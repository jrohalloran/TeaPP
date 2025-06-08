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
    //console.log(node.year)
    
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

  console.log("Getting Edges for Nodes")
  // Use empty arrays as defaults if data.nodes or data.family are missing or not arrays
  const allNodes = [
    ...(Array.isArray(data.nodes) ? data.nodes : []),
    ...(Array.isArray(data.family) ? data.family : [])
  ];

  //console.log("All Nodes: "+allNodes);
  
  allNodes.forEach(node => {
    //console.log(node.year);
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

  //console.log("Resulting Edges:" +sigmaEdges);
  return {
    nodes: sigmaNodes,
    edges: sigmaEdges
  };
}

export async function getSigmaEdges(data) {

  console.log("Getting Edges for Nodes")
  const allNodes = data;

  console.log("Number of Nodes:", allNodes.length);
  // Use empty arrays as defaults if data.nodes or data.family are missing or not arrays

  //console.log("All Nodes: "+allNodes);
  //console.log("Number of Nodes: "+allNodes.length);

  /*
  allNodes.forEach(node => {
    //console.log(node.year);
  });*/

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

  console.log("Resulting Edges:" +sigmaEdges);
  return {
    nodes: sigmaNodes,
    edges: sigmaEdges
  };
}





function buildDescendantMap(graphData) {
  const childrenMap = new Map();
  graphData.edges.forEach(edge => {
    if (!childrenMap.has(edge.source)) childrenMap.set(edge.source, []);
    childrenMap.get(edge.source).push(edge.target);
  });
  return childrenMap;
}

// Function for checking if the node has a child of a higher generation (has been used to breed)
function hasHigherGenDescendant(nodeId, genMap, childrenMap, visited = new Set(), baseGen) {
  if (visited.has(nodeId)) return false;
  visited.add(nodeId);

  const children = childrenMap.get(nodeId) || [];
  for (const childId of children) {
    const childGen = genMap.get(childId);
    if (childGen > baseGen) return true;
    if (hasHigherGenDescendant(childId, genMap, childrenMap, visited, baseGen)) return true;
  }
  return false;
}


export function filterNodesWithoutHigherGenDescendants(graphData) {
  console.log("Filtering Based on Descendants...")

  const genMap = new Map(graphData.nodes.map(n => [n.id, Number(n.gener) || 0]));
  const childrenMap = buildDescendantMap(graphData);

  const maxGeneration = Math.max(...graphData.nodes.map(n => Number(n.gener) || 0));
  const keepSet = new Set();

  for (const node of graphData.nodes) {
    const baseGen = genMap.get(node.id);

    if (baseGen === maxGeneration) {
      keepSet.add(node.id);
      continue;
    }

    if (hasHigherGenDescendant(node.id, genMap, childrenMap, new Set(), baseGen)) {
      keepSet.add(node.id);
    }
  }

  const filteredNodes = graphData.nodes.filter(n => keepSet.has(n.id));
  const validIds = new Set(filteredNodes.map(n => n.id));
  const filteredEdges = graphData.edges.filter(e => validIds.has(e.source) && validIds.has(e.target));

  return { nodes: filteredNodes, edges: filteredEdges };
}


export function removeIsolatedNodes(graphData) {
  console.log("Starting to remove isolated ndoes...")
  const linkedNodeIds = new Set();
  graphData.edges.forEach(edge => {
    linkedNodeIds.add(edge.source);
    linkedNodeIds.add(edge.target);
  });

  const filteredNodes = graphData.nodes.filter(node => linkedNodeIds.has(node.id));
  return {
    nodes: filteredNodes,
    edges: graphData.edges
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
  const layerHeight = 8_000_000_000;
  const nodeSpacing = 10_000_000_000;

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




//  ------- Inital Group mapping functions ----------


export function allNodeslayerByYearReverse(graphData) {
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
  const layerHeight = 200_000_000;
  const nodeSpacing = 200_000_000;

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
      parents: node.parents,
      siblings: node.sibling,
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


export function groupSiblings(graphData) {
  const groupedNodes = [];
  const nodeById = new Map(graphData.nodes.map(n => [n.id, n]));
  const edgeMap = new Map(); // target -> [sources]

  // Build edge map: target -> parents
  for (const edge of graphData.edges) {
    if (!edgeMap.has(edge.target)) edgeMap.set(edge.target, []);
    edgeMap.get(edge.target).push(edge.source);
  }

  const groupMap = new Map();

  for (const node of graphData.nodes) {
    const parents = (edgeMap.get(node.id) || []).sort();
    const parentKey = parents.join(',');

    if (Number(node.gener) === 0 || node.year == null || parents.length === 0) {
      groupedNodes.push({ ...node }); // Not groupable
      continue;
    }

    const groupKey = `${node.gener}-${node.year}-${parentKey}`;
    if (!groupMap.has(groupKey)) groupMap.set(groupKey, []);
    groupMap.get(groupKey).push({ ...node, parents });
  }

  for (const [key, group] of groupMap.entries()) {
    if (group.length === 1) {
      groupedNodes.push(group[0]);
      continue;
    }

    const parents = group[0].parents;
    const siblingIds = group.map(n => n.id);

    const groupId = `grp_${parents.join('_')}_${group[0].gener}_${group[0].year}`;

    const newGroupNode = {
      id: groupId,
      label: `Group (${siblingIds.length})`,
      gener: group[0].gener,
      year: group[0].year,
      sibling: siblingIds,
      parents: parents,
      size: 15,
      color: '#FFD700'
    };

    groupedNodes.push(newGroupNode);
  }

  const newEdges = [];
  const targetMap = new Map(graphData.nodes.map(n => [n.id, n.id]));

  for (const node of groupedNodes) {
    if (node.sibling) {
      for (const sid of node.sibling) {
        targetMap.set(sid, node.id);
      }
    }
  }

  for (const edge of graphData.edges) {
    const newSource = targetMap.get(edge.source) || edge.source;
    const newTarget = targetMap.get(edge.target) || edge.target;

    if (newSource !== newTarget) {
      const newEdgeId = `e_${newSource}_${newTarget}`;
      newEdges.push({
        id: newEdgeId,
        source: newSource,
        target: newTarget,
        size: edge.size,
        color: edge.color,
      });
    }
  }

  return {
    nodes: groupedNodes,
    edges: newEdges
  };
}
