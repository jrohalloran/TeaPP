import { Injectable } from '@angular/core';
import Sigma from 'sigma';
import Graph from 'graphology';

@Injectable({
  providedIn: 'root',
})
export class VisualisationService {
  constructor() {}

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
  }
}
