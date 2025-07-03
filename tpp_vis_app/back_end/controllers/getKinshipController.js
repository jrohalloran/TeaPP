/*** 
 * // Date: 27/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/



import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs/promises';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);

// Thesis Project - Getting Existing Kinship Analysis 

export const getKinship= async (req, res) => {

    console.log("Getting Stored Kinship Data")
    const kinshipDir = path.join(backend_dir, '/kinship');
    console.log(kinshipDir)
    fs.readdir(kinshipDir, (err, files) => {
        if (err) 
            return res.status(500).json({ error: 'Failed to read images directory' });
    const imageFiles = files.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file));
    res.json(imageFiles);
    });
}
