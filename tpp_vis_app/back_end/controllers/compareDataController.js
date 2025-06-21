
// Jennifer O'Halloran
// 20/06/2025


// Thesis Project 



import path from 'path';
//import { exec } from 'child_process';
//import { Client } from 'pg';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';
import { InvalidFileSystem } from '@angular/compiler-cli';
import { identifierName } from '@angular/compiler';




const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
//const backend_dir = path.dirname(__dirname);




async function readParents() {
    let cleaned = [];


    console.log("Getting Non matching parent info");
    const filename = "non_match_parents.txt";
    const filePath = path.join(__dirname, 'temp', filename);
    console.log("Reading file:", filePath);

  try {
    let content = await fs.readFile(filePath, 'utf8');
    content = content.split("\n");
    //console.log(content);
    cleaned = content.filter(item => item !== '');
    //console.log(cleaned);

  } catch (err) {
    console.error("Error reading the file:", err);
    return [];
  }
  return cleaned;
}


async function readInvalidIDs() {

    let cleaned = [];

    console.log("Getting Invalvid Clones info");
    const filename = "invalid_IDs.txt";
    const filePath = path.join(__dirname, 'temp', filename);
    console.log("Reading file:", filePath);

    try {
        let content = await fs.readFile(filePath, 'utf8');
        content = content.split("\n");
        //console.log(content);
        cleaned = content.filter(item => item !== '');
        console.log(cleaned);

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
    return cleaned;
}


async function readInvalidSoloIDs() {

    let cleaned = [];

    console.log("Getting Invalvid Clones info");
    const filename = "invalid_solo_IDs.txt";
    const filePath = path.join(__dirname, 'temp', filename);
    console.log("Reading file:", filePath);

    try {
        let content = await fs.readFile(filePath, 'utf8');
        content = content.split("\n");
        //console.log(content);
        cleaned = content.filter(item => item !== '');
        console.log(cleaned);

    } catch (err) {
        console.error("Error reading the file:", err);
        return [];
    }
    return cleaned;
}



function getInvalidIDEntries(invalidIDs, processedData){
    console.log(invalidIDs);
    //console.log(processedData);

    //console.log(processedData[1].correct_ID);

    const matchedEntries = processedData.filter(entry =>
        invalidIDs.includes(entry.correct_ID));

    //console.log(matchedEntries);   
    //console.log(matchedEntries.length);
    return matchedEntries;

}





function getInvalidParentEntries(nonMatchParents, processedData){

    console.log(nonMatchParents);
    //console.log(processedData);

    const matchedEntries_F = processedData.filter(entry =>
    nonMatchParents.includes(entry.correct_female));

    const matchedEntries_M = processedData.filter(entry =>
    nonMatchParents.includes(entry.correct_male));

    //console.log(matchedEntries_F);
    console.log(matchedEntries_F.length);
    //console.log(matchedEntries_M); 
    //console.log(matchedEntries_M.length); 
    matchedEntries_F.push(matchedEntries_M);
    console.log("combined matched entries");
    console.log(matchedEntries_F.length);
    return matchedEntries_F;
}


function findUnusedEntries(idEntries, soloIds){
    //console.log(idEntries);
    console.log("Finding Entries used as parents")
    idEntries.forEach(item => {
        if (soloIds.includes(item.correct_ID)) {
                item.used = 'N';
        }else{
            item.used = 'Y'
    }
    });
    //console.log(idEntries);
    return idEntries;
}

async function main(processedData){
    console.log("Main Activated -- compareDataController")
    //console.log(processedData);

    const invalidIDs = await readInvalidIDs();
    //console.log(invalidIDs);

    const nonMatchParents = await readParents();

    const soloIds = await readInvalidSoloIDs()
    console.log(soloIds);
    //console.log(nonMatchParents);
    const parentEntries = getInvalidParentEntries(nonMatchParents,processedData);
    const idEntries = getInvalidIDEntries(invalidIDs ,processedData);

    const finalidEntries = findUnusedEntries(idEntries, soloIds)

    console.log(finalidEntries);
    console.log(parentEntries);

    return [finalidEntries,parentEntries,nonMatchParents,invalidIDs];
}




export const compareData= async (req, res) => {

    console.log("Starting Comparison Function")
    const processedData = req.body;
    //console.log(processedData);

  try{
    console.log("Attempting to compare data...")
    const result = await main(processedData);
    //console.log(result);
    res.json(result);
    

  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}

