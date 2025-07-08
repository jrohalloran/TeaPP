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
const inputFile = path.join(uploadsDir, 'rainfall_data.txt');

// reformat (RScript)

async function reformatRainfall() {


    console.log("Reformatting Input Rainfall File")
    
    const scriptPath = path.join(__dirname, 'scripts', 'reformat_rainfall.R');
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


async function readRainfall() {

    console.log("Attempting to read Rainfall file");
    const filename = "rainfall_reformat.txt";
    const filePath = path.join(__dirname, 'temp_envir', filename);
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
  const yearIndex = headers.indexOf("year");
  const monthIndex = headers.indexOf("month");
  const rainIndex = headers.indexOf("rainfall");
  const dateIndex = headers.indexOf("date");

  const entries = [];

  // First pass: add nodes with generation and parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const year = parts[yearIndex]?.trim().toUpperCase();
    const month = parts[monthIndex]?.trim();
    const rainfall = parts[rainIndex]?.trim();
    const date = parts[dateIndex]?.trim();


    entries.push({
        year: year,
        month: month,
        rainfall: rainfall === 'NA' ? null : parseFloat(rainfall),
        date: date
        });

    });
    return entries;
    
}


// insert
async function insertRainfall(data){
    console.log("Starting Insertion Function....");
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
            const query = 'INSERT INTO rainfall (year, month, rainfall, date) VALUES ($1, $2, $3, $4)';
            const values = [entry.year, entry.month, entry.rainfall, entry.date];
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
  console.log("Rainfall inserted sucessfuly in rainfall Table!")
  return insertFlag;
}


export const processRainfall = async (req, res) => {
  console.log("Attempting to insert Rainfall data...");

  try {
    console.log("Attempting to process data...");
    await reformatRainfall();
    console.log("Reformatting Complete");

    const data = await readRainfall(); 
    console.log(data);

    const result = await insertRainfall(data); 
    console.log(result);

    res.json(result);
    console.log("Processing Complete - Updating Flag");

  } catch (error) {
    console.error('Controller error:', error); 
    res.status(500).json({ error: 'Failed to process data' });
  }
};

