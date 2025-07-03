/*** 
 * // Date: 23/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 
// Running R Script to convert clean data to synbreed pedigree for visulisation 

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
const tempDir = path.join(__dirname, 'temp');

const outputTextFile = path.join(tempDir, 'temp_cleanData.txt');

let data;

async function joinPlants() {
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
}

async function writeFile(){


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


async function performSynbreed() {
    
    const scriptPath = path.join(__dirname, 'scripts', 'perform_synbreed.R');
    const dataFilePath = outputTextFile;
    const scriptDir = path.dirname(scriptPath);

    const command = `Rscript "${scriptPath}" "${dataFilePath}" "${scriptDir}"`;

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


function removeParentEntries(data){
    // Remove parent entries if flagged for removal
    const cleanedData = data.filter(item => !item.removed);
    return cleanedData;

}


export const processPedigree = async (req, res) => {
    console.log("Attempting to process Pedigree...");
    const data = req.body;
    //const cleanedData = removeParentEntries(data);

    try {
        await joinPlants();
        await writeFile();
        await performSynbreed();
        res.json(true);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}