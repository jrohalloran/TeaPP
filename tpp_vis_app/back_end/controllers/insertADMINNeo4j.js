/*** 
 * // Date: 24/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

import fs from 'fs/promises';
import neo4j from 'neo4j-driver'
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { Client } from 'pg';

const execAsync = promisify(exec);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);



const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'tAqsiv-tivfif-bomhe9'; 

// Create a driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));


async function writeCsvFiles(graphData) {
  // Define CSV headers exactly as neo4j-admin import expects
  // Keep one unique ID column for node identification
  // Rename 'id' property to 'nodeId' or similar to avoid duplicate column names
  const nodeHeaders = ['id:ID', 'gener', 'par1', 'par2', 'year:int', ':LABEL'];
  const relHeaders = [':START_ID', ':END_ID', ':TYPE'];

  // Build CSV content for nodes
  const nodeRows = graphData.nodes.map(node => [
    node.id,
    node.gener || '',
    node.par1 || '',
    node.par2 || '',
    node.year !== null && node.year !== undefined ? node.year : '',
    'Plant'  // add label explicitly
  ]);

  const nodesCsv = [
    nodeHeaders.join(','),              
    ...nodeRows.map(row => row.map(val => `"${val}"`).join(',')) 
  ].join('\n');

  // Build CSV content for relationships
  const relRows = graphData.edges.map(edge => [
    edge.source,
    edge.target,
    'PARENT_OF' 
  ]);

  const relsCsv = [
    relHeaders.join(','),               
    ...relRows.map(row => row.map(val => `"${val}"`).join(','))
  ].join('\n');

  const tempDir = path.join(__dirname, 'temp');
  await fs.mkdir(tempDir, { recursive: true });

  const nodesFile = path.join(tempDir, 'plants.csv');
  const relsFile = path.join(tempDir, 'parent_of.csv');

  await fs.writeFile(nodesFile, nodesCsv, 'utf8');
  await fs.writeFile(relsFile, relsCsv, 'utf8');

  console.log(`CSV files written:`);
  console.log(`  Nodes: ${nodesFile}`);
  console.log(`  Relationships: ${relsFile}`);

  return { nodesFile, relsFile };
}

async function importWithNeo4jAdmin(graphData) {
  try {
    // Step 1: Write CSV files
    const { nodesFile, relsFile } = await writeCsvFiles(graphData);

    // Step 2: Stop Neo4j (ensure DB is offline before import)
    console.log('⛔ Stopping Neo4j...');
    await execAsync('sudo neo4j stop');

    // Step 3: Build and run neo4j-admin import command
    const cmd = `sudo neo4j-admin database import full neo4j --overwrite-destination=true --nodes="${nodesFile}" --relationships="${relsFile}" --verbose`;
    //const cmd = `neo4j-admin database import full neo4j --overwrite-destination=true --nodes="${nodesFile}" --verbose`;

    console.log('🚀 Running neo4j-admin import...');
    const { stdout, stderr } = await execAsync(cmd);

    if (stderr) {
      console.warn('⚠️ neo4j-admin import warnings:', stderr);
    }
    console.log('✅ neo4j-admin import output:', stdout);

    // Step 4: Start Neo4j again
    console.log('▶️ Starting Neo4j...');
    await execAsync('sudo neo4j start');
    console.log('✅ Neo4j restarted successfully.');

  } catch (error) {
    console.error('❌ Import failed:', error.message || error);
  }
}




async function readFile(){

  const filename = "synbreed_pedigree.txt";
  const filePath = path.join(__dirname, 'temp', filename);
  console.log("Reading file:", filePath);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    const graphData = parseGraphData(content);
    return graphData;
  } catch (err) {
    console.error("Error reading the file:", err);
    return [];
  }
}


function parseGraphData(text) {
  const lines = text.split('\n').map(line => line.trim()).filter(Boolean);
  if (lines.length < 2) return { nodes: [], edges: [] };

  const headers = lines[0].split(/\t/);
  const idIndex = headers.indexOf("ID");
  const p1Index = headers.indexOf("Par1");
  const p2Index = headers.indexOf("Par2");
  const genIndex = headers.indexOf("gener");

  const nodes = new Map();
  const edges = [];

  function addNode(id, gener = null, par1 = null, par2 = null) {
    if (!nodes.has(id) && id && id !== '0' && id !== '#') {
      nodes.set(id, { id, gener, par1, par2 });
    }
  }

  // First pass: add nodes with generation and parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const id = parts[idIndex]?.trim();
    const gener = parts[genIndex]?.trim();
    const par1 = parts[p1Index]?.trim();
    const par2 = parts[p2Index]?.trim();

    if (!id || id === '0' || id === '#') return;

    addNode(id, gener, par1, par2);
  });

  // Second pass: add edges based on parents
  lines.slice(1).forEach(line => {
    const parts = line.split(/\t/);
    const id = parts[idIndex]?.trim();
    const par1 = parts[p1Index]?.trim();
    const par2 = parts[p2Index]?.trim();

    if (!id || id === '0' || id === '#') return;

    [par1, par2].forEach(parent => {
      if (parent && parent !== '0' && parent !== '#' && parent !== id) {
        if (!nodes.has(parent)) {
          addNode(parent, null, null, null);
        }
        edges.push({ source: parent, target: id });
      }
    });
  });

  return {
    nodes: Array.from(nodes.values()),
    edges: edges
  };
}

function getYear(graphData) {

  const idPattern = /^\d{6,7}([a-zA-Z]\d?)?$/;

  graphData.nodes.forEach(node => {
    if (node.id && idPattern.test(node.id)) {
      const match = node.id.match(/\d{2}/);

      if (match) {
        const yearNum = Number(match[0]);
        let year;

        if (yearNum >= 0 && yearNum <= 22) {
          year = 2000 + yearNum;
        } else {
          year = 1900 + yearNum;
        }

        node.year = (year > 1992) ? year : null;
      } else {
        node.year = null;
      }
    } else {
      node.year = null;
    }
  });
}

function printNodesWith6Digits(graphData) {
  const sixDigitPattern = /^\d{6}([a-zA-Z]\d?)?$/;

  graphData.nodes.forEach(node => {
    if (node.id && sixDigitPattern.test(node.id)) {
      //console.log('Matching node:', node);
    }
  });
}

async function updatePostgres(data) {
  console.log("Starting Insertion Function to Update Year/Gener...");

    const client = new Client({
        user: "postgres",
        password: "liptontea",
        host: "localhost",
        database: "teapp_app_db",
        port: "5432",
    });

  console.log("----- Attempting to connect to PostgreSQL DB -----");

  try {
    await client.connect();
    console.log("----- Connection successful -----");



    for (const entry of data) {
      // Assuming entry has fields: id, year, gener
      const query = `
        UPDATE cleanData
        SET year = $1, generation = $2
        WHERE correct_id = $3
      `;
      const values = [entry.year, entry.gener, entry.id];
      await client.query(query, values);
    }

    console.log("Data updated successfully in cleanData table!");
  } catch (err) {
    console.error("Error updating data", err);
  } finally {
    await client.end();
  }
}



export const insertADMINNeo4jDB= async (req, res) => {
  console.log("----Attempting to Run insertion script---")

  const data = await readFile();
  getYear(data);
  printNodesWith6Digits(data);
  //console.log(data);

  // Updating Postrgres 

  await updatePostgres(data.nodes);
  // Instead of inserting with Cypher, create CSVs & import with neo4j-admin:
  await importWithNeo4jAdmin(data);

  res.json("CSV generation and neo4j-admin import started");
}
