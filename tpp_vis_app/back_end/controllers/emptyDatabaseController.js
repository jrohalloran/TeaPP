/*** 
 * // Date: 22/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { Client } from 'pg';
import { emptyNeo4jDatabase } from '../services/neo4j-driver.js';
import { exec } from 'child_process';
import { promisify } from 'util';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const client = new Client({
        user: "jennyohalloran",
        host: "localhost",
        database: "teapp_app_db",
        port: "5432",
    });


// insert
async function emptyPGDatabase(){
    console.log("Starting emptying function....");
    let emptyFlag;

    console.log("----- Attempting to connect to PostgreSQL DB-----");
    try {
        await client.connect();
        console.log("-----Connection successful-----");
        

        // Disable constraints if needed
        await client.query('BEGIN');
        await client.query('TRUNCATE TABLE cleandata, preprocesseddata, rawdata, rainfall, temperature RESTART IDENTITY CASCADE');
        await client.query('COMMIT');

        console.log('Tables truncated successfully');
        emptyFlag = true;

    } catch (err) {
        await client.query('ROLLBACK');
        console.error('Error inserting data', err);
        emptyFlag = false;
    }
        finally {
        await client.end();
    }
  console.log("Emptying Databases successfully")
  return emptyFlag;
}


export const emptyPostgreSQL= async (req, res) => {

    console.log("Starting Postgres Emptying Function")

  try{

    const flag = await emptyPGDatabase();
    console.log("Flag: "+flag)

    res.json(flag);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}


export const emptyNeo4j= async (req, res) => {

    console.log("Starting Neo4j Emptying Function")

  try{

    const flag = await emptyNeo4jDatabase();
    console.log("Flag: "+flag)

    res.json(flag);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}


const execAsync = promisify(exec);

export const restartNeo4j = async (req, res) => {
  console.log("Restarting Neo4j database");

  try {
    const { stdout, stderr } = await execAsync('sudo neo4j restart || sudo neo4j start');

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ success: false, message: 'Neo4j restart stderr', error: stderr });
    }

    console.log(`Neo4j restarted: ${stdout}`);
    return res.status(200).json({ success: true, message: 'Neo4j restarted', output: stdout });

  } catch (error) {
    console.error(`Error restarting Neo4j: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to restart Neo4j', error: error.message });
  }
};


export const restartPostgreSQL = async (req, res) => {
  console.log("Restarting PostgreSQL database");

  try {
    const { stdout, stderr } = await execAsync('sudo systemctl restart postgresql');

    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).json({ success: false, message: 'PostgreSQL restart stderr', error: stderr });
    }

    console.log(`PostgreSQL restarted: ${stdout}`);
    return res.status(200).json({ success: true, message: 'PostgreSQL restarted', output: stdout });

  } catch (error) {
    console.error(`Error restarting PostgreSQL: ${error.message}`);
    return res.status(500).json({ success: false, message: 'Failed to restart PostgreSQL', error: error.message });
  }
};
