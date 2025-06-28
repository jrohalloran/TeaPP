/*** 
 * // Date: 28/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import neo4j from 'neo4j-driver'



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);


const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'tAqsiv-tivfif-bomhe9';

const driver = neo4j.driver(
  uri, 
  neo4j.auth.basic(user, password)
);


async function runQuery(cypher) {
  const session = driver.session();
  try {
    return await session.run(cypher);
  } finally {
    await session.close();
  }
}

async function getStats() {
  console.log("Starting to retrieve Neo4j stats");

  const [
    labelsRes,
    relTypesRes,
    propsRes,
    nodesRes,
    relsRes
  ] = await Promise.all([
    runQuery(`CALL db.labels()`),
    runQuery(`CALL db.relationshipTypes()`),
    runQuery(`CALL db.propertyKeys()`),
    runQuery(`MATCH (n) RETURN count(n) AS count`),
    runQuery(`MATCH ()-[r]->() RETURN count(r) AS count`)
  ]);

  return {
    labels: labelsRes.records.map(r => r.get('label')),
    relationshipTypes: relTypesRes.records.map(r => r.get('relationshipType')),
    propertyKeys: propsRes.records.map(r => r.get('propertyKey')),
    nodeCount: nodesRes.records[0].get('count').toInt(),
    relationshipCount: relsRes.records[0].get('count').toInt()
  };
}




export const getNeo4jStats= async (req, res) => {

    console.log("Starting to retrieve Neo4j stats");
    try {
        const stats = await getStats();
        console.log(stats);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching table stats:', error);
        res.status(500).json({ error: 'Failed to retrieve stats' });
    }


}


