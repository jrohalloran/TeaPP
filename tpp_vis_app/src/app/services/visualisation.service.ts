/*** 
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
//----------------------------------------
// FILE SERVICE --- ASSIGNS NODES TO SIGMA MODEL

***/



import { Injectable } from '@angular/core';
import Sigma from 'sigma';
import Graph from 'graphology';



@Injectable({
  providedIn: 'root',
})
export class VisualisationService {
  constructor() {}



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
      });
    });


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
    context.fillText(node.label, node.x, node.y + size);
  }
};

}



