
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
import searchRoutes from './routes/searchID.js'
import envStatsRoutes from './routes/envStats.js'
import genomicDataRoutes from './routes/genomicAnalysis.js'
import databaseRoutes from './routes/databaseRoutes.js'

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' })); 
app.use(express.json({ limit: '10mb' })); 


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = __dirname;
const controller_dir = path.join(backend_dir,"controllers");
const temp_dir = path.join(controller_dir,"temp");
const temp_envir_dir = path.join(controller_dir,"temp_envir");
const temp_envir_temp_dir = path.join(controller_dir,"temp_envir_temp");

/// ------------ DIRECTORY HANDLING --------------

// Setting up Upload Directory in Back-end 
const uploadDir = 'uploads';
const upload_tempDir = 'env_temp_uploads';
const upload_rainDir = 'env_uploads';

if (fs.existsSync(uploadDir)){
  console.log("/uploads directory exists");
  console.log("---- Removing Directory ----");
  fs.rmSync(uploadDir, { recursive: true, force: true })
}
if (!fs.existsSync(uploadDir)) {
  console.log("---- Making Directory ----");
  fs.mkdirSync(uploadDir);
}


if (fs.existsSync(upload_tempDir)){
  console.log("/env_temp_uploads directory exists");
  console.log("---- Removing Directory ----");
  fs.rmSync(upload_tempDir, { recursive: true, force: true })
}
if (!fs.existsSync(upload_tempDir)) {
  console.log("/env_temp_uploads making directory");
  console.log("---- Making Directory ----");
  fs.mkdirSync(upload_tempDir);
}


if (fs.existsSync(upload_rainDir)){
  console.log("/env_uploads directory exists");
  console.log("---- Removing Directory ----");
  fs.rmSync(upload_rainDir, { recursive: true, force: true })
}
if (!fs.existsSync(upload_rainDir)) {
  console.log("---- Making Directory ----");
  fs.mkdirSync(upload_rainDir);
}



console.log("Backend Directory: "+backend_dir);
console.log("Controller Directory: "+controller_dir);
console.log("Temp Directory: "+temp_dir);
console.log("Temp Envir Directory: "+temp_envir_dir);
console.log("Temp Envir Temp Directory: "+temp_envir_temp_dir);

// ------ Re-establising TEMP files --------

if (fs.existsSync(temp_dir)){
  console.log("/temp_dir directory exists");
  console.log("---- Removing Directory ----");
  fs.rmSync(upload_tempDir, { recursive: true, force: true })
}
if (!fs.existsSync(temp_dir)) {
  console.log("---- Making Directory ----");
  fs.mkdirSync(temp_dir);
}

/// ------------ FILE UPLOAD --------------


const EXPECTED_HEADERS = ['ID', 'Female_parent', 'Male_parent'];

const EXPECTED_RAIN_HEADERS = ['year','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

const EXPECTED_TEMP_HEADERS = ["YEAR","MONTH","JAN","FEB","MAR","APR","MAY","JUN","JUL","AUG","SEP","OCT","NOV","DEC","Mean"];


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


const env_storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'env_uploads/'); // Upload directory
 },
 filename: function (req, file, cb) {
   cb(null, file.originalname); // Keep the original file name
 }
});
const env_upload = multer({ storage: env_storage });


const genom_storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'genom_uploads/'); // Upload directory
 },
 filename: function (req, file, cb) {
   cb(null, file.originalname); // Keep the original file name
 }
});
const genom_upload = multer({ storage: genom_storage });



const env_temp_storage = multer.diskStorage({
 destination: function (req, file, cb) {
   cb(null, 'env_temp_uploads/'); // Upload directory
 },
 filename: function (req, file, cb) {
   cb(null, file.originalname); // Keep the original file name
 }
});
const env_temp_upload = multer({ storage: env_temp_storage });




// Upload route
app.post('/uploadFile', (req, res) => {
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


app.post('/uploadEnvRAINfile', (req, res) => {
  console.log('Starting Environmental File Upload...');

  env_upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Multer error occurred during upload.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'An unknown error occurred during upload.', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = path.join('env_uploads', req.file.originalname);

    // Read file contents
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ message: 'Error reading uploaded file.' });
      }

      const lines = data.split('\n');
      const headers = lines[0].trim().split('\t');

      const headersMatch = EXPECTED_RAIN_HEADERS.every((h, i) => h === headers[i]);
      
      if (!headersMatch) {
        // Delete the file if headers don't match
        fs.unlink(filePath, () => {
          return res.status(400).json({
            message: `Invalid file headers. Expected: ${EXPECTED_RAIN_HEADERS.join(', ')}`
          });
        });
      } else {
        console.log('File uploaded successfully with valid headers:', req.file);
        return res.status(200).json({ message: 'File uploaded and validated successfully.' });
      }

    });
  });
});


app.post('/uploadEnvTEMPfile', (req, res) => {
  console.log('Starting Environmental File Upload...');

  env_temp_upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Multer error occurred during upload.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'An unknown error occurred during upload.', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = path.join('env_temp_uploads', req.file.originalname);

    // Read file contents
    fs.readFile(filePath, 'utf8', (readErr, data) => {
      if (readErr) {
        return res.status(500).json({ message: 'Error reading uploaded file.' });
      }

      const lines = data.split('\n');
      const headers = lines[0].trim().split('\t');

      const headersMatch = EXPECTED_TEMP_HEADERS.every((h, i) => h === headers[i]);
      
      if (!headersMatch) {
        // Delete the file if headers don't match
        fs.unlink(filePath, () => {
          return res.status(400).json({
            message: `Invalid file headers. Expected: ${EXPECTED_TEMP_HEADERS.join(', ')}`
          });
        });
      } else {
        console.log('File uploaded successfully with valid headers:', req.file);
        return res.status(200).json({ message: 'File uploaded and validated successfully.' });
      }

    });
  });
});


app.post('/uploadGENOMfile', (req, res) => {
  console.log('Starting Genomic File Upload...');

  genom_upload.single('file')(req, res, function (err) {
    if (err instanceof multer.MulterError) {
      return res.status(500).json({ message: 'Multer error occurred during upload.', error: err.message });
    } else if (err) {
      return res.status(500).json({ message: 'An unknown error occurred during upload.', error: err.message });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded.' });
    }

    const filePath = path.join('genom_uploads', req.file.originalname);

    console.log('File uploaded successfully with valid headers:', req.file);
    return res.status(200).json(true);

    });
  });




// Serve uploaded files
app.use('/uploads', express.static('uploads'));

app.use('/genom_uploads', express.static('genom_uploads'));


// DATABASE HANDLING 

app.use('/api', databaseRoutes);


// File Processing Routes

app.use('/api', processDataRoutes); 

app.use('/api', compareDataRoutes); 

app.use('/api', getCleanDataRoutes); 

app.use('/api', insertNeo4jDBRoutes); 

app.use('/api', processPedigreeRoutes); 

app.use('/api', updateParentsRoutes); 


// STAT + SEARCHING Routes

app.use('/api', getStatsRoutes);

app.use('/api', searchRoutes);


app.use('/api', genomicDataRoutes);






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

app.use('/calculatedKinship', express.static(path.join(__dirname, '/controllers/kinship_plots')));

app.use('/fastQCReports', express.static(path.join(__dirname, '/fastQC_reports')));

app.get('/api/fastQCreports', (req, res) => {
  const reportsDir = path.join(__dirname, '/fastQC_reports');

  fs.readdir(reportsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to read directory' });
    }

    const htmlFiles = files.filter(file => file.endsWith('.html'));
    res.json(htmlFiles);
  });
});


app.use('/diagramImages', express.static(path.join(__dirname, '/controllers/temp')));


// ENVIRONMENTAL DATA 

app.use('/api', envStatsRoutes);

app.use('/rainfallImages', express.static(path.join(__dirname, 'controllers/temp_envir')));

app.use('/temperatureImages', express.static(path.join(__dirname, 'controllers/temp_envir_temp')));


// Authentication 

app.get('/api/user', (req, res) => {
  const username = req.headers['x-remote-user'] || 'Guest';
  res.json(username);
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

  await driver.close();
})();



// HANDLING ERRORS 
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