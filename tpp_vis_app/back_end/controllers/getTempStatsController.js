/*** 
 * // Date: 04/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import path, { join } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs_promise from 'fs/promises';
import fs from 'fs';
import db from '../services/postgres_db.js';
import { removeTemp_envir_tempDir} from '../services/directories.service.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp_envir_temp');
const outputFile = path.join(tempDir, 'temperature_data.txt');


let data;

async function getTempData(){

    console.log("Getting Temperature Stats from Database");
    
        try {
            const query = `
            SELECT * 
            FROM temperature 
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
        fs.writeFileSync(outputFile, content);
        console.log("File Successfully Written:", outputFile);
    } catch (error) {
        console.error('Error:', error);
    }

}


async function performStatistics() {

    console.log("Performing statistics")

    const scriptPath = path.join(__dirname, 'scripts', 'process_temp.R');
    const scriptDir = path.dirname(scriptPath);

    console.log('========== TEMPERATURE STATS Script Execution ==========');
    console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
    console.log(`[INFO] Script path: ${scriptPath}`);
    console.log(`[INFO] Working directory: ${process.cwd()}`);
    console.log(`[INFO] Spawning Python process...\n`);


    const command = `Rscript "${scriptPath}" "${outputFile}" "${scriptDir}"`;

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



export const getTempStats= async (req, res) => {

    console.log("Attempting to process Pedigree Statistics...");
    try {
        await removeTemp_envir_tempDir();
        await getTempData();
        await writeFile();
        await performStatistics();
        res.json("This pathway works");
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}