
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

const app = express();


const URI = 'neo4j+s://a71c11d2.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ';
//const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' })); 
app.use(express.json({ limit: '10mb' })); 


app.get('/api/getJSON', (req, res) => {
  console.log("Reading JSON Data")
  const data = fs.readFileSync('./plant_clone_sigma_size_by_children_gencol.json', 'utf-8');
  res.json(JSON.parse(data));
});  



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


const EXPECTED_HEADERS = ['ID', 'Female_parent', 'Male_parent']; // Customize as needed


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






// Checking Database Cloud Server is running 
/*
(async () => {
  // URI examples: 'neo4j://localhost', 'neo4j+s://xxx.databases.neo4j.io'
  const URI = 'neo4j+s://a71c11d2.databases.neo4j.io'
  const USER = 'neo4j'
  const PASSWORD = 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ'
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
})();*/

// Setting up port 
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});