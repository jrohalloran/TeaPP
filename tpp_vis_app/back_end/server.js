
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
import { highlightAncestors } from './scripts/getSigmaStats.js';
import Graph from 'graphology';

const app = express();

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


/*
app.post('/highlight', (req, res) => {
  const { graphData, nodeId } = req.body;

  const graph = new Graph({ multi: true });
  graphData.nodes.forEach(n => {
    graph.addNode(n.id, n);
  });
  graphData.edges.forEach(e => {
    graph.addEdge(e.source, e.target, { id: e.id });
  });

  const highlights = highlightAncestors(graph, nodeId, graphData);
  res.json(highlights);
});
*/


app.post('/api/getNuclearFamily', (req, res) => {
  const nodeID = req.body;
  console.log("------------------------")
  console.log("Getting Nuclear Family for:");
  console.log(nodeID);
  console.log("------------------------")
  

});


const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});