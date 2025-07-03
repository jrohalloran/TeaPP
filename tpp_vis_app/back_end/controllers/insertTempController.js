/*** 
 * // Date: 03/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import path from 'path';
import { exec } from 'child_process';
import { Client } from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs_promise from 'fs/promises';
import fs, { write } from 'fs';
import db from '../services/postgres_db.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp_envir');
const uploadsDir = path.join(backend_dir, 'env_uploads');
const inputFile = path.join(uploadsDir, 'temperature_data.txt');




async function reformatTemperature() {


    console.log("Reformatting Input Temperature File")
    
    const scriptPath = path.join(__dirname, 'scripts', 'reformat_temp.R');
    const scriptDir = path.dirname(scriptPath);

    // Escape quotes inside the JSON string for safe shell usage:
    const command = `Rscript "${scriptPath}" "${inputFile}" "${scriptDir}"`;

    return new Promise((resolve, reject) => {
        exec(command, { maxBuffer: 1024 * 5000 }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running R script: ${error.message}`);
            return reject(error);
        }
        if (stderr) {
            console.warn(`R script stderr:\n${stderr}`);
        }
        console.log(`R script output:\n${stdout}`);
        resolve();
        });
    });
}


async function readTemperature(){
        
    console.log("Reading Re-formatted Temp File");

}


async function insertTemperature(){

    console.log("Inserting Temperature records.....");


}






export const processTemperature = async (req, res) => {
  console.log("Attempting to insert Rainfall data...");

  try {
    console.log("Attempting to process data...");
    await reformatTemperature();
    console.log("Reformatting Complete");

    const data = await readTemperature(); // ✅ add await
    console.log(data);

    const result = await insertTemperature(data); 
    console.log(result);

    res.json(result);
    console.log("Processing Complete - Updating Flag");

  } catch (error) {
    console.error('Controller error:', error); // ✅ fixed error variable
    res.status(500).json({ error: 'Failed to process data' });
  }
};
