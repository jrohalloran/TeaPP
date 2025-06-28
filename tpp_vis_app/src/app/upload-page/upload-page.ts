import { Component } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/dataTransferService';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { AuthService } from '../services/auth.service';
import { ModalComponent } from '../modal/modal';

interface ApiData {
    ID: String,
    female_parent:String,
    male_parent: String,
    correct_ID: String,
    correct_female: String,
    correct_male: String,
    removed: boolean,
    used:boolean,
  }

@Component({
  selector: 'app-upload-page',
  imports: [CommonModule,
    FileUploadComponent,
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    ModalComponent],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.css'
})
export class UploadComponent {


  // SETTING GLOBAL ATTRIBUTES 

  // Boolean to show Upload Component
  showUploader = true;
  // Boolean to show Modal Pop-out Component 
  showModal = false;

  // Arrays to store Uploaded Data are different processing stages
  apiResult: ApiData[] = [];
  processedData : any[] = [];
  cleanData : any[] = [];

  // Additional Arrays with highlighted records from processing pipeline
  idEntries : any[] = [];
  parentEntries : any[] = [];
  nonMatchParents : any[] = [];
  invalidIDs : any[] = [];

  // Loading Overlay Flags 
  loading: boolean = false;
  loadingTable: boolean = false;
  dataflag: boolean = false;
  synbreedFlag: boolean = false;

  // Search Attributes 
  searchInput: string = '';
  searchResults: any[] = [];
  searchPerformed = false;
  

  // Updating parents attributes
  mismatches: any[] = [];
  filterStats: any[] = [];

  // Login State 
  user: any;


  // Table Attrbutes 

  // Assigning Columns 
  displayedColumns: string[] = ['ID','used','female_parent', 'male_parent','correct_ID','removed'];
  secondDisplayedColumns = ['ID','correct_ID','removed'];

  // Phase counter for tabs
  currentPhaseIndex: number = 0;

  secondPhaseData: any[] = [];
  secondTableData: any[]=[];


    constructor(private backendApiService: backendApiService,
              private router: Router,
              private dataTransferService: DataTransferService,
              private authService: AuthService
  ){}


  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
  
  // Performs function after file has been uploaded from child component - file-upload 
  async handleUploadResponse(event: any): Promise<void> {
    this.loading = true;
    console.log('Upload response received:', event);
    this.processedData = event;
    this.getCleanDataFormat()
    this.apiResult = this.cleanData;
    try {
          const response = await firstValueFrom(this.backendApiService.compareData(this.cleanData));
          console.log('Response from backend:', response);
          this.idEntries = response[0];
          this.parentEntries = response[1];
          this.nonMatchParents = response[2];
          this.invalidIDs = response[3];

          this.showUploader = false;
          this.loading = false;
          //this.showModal = true;
          this.apiResult=this.idEntries;
          this.secondPhaseData = this.nonMatchParents;
          this.populateSecondTable();
          this.showModal = true;
          /*
          console.log(this.idEntries);
          console.log(this.parentEntries);
          console.log(this.nonMatchParents);
          console.log(this.invalidIDs);

          this.apiResult=this.idEntries;
          this.secondPhaseData = this.nonMatchParents;
          this.populateSecondTable();

          this.showUploader = false;
          this.loading = false;*/

          } catch (error) {
          console.error('Error:', error);
    }

  }


  // FINAL PROCESSING FUNCTION -- Takes final entry versions to insert into databases
  // Then navigates to come page 
  // Called if user skips record reviewing or confirms they are happy with reviewed entries.
  async finalise() {

    console.log('Getting Clean Data Entries');

    this.loading = true;

    console.log(this.apiResult);
    console.log(this.secondTableData);
    console.log(this.cleanData);

    const data = [this.apiResult,this.secondTableData,this.cleanData]


    try {
      console.log('Sending Data to backend for Processing');
      const response = await firstValueFrom(this.backendApiService.getCleanData(data));
      console.log('Response from backend:', response);
      const finalData = response[0];
      this.dataflag = response[1]
      if (this.dataflag){
      try{
          await this.getSynbreedPedigree(finalData);
          if (this.synbreedFlag){

            await this.sendNeo4jUpload();
          }
        } catch (error) {
          console.error('Error:', error);
        }

        }else{
          console.log("No Data recieved -- functions cannot be executed");
      }





      console.log("Navigating to Home Page");
      this.dataTransferService.setResponse(response);
      this.router.navigate(['/home']);
      } catch (error) {
      console.error('Error:', error);

    }

  }


  // UPDATE PARENT LIST 
  // Post to back-end to re-evalutate list of parents based in changes made by user.
  // Reloads second table 
  async onUpdate(){
    this.loadingTable = true;
    console.log("Updating the list of Parents");
    console.log(this.secondTableData);
    console.log(this.cleanData);

    const data = [this.secondTableData,this.cleanData]

    try {
      console.log('Sending Data to backend for Processing');
      const response = await firstValueFrom(this.backendApiService.updateParents(data));
      console.log('Response from backend:', response);
      this.secondTableData = response[0];
      this.filterStats = response[1];
      this.mismatches = response[2];
      this.cleanData = response[3];

      console.log("Mismatches: ");
      console.log(this.mismatches);
      console.log("Stats: ")
      console.log(this.filterStats);
      console.log("Table Data: ")
      console.log(this.secondTableData);

      // TO DO ------ ADD POP UP 

      this.loadingTable = false;
      } catch (error) {
      console.error('Error:', error);
      this.loadingTable = false;
    }
  }


  async getSynbreedPedigree(finalData: any){

    // Updated Graph DB loading component 
    console.log("Getting Synbreed Pedigree");

    const data = finalData;

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
      //const response = await firstValueFrom(this.backendApiService.insertNeo4j());
      const response = await firstValueFrom(this.backendApiService.insertAdminNeo4j());
      console.log('Response from backend:', response);
      //this.graphDBloaded = response;
    } catch (error) {
          console.error('Error:', error);
    }
  }


  // Formatting Functions 

  getCleanDataFormat(){
      const updatedData = this.processedData.map(item => ({
    ...item,
    removed: false,
  }));
    this.cleanData = updatedData;
  }

  //// MODAL FUNCTION ----- REVIEW RECORDS OR SKIP RECORDS

  onModalConfirm() {
    console.log("onModal confirmation activated")
    this.showModal = false;
    this.onConfirmation(); // Define this method to proceed
  }

  onConfirmation(){

      this.apiResult=this.idEntries;
      this.secondPhaseData = this.nonMatchParents;
      this.populateSecondTable();

  }

  onModalCancel() {
    console.log("onModal cancel activated")
    this.finalise();
    this.showModal = false;
  }



  // TABLE FUNCTIONS 

  addRow(): void {
      const nextId = this.apiResult.length
        ? Math.max(...this.apiResult.map(d => Number(d.ID) || 0)) + 1
        : 1;

      const newRow: ApiData = {
        ID: String(nextId),
        female_parent: '',
        male_parent: '',
        correct_ID: '',
        correct_female: '',
        correct_male: '',
        removed: false,
        used: false,
      };

      this.apiResult.push(newRow);
      this.apiResult = [...this.apiResult]; // Trigger change detection
    }

  selectAllToRemove() {
  this.apiResult = this.apiResult.map(row => ({
    ...row,
    removed: true
    }));


  }

  toggleSelectAllToRemove() {
  const allSelected = this.apiResult.every(row => row.removed === true);

  this.apiResult = this.apiResult.map(row => ({
    ...row,
    removed: !allSelected
  }));
  }

  areAllRemoved(): boolean {
    return this.apiResult?.every(row => row.removed === true);
  }

  selectUnusedToRemove() {
    this.apiResult = this.apiResult.map(row => ({
      ...row,
      removed: row.used === false // or !row.used
    }));
  }

  toggleSelectUnusedToRemove() {
    const allUnusedSelected = this.apiResult
      .filter(row => !row.used) // only rows where used === false
      .every(row => row.removed);

    this.apiResult = this.apiResult.map(row => {
      if (!row.used) {
        return { ...row, removed: !allUnusedSelected };
      }
      return row; // don't change rows that are used === true
    });
  }

  areAllUnusedRemoved(): boolean {
    return this.apiResult
      ?.filter(row => !row.used)
      .every(row => row.removed === true);
  }

  populateSecondTable() {
    console.log(this.apiResult);

    console.log("Getting Lone Parental ID Data")
    console.log(this.secondPhaseData);
    this.secondTableData = this.secondPhaseData.map(name => ({
    ID: name,      
    correct_ID: name, 
    removed: false  
    }));
    console.log(this.secondTableData)

    this.secondTableData = [...this.secondTableData];
  }


  onProceed(){
    this.currentPhaseIndex = 1;
  }



  onTabChanged(event: MatTabChangeEvent) {
  this.currentPhaseIndex = event.index;
}

  // SEARCH FUNCTIONS

  performSearch() {
    const term = this.searchInput?.toLowerCase().trim();
    this.searchPerformed = true;

    if (!term) {
      this.searchResults = [];
      return;
    }

    this.searchResults = this.processedData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );
  }

}



