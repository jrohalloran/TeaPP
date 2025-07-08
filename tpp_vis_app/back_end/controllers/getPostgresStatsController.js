/*** 
 * // Date: 28/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import { Pool } from 'pg';


const pool = new Pool({
    user: "postgres",
    password: "liptontea",
    host: "localhost",
    database: "teapp_app_db",
    port: "5432",
  });

async function getTableStats() {
  const client = await pool.connect();
  try {
    const result = await client.query(`
      SELECT 
        s.relname AS table_name,
        s.seq_scan,
        s.idx_scan,
        s.n_live_tup AS rows,
        pg_size_pretty(pg_total_relation_size(s.relid)) AS total_size
      FROM 
        pg_stat_user_tables s
      ORDER BY 
        pg_total_relation_size(s.relid) DESC;
    `);
    console.log(result);
    return result.rows;
  } finally {
    client.release();
  }
}



export const getPostgresStats= async (req, res) => {

    try {
        const stats = await getTableStats();
        console.log(stats);
        res.json(stats);
    } catch (error) {
        console.error('Error fetching table stats:', error);
        res.status(500).json({ error: 'Failed to retrieve stats' });
    }

}