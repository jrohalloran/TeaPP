/*** 
 * // Date: 08/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import db from '../services/postgres_db.js';


export async function getPlants(req, res) {
    console.log("Getting First 100 rows of Plants table")
  try {
    const result = await db.query('SELECT * FROM plants LIMIT 100');
    //console.log(result.rows);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching plants');
  }
}
