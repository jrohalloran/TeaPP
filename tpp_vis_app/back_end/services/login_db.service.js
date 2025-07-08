/*** 
 * // Date: 02/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/


import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

  const pool = new Pool({
    user: "postgres",
    password: "liptontea",
    host: "localhost",
    database: "accounts_teapp",
    port: "5432",
  });



export default {
  query: (text, params) => pool.query(text, params),
};




