/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import neo4j from 'neo4j-driver';

// LOCAL DATABASE -- PRE AWS
const URI = 'bolt://localhost:7687';
const USER = 'neo4j';
const PASSWORD = 'tAqsiv-tivfif-bomhe9'; 

// Create a driver instance

const driver = neo4j.driver(
  URI,
  neo4j.auth.basic(USER, PASSWORD),
  {
    connectionTimeout: 10000, 
    maxConnectionLifetime: 3600000, // 1 hour
    connectionAcquisitionTimeout: 3000000, // 30 seconds
  }
);



// Function for converting Neo4j Integers
// For handling Year and Gener attributes
function safeProperties(props) {
  const output = {};

  for (const [key, value] of Object.entries(props)) {
    // Convert Neo4j integers safely
    if (typeof value === 'object' && value.low !== undefined) {
      output[key] = neo4j.int(value).toNumber();
    } else {
      output[key] = value;
    }
  }

  return output;
}


export async function emptyNeo4jDatabase(){
    const session = driver.session();
    console.log("Starting emptying function....");
    let emptyFlag;
      try {
            await session.run('MATCH (n) DETACH DELETE n');
            console.log('All data deleted successfully.');
            emptyFlag = true;
        } catch (err) {
            console.error('Error deleting data:', err);
            emptyFlag = false;
        } finally {
            await session.close();
            //await driver.close();
    }
    console.log("Emptying Neo4j Databases successfully")
    return emptyFlag;
}


export async function getNeo4jStatus(){
    let statusFlag = false;
    const session = driver.session();

  try {
    const result = await session.run('RETURN 1');
    console.log('Neo4j connected successfully:', result);
    statusFlag = true;
  } catch (error) {
    console.error('Neo4j connection failed:', error.message);
    statusFlag = false;
  } finally {
  if (session) await session.close();
  }

  return statusFlag;

}

// Querying for NodeID/IDs (Array) from front-end
// Returns Family nodes 
export async function fetchNuclearFamilyData(nodeIDs) {
  if (!Array.isArray(nodeIDs)) nodeIDs = [nodeIDs];

  const combinedResult = {
    nodes: [],
    family: [],
  };

  await Promise.all(
    nodeIDs.map(async (id) => {
      const session = driver.session();
      try {
        const query = `
          MATCH (n {id: $nodeID})-[:PARENT_OF|CHILD_OF]-(family)
          RETURN n, family
        `;
        const result = await session.run(query, { nodeID: id });

        if (result.records.length === 0) return;

        // Push main node only once
        const nProps = safeProperties(result.records[0].get('n').properties);
        if (!combinedResult.nodes.find(n => n.id === nProps.id)) {
          combinedResult.nodes.push(nProps);
        }

        // Add family members
        result.records.forEach(record => {
          const famProps = safeProperties(record.get('family').properties);
          combinedResult.family.push(famProps);
        });
      } finally {
        await session.close();
      }
    })
  );

  // Deduplicate family nodes by 'id'
  const seenIds = new Set();
  combinedResult.family = combinedResult.family.filter(fam => {
    if (fam.id && !seenIds.has(fam.id)) {
      seenIds.add(fam.id);
      return true;
    }
    return false;
  });

  return combinedResult;
}


export async function fetchWholeFamilyData(nodeIDs) {
  if (!Array.isArray(nodeIDs)) nodeIDs = [nodeIDs];

  const combinedResult = {
    nodes: [],
    ancestors: [],
    descendants: [],
    family: [],
    partners: [],
    grandparents: [],
  };

  await Promise.all(
    nodeIDs.map(async (id) => {
      const session = driver.session();
      try {
        const query = `
          MATCH (n {id: $nodeID})
          OPTIONAL MATCH (ancestor)-[:PARENT_OF*1..]->(n)
          OPTIONAL MATCH (n)-[:PARENT_OF*1..]->(descendant)
          OPTIONAL MATCH (n)-[:PARENT_OF|CHILD_OF]-(family)
          OPTIONAL MATCH (n)-[:PARTNER_OF]-(partner)
          OPTIONAL MATCH (grandparent)-[:PARENT_OF*2..2]->(n)
          RETURN
            collect(DISTINCT n) AS nodes,
            collect(DISTINCT ancestor) AS ancestors,
            collect(DISTINCT descendant) AS descendants,
            collect(DISTINCT family) AS family,
            collect(DISTINCT partner) AS partners,
            collect(DISTINCT grandparent) AS grandparents
        `;

        const result = await session.run(query, { nodeID: id });

        if (result.records.length === 0) return;

        const record = result.records[0];

        const extractProps = (nodes) =>
          nodes
            .map(node => safeProperties(node.properties))
            .filter((n) => n && n.id);

        const addUnique = (arr, items) => {
          items.forEach(i => {
            if (!arr.find(x => x.id === i.id)) arr.push(i);
          });
        };

        addUnique(combinedResult.nodes, extractProps(record.get('nodes')));
        addUnique(combinedResult.ancestors, extractProps(record.get('ancestors')));
        addUnique(combinedResult.descendants, extractProps(record.get('descendants')));
        addUnique(combinedResult.family, extractProps(record.get('family')));
        addUnique(combinedResult.partners, extractProps(record.get('partners')));
        addUnique(combinedResult.grandparents, extractProps(record.get('grandparents')));
      } finally {
        await session.close();
      }
    })
  );
  console.log(combinedResult);
  return combinedResult;
}

export async function fetchPedigreeData(nodeIDs) {
  if (!Array.isArray(nodeIDs)) nodeIDs = [nodeIDs];

  const combinedNodes = [];

  await Promise.all(
    nodeIDs.map(async (id) => {
      const session = driver.session();
      try {
        const query = `
          MATCH (n {id: $nodeID})
          OPTIONAL MATCH (ancestor)-[:PARENT_OF*1..]->(n)
          OPTIONAL MATCH (n)-[:PARENT_OF*1..]->(descendant)
          OPTIONAL MATCH (n)-[:PARTNER_OF]-(partner)
          OPTIONAL MATCH (n)-[:PARENT_OF|CHILD_OF]-(family)
          WITH collect(DISTINCT n) + collect(DISTINCT ancestor) + collect(DISTINCT descendant) + collect(DISTINCT partner) AS relatedNodes
          UNWIND relatedNodes AS node
          RETURN DISTINCT node
        `;

        const result = await session.run(query, { nodeID: id });

        if (result.records.length === 0) return;

        result.records.forEach(record => {
          const nodeProps = safeProperties(record.get('node').properties);
          if (nodeProps && !combinedNodes.find(n => n.id === nodeProps.id)) {
            combinedNodes.push(nodeProps);
          }
        });

      } finally {
        await session.close();
      }
    })
  );
  console.log(combinedNodes);
  return { nodes: combinedNodes };
}



export async function fetchAllNodesEdges2(){
  console.log('fetchAllNodesEdges called...');
  
  const session = driver.session();  // open a session here
  
  try {
    const result = await session.run(`
      MATCH (n)
      OPTIONAL MATCH (n)-[r]->(m)
      RETURN collect(DISTINCT { node: n, id }) AS nodesWithLabels, collect(DISTINCT r) AS relationships

    `);

    const record = result.records[0];
    //const nodes = record.get('nodes');
    const relationships = record.get('relationships');
    console.log(relationships);

    const nodesWithLabels = record.get('nodesWithLabels');

    const sigmaNodes = nodesWithLabels.map(({ node, labels }, index) => ({
      id: node.identity.toString(),
      label: node.properties.name || labels.join(', ') || `Node ${node.identity}`,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 1,
      color: '#666'
    }));

    /*
    const sigmaEdges = relationships.map((rel, index) => ({
      id: `e${index}`,
      source: rel.start.toString(),
      target: rel.end.toString(),
      label: rel.type
    }));*/

    const sigmaGraph = {
      nodes: sigmaNodes,
      //edges: sigmaEdges
    };

    //console.log("Edges: "+sigmaEdges);
    console.log("Nodes: "+sigmaNodes)
    return sigmaNodes;

  } catch (err) {
    console.error('Error exporting graph:', err);
    throw err; // rethrow to handle upstream if needed
  } finally {
    await session.close();
  }
}

export async function fetchAllNodesEdges() {
  const session = driver.session();
  try {
    const result = await session.run(`
      MATCH (p:Plant)
      OPTIONAL MATCH (p)-[:PARENT_OF]->(c:Plant)
      RETURN
        collect(DISTINCT {
          id: p.id,
          gener: p.gener,
          par1: p.par1,
          par2: p.par2,
          year: p.year
        }) AS nodes,
        collect(DISTINCT {
          source: p.id,
          target: c.id
        }) AS edges
    `);

    const record = result.records[0];
    const nodes = record.get('nodes').map(node => ({
      id: node.id,
      gener: node.gener,
      par1: node.par1,
      par2: node.par2,
      year: node.year ? node.year.toNumber() : null  // convert neo4j int to JS number
    }));

    const edges = record.get('edges').filter(edge => edge.source != null && edge.target != null);


    const graphData = {
    nodes: nodes,
    edges: edges
  };
    return graphData;
  } catch (error) {
    console.error('Error fetching plant graph:', error);
    throw error;
  } finally {
    await session.close();
  }
}


/*
// Querying PartnerOF 
// Returns Family nodes 
export async function fetchPartnerOf(names) {
  console.log("--------------------");
  console.log("Getting Partners of "+names);
  const session = driver.session();
  const allResults = [];

  try {
    for (const name of names) {
      const result = await session.run(
        `
        MATCH (p:Person {name: $personName})-[r:PARTNER_OF]-(partner:Person)
        RETURN partner.name AS partnerName, r.years AS years
        `,
        { personName: name }
      );

      const partners = result.records.map(record => ({
        partnerName: record.get('partnerName'),
        years: record.get('years'),
      }));

      allResults.push({ name, partners });
    }
  } catch (error) {
    console.error('Error fetching partners:', error);
    throw error; // or handle as needed
  } finally {
    await session.close();
  }

  return allResults;
}
*/
