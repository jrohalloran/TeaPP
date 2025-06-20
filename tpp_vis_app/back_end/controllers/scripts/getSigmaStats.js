




function getAncestors(graph, nodeId, ancestors = new Set()) {
  const parents = graph.inNeighbors(nodeId);
  for (const parentId of parents) {
    if (!ancestors.has(parentId)) {
      ancestors.add(parentId);
      getAncestors(graph, parentId, ancestors);
    }
  }
  return ancestors;
}


export function highlightAncestors(graph, nodeId, originalData) {
  const modifiedNodes = new Map();
  const modifiedEdges = new Map();

  // Reset all nodes
  graph.forEachNode(n => {
    const orig = originalData.nodes.find(nd => nd.id === n);
    if (orig) {
      modifiedNodes.set(n, {
        color: orig.color,
        size: orig.size
      });
    }
  });

  // Reset all edges
  graph.forEachEdge(e => {
    const orig = originalData.edges.find(ed => ed.id === e);
    if (orig) {
      modifiedEdges.set(e, {
        color: orig.color,
        size: orig.size
      });
    }
  });

  // Get ancestors and include clicked node
  const ancestors = getAncestors(graph, nodeId);
  ancestors.add(nodeId);

  // Highlight ancestor nodes
  for (const ancestorId of ancestors) {
    modifiedNodes.set(ancestorId, {
      color: '#90EE90', // light green
      size: 20
    });
  }

  // Highlight clicked node
  modifiedNodes.set(nodeId, {
    color: '#0074D9', // blue
    size: 25
  });

  // Highlight connecting edges
  graph.forEachEdge((edgeId, attr, source, target) => {
    if (ancestors.has(source) && ancestors.has(target)) {
      modifiedEdges.set(edgeId, {
        color: '#87CEEB', // sky blue
        size: 4
      });
    }
  });

  return {
    nodes: Object.fromEntries(modifiedNodes),
    edges: Object.fromEntries(modifiedEdges)
  };
}
