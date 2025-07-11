
/*** 
 * // Date: 09/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import db from '../services/postgres_db.js';
import { getNeo4jStatus } from '../services/neo4j-driver.js';



async function getPostgresStatus(){

  let statusFlag = false;
  console.log("Attempting to connect to Postgres DB...");

  try {
    const result = await db.query('SELECT 1');
    console.log('Postgres connected successfully:', result.rows);
    statusFlag = true;
  } catch (err) {
    console.error('Postgres connection failed:', err.message);
    statusFlag = false;
  }

  return statusFlag;
}




export const getDBStatus= async (req, res) => {

    try {
        const pgFlag = await getPostgresStatus();
        const neoFlag = await getNeo4jStatus();
        console.log("PG Flag: "+pgFlag);
        console.log("Neo4j Flag: "+neoFlag);
        res.json({pg: pgFlag, neo: neoFlag});
    } catch (error) {
        console.error('Error fetchingDB Status:', error);
        res.status(500).json({ error: 'Failed to retrieve DB Status' });
    }

}