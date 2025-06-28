/*** 
 * // Date: 18/06/2025
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


// Parse RAW File 
function parseUploadFile(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) return entries;

  const headers = lines[0].split(/\t/);
  const idIndex = headers.indexOf("ID");
  const fIndex = headers.indexOf("Female_parent");
  const mIndex = headers.indexOf("Male_parent");

  const entries = [];

  // First pass: add nodes with generation and parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const id = parts[idIndex]?.trim().toUpperCase();
    const female_parent = parts[fIndex]?.trim().toUpperCase();
    const male_parent = parts[mIndex]?.trim().toUpperCase();

    entries.push({ID:id, 
        female_parent: female_parent, 
        male_parent: male_parent
        });

    });
    return entries;
    
}

// Parse Preprocessed File 
function parseProcessedFile(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) return entries;

  const headers = lines[0].split(/\t/);
  const idIndex = headers.indexOf("ID");
  const fIndex = headers.indexOf("Female_parent");
  const mIndex = headers.indexOf("Male_parent");
  const cidIndex = headers.indexOf("correct_ID");
  const cfIndex = headers.indexOf("correct_Female");
  const cmIndex = headers.indexOf("correct_Male");

  const entries = [];

  // First pass: add nodes with generation and parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const id = parts[idIndex]?.trim().toUpperCase();
    const female_parent = parts[fIndex]?.trim().toUpperCase();
    const correct_id = parts[cidIndex]?.trim().toUpperCase();
    const male_parent = parts[mIndex]?.trim().toUpperCase();
    const correct_female = parts[cfIndex]?.trim().toUpperCase();
    const correct_male = parts[cmIndex]?.trim().toUpperCase();


    entries.push({ID:id, 
        female_parent: female_parent, 
        male_parent: male_parent,
        correct_ID: correct_id,
        correct_female: correct_female,
        correct_male: correct_male
        });

    });
    return entries;
    
}

// Read files in uploads directory
// Parse them 
// Create JSON OBJECT "entries" {ID: ___, female_parent:___, male_parent:______}
async function readUploadedFile() {
    const uploadsDir = path.join(backend_dir, 'uploads');
    console.log("Uploads Directory:", uploadsDir);

    try {
        const files = await fs.readdir(uploadsDir);
        console.log("Opening Directory");

        let allEntries = [];

        for (const file of files) {
            const filePath = path.join(uploadsDir, file);
            console.log("Reading File:", file);

            try {
                const content = await fs.readFile(filePath, 'utf8');
                const parsedData = parseUploadFile(content);

                if (Array.isArray(parsedData)) {
                    allEntries = allEntries.concat(parsedData);
                } else {
                    console.warn(`Warning: Parsed data from ${file} is not an array. Skipping.`);
                }

            } catch (err) {
                console.error(`Error reading file ${file}:`, err);
            }
        }

        //console.log("All combined entries:", allEntries);
        return allEntries;

    } catch (err) {
        console.error("Error reading uploads directory:", err);
    }
}

// Read files in uploads directory
// Parse them 
// Create JSON OBJECT "entries"
// {ID: ___, female_parent:___, male_parent:__, correct_ID:_, correct_Female:__, correct_male:__}
/*
async function readProcessedFile() {
    const filename = "preprocessed_data.txt"
    const tempDir = path.join(__dirname, 'temp',filename);
    console.log("temp Directory:", tempDir);

    try {
        const files = await fs.readdir(tempDir);
        console.log("Opening Directory");

        let allEntries = [];

        for (const file of files) {
            const filePath = path.join(tempDir, file);
            console.log("Reading File:", file);

            try {
                const content = await fs.readFile(filePath, 'utf8');
                const parsedData = parseProcessedFile(content);

                if (Array.isArray(parsedData)) {
                    allEntries = allEntries.concat(parsedData);
                } else {
                    console.warn(`Warning: Parsed data from ${file} is not an array. Skipping.`);
                }

            } catch (err) {
                console.error(`Error reading file ${file}:`, err);
            }
        }

        //console.log("All combined entries:", allEntries);
        return allEntries;

    } catch (err) {
        console.error("Error reading uploads directory:", err);
    }
}*/

async function readProcessedFile() {
  const filename = "preprocessed_data.txt";
  const filePath = path.join(__dirname, 'temp', filename);
  console.log("Reading file:", filePath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
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

// Calling R Script to format and proprocess Raw data uploaded 
function preProcessData(){
    /// Calls R formatting script to take uploaded file
    // Then cleans and formats IDs into new file 
    // stored in temp directory 
    console.log(__dirname);
    const uploadsDir = path.join(backend_dir, 'uploads');
    console.log("Uploads Directory:", uploadsDir);




    const scriptPath = path.join(__dirname, 'scripts', 'process_raw.R');
    console.log("Script Directory:", scriptPath);
    const command = `Rscript "${scriptPath}"`;
    console.log(command);


    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running R script: ${error.message}`);
            return reject(error);
        }
        if (stderr) {
            console.warn(`R script warnings:\n${stderr}`);
        }
        console.log(`R script output:\n${stdout}`);
        resolve();
        });
    });
}



async function insertData(rawEntries,processedEntries) {
  console.log("Starting Insertion Function....");


  const client = new Client({
    user: "jennyohalloran",
    host: "localhost",
    database: "teapp_app_db",
    port: "5432",
  });
  

  try {
    await client.connect();

    for (const entry of rawEntries) {
      const query = 'INSERT INTO rawData (clone_id, female_par, male_par) VALUES ($1, $2, $3)';
      const values = [entry.ID, entry.female_parent, entry.male_parent];
      await client.query(query, values);
        
      for (const element of processedEntries){
        if (element.ID == entry.ID){
            const query2 = 'INSERT INTO preprocessedData (clone_id, correct_id, correct_female, correct_male) VALUES ($1, $2, $3, $4)';
            const values2 = [element.ID, element.correct_ID,element.correct_female, element.correct_male];
            await client.query(query2, values2);
        }
      }
    }

  } catch (err) {
    console.error('Error inserting data', err);
  } finally {
    await client.end();
  }
  console.log("RawData and preProcessedData inserted sucessfuly!")
}


async function main() {

  let rawEntries = [];
  let processedEntries = [];
  try {
    // Run R script to preprocess data
    console.log("Calling Pre-processing Function...");
    await preProcessData();
    console.log("-------------------------------------");
    console.log("Calling Raw Data Loading Function...");
    rawEntries = await readUploadedFile();  // Await here if async
    console.log("-------------------------------------");
    console.log("Calling Processed Data Loading Function...");
    processedEntries = await readProcessedFile();  // Await here if async

    try {
        console.log("-------------------------------------");
        console.log("Trying to Insert Function...");


        //console.log("rawEntries is:", rawEntries);
        //console.log("processedEntries is:", processedEntries);

        if (!Array.isArray(rawEntries)) {
          console.error("rawEntries is not an array");
        }
        if (!Array.isArray(processedEntries)) {
          console.error("processedEntries is not an array");
        }



        await insertData(rawEntries, processedEntries);
        console.log("-------------------------------------");
        console.log("PostgreSQL inserted successfully");
    } catch (err) {
        console.error("Failed to insert into PostgreSQL Database:", err);
    }

  } catch (err) {
    console.error("Failed in main():", err);
  }finally{
    console.log("-------------------------------------");
    console.log("Main function complete! ")
  }

  return [rawEntries, processedEntries]
}


export const processData= async (req, res) => {

  console.log("Attempting to process data...")
  try{
    console.log("Attempting to process data...")
    const result = await main();
    const complete = true;
    console.log("Processing Complete - Updating Flag")
    const processedEntries = result[1]
    //console.log(processedEntries);
    console.log("Sending Processed Data to front-end for display")
    res.json(processedEntries);

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}
