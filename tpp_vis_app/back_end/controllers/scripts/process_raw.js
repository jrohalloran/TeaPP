
// Jennifer O'Halloran
// 18/06/2025


// Thesis Project 




const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const { Client } = require('pg');


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
    const uploadsDir = path.join(__dirname, 'uploads');
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

        console.log("All combined entries:", allEntries);
        return allEntries;

    } catch (err) {
        console.error("Error reading uploads directory:", err);
    }
}


// Read files in uploads directory
// Parse them 
// Create JSON OBJECT "entries"
// {ID: ___, female_parent:___, male_parent:__, correct_ID:_, correct_Female:__, correct_male:__}
async function readProcessedFile() {
    const tempDir = path.join(__dirname, 'temp');
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

        console.log("All combined entries:", allEntries);
        return allEntries;

    } catch (err) {
        console.error("Error reading uploads directory:", err);
    }
}




// Calling R Script to format and proprocess Raw data uploaded 
function preProcessData(){
    /// Calls R formatting script to take uploaded file
    // Then cleans and formats IDs into new file 
    // stored in temp directory 
    const uploadsDir = path.join(__dirname, 'uploads');
    console.log("Uploads Directory:", uploadsDir);

    const scriptDir = path.join("Rscript ",__dirname,'process_raw.R');
    console.log("Script Directory:", scriptDir);

    return new Promise((resolve, reject) => {
        exec(scriptDir, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error running R script: ${error.message}`);
            return reject(error);
        }
        if (stderr) {
            console.warn(`R script warnings:\n${stderr}`);
        }
        console.log(`R script output:\n${stdout}`);
        resolve(); // indicate successful completion
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
            const query2 = 'INSERT INTO preprocessedData (clone_id, female_par, male_par, correct_id, correct_female, correct_male) VALUES ($1, $2, $3, $4, $5, $6)';
            const values2 = [element.ID, element.female_parent, element.male_parent, element.correct_ID,element.correct_female, element.correct_male];
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
  try {
    // Run R script to preprocess data
    console.log("Calling Pre-processing Function...");
    await preProcessData();
    console.log("-------------------------------------");
    console.log("Calling Raw Data Loading Function...");
    const rawEntries = await readUploadedFile();  // Await here if async
    console.log("-------------------------------------");
    console.log("Calling Processed Data Loading Function...");
    const processedEntries = await readProcessedFile();  // Await here if async

    try {
        console.log("-------------------------------------");
        console.log("Trying to Insert Function...");
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
}


main();
