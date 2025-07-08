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



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp_envir_temp');
const uploadsDir = path.join(backend_dir, 'env_temp_uploads');
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
    const filename = "temp_reformat.txt";
    const filePath = path.join(__dirname, 'temp_envir_temp', filename);
    console.log("Reading file:", filePath);

    try {
        const content = await fs_promise.readFile(filePath, 'utf8');
        const parsedData = parseProcessedFile(content);

        if (Array.isArray(parsedData)) {
        return parsedData;
        } else {
        console.warn("Parsed data is not an array. Returning empty array.");
        return [];
        }
    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }


}

function parseProcessedFile(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) return entries;

  const headers = lines[0].split(/\t/);
  const yearIndex = headers.indexOf("YEAR");
  const monthIndex = headers.indexOf("MONTH");
  const statIndex = headers.indexOf("STAT");
  const tempIndex = headers.indexOf("VALUE");

  const entries = [];

  // First pass: add nodes with generation and parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const year = parts[yearIndex]?.trim().toUpperCase();
    const month = parts[monthIndex]?.trim().toUpperCase();
    const stat = parts[statIndex]?.trim().toUpperCase();
    const temp = parts[tempIndex]?.trim();


    entries.push({
        year: year,
        month: month,
        temp: temp === 'NA' ? null : Number(temp),
        stat: stat
        });

    });
    return entries;
    
}




async function insertTemperature(data){

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
        
        for (const entry of data) {
            const query = 'INSERT INTO temperature (year, stat, month, value) VALUES ($1, $2, $3, $4)';
            const values = [entry.year, entry.stat, entry.month, entry.temp];
            console.log(entry.temp);
            await client.query(query, values);
            
        }
        insertFlag = true

    } catch (err) {
        console.error('Error inserting data', err);
        insertFlag = false;
    }
        finally {
        await client.end();
    }
  console.log("Temperature inserted sucessfuly in temp Table!")
  return insertFlag;
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
