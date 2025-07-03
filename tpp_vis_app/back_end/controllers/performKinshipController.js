/*** 
 * // Date: 27/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

//import {joinPlants} from "tpp_vis_app/back_end/services/login_db.service.js"
import path, { join } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//import fs_promise from 'fs/promises';
import fs from 'fs';
import db from '../services/postgres_db.js';


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


// Running Visualisation Scripts

async function getPCA() {
    console.log("Running Python script to visualise PCA");


}

async function getHeatmap(){
     console.log("Running Python script to visualise Heatmap + Histograms");



}


export const performKinship= async (req, res) => {

    console.log("Performing Kinship Analysis ")

    // get Data 

    try{
        const data = await joinPlants(); // Getting all Data from the DB
        await writeFile(data); // Write to a data text file to parse to the R script
        console.log("Perform Kinship");
        await getKinship(); // Performing new synbreed pedigree and kinship matrix
        await getHeatmap(); 
        await getPCA();

    

    }catch(error){

    }

    res.json("Kinship Retrieved");
}