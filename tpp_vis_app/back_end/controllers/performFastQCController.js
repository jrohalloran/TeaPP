/*** 
 * // Date: 16/07/2025
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
const genomfile_dir = path.join(backend_dir,"genom_uploads")
const report_dir = path.join(backend_dir,"fastQC_reports")


async function runFastQC(filePaths){

    console.log('========== FASTQC Script Execution ==========');
    console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
    console.log(`[INFO] Working directory: ${process.cwd()}`);
    console.log(`[INFO] Attempting to run bash script...\n`);


    filePaths.forEach(path => {
        console.log('========== FASTQC Script Execution for '+path+' ==========');
        console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
        /*
        exec(`fastqc "${path}" -o "${report_dir}"`, (err, stdout, stderr) => {
            if (err) {
            console.error(`Error running FastQC on ${path}:`, stderr);
            } else {
            console.log(`FastQC completed for ${path}`);
            }
        });*/
    });



}

function getDirectories(data){

    const directory_list = [];
    for (let i=0; i<data.length;i++){
        let location = data[i].file_location;
        let name = data[i].file_name;
        console.log(location);
        console.log(name);
        let directory = location+"/"+name;
        console.log(directory);
        directory_list.push(directory);
    }

    return directory_list;

}



export const performFastQC =  async (req, res) => {

  console.log(req.body);

    const data = req.body;

  try{
    const directory_list = getDirectories(data);
    console.log(directory_list);
    await runFastQC(directory_list);

    res.json("This path works");
  }catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
    }
}
