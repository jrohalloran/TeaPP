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
import { promisify } from 'util';
import { sendEmail } from '../services/email.service.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);
const genomfile_dir = path.join(backend_dir,"genom_uploads")
const report_dir = path.join(backend_dir,"fastQC_reports")




const execPromise = promisify(exec);

async function runFastQC(filePaths){

  console.log('========== FASTQC Batch Execution Started ==========');
  console.log(`[INFO] Timestamp: ${new Date().toISOString()}`);
  if (email){
  try{
    sendEmail(email, 'FastQC Analysis Started', 'FastQC Analysis started!');
  }catch(err){
    console.log("Unable to send Email/ Invalid Email given")
  }}
    const promises = filePaths.map(path => {
    const command = `fastqc "${path}" -o "${report_dir}"`;
    console.log(`Running: ${command}`);
    return execPromise(command)
      .then(() => ({ path, success: true }))
      .catch(error => ({ path, success: false, error: error.stderr || error.message }));
  });

  const results = await Promise.all(promises);
  console.log('========== FASTQC Batch Execution Finished ==========');
  if(email){
  try{
    sendEmail(email, 'FastQC Analysis Ended', 'FastQC Analysis Ended!');
  }catch(err){
    console.log("Unable to send Email/ Invalid Email given")
  }}
  return results;
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

let email;

export const performFastQC =  async (req, res) => {

  console.log(req.body);

  const data = req.body[0];
  console.log(data);
  email = req.body[1];
  console.log(email);


  try{
    const directory_list = getDirectories(data);
    console.log(directory_list);
    const results = await runFastQC(directory_list);
    sendEmail(email, 'FastQC Analysis Ended', 'FastQC Analysis Ended!');

    res.json(results);
  }catch (err) {
    console.error('Controller error:', err);
    res.status(500).json({ error: 'Failed to process data' });
    }
}
