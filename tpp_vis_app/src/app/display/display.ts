import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import Graph from 'graphology';
import Sigma from 'sigma';
import { firstValueFrom } from 'rxjs';


// Setting Up Data Formats
interface GraphNode {
  id: string;          
  label: string;       
  x: number;
  y: number;
  size: number;
  color: string;
  year: number | null;
  siblings: []| null,
  parents: [] | null,
  gener: number;
}

interface GraphEdge {
  id: string;  
  source: string;
  target: string;
  size: number;
  color: string;
}

interface GraphJSON {
  nodes: GraphNode[];
  edges: GraphEdge[];
}


@Component({
  selector: 'app-display',
  templateUrl: './display.html',
  styleUrls: ['./display.css']
})



export class DisplayComponent implements AfterViewInit {
  @ViewChild('sigmaContainer', { static: false }) container!: ElementRef;

  stats = {
    nodes: 0,
    edges: 0,
  };

  jsonData: GraphJSON = {
    nodes: [],
    edges: []
  };


  graph = new Graph({ multi: true });
  renderer!: Sigma;

  constructor(private backendApiService: backendApiService) {}

  async ngAfterViewInit(): Promise<void> {
    console.log('Initialize Sigma in #sigma-container');
    await this.getTrial();
    await this.getJSON();

    if (!this.container) {
      console.error('Container is undefined in ngAfterViewInit');
    } else {
      this.loadGraph();
    }
  }
  

  async getTrial(): Promise<void> {
    console.log('Getting Trial Data');
    try {
      const response = await this.backendApiService.getTrial().toPromise();
      console.log('Response from backend:', response);
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getJSON(): Promise<void> {
    console.log('Getting JSON Data');
    try {
      const response = await firstValueFrom(this.backendApiService.getJSON());
      console.log('Response from backend:', response);
      this.jsonData = response;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  loadGraph(): void {
  const data = this.jsonData;
  const graph = this.graph;

  // 1. Properly dispose of old Sigma renderer
  if (this.renderer) {
    this.renderer.kill();
    this.container.nativeElement.innerHTML = '';
    //this.renderer = []; // optional but recommended to avoid reuse
  }

  // 2. Clear container DOM (to remove old canvases)
  if (this.container?.nativeElement) {
    this.container.nativeElement.innerHTML = '';
  }

  // 3. Clear old graph data
  if (graph.order > 0) {
    graph.clear();
  }

  // 4. Add nodes and edges
  data.nodes.forEach(node => {
    graph.addNode(node.id, {
      name: node.label,
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

  data.edges.forEach(edge => {
    graph.addEdge(edge.source, edge.target, {
      id: edge.id,
      size: edge.size,
      color: edge.color,
      originalColor: edge.color
    });
  });

  // 5. Create new Sigma renderer (with fresh graph and clean container)
  this.renderer = new Sigma(graph, this.container.nativeElement);

  // 6. Setup interactions
  this.setupHighlighting();
  this.getSelectedNode();
}


  loadNewGraph(): void {
  const data = this.jsonData;
  const graph = this.graph;

  // Dispose of the old Sigma renderer if it exists
  if (this.renderer) {
    this.renderer.kill();
    this.container.nativeElement.innerHTML = '';
    //this.renderer = []; // optional but recommended to avoid reuse
  }

  // 2. Clear container DOM (to remove old canvases)
  if (this.container?.nativeElement) {
    this.container.nativeElement.innerHTML = '';
  }

  // 3. Clear old graph data
  if (graph.order > 0) {
    graph.clear();
  }

  // Add nodes
  data.nodes.forEach(node => {
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

  // Add edges
  data.edges.forEach(edge => {
    graph.addEdge(edge.source, edge.target, {
      id: edge.id,
      size: edge.size,
      color: edge.color,
      originalColor: edge.color
    });
  });

  // Create new Sigma renderer
  this.renderer = new Sigma(graph, this.container.nativeElement);

  // Setup interactivity again
  //this.setupHighlighting();
  //this.getSelectedNode();
}


  private getAncestors(nodeId: string, ancestors: Set<string> = new Set()): Set<string> {
    this.graph.inNeighbors(nodeId).forEach(parentId => {
      if (!ancestors.has(parentId)) {
        ancestors.add(parentId);
        this.getAncestors(parentId, ancestors);
      }
    });
    return ancestors;
  }

  private setupHighlighting(): void {

    this.renderer.on('clickNode', ({ node }) => {
      // Reset nodes and edges to original color/size
      this.graph.forEachNode(n => {
        this.graph.setNodeAttribute(n, 'color', this.graph.getNodeAttribute(n, 'originalColor'));
        const originalSize = this.jsonData.nodes.find(nd => nd.id === n)?.size || 8;
        this.graph.setNodeAttribute(n, 'size', originalSize);
      });

      this.graph.forEachEdge(e => {
        this.graph.setEdgeAttribute(e, 'color', this.graph.getEdgeAttribute(e, 'originalColor'));
        const originalSize = this.jsonData.edges.find(ed => ed.id === e)?.size || 1;
        this.graph.setEdgeAttribute(e, 'size', originalSize);
      });

      // Get ancestors including clicked node
      const ancestors = this.getAncestors(node);
      //console.log(node);
      ancestors.add(node);

      // Highlight ancestor nodes
      ancestors.forEach(ancestorId => {
        this.graph.setNodeAttribute(ancestorId, 'color', '#90EE90'); // light green
        this.graph.setNodeAttribute(ancestorId, 'size', 20);
      });

      // Highlight clicked node differently
      this.graph.setNodeAttribute(node, 'color', '#0074D9'); // blue
      this.graph.setNodeAttribute(node, 'size', 25);

      // Highlight edges connecting ancestors
      this.graph.forEachEdge((edgeId, attr, source, target) => {
        if (ancestors.has(source) && ancestors.has(target)) {
          this.graph.setEdgeAttribute(edgeId, 'color', '#87CEEB'); // sky blue
          this.graph.setEdgeAttribute(edgeId, 'size', 4);
        }
      });

      this.renderer.refresh();
    });

    // Reset highlights when clicking background
    this.renderer.on('clickStage', () => {
      this.graph.forEachNode(n => {
        this.graph.setNodeAttribute(n, 'color', this.graph.getNodeAttribute(n, 'originalColor'));
        const originalSize = this.jsonData.nodes.find(nd => nd.id === n)?.size || 8;
        this.graph.setNodeAttribute(n, 'size', originalSize);
      });

      this.graph.forEachEdge(e => {
        this.graph.setEdgeAttribute(e, 'color', this.graph.getEdgeAttribute(e, 'originalColor'));
        const originalSize = this.jsonData.edges.find(ed => ed.id === e)?.size || 1;
        this.graph.setEdgeAttribute(e, 'size', originalSize);
      });

      this.renderer.refresh();
    });
  }

  async getSelectedNode():Promise<void>{
      this.renderer.on('clickNode', async ({ node }) => {
      // Reset nodes and edges to original color/size
      let data = this.graph.getNodeAttributes(node);
      console.log(data)
      console.log("Siblings: "+data['siblings']);
      console.log("Parents: "+data['parents']);
      let nodeID;


      // If node if singular node (no siblings) - assign its ID for query as its node label
      if (data['siblings']== undefined){
        nodeID = node;
        console.log(nodeID);
      }
      else{
        // Else Assign the ID for querying as the list of siblings for looping through 
        nodeID = data['siblings'];
        console.log(nodeID);
      }
      try {
        //console.log("Retrieving Nuclear Family");
        const response = await firstValueFrom(this.backendApiService.getPedigree(nodeID));
        console.log('Response from backend:', response);
        this.jsonData = response;
        this.loadNewGraph();
    } catch (error) {
      console.error('Error:', error);
    }
  });
  };

  zoomIn() {
    console.log('Zoom in clicked');
  }

  zoomOut() {
    console.log('Zoom out clicked');
  }
}
