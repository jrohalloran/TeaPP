/*** 
 * // Date: 06/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
// Takes Family nodes from Neo4j database
// Queries to get edges 
// Formats the data in appropriate sigma.js format

// Formatting is currently random 
***/



import neo4j from 'neo4j-driver';


// Setting up Driver to access Neo4js
const URI = 'neo4j+s://a71c11d2.databases.neo4j.io';
const USER = 'neo4j';
const PASSWORD = 'KPoauq4gefxZaMGDId8t3lRtudtCCMJdM1gVDe84JiQ';

const driver = neo4j.driver(URI, neo4j.auth.basic(USER, PASSWORD));



// Formatting Function 
export async function formatForSigma(data) {
  const allNodes = [...data.nodes, ...data.family];
  allNodes.forEach(node => {
    console.log(node.year)
    
  });
  // Create Sigma.js node objects
  const sigmaNodes = allNodes.map(node => ({
    id: node.id,
    label: node.name || node.id,
    x: Math.random(), // or 0, or use a layout engine later
    y: Math.random(),
    year: node.year,
    gener: node.gener,
    size: 1,
    color: '#6699cc'
  }));

  // Fetch edges between these nodes
  const session = driver.session();
  const allIds = allNodes.map(n => n.id);

  const edgesQuery = `
    MATCH (n)-[r:PARENT_OF|CHILD_OF]-(m)
    WHERE n.id IN $ids AND m.id IN $ids
    RETURN n.id AS source, m.id AS target, type(r) AS type
  `;

  let sigmaEdges = [];
  try {
    const edgesResult = await session.run(edgesQuery, { ids: allIds });

    sigmaEdges = edgesResult.records.map((record, index) => ({
      id: `e${index}`,
      source: record.get('source'),
      target: record.get('target'),
      color: '#ccc',
      size: 1,
      label: record.get('type')
    }));
  } finally {
    await session.close();
  }

  return {
    nodes: sigmaNodes,
    edges: sigmaEdges
  };
}

export async function formatForSigma2(data) {
  // Use empty arrays as defaults if data.nodes or data.family are missing or not arrays
  const allNodes = [
    ...(Array.isArray(data.nodes) ? data.nodes : []),
    ...(Array.isArray(data.family) ? data.family : [])
  ];
  
  allNodes.forEach(node => {
    console.log(node.year);
  });

  // Create Sigma.js node objects
  const sigmaNodes = allNodes.map(node => ({
    id: node.id,
    label: node.name || node.id,
    x: Math.random(), // or 0, or use a layout engine later
    y: Math.random(),
    year: node.year,
    gener: node.gener,
    size: 1,
    color: '#6699cc'
  }));

  // Fetch edges between these nodes
  const session = driver.session();
  const allIds = allNodes.map(n => n.id);

  const edgesQuery = `
    MATCH (n)-[r:PARENT_OF|CHILD_OF]-(m)
    WHERE n.id IN $ids AND m.id IN $ids
    RETURN n.id AS source, m.id AS target, type(r) AS type
  `;

  let sigmaEdges = [];
  try {
    const edgesResult = await session.run(edgesQuery, { ids: allIds });

    sigmaEdges = edgesResult.records.map((record, index) => ({
      id: `e${index}`,
      source: record.get('source'),
      target: record.get('target'),
      color: '#ccc',
      size: 1,
      label: record.get('type')
    }));
  } finally {
    await session.close();
  }

  return {
    nodes: sigmaNodes,
    edges: sigmaEdges
  };
}


export function layerByYearReverse(graphData) {
  const layers = {};
  const nullGen0 = [];
  const nullGenPos = [];

  graphData.nodes.forEach(node => {
    if (node.year === null || node.year === undefined) {
      if (Number(node.gener) === 0) nullGen0.push(node);
      else nullGenPos.push(node);
    } else {
      const key = String(node.year);
      if (!layers[key]) layers[key] = [];
      layers[key].push(node);
    }
  });

  const sortedYears = Object.keys(layers).sort((a, b) => Number(b) - Number(a));
  const layerHeight = 10_000_000_000;
  const nodeSpacing = 300_000_000;

  const nodeById = new Map(graphData.nodes.map(n => [n.id, n]));

  sortedYears.forEach((year, layerIndex) => {
    const nodes = layers[year];
    const count = nodes.length;
    nodes.forEach((node, i) => {
      node.x = (i - (count - 1) / 2) * nodeSpacing;
      node.y = layerIndex * layerHeight;
    });
  });

  const lastLayerY = sortedYears.length * layerHeight;
  nullGenPos.forEach((node, i) => {
    node.x = (i - (nullGenPos.length - 1) / 2) * nodeSpacing;
    node.y = lastLayerY;
  });

  const nullGen0Y = lastLayerY + layerHeight;
  nullGen0.forEach((node, i) => {
    node.x = (i - (nullGen0.length - 1) / 2) * nodeSpacing;
    node.y = nullGen0Y;
  });

  return graphData;
}

export function convertToSigmaFormat(graphData) {
  const nodeById = new Map(graphData.nodes.map(n => [n.id, n]));
  const childrenCount = {};

  graphData.edges.forEach(edge => {
    const sourceNode = nodeById.get(edge.source);
    const targetNode = nodeById.get(edge.target);
    if (!sourceNode || !targetNode) return;

    if (Number(targetNode.gener) > Number(sourceNode.gener)) {
      if (!childrenCount[edge.source]) childrenCount[edge.source] = 0;
      childrenCount[edge.source]++;
    }
  });

  const generations = graphData.nodes
    .map(n => Number(n.gener) || 0)
    .filter(g => g != null);
  const uniqueGenerations = [...new Set(generations)].sort((a, b) => a - b);

  function interpolateColor(gener) {
    if (gener == null) return '#00FF00';
    const colors = ['#e6194B', '#f58231', '#ffe119', '#3cb44b', '#4363d8', '#911eb4'];
    const index = uniqueGenerations.indexOf(Number(gener));
    return colors[index % colors.length] || '#00FF00';
  }

  const sigmaNodes = graphData.nodes.map(node => {
    const childCount = childrenCount[node.id] || 0;
    const size = Math.min(40, 6 + Math.log2(childCount + 1) * 2.5);
    return {
      id: node.id,
      label: node.label || node.id,
      x: Number(node.x),
      y: Number(node.y),
      size,
      color: interpolateColor(node.gener),
      year: node.year,
      //parents: node.parents,
      //siblings: node.sibling,
      gener: Number(node.gener || 0)
    };
  });

  const sigmaEdges = graphData.edges.map((edge, i) => ({
    id: `e${i}`,
    source: edge.source,
    target: edge.target,
    size: edge.size || 1,
    color: edge.color || '#999'
  }));

  return { nodes: sigmaNodes, edges: sigmaEdges };
}
