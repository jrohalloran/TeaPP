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



