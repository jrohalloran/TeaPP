
/*** 
 * // Date: 30/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 
// Running R Script to convert clean data to synbreed pedigree for visulisation 

import path, { join } from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs_promise from 'fs/promises';
import fs from 'fs';
import db from '../services/postgres_db.js';
import { removeTempDir } from '../services/directories.service.js';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp');
const outputFile = path.join(tempDir, 'Stats_cleanData.json');
const outputTextFile = path.join(tempDir, 'temp_cleanData.txt');

let data;

async function joinPlants() {
    console.log("Getting all of Plants table")
  try {
    const query = `
        SELECT 
            c.*, 
            p.female_par, 
            p.male_par
        FROM cleanData c
        LEFT JOIN rawData p ON c.clone_id = p.clone_id
        `;
    const result = await db.query(query);
    data = result.rows;
    console.log(result.rows);

  } catch (error) {
    console.error(error);
    res.status(500).send('Error fetching plants');
  }
}

async function writeJson(){


    console.log("Attempting Write JSON file...")
    
    try{
        fs.writeFileSync(outputFile, JSON.stringify(data, null, 2));
        console.log("File Successfully Written:", outputFile);
    } catch (error) {
        console.error('Error:', error);
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


async function performStatistics() {
    console.log("Performing statistics")
    
    const scriptPath = path.join(__dirname, 'scripts', 'perform_statistics.R');

    const dataFilePath = outputFile;
    const scriptDir = path.dirname(scriptPath);
    const jsonString = JSON.stringify(data);

    // Escape quotes inside the JSON string for safe shell usage:
    const escapedJsonString = jsonString.replace(/(["\\$`])/g, '\\$1');

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

async function readSiblingCounts(tempDir) {

    console.log("Getting Sibling Counts")
    const filename = "sibling_counts.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
                [headers[2]]: parseInt(values[2], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readRankedCounts(tempDir) {

    console.log("Getting Ranked Counts")
    const filename = "ranked_counts.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readSummaryCounts(tempDir) {
    console.log("Getting Parental Summary Counts");

    const filename = "summary_counts.tsv"; // updated for TSV if needed
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        const content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        if (lines.length < 2) {
            console.warn("No data rows found in file.");
            return [];
        }

        // Parse headers (assuming TSV)
        const headers = lines[0].split('\t').map(h => h.trim());

        // Parse each data line
        const data = lines.slice(1).map(line => {
            const values = line.split('\t').map(v => v.trim());
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10)
            };
        });

        console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readTwinSummary(tempDir) {

    console.log("Getting Twin Summary Counts")
    const filename = "twin_check_summary.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readYearCount(tempDir) {

    console.log("Getting Year Counts")
    const filename = "year_count.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readFormatted(tempDir) {

    console.log("Getting Re-Formatting Stats")
    const filename = "formatting_summary.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readBasicFigures(tempDir) {

    console.log("Getting Basic Figures")
    const filename = "basic_figures.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: values[0],
                [headers[1]]: parseInt(values[1], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}

async function readGenTable(tempDir) {

    console.log("Getting Basic Figures")
    const filename = "gener_table.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        // Read and split into lines
        let content = await fs_promise.readFile(filePath, 'utf8');
        const lines = content.trim().split('\n');

        // Parse header
        const headers = lines[0].split('\t');

        // Parse rows into objects
        const data = lines.slice(1).map(line => {
            const values = line.split('\t');
            return {
                [headers[0]]: parseInt(values[1], 10),
                [headers[1]]: parseInt(values[2], 10),
            };
        });

        //console.log("Parsed data:", data);
        return data;

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
}




async function readStats(){

    let siblings;
    let ranked;
    let summary;
    let twins;
    let year;
    let figures;
    let formatted;
    let generation;


    console.log("Getting Saved Statistics");
    try{
        siblings = await readSiblingCounts(tempDir);
        //console.log(siblings)
        ranked = await readRankedCounts(tempDir);
        //console.log(ranked)
        summary = await readSummaryCounts(tempDir);

        twins = await readTwinSummary(tempDir);

        year = await readYearCount(tempDir);

        figures = await readBasicFigures(tempDir);

        formatted = await readFormatted(tempDir);

        generation = await readGenTable(tempDir);

    }catch(error){
        console.error('Error:', error);

    }
    return [siblings,ranked,summary,twins,year,figures,formatted,generation];
}


export const getStatistics= async (req, res) => {

    console.log("Attempting to process Pedigree Statistics...");

    try {
        await removeTempDir();
        await joinPlants();
        await writeJson();
        await writeFile();
        await performSynbreed();
        await performStatistics();
        const result = await readStats(tempDir);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}
