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


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);



const uri = 'bolt://localhost:7687';
const user = 'neo4j';
const password = 'tAqsiv-tivfif-bomhe9'; // Replace with your actual password

// Create a driver instance
const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));


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
      console.log('Matching node:', node);
    }
  });
}

const BATCH_SIZE = 500;

async function insertDataInBatches(data) {
  console.log("Starting batched data upload to Neo4j");
  const session = driver.session();

  try {
    console.log("----- Successfully Connected ----");

    // Helper to split array into chunks
    function chunkArray(array, size) {
      const chunks = [];
      for (let i = 0; i < array.length; i += size) {
        chunks.push(array.slice(i, i + size));
      }
      return chunks;
    }

    // Prepare nodes and warn for null year
    const preparedNodes = data.nodes.map((node, idx) => {
      if (node.year == null) {
        console.warn(`Warning: node with id ${node.id} (index ${idx}) has a null year.`);
      }
      return {
        id: node.id,
        gener: node.gener,
        par1: node.par1,
        par2: node.par2,
        year: node.year != null ? neo4j.int(node.year) : null,
      };
    });

    const nodeBatches = chunkArray(preparedNodes, BATCH_SIZE);
    console.log(`Total nodes: ${preparedNodes.length}, split into ${nodeBatches.length} batches of up to ${BATCH_SIZE} nodes each.`);

    // Insert nodes batch by batch with logs
    for (let i = 0; i < nodeBatches.length; i++) {
      const batch = nodeBatches[i];
      await session.run(
        `
        UNWIND $nodes AS node
        MERGE (p:Plant {id: node.id})
        SET p.gener = node.gener, p.par1 = node.par1, p.par2 = node.par2, p.year = node.year
        `,
        { nodes: batch }
      );
      console.log(`Inserted node batch ${i + 1} / ${nodeBatches.length} (Batch size: ${batch.length})`);
    }

    // Prepare edges
    const preparedEdges = data.edges.map(edge => ({
      source: edge.source,
      target: edge.target,
    }));

    const edgeBatches = chunkArray(preparedEdges, BATCH_SIZE);
    console.log(`Total edges: ${preparedEdges.length}, split into ${edgeBatches.length} batches of up to ${BATCH_SIZE} edges each.`);

    // Insert edges batch by batch with logs
    for (let i = 0; i < edgeBatches.length; i++) {
      const batch = edgeBatches[i];
      await session.run(
        `
        UNWIND $edges AS edge
        MATCH (a:Plant {id: edge.source}), (b:Plant {id: edge.target})
        MERGE (a)-[:PARENT_OF]->(b)
        `,
        { edges: batch }
      );
      console.log(`Inserted edge batch ${i + 1} / ${edgeBatches.length} (Batch size: ${batch.length})`);
    }

    console.log('Batched data import complete!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
}



export const insertNeo4jDB= async (req, res) => {

  console.log("----Attempting to Run insertion script---")

  const data = await readFile();
  getYear(data);
  printNodesWith6Digits(data);
  console.log(data)
  //await insertDataInBatches(data)

  res.json("Path to function works");

}









