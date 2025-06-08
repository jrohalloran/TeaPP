
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
import nuclearFamilyRoutes from './routes/nuclearFamily.js';
import wholeFamilyRoutes from './routes/wholeFamily.js';
import pedigreeRoutes from './routes/pedigree.js';
import allNodesEdgesRoutes from "./routes/allNodesEdges.js"
import allPlantsRoutes from "./routes/allPlantsPG.js"
import selectedPlantRoutes from "./routes/selectedPlant.js"

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


// NEO4J Routes
app.use('/api', nuclearFamilyRoutes); 

app.use('/api', wholeFamilyRoutes);

app.use('/api', pedigreeRoutes);// Gets Pedigree of a selected node 

app.use('/api', allNodesEdgesRoutes); // Getting all nodes and edges for first visualisation 
// Executes Filtering, Grouping and Sigma Conversion


// POSTGRESQL Routes

app.use('/api', allPlantsRoutes); // Gets first 100 rows of plants table 

app.use('/api', selectedPlantRoutes); // Get data for one selected plant 






// Checking Database Cloud Server is running 
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
})();

// Setting up port 
const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});