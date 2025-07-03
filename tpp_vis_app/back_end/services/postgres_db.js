/*** 
 * // Date: 08/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
 * // First PostgreSQL Database connection
***/


// Requiring Postgres 
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// Creating a 'pool' of connection

/*
const pool = new Pool({
    user:"jennyohalloran",
    host:"localhost",
    database:"tpp_db",
    port:"5432"
});*/

  const pool = new Pool({
    user: "jennyohalloran",
    host: "localhost",
    database: "teapp_app_db",
    port: "5432",
  });

export default {
  query: (text, params) => pool.query(text, params),
};



export async function joinPlants() {
  let data;
    console.log("Getting all of Plants table")
  try {
    const query = `
    SELECT *
      FROM cleanData 
      WHERE removed IS NOT TRUE
    `;
    const result = await db.query(query);
    data = result.rows;
    //console.log(result.rows);

  } catch (error) {
    console.error(error);
  }
  return data;
}


