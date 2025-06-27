import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { catchError, firstValueFrom } from 'rxjs';
import { DataTransferService } from '../services/dataTransferService';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplayComponent } from '../display/display';
import { Kinship } from '../kinship/kinship';
import { Overview } from '../overview/overview';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'app-home',
  imports:[MatTabsModule,
            DisplayComponent,
            MatIconModule,
            MatMenuModule,
            Kinship,
            Overview ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  dataFlag = false;
  graphDBloaded = true;
  synbreedFlag = false;
  isHelpOpen = false;

  data: any[]=[];

  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private router: Router) {}


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

    // TO DO:      Updated Graph DB loading component 
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

    
      this.router.navigate(['/upload-page']);
    }

  toggleHelpPanel() {
    this.isHelpOpen = !this.isHelpOpen;
  }

  onProfile() {
    // navigate or show profile
    console.log('Profile clicked');
  }

  onSettings() {
    // navigate or show settings
    console.log('Settings clicked');
  }

  onLogout() {
    // logout logic here
    console.log('Logout clicked');
  }

}
