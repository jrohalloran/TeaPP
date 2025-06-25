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
    MatTabsModule],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.css'
})
export class UploadComponent {

  showUploader = true;

  apiResult: ApiData[] = [];
  processedData : any[] = [];
  cleanData : any[] = [];

  idEntries : any[] = [];
  parentEntries : any[] = [];
  nonMatchParents : any[] = [];
  invalidIDs : any[] = [];

  loading: boolean = false;
  loadingTable: boolean = false;

  searchInput: string = '';
  searchResults: any[] = [];
  searchPerformed = false;
  
  user: any;


  constructor(private backendApiService: backendApiService,
              private router: Router,
              private dataTransferService: DataTransferService,
              private authService: AuthService
  ){}


  getCleanDataFormat(){
      const updatedData = this.processedData.map(item => ({
    ...item,
    removed: false,
  }));
    this.cleanData = updatedData;
  }

  ngOnInit() {
    this.user = this.authService.getCurrentUser();
  }
 
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

          console.log(this.idEntries);
          console.log(this.parentEntries);
          console.log(this.nonMatchParents);
          console.log(this.invalidIDs);

          this.apiResult=this.idEntries;
          this.secondPhaseData = this.nonMatchParents;
          this.populateSecondTable();

          this.showUploader = false;
          this.loading = false;

          } catch (error) {
          console.error('Error:', error);
    }

  }

//displayedColumns: string[] = ['ID', 'female_parent', 'male_parent', 'correct_ID', 'correct_female', 'correct_male', 'removed', 'actions'];

displayedColumns: string[] = ['ID','used','female_parent', 'male_parent','correct_ID','removed'];

//currentPhase = 1;  // 1 = first table + instructions, 2 = second table + instructions
// You probably already have apiResult as the first table's data
// Prepare second phase data:

currentPhaseIndex: number = 0;

secondPhaseData: any[] = [];

secondTableData: any[]=[];

// Optional: columns for the second table if different
secondDisplayedColumns = ['ID','correct_ID','removed'];


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

  async finalise() {

    console.log('Getting Clean Data Entries');

    this.loading = true;

    const data = [this.apiResult,this.secondTableData,this.cleanData]

    try {
      console.log('Sending Data to backend for Processing');
      const response = await firstValueFrom(this.backendApiService.getCleanData(data));
      console.log('Response from backend:', response);
      console.log("Navigating to Home Page");
      this.dataTransferService.setResponse(response);
      this.router.navigate(['/home']);
      } catch (error) {
      console.error('Error:', error);

    }

  }


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


  onTabChanged(event: MatTabChangeEvent) {
  this.currentPhaseIndex = event.index;
}

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
      this.loadingTable = false;
      } catch (error) {
      console.error('Error:', error);
    }
  }
}



