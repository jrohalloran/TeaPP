import { Component, AfterViewInit, ElementRef, ViewChild } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import Graph from 'graphology';
import Sigma from 'sigma';
import { firstValueFrom } from 'rxjs';
import { VisualisationService } from '../services/visualisation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';



// Setting Up Data Formats
interface GraphNode {
  id: string;          
  label: string;       
  x: number;
  y: number;
  size: number;
  color: string;
  year: number | null;
  siblings?: []| null,
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

interface legend{
  element: string;
  colour: string;
}

@Component({
  selector: 'app-visualisation',
  standalone: true,
  imports: [CommonModule, FormsModule, MatExpansionModule],  // Import CommonModule here to use *ngIf, etc.
  templateUrl: './display.html',
  styleUrls: ['./display.css']
})



export class DisplayComponent implements AfterViewInit {
  @ViewChild('sigmaContainerTop', { static: false }) containerTop!: ElementRef;
  @ViewChild('sigmaContainerBottom', { static: false }) containerBottom!: ElementRef;
  

  // Declaring and intialising Attributes 
  topLoadingMessage: string = '';
  bottomLoadingMessage: string = '';
  isTopLoading: boolean = true;
  isBottomLoading: boolean = false;
  showBottomOverlay: boolean = true;


  isfiltered = 'yes';
  selectedGroup = 'sibling';//Default Grouping
  selectedColour = 'generation'; //Default Colouring
  selectedLayer = 'year'; //Default Layering


  jsonData: GraphJSON = {
    nodes: [],
    edges: []
  };

  groupedFamilyData: GraphJSON = {
    nodes: [],
    edges: []
  };

  nuclearFamilyData: GraphJSON = {
      nodes: [],
      edges: []
    };

    

  stats = {
    nodes: 0,
    edges: 0,
  };

  cloneList : any[] = []; // Stores list of the clones in the Postgres DB for searching
  
  // Searching Function Variables 
  searchTerm = '';
  filteredData = [...this.cloneList];
  selectedItem: any = null;


  legend: { element: string | number; colour: string }[] = [];


  // Setting Up Graphs & Sigma for containers 
  graphTop = new Graph({ multi: true });
  graphBottom = new Graph({ multi: true });
  rendererTop!: Sigma;
  rendererBottom!: Sigma;


  // Constructing Services 
  constructor(private backendApiService: backendApiService,
    private visualisationService: VisualisationService
  ) {}



  async ngAfterViewInit(): Promise<void> {

    console.log('Initialize Sigma in #sigma-container');
    await this.getGroupedData();
    await this.getAllPlants();

    if (!this.containerTop) {
      console.error('Container is undefined in ngAfterViewInit');
    } else {
      this.loadGraph();
    }
  }
  

  async getGroupedData(): Promise<void> {
    try {
      const response = await firstValueFrom(this.backendApiService.getAllNodesEdges());
      console.log('Response from backend:', response);
      this.groupedFamilyData = response;
      this.legend = response.legend;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getAllPlants(): Promise<void> {
    console.log('Retrieving all plants in PostGres Database:');
    try {
      const response = await firstValueFrom(this.backendApiService.getAllPlants());
      console.log('Postgres Response from getAllPlants:', response);
      this.cloneList = response;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  async getSelectPlantPG(nodeID: any): Promise<void> {
    console.log('Retrieving Selected:');
    console.log(nodeID);
    try {
      const response = await firstValueFrom(this.backendApiService.getSelectedPlantPG(nodeID));
      console.log('Postgres Response from getSelectedPlant:', response);
      //this.jsonData = response;
    } catch (error) {
      console.error('Error:', error);
    }
  }

  loadGraph(): void {
    if (this.rendererTop) {
      this.rendererTop.kill();
    }
    
    const graph = this.visualisationService.loadGraph(
      this.groupedFamilyData,
      this.containerTop.nativeElement
    );
    this.graphTop = graph.graph;
    this.rendererTop = graph.renderer
    this.isTopLoading = false;


    this.setupHighlighting();
    this.getSelectedNode();

  }
  

  loadNewGraph(): void {
    this.showBottomOverlay = false;
    this.isBottomLoading = true;


    if (this.rendererBottom) {
      this.rendererBottom.kill();
    }

    const graph = this.visualisationService.loadNewGraph(
      this.nuclearFamilyData,
      this.containerBottom.nativeElement

    );
    this.graphBottom = graph.graph; // Adding Graph to the bottom container
    this.rendererBottom = graph.renderer 
    this.showBottomOverlay = false; // Removing Loading screen 
    this.isBottomLoading = false;

    this.getNodeData();



  }

  

  private getDescendants(nodeId: string): Set<any>{
    let name: string | any[] = [];
    name = [nodeId];
    console.log(nodeId);
    const descendants = new Set();
    this.groupedFamilyData.nodes.forEach(node => {
      if (node.id == nodeId){

        if (node.siblings){
          name = node.siblings;
        }
      }
      if (node.parents){
          for (let i=0;i<node.parents.length;i++){
            for (let j=0;j<name.length;j++){
              if (node.parents[i]==name[j]){
                console.log(node)
                descendants.add(node.id);
              }
        }
        }}})
        //console.log(descendants);
        return descendants;
  }


  private getAncestors(nodeId: string, ancestors: Set<string> = new Set()): Set<string> {
    this.graphTop.inNeighbors(nodeId).forEach(parentId => {
      if (!ancestors.has(parentId)) {
        ancestors.add(parentId);
        this.getAncestors(parentId, ancestors);
      }
    });
    //console.log(ancestors);
    return ancestors;
  }


  private getNodeData(): void{
    this.rendererBottom.on('clickNode', ({ node }) => {
      console.log(node);
      const nodeData = this.nuclearFamilyData.nodes.find(nd => nd.id === node);
      console.log("Gettig node value:")
      console.log(nodeData);
      this.getSelectPlantPG([node]);

    });


  }

  private setupHighlighting(): void {

    this.rendererTop.on('clickNode', ({ node }) => {
      // Reset nodes and edges to original color/size
      this.graphTop.forEachNode(n => {
        this.graphTop.setNodeAttribute(n, 'color', this.graphTop.getNodeAttribute(n, 'originalColor'));
        const originalSize = this.groupedFamilyData.nodes.find(nd => nd.id === n)?.size || 8;
        this.graphTop.setNodeAttribute(n, 'size', originalSize);
      });

      this.graphTop.forEachEdge(e => {
        this.graphTop.setEdgeAttribute(e, 'color', this.graphTop.getEdgeAttribute(e, 'originalColor'));
        const originalSize = this.groupedFamilyData.edges.find(ed => ed.id === e)?.size || 1;
        this.graphTop.setEdgeAttribute(e, 'size', originalSize);
      });

      // Get ancestors including clicked node
      const ancestors = this.getAncestors(node);
      const descendants = this.getDescendants(node);
      console.log(descendants);
      console.log(ancestors);
      //console.log(node);

      ancestors.add(node);
      descendants.forEach(node =>{ancestors.add(node)});


      // Highlight ancestor nodes
      ancestors.forEach(ancestorId => {
        this.graphTop.setNodeAttribute(ancestorId, 'color', '#fe6100');
        this.graphTop.setNodeAttribute(ancestorId, 'size', 20);
      });

      // Highlight clicked node differently
      this.graphTop.setNodeAttribute(node, 'color', '#fe6100');
      this.graphTop.setNodeAttribute(node, 'size', 25);

      // Highlight edges connecting ancestors
      this.graphTop.forEachEdge((edgeId, attr, source, target) => {
        if (ancestors.has(source) && ancestors.has(target)) {
          this.graphTop.setEdgeAttribute(edgeId, 'color', '#fe6100');
          this.graphTop.setEdgeAttribute(edgeId, 'size', 4);
        }
      });

      this.rendererTop.refresh();
    });

    // Reset highlights when clicking background
    this.rendererTop.on('clickStage', () => {
      this.graphTop.forEachNode(n => {
        this.graphTop.setNodeAttribute(n, 'color', this.graphTop.getNodeAttribute(n, 'originalColor'));
        const originalSize = this.groupedFamilyData.nodes.find(nd => nd.id === n)?.size || 8;
        this.graphTop.setNodeAttribute(n, 'size', originalSize);
      });

      this.graphTop.forEachEdge(e => {
        this.graphTop.setEdgeAttribute(e, 'color', this.graphTop.getEdgeAttribute(e, 'originalColor'));
        const originalSize = this.groupedFamilyData.edges.find(ed => ed.id === e)?.size || 1;
        this.graphTop.setEdgeAttribute(e, 'size', originalSize);
      });

      this.rendererTop.refresh();
    });
  }



 // Highlighting the selected node in the pedigree (bottom graph) -- organge 
  updateSelectedNodeColour(nodeID: string | any[]):void{
    console.log("Matching Selected Nodes -- Changing colour.....")
    console.log(nodeID);
    console.log(this.nuclearFamilyData.nodes);
    if (this.selectedColour == "generation"){

    }

    const yearColorMap = new Map<number, string>();
      this.legend.forEach(item => {
        yearColorMap.set(Number(item.element), item.colour);
      });

    this.nuclearFamilyData.nodes.forEach(node => {
      if (nodeID.includes(node.id)) {
        console.log("match");
        node.color = '#fe6100';
      } else {
        if (this.selectedColour === "generation") {
          node.color = yearColorMap.get(Number(node.gener)) || '#1B9E77';
        } else if (this.selectedColour === "year") {
          node.color = yearColorMap.get(Number(node.year)) || '#1B9E77';
        }
      }
    });
  }
    



  async getSelectedNode():Promise<void>{
      this.rendererTop.on('clickNode', async ({ node }) => {
        this.showBottomOverlay = false;
        this.isBottomLoading = true;
        // Reset nodes and edges to original color/size
        let data = this.graphTop.getNodeAttributes(node);
        console.log(data)
        console.log("Siblings: "+data['siblings']);
        console.log("Parents: "+data['parents']);
        let nodeID;


        // If node if singular node (no siblings) - assign its ID for query as its node label
        if (data['siblings']== undefined){
          nodeID = [node];
          console.log(nodeID);
        }
        else{
          // Else Assign the ID for querying as the list of siblings for looping through 
          nodeID = data['siblings'];
          console.log(nodeID);
        }

        try {
          console.log("Retrieving Data...");
          console.log(nodeID)
          this.getSelectPlantPG(nodeID); // Get entry for select clones

          const data = [nodeID, this.selectedColour];

          const response = await firstValueFrom(this.backendApiService.getPedigree(data));
          console.log('Response from backend:', response);
          this.nuclearFamilyData = response;
          this.setStatistics();
          this.updateSelectedNodeColour(nodeID);
          this.loadNewGraph();
      } catch (error) {
        console.error('Error:', error);
      }
  });
  };


  
  async getSearchedNode(item: any):Promise<void>{

        console.log('Getting Pedigree for searched clone...')
        const nodeID = item
        this.showBottomOverlay = false;
        this.isBottomLoading = true;

        try {
          console.log("Retrieving Data...");
          this.getSelectPlantPG([nodeID]); // Get entry for select clones
          const data = [nodeID, this.selectedColour];
          const response = await firstValueFrom(this.backendApiService.getPedigree(data));
          console.log('Response from backend:', response);
          this.nuclearFamilyData = response;
          console.log(this.nuclearFamilyData);
          this.setStatistics();
          this.updateSelectedNodeColour([nodeID]);
          this.loadNewGraph();
      } catch (error) {
        console.error('Error:', error);
      }
  };



  /// SIDE BAR FUNCTIONS

  setStatistics(){
    const noEdges = this.nuclearFamilyData.edges.length;
    const noNodes = this.nuclearFamilyData.nodes.length;
    console.log(noEdges);
    console.log(noNodes);
    this.stats.edges = noEdges;
    this.stats.nodes = noNodes;

  }
  zoomIn(): void {
    if (this.rendererTop) {
      const camera = this.rendererTop.getCamera();
      camera.animatedZoom({ duration: 200, factor: 1.2 }); // Zoom in 20%
    }
  }

  zoomOut(): void {
    if (this.rendererTop) {
      const camera = this.rendererTop.getCamera();
      camera.animatedUnzoom({ duration: 200, factor: 1.2 }); // Zoom out 20%
    }
  }

  resetZoom(): void {
  if (this.rendererTop) {
    const camera = this.rendererTop.getCamera();
    camera.animatedReset({ duration: 300 });
    }
  }


  selectItem(item: any): void {
    this.selectedItem = item;
    console.log(item);
    console.log(item)
    //this.searchTerm = item.id;
    this.filteredData = [];
    this.getSearchedNode(item);



}


onSearch(): void {
  const term = this.searchTerm?.toString().toLowerCase() || '';
  const matches = new Set<string>(); // To collect unique matches

  for (const item of this.cloneList) {
    const fields = [
      item.correct_id?.toString(),
      item.clone_id?.toString(),
      item.correct_female?.toString(),
      item.correct_male?.toString()
    ];

    for (const field of fields) {
      if (!field) continue;

      const value = field.toLowerCase();
      if (value.includes(term)) {
        // Store the original (not lowercased) field value to show to user
        matches.add(field);
      }
    }
  }

  // Convert Set to Array and assign to filteredData
  this.filteredData = Array.from(matches);
  console.log(this.filteredData);
}



async getUpdatedData(flags: any[]): Promise<void> {
    try {
      console.log("Sending Flags to backend.")
      const response = await firstValueFrom(this.backendApiService.getUpdatedNodesEdges(flags));
      console.log('Response from backend:', response);
      this.groupedFamilyData = response;
      this.legend = response.legend;
      console.log(this.legend);
    } catch (error) {
      console.error('Error:', error);
    }
}

 async updateDiagram(){
  this.isTopLoading = true;

  console.log("Updating Diagram");
  console.log(this.selectedGroup);
  console.log(this.selectedLayer);
  console.log(this.isfiltered);

  const flags = [this.selectedGroup,this.selectedLayer, this.isfiltered,this.selectedColour];
  console.log(flags);

  await this.getUpdatedData(flags);
  this.loadGraph();
  this.isTopLoading=false;

 }

}
