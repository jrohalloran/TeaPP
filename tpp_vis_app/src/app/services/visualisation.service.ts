import { Injectable } from '@angular/core';
import Sigma from 'sigma';
import Graph from 'graphology';
import EdgeCurveProgram from '@sigma/edge-curve';



@Injectable({
  providedIn: 'root',
})
export class VisualisationService {
  constructor() {}

  /*
  loadGraph(graph: Graph, data: any, container: HTMLElement): Sigma {

    container.innerHTML = '';
    if (graph.order > 0) {
      graph.clear();
    }

    // Nodes
    data.nodes.forEach((node: any) => {
      graph.addNode(node.id, {
        name: node.label,
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        year: node.year,
        siblings: node.siblings,
        parents: node.parents,
        originalColor: node.color,
      });
    });

    // Add edges
    data.edges.forEach((edge: any) => {
      graph.addEdge(edge.source, edge.target, {
        id: edge.id,
        size: edge.size,
        color: edge.color,
        originalColor: edge.color,
      });
    });

    // 4. Create and return Sigma renderer
    return new Sigma(graph, container);
  }*/

/*
  loadNewGraph(data: any, container: HTMLElement): { renderer: Sigma, graph: Graph } {
    container.innerHTML = ''; // Clean container

    const graph = new Graph({ multi: true });

    data.nodes.forEach((node: any) => {
      graph.addNode(node.id, {
        name: node.label,
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        year: node.year,
        siblings: node.siblings,
        parents: node.parents,
        originalColor: node.color
      });
    });

    data.edges.forEach((edge: any) => {
      graph.addEdge(edge.source, edge.target, {
        id: edge.id,
        size: edge.size,
        color: edge.color,
        originalColor: edge.color,
        type: 'curve',
      });
    });

    //graph.setEdgeAttribute(edgeId, "type", "curve");


    //const renderer = new Sigma(graph, container);
    const renderer = new Sigma(graph, container, {
    edgeProgramClasses: {
      curve: EdgeCurveProgram,
      },
    });

    return { renderer, graph };
}*/

/*
loadNewGraph(data: any, container: HTMLElement): { renderer: Sigma, graph: Graph } {
  container.innerHTML = ''; // Clean container

  const graph = new Graph({ multi: true });
  const nodeById = new Map<string, any>();

  // Add all original nodes
  data.nodes.forEach((node: any) => {
    nodeById.set(node.id, node);

    graph.addNode(node.id, {
      name: node.label,
      label: node.label,
      x: node.x,
      y: node.y,
      size: node.size,
      color: node.color,
      year: node.year,
      siblings: node.siblings,
      parents: node.parents,
      originalColor: node.color
    });
  });

  // Keep track of elbow node IDs to avoid conflicts
  let elbowCount = 0;

  // For each edge, insert an elbow node and split the edge
  data.edges.forEach((edge: any) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) return;

    // Define elbow coordinates (bend first in X, then in Y)
    const elbowX = target.x;
    const elbowY = source.y;

    const elbowId = `elbow-${elbowCount++}`;

    graph.addNode(elbowId, {
      x: elbowX,
      y: elbowY,
      size: 0.01, // nearly invisible
      label: '',
      color: '#00000000' // fully transparent
    });

    // Add source → elbow
    graph.addEdge(edge.source, elbowId, {
      id: `${edge.id}-1`,
      size: edge.size || 1,
      color: edge.color || '#999',
      originalColor: edge.color
    });

    // Add elbow → target
    graph.addEdge(elbowId, edge.target, {
      id: `${edge.id}-2`,
      size: edge.size || 1,
      color: edge.color || '#999',
      originalColor: edge.color
    });
  });

  // Create renderer as usual
  const renderer = new Sigma(graph, container);

  return { renderer, graph };
}



/*
loadNewGraph(data: any, container: HTMLElement): { renderer: Sigma, graph: Graph } {
  container.innerHTML = ''; // Clean container

  const graph = new Graph({ multi: true });
  const nodeById = new Map<string, any>();

  // Add original nodes
  data.nodes.forEach((node: any) => {
    nodeById.set(node.id, node);

    graph.addNode(node.id, {
      name: node.label,
      label: node.label,
      x: node.x,
      y: node.y,
      size: node.size,
      color: node.color,
      year: node.year,
      siblings: node.siblings,
      parents: node.parents,
      originalColor: node.color
    });
  });

  // Insert elbow nodes and split edges
  let elbowCount = 0;

  data.edges.forEach((edge: any) => {
    const source = nodeById.get(edge.source);
    const target = nodeById.get(edge.target);
    if (!source || !target) return;

    // Bend down, then across
    const elbowX = source.x;
    const elbowY = target.y;

    const elbowId = `elbow-${elbowCount++}`;

    graph.addNode(elbowId, {
      x: elbowX,
      y: elbowY,
      size: 0.01, // invisible
      label: '',
      color: '#00000000'
    });

    // First segment: source → elbow (vertical down)
    graph.addEdge(edge.source, elbowId, {
      id: `${edge.id}-1`,
      size: edge.size || 1,
      color: edge.color || '#999',
      originalColor: edge.color
    });

    // Second segment: elbow → target (horizontal)
    graph.addEdge(elbowId, edge.target, {
      id: `${edge.id}-2`,
      size: edge.size || 1,
      color: edge.color || '#999',
      originalColor: edge.color
    });
  });

  const renderer = new Sigma(graph, container);
  return { renderer, graph };
}
*/


// Nuclear family with straight edges 
loadNewGraph(data: any, container: HTMLElement): { renderer: Sigma, graph: Graph } {
    container.innerHTML = ''; // Clean container

    const graph = new Graph({ multi: true });

    data.nodes.forEach((node: any) => {
      graph.addNode(node.id, {
        name: node.label,
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        year: node.year,
        siblings: node.siblings,
        parents: node.parents,
        originalColor: node.color
      });
    });

    data.edges.forEach((edge: any) => {
      graph.addEdge(edge.source, edge.target, {
        id: edge.id,
        size: edge.size,
        color: edge.color,
        originalColor: edge.color,
        //type: 'curve',
      });
    });

    //graph.setEdgeAttribute(edgeId, "type", "curve");


    const renderer = new Sigma(graph, container,
      { allowInvalidContainer: true }
    );

    
    return { renderer, graph };
  }


// General Visulisation function
loadGraph(data: any, container: HTMLElement): { renderer: Sigma, graph: Graph } {
    container.innerHTML = ''; // Clean container

    const graph = new Graph({ multi: true });

    data.nodes.forEach((node: any) => {
      graph.addNode(node.id, {
        name: node.label,
        label: node.label,
        x: node.x,
        y: node.y,
        size: node.size,
        color: node.color,
        year: node.year,
        siblings: node.siblings,
        parents: node.parents,
        originalColor: node.color
      });
    });

    data.edges.forEach((edge: any) => {
      graph.addEdge(edge.source, edge.target, {
        id: edge.id,
        size: edge.size,
        color: edge.color,
        originalColor: edge.color,
        //type: 'curve',
      });
    });

    //graph.setEdgeAttribute(edgeId, "type", "curve");


    const renderer = new Sigma(graph, container,
      { allowInvalidContainer: true }
    );

    
    
    return { renderer, graph };
  }


  private customLabelRenderer = (context: { font: string; fillStyle: any; textAlign: string; fillText: (arg0: any, arg1: any, arg2: any) => void; }, node: { label: any; x: any; y: any; }, settings: { graph: { getNodeAttribute: (arg0: any, arg1: string) => any; }; labelSize: (arg0: any) => any; labelColor: (arg0: any) => any; }) => {
  const labelVisible = settings.graph.getNodeAttribute(node, 'labelVisible');

  if (labelVisible && node.label) {
    const size = settings.labelSize(node); // font size
    context.font = `${size}px Sans-Serif`;
    context.fillStyle = settings.labelColor(node);
    context.textAlign = 'center';
    // Use node.x and node.y directly for coordinates
    context.fillText(node.label, node.x, node.y + size);
  }
};

}



