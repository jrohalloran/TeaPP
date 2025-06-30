
/*** 
 * // Date: 30/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

// Thesis Project 
// Running R Script to convert clean data to synbreed pedigree for visulisation 

import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs_promise from 'fs/promises';
import fs from 'fs';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const tempDir = path.join(__dirname, 'temp');
const outputFile = path.join(tempDir, 'cleanData.json');



async function performStatistics() {
    console.log("Performing statistics")
    
    const scriptPath = path.join(__dirname, 'scripts', 'perform_statistics.R');
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
/*

async function readRankedCounts() {

    let cleaned = [];

    console.log("Getting Ranked Counts");
    const filename = "ranked_counts.txt";
    const filePath = path.join(tempDir, filename);
    console.log("Reading file:", filePath);

    try {
        let content = await fs.readFile(filePath, 'utf8');
        content = content.split("\t");
        //console.log(content);
        cleaned = content.filter(item => item !== '');
        console.log(cleaned);

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
    return cleaned;
}*/



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

    console.log("Getting Parental Summary Counts")
    const filename = "summary_counts.txt";
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





async function readStats(){

    let siblings;
    let ranked;
    let summary;
    let twins;

    console.log("Getting Saved Statistics");
    try{
        siblings = await readSiblingCounts(tempDir);
        //console.log(siblings)
        ranked = await readRankedCounts(tempDir);
        //console.log(ranked)
        summary = await readSummaryCounts(tempDir);

        twins = await readTwinSummary(tempDir);
    }catch(error){
        console.error('Error:', error);

    }
    return [siblings,ranked,summary,twins];
}


export const getStatistics= async (req, res) => {

    console.log("Attempting to process Pedigree Statistics...");

    try {
        await performStatistics();
        const result = await readStats(tempDir);
        res.json(result);
    } catch (error) {
        console.error('Error:', error);
        res.json(false);
    }
}
