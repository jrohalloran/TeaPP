

import fs from 'fs/promises';
import neo4j from 'neo4j-driver'

import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
//import fs from 'fs';



const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const backend_dir = path.dirname(__dirname);

// Connecting to cloud database 
const driver = neo4j.driver(
  'neo4j+s://a71c11d2.databases.neo4j.io',
  neo4j.auth.basic('neo4j', 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ')
);


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
  graphData.nodes.forEach(node => {
    const genNum = Number(node.gener);
    const par1Valid = node.par1 && node.par1 !== '0' && node.par1 !== 0;
    const par2Valid = node.par2 && node.par2 !== '0' && node.par2 !== 0;

    if (!isNaN(genNum) && genNum > 0 && par1Valid && par2Valid) {
      const match = node.id.match(/\d{2}/);
      if (match) {
        let yearNum = Number(match[0]);
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


async function insertData(data){

    console.log("Starting Data Upload to Neo4js");


    //console.log(data)
    console.log("Attempting to connect to Neo4j");
    try {
    
    const session = driver.session();
    console.log("----- Successfully Connected ----");


    for (const node of data.nodes) {
        if (node.year == null) {
            console.warn(`Warning: node with id ${node.id} has a null year.`);
            }
      await session.run(
        `MERGE (p:Plant {id: $id})
         SET p.gener = $gener, p.par1 = $par1, p.par2 = $par2, p.year = $year`,
        {
          id: node.id,
          gener: node.gener,
          par1: node.par1,
          par2: node.par2,
          year: node.year != null ? neo4j.int(node.year) : null
        }
      );
    }

    // Insert edges
    for (const edge of data.edges) {
      await session.run(
        `MATCH (a:Plant {id: $source}), (b:Plant {id: $target})
         MERGE (a)-[:PARENT_OF]->(b)`,
        {
          source: edge.source,
          target: edge.target
        }
      );
    }

    console.log('Data import complete!');
  } catch (error) {
    console.error('Error importing data:', error);
  } finally {
    await session.close();
    await driver.close();
  }
    
}


export const insertNeo4jDB= async (req, res) => {

  console.log("Attempting to Run insertion script")

  const data = await readFile();
  getYear(data);
  console.log(data)
  //await insertData(data)

  res.json("Path to function works");

}









