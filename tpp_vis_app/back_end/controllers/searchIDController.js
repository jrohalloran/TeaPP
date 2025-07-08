
/*** 
 * // Date: 29/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 
// SearcH Function 


import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import neo4j from 'neo4j-driver';
import { Pool } from 'pg';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);






const pool = new Pool({
        user: "postgres",
        password: "liptontea",
        host: "localhost",
        database: "teapp_app_db",
        port: "5432",
    });

// Neo4j setup
const driver = neo4j.driver(
  'bolt://localhost:7687',
  neo4j.auth.basic('neo4j', 'tAqsiv-tivfif-bomhe9')
);

export async function searchID(req, res){
    console.log("Starting Search Function");
    const id = req.body[0];
    console.log(id);
    
    if (!id || typeof id !== 'string') {
        return res.status(400).json({ error: 'Invalid or missing id parameter' });
    }

  try {
    const pgResult = await pool.query(
    `SELECT * FROM cleandata 
    WHERE correct_id ILIKE $1 
    OR clone_id ILIKE $1 
    OR correct_female ILIKE $1 
    OR correct_male ILIKE $1`,
    [`%${id}%`]
    );

    // 2. Neo4j partial match
    const session = driver.session();
        const neoResult = await session.run(
        `
        MATCH (n:Plant)
        WHERE ANY(key IN keys(n) WHERE toLower(toString(n[key])) CONTAINS toLower($id))
        OPTIONAL MATCH (n)-[r:PARENT_OF]->(m)
        RETURN n, r, m
        `,
        { id }
    );
    const neoFormatted = neoResult.records.map(record => ({
      source: record.get('n')?.properties,
      relation: record.get('r')?.type,
      target: record.get('m')?.properties
    }));

    await session.close();

    res.json({
      postgres: pgResult.rows,
      neo4j: neoFormatted
    });

  } catch (error) {
    console.error('Partial search error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
