
/*** 
 * // Date: 05/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
// Function  - Express API SERVER
// Endpoints for the Front-end Angular Post Requests 
***/

// Importing all required functions
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import fs from 'fs';
import neo4j from 'neo4j-driver';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';


import nuclearFamilyRoutes from './routes/nuclearFamily.js';
import wholeFamilyRoutes from './routes/wholeFamily.js';
import pedigreeRoutes from './routes/pedigree.js';
import allNodesEdgesRoutes from "./routes/allNodesEdges.js"
import allPlantsRoutes from "./routes/allPlantsPG.js"
import selectedPlantRoutes from "./routes/selectedPlant.js"
import getPartnerOfRoutes from "./routes/getPartnerOf.js"
import processDataRoutes from "./routes/processData.js"
import compareDataRoutes from "./routes/compareData.js"
import getCleanDataRoutes from "./routes/getCleanData.js"
import processPedigreeRoutes from "./routes/processPedigree.js"
import insertNeo4jDBRoutes from './routes/insertNeo4j.js'
import updateParentsRoutes from './routes/updateParentsID.js'
import getKinshipRoutes  from './routes/getKinship.js';
import performKinshipfromRoutes from './routes/performKinship.js';
import getStatsRoutes from './routes/getStats.js'

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' })); 
app.use(express.json({ limit: '10mb' })); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);


/// ------------ FILE UPLOAD --------------

// Setting up Upload Directory in Back-end 
const uploadDir = 'uploads';
if (fs.existsSync(uploadDir)){
  console.log("/uploads directory exists");
  console.log("---- Removing Directory ----");
  fs.rmSync(uploadDir, { recursive: true, force: true })
}
if (!fs.existsSync(uploadDir)) {
  console.log("---- Making Directory ----");
  fs.mkdirSync(uploadDir);
}


const EXPECTED_HEADERS = ['ID', 'Female_parent', 'Male_parent'];


// Set up multer for file upload
const storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'uploads/'); // Upload directory
 },
 filename: function (req, file, cb) {
   cb(null, file.originalname); // Keep the original file name
 }
});
const upload = multer({ storage: storage });

// Upload route
app.post('/uploadfile', (req, res) => {
  console.log('Starting File Upload...');

  upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Multer error occurred during upload.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'An unknown error occurred during upload.', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = path.join('uploads', req.file.originalname);

    // Read file contents
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ message: 'Error reading uploaded file.' });
      }

      const lines = data.split('\n');
      const headers = lines[0].trim().split('\t');

      const headersMatch = EXPECTED_HEADERS.every((h, i) => h === headers[i]);

      if (!headersMatch) {
        // Delete the file if headers don't match
        fs.unlink(filePath, () => {
          return res.status(400).json({
            message: `Invalid file headers. Expected: ${EXPECTED_HEADERS.join(', ')}`
          });
        });
      } else {
        console.log('File uploaded successfully with valid headers:', req.file);
        return res.status(200).json({ message: 'File uploaded and validated successfully.' });
      }
    });
  });
});


// Serve uploaded files
app.use('/uploads', express.static('uploads'));



// File Processing Routes

app.use('/api', processDataRoutes); 

app.use('/api', compareDataRoutes); 

app.use('/api', getCleanDataRoutes); 

app.use('/api', insertNeo4jDBRoutes); 

app.use('/api', processPedigreeRoutes); 

app.use('/api', updateParentsRoutes); 

// Stats + Searching 

app.use('/api', getStatsRoutes);

// NEO4J Routes
app.use('/api', nuclearFamilyRoutes); // depricated?

app.use('/api', wholeFamilyRoutes); // depricated?



app.use('/api', pedigreeRoutes);// Gets Pedigree of a selected node 

app.use('/api', allNodesEdgesRoutes); // Getting all nodes and edges for first visualisation 
// Executes Filtering, Grouping and Sigma Conversion

app.use('/api', getPartnerOfRoutes);


// POSTGRESQL Routes

app.use('/api', allPlantsRoutes); // Gets first 100 rows of plants table 

app.use('/api', selectedPlantRoutes); // Get data for one selected plant 



// KINSHIP ROUTES 

app.use('/api', getKinshipRoutes); // Get existing stored Kinship data 

app.use('/api', performKinshipfromRoutes); // Performing New Kinship 

app.use('/kinshipImages', express.static(path.join(__dirname, '/kinship')));

app.get('/api/images', (req, res) => {
  const imagesPath = path.join(__dirname, '/kinship');
  console.log(imagesPath);
  fs.readdir(imagesPath, (err, files) => {
    if (err) return res.status(500).json({ error: 'Error reading images directory' });
    const imageFiles = files.filter(f => /\.(png|jpg|jpeg|gif)$/i.test(f));
    res.json(imageFiles);
  });
});



// NEO4J CONNECTION TEST
// Checking Database Cloud Server is running 
(async () => {
  const URI = 'bolt://localhost:7687';
  const USER = 'neo4j';
  const PASSWORD = 'tAqsiv-tivfif-bomhe9'; // Replace with your actual password

  let driver

  try {
    driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD))
    const serverInfo = await driver.getServerInfo()
    console.log('Connection to Neo4js DB established')
    console.log(serverInfo)
  } catch(err) {
    console.log(`Connection error\n${err}\nCause: ${err.cause}`);
    await driver.close();
  }

  // Make queries

  await driver.close();
})();

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled Rejection:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});


// Setting up port 
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});