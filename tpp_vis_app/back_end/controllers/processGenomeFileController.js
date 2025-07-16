/*** 
 * // Date: 15/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 

import path from 'path';
import { exec } from 'child_process';
import { Client } from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const genomfile_dir = path.join(backend_dir,"genom_uploads")


async function insertGenomicData(clone_id, file_location,file_name, info){

    console.log("Inserting Temperature records.....");

    let insertFlag;
    const client = new Client({
        user: "postgres",
        password: "liptontea",
        host: "localhost",
        database: "teapp_app_db",
        port: "5432",
    });

    console.log("----- Attempting to connect to PostgreSQL DB-----");
    try {
        await client.connect();
        console.log("-----Connection successful-----");
        
        const query = 'INSERT INTO genomicdata (clone_id, file_location, file_name, additional_data) VALUES ($1, $2, $3, $4)';
        const values = [clone_id, file_location, file_name, info];
        await client.query(query, values);
            
        insertFlag = true

    } catch (err) {
        console.error('Error inserting data', err);
        insertFlag = false;
    }
        finally {
        await client.end();
    }
  console.log("File Details inserted sucessfuly in genomicData Table!")
  return insertFlag;
}




export const processGenomFile =  async (req, res) => {

  console.log(req.body);
  const clone_id = req.body[0];
  const filename = req.body[1];
  const file_location = genomfile_dir;
  const info = "RNA-Seq Data";

  console.log(genomfile_dir);

  console.log("Attempting to process Genom File...")
  try{
    console.log("Attempting to process Genomic File...")
    await insertGenomicData(clone_id,file_location,filename, info);
    console.log("Sending Processed Data to front-end for display")
    res.json("This path works");
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}
