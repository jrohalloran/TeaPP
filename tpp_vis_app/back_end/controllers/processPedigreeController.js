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
import fs from 'fs';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);

let outputFile;

async function writeData(data){

        console.log("Attempting Write JSON file...")
    
    console.log(__dirname);
    const tempDir = path.join(__dirname, 'temp');
    console.log("Temp Directory:", tempDir);
    outputFile = path.join(tempDir, 'cleanData.json');
    console.log("File Directory:", outputFile);

    try{
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log("File Successfully Written:", outputFile);
    } catch (error) {
        console.error('Error:', error);
    }
}


async function performSynbreed() {
    
    const scriptPath = path.join(__dirname, 'scripts', 'perform_synbreed.R');
    const dataFilePath = outputFile;
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
    const cleanedData = removeParentEntries(data);

    try {
        await writeData(cleanedData);
        await performSynbreed();
        res.json(true);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}