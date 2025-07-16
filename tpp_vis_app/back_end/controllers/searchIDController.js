
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



function aggregateNeo4j(){



}


function aggregatePostgres(results){
    // Aggregating results that have the same parents and year 
    /*for (let i=0; i>results.length;i++){
      console.log(i);


    }*/
   //console.log(results.length);
   for (let i=0; i<results.length;i++){
      let clone_id = results[i].clone_id;
      let F_par = results[i].correct_female;
      let M_par = results[i].correct_male;
      let year = results[i].year;
      //console.log(clone_id);
      //console.log(F_par);
      //console.log(M_par);
      //console.log(year);

   }

  const grouped = {};

  for (const row of results) {
    const key = `${row.year}-${row.correct_female}-${row.correct_male}`;
    if (!grouped[key]) {
      grouped[key] = [];
    }
    grouped[key].push(row);
  }

  const groupedArray = Object.entries(grouped).map(([key, items]) => {
    const [year, correct_female, correct_male] = key.split('-');
    return {
      year: parseInt(year),
      female_parent: correct_female,
      male_parent: correct_male,
      items: items
    };
  });

  console.log(groupedArray);
  return groupedArray;

}





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

    const groupedArray = aggregatePostgres(pgResult.rows);


    res.json({
      postgres: pgResult.rows,
      neo4j: neoFormatted,
      grouped: groupedArray
    });

  } catch (error) {
    console.error('Partial search error:', error);
    res.status(500).json({ error: 'Something went wrong.' });
  }
};
