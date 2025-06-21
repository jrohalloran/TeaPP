import { Component } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


interface ApiData {
    ID: String,
    female_parent:String,
    male_parent: String,
    correct_ID: String,
    correct_female: String,
    correct_male: String,
    removed: String,
    used:String,
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
    MatCheckboxModule],
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


  constructor(private backendApiService: backendApiService){}


  getCleanDataFormat(){
      const updatedData = this.processedData.map(item => ({
    ...item,
    removed: 0,
  }));
    this.cleanData = updatedData;
  }

  async handleUploadResponse(event: any): Promise<void> {
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

          this.showUploader = false;

          } catch (error) {
          console.error('Error:', error);
    }

  }

//displayedColumns: string[] = ['ID', 'female_parent', 'male_parent', 'correct_ID', 'correct_female', 'correct_male', 'removed', 'actions'];

displayedColumns: string[] = ['ID', 'female_parent', 'male_parent','correct_ID', 'used', 'removed'];


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
      removed: '',
      used: '',
    };

    this.apiResult.push(newRow);
    this.apiResult = [...this.apiResult]; // Trigger change detection
  }


deleteRow(index: number) {
  this.apiResult.splice(index, 1);
  this.apiResult = [...this.apiResult];
}

}
