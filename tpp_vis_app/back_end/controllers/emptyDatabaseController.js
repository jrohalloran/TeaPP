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


export const restartNeo4j= async (req, res) =>{

  console.log("Restarting Neo4j database");

  let restartflag;
  exec('sudo neo4j restart || sudo neo4j start', (error, stdout, stderr) => {
    if (error) {
      restartflag = false;
      console.error(`Error restarting Neo4j: ${error.message}`);
      return;
    }

    if (stderr) {
      restartflag = false;
      console.error(`stderr: ${stderr}`);
    }

    restartflag = true;
    console.log(`Neo4j restarted: ${stdout}`);
  });
  return restartflag;
}


export const restartPostgreSQL = async (req, res)=>{

  console.log("Restarting PostgreSQL database");

  let restartflag;
  exec('sudo systemctl restart postgresql', (error, stdout, stderr) => {
    if (error) {
      restartflag = false;
      console.error(`Error restarting PostgreSQL: ${error.message}`);
      return;
    }

    if (stderr) {
      restartflag = false;
      console.error(`stderr: ${stderr}`);
    }

    restartflag = true;
    console.log(`PostgreSQL restarted: ${stdout}`);
  });

  return restartflag;
}
