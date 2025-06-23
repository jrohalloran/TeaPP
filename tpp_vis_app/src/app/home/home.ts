import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { catchError, firstValueFrom } from 'rxjs';
//import { FileUploadComponent } from '../file-upload/file-upload';
import { DataTransferService } from '../services/dataTransferService';

@Component({
  selector: 'app-home',
  imports:[],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  dataFlag = false;
  graphDBloaded = false;
  synbreedFlag = false;

  data: any[]=[];

  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService) {}


  async ngOnInit() {

      console.log('Welcome to the home page');
      const response = this.dataTransferService.getResponse();
      if (response) {
        // Use the response
        console.log('Received:', response);
        this.data = response;
        this.dataFlag = true;
      } else {
        console.warn('No data received');
      }

  }

  async ngAfterViewInit(): Promise<void> {

    console.log('Welcome to the home page');

    if (this.dataFlag){
      try{
      await this.getSynbreedPedigree()
      if (this.synbreedFlag){

        await this.sendNeo4jUpload();
      }
    } catch (error) {
      console.error('Error:', error);
    }

    }else{
      console.log("No Data recieved -- functions cannot be executed");
    }

  }

  async getSynbreedPedigree(){

    // Updated Graph DB loading component 
    console.log("Getting Synbreed Pedigree");

    const data = this.data;

    try {
      const response = await firstValueFrom(this.backendApiService.processPedigree(data));
      console.log('Response from backend:', response);
      this.synbreedFlag = response;
    } catch (error) {
      console.error('Error:', error);

    }
  }


  async sendNeo4jUpload(){

    // Updated Graph DB loading component 

    console.log("Uploading Neo4j Data");
    try {
      const response = await firstValueFrom(this.backendApiService.insertNeo4j());
      console.log('Response from backend:', response);
      this.graphDBloaded = response;
    } catch (error) {
          console.error('Error:', error);
    }
  }


  openDisplay() {
    if (this.graphDBloaded){
  
      window.open('/display', '_blank');
    }else{
      console.log("Graphing Data is not loaded yet.....");
      //// ADD POP OUT MESSAGE
    }
}

  openDirectory() {
    console.log("Opening Local Directory");



  }
}
