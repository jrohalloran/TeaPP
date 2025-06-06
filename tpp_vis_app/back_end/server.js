
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


const app = express();


const URI = 'neo4j+s://a71c11d2.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ';
const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));

// Middleware
app.use(cors());
app.use(bodyParser.json({ limit: '10mb' }));
app.use(express.text({ limit: '10mb' })); 
app.use(express.json({ limit: '10mb' })); 




app.get('/api/trial', (req, res) => {

  console.log("Trial Successful");
  res.json({ message: 'This is trial data' });
});


app.get('/api/getJSON', (req, res) => {
  console.log("Reading JSON Data")
  const data = fs.readFileSync('./plant_clone_sigma_size_by_children_gencol.json', 'utf-8');
  res.json(JSON.parse(data));
});  

app.use('/api', nuclearFamilyRoutes);

app.use('/api', wholeFamilyRoutes);

app.use('/api', pedigreeRoutes);

/*
app.post('/api/getNuclearFamily', (req, res) => {
  const nodeID = req.body;
  console.log("------------------------")
  console.log("Getting Nuclear Family for:");
  console.log(nodeID);
  console.log("------------------------")
  

});
*/

/*
app.post('/api/getNuclearFamily2', async (req, res) => {
  let nodeIDs = req.body.nodeID || req.body; // accept { nodeID: [...] } or direct array

  if (!nodeIDs) {
    return res.status(400).json({ error: 'Missing nodeID(s) in request body' });
  }

  if (!Array.isArray(nodeIDs)) {
    nodeIDs = [nodeIDs];
  }

  const combinedResult = {
    nodes: [],
    family: [],
  };

  try {
    await Promise.all(nodeIDs.map(async (id) => {
      const session = driver.session(); // create new session per query
      try {
        const query = `
          MATCH (n {id: $nodeID})-[:PARENT_OF|CHILD_OF]-(family)
          RETURN n, family
        `;

        const result = await session.run(query, { nodeID: id });

        if (result.records.length === 0) return;

        combinedResult.nodes.push(result.records[0].get('n').properties);

        result.records.forEach(record => {
          combinedResult.family.push(record.get('family').properties);
        });

      } finally {
        await session.close(); // close session after query
      }
    }));

    // Optional: deduplicate family nodes by id
    const seenIds = new Set();
    combinedResult.family = combinedResult.family.filter(fam => {
      if (fam.id && !seenIds.has(fam.id)) {
        seenIds.add(fam.id);
        return true;
      }
      return false;
    });

    res.json(combinedResult);

  } catch (error) {
    console.error('Error querying nuclear family:', error);
    res.status(500).json({ error: 'Failed to get nuclear family data' });
  }
});
*/




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


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});