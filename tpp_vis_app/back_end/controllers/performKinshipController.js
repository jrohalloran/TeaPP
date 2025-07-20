/*** 
 * // Date: 27/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import path, { join } from 'path';
import { exec, spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import db from '../services/postgres_db.js';
import { sendEmail } from '../services/email.service.js';
import os from 'os';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp');
//const outputFile = path.join(tempDir, '');
const outputTextFile = path.join(tempDir, 'temp_cleanData.txt');




// Fetching all Data from PostgresDatabase
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

// Writing to text file to parse to R Script
async function writeFile(data){


    console.log("Attempting Write Data file...")
    const headers = Object.keys(data[0]).join('\t');
    const dataLines = data.map(row => Object.values(row).join('\t'));
    const content = [headers, ...dataLines].join('\n');
    
    try{
        fs.writeFileSync(outputTextFile, content);
        console.log("File Successfully Written:", outputTextFile);
    } catch (error) {
        console.error('Error:', error);
    }

}

// Running Kinship R Script
async function getKinship() {
    console.log("Performing Kinship")

    const scriptPath = path.join(__dirname, 'scripts', 'perform_kinship.R');

    console.log('========== KINSHIP Script Execution ==========');
    console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
    console.log(`[INFO] Script path: ${scriptPath}`);
    console.log(`[INFO] Working directory: ${process.cwd()}`);
    console.log(`[INFO] Spawning Python process...\n`);
    

    const scriptDir = path.dirname(scriptPath);

    const command = `Rscript "${scriptPath}" "${outputTextFile}" "${scriptDir}"`;

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



async function getHeatmap() {
    const scriptPath = path.join(__dirname, 'scripts', 'visualise_kinship_heatmap.py');
    const command = 'python3';
    const args = [scriptPath];

    console.log('========== HEATMAP Script Execution ==========');
    console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
    console.log(`[INFO] Script path: ${scriptPath}`);
    console.log(`[INFO] Working directory: ${process.cwd()}`);
    console.log(`[INFO] Spawning Python process...\n`);

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(command, args, { cwd: process.cwd() });

        pythonProcess.stdout.on('data', (data) => {
            process.stdout.write(`[PYTHON STDOUT] ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            process.stderr.write(`[PYTHON STDERR] ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`\n[INFO] Python process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });

        pythonProcess.on('error', (err) => {
            console.error(`[ERROR] Failed to start subprocess: ${err.message}`);
            reject(err);
        });
    });
}

async function getPCA() {
    const scriptPath = path.join(__dirname, 'scripts', 'visualise_kinship_pca.py');
    const command = 'python3';
    const args = [scriptPath];

    console.log('========== PCA Script Execution ==========');
    console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
    console.log(`[INFO] Script path: ${scriptPath}`);
    console.log(`[INFO] Working directory: ${process.cwd()}`);
    console.log(`[INFO] Spawning Python process...\n`);

    return new Promise((resolve, reject) => {
        const pythonProcess = spawn(command, args, { cwd: process.cwd() });

        pythonProcess.stdout.on('data', (data) => {
            process.stdout.write(`[PYTHON STDOUT] ${data}`);
        });

        pythonProcess.stderr.on('data', (data) => {
            process.stderr.write(`[PYTHON STDERR] ${data}`);
        });

        pythonProcess.on('close', (code) => {
            console.log(`\n[INFO] Python process exited with code ${code}`);
            if (code === 0) {
                resolve();
            } else {
                reject(new Error(`Python script exited with code ${code}`));
            }
        });

        pythonProcess.on('error', (err) => {
            console.error(`[ERROR] Failed to start subprocess: ${err.message}`);
            reject(err);
        });
    });
}

let totalRAM;



function checkMem(){
// Minimum RAM required (in GB)
    const MIN_RAM_GB = 64;
    let flag;

// Get total system memory in GB
    totalRAM = os.totalmem() / (1024 ** 3);

    console.log(`Detected RAM: ${totalRAM.toFixed(2)} GB`);

    if (totalRAM >= MIN_RAM_GB) {
    console.log(`Enough RAM. Running script...`);
    flag = true;

    } else {
    console.error(`Not enough RAM. Need at least ${MIN_RAM_GB} GB.`);
    flag = false;
    }

    return flag;
}


export const performKinship= async (req, res) => {

    const email = req.body;
    console.log("Email: "+email);

    console.log("Performing Kinship Analysis ")

    // get Data 

    const flag = checkMem();
    if (flag){

    try{
        const data = await joinPlants(); // Getting all Data from the DB
        await writeFile(data); // Write to a data text file to parse to the R script
        console.log("Perform Kinship");
        let date = new Date().toISOString();
        sendEmail(email, 'Kinship Pipeline Started', 'Kinship Analysis started!');
        await getKinship(); // Performing new synbreed pedigree and kinship matrix
        await getHeatmap(); 
        await getPCA();
        date = new Date().toISOString();
        sendEmail(email, 'Kinship Pipeline Ended', 'Kinship Analysis Finished!');

        res.json(true);
    
    }catch(error){
        res.json(false);

    }}
    else{
        res.json(["Memory",totalRAM]);
    }

}