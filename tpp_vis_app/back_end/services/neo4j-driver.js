/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import neo4j from 'neo4j-driver';

// Neo4j connection setup
const URI = 'neo4j+s://a71c11d2.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));


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

  return { nodes: combinedNodes };
}
