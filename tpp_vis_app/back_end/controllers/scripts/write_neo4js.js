
// Jennifer O'Halloran 
// 06/06/2025 
// Thesis Project - TPP visualisation 

// Writing Pedigree Data to Neo4js cloud database 
const fs = require('fs');
const neo4j = require('neo4j-driver');

// Connecting to cloud database 
const driver = neo4j.driver(
  'neo4j+s://a71c11d2.databases.neo4j.io',
  neo4j.auth.basic('neo4j', 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ')
);

async function importData() {
  const session = driver.session();

  try {
    // Read JSON file
    console.log("Reading JSON file");
    const rawData = fs.readFileSync('plant_clone_graph.json', 'utf8');
    const data = JSON.parse(rawData);

    console.log("Starting Data Upload to Neo4js")
    // Insert nodes
    for (const node of data.nodes) {
        if (node.year == null) {
            console.warn(`Warning: node with id ${node.id} has a null year.`);
            }
      await session.run(
        `MERGE (p:Plant {id: $id})
         SET p.gener = $gener, p.par1 = $par1, p.par2 = $par2, p.year = $year`,
        {
          id: node.id,
          gener: node.gener,
          par1: node.par1,
          par2: node.par2,
          year: node.year != null ? neo4j.int(node.year) : null
        }
      );
    }

    // Insert edges
    for (const edge of data.edges) {
      await session.run(
        `MATCH (a:Plant {id: $source}), (b:Plant {id: $target})
         MERGE (a)-[:PARENT_OF]->(b)`,
        {
          source: edge.source,
          target: edge.target
        }
      );
    }

    console.log('Data import complete!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}

importData();
