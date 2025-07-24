/*** 
 * // Date: 20/07/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const __backendDir = path.dirname(__dirname);
const __controllersDir = path.join(__backendDir,'controllers');
const __tempDir = path.join(__controllersDir,'temp');
const __temp_envDir = path.join(__controllersDir,'temp_envir');
const __temp_env_tempDir = path.join(__controllersDir,'temp_envir_temp');


const __kinship_plotsDir = path.join(__backendDir,'kinship_plots');
const __fastQCDir = path.join(__backendDir,'fastQC_reports');




async function emptyDirectory(dirPath) {
  try {
    // Check if the directory exists
    await fs.access(dirPath);

    const entries = await fs.readdir(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        await fs.rm(fullPath, { recursive: true, force: true });
      } else {
        await fs.unlink(fullPath);
      }
    }

    console.log(`✅ Emptied directory: ${dirPath}`);
  } catch (err) {
    if (err.code === 'ENOENT') {
      console.warn(`⚠️ Directory does not exist: ${dirPath}`);
    } else {
      console.error(`❌ Failed to empty directory ${dirPath}: ${err.message}`);
    }
  }
}



export async function removeTempDir() {
  console.log("Removing Temp Directory");

  console.log(__tempDir);
  await emptyDirectory(__tempDir);
  return true;
}


export async function removeTemp_evirDir() {
  console.log("Removing Temp_evir Directory");
  console.log(__temp_envDir);
  await emptyDirectory(__temp_envDir);
  return true;
}


export async function removeTemp_envir_tempDir(){
    console.log("Removing Temp_evir Directory");
    console.log(__temp_env_tempDir);
    await emptyDirectory(__temp_env_tempDir);
    return true;

}



export async function removeTempKinship(){
    console.log("Removing Kinship Dir Directory");
    console.log(__kinship_plotsDir);
    await emptyDirectory(__kinship_plotsDir);
    return true;

}


export async function removeFastQCReports(){


}
