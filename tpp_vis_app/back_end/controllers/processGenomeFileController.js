/*** 
 * // Date: 15/07/2025
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


export const processGenomFile =  async (req, res) => {

  console.log(req.body);

  console.log("Attempting to process Genom File...")
  try{
    /*
    console.log("Attempting to process data...")
    const result = await main();
    const complete = true;
    console.log("Processing Complete - Updating Flag")
    const processedEntries = result[1]
    //console.log(processedEntries);
    console.log("Sending Processed Data to front-end for display")*/
    res.json("This path works");
  } catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
  }
}
