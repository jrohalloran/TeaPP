import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { catchError, firstValueFrom } from 'rxjs';
import { DataTransferService } from '../services/dataTransferService';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';
import { SafeUrlPipe } from '../services/safe-url.pipe';
import { MatButtonModule } from '@angular/material/button';

import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

import { MatExpansionModule } from '@angular/material/expansion';


@Component({
  selector: 'app-genomic-data',
  imports: [MatTabsModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      CommonModule,
      SafeUrlPipe,
      MatButtonModule,
      MatTableModule,
      MatInputModule,
      MatCheckboxModule,
      MatIcon,
      FormsModule,
      ReactiveFormsModule,
      MatExpansionModule],
  templateUrl: './genomic-data.html',
  styleUrl: './genomic-data.css'
})
export class GenomicData {
  
  
  constructor(private backendApiService: backendApiService,
                private dataTransferService: DataTransferService,
                private router: Router) {}


  loading: boolean = false;
  genomicTableColumns = ['clone_id','file_name', 'add_info', 'select'];
  genomicTableData: any = [];
  htmlReports: string[] = [];
  storedReports: string[] = [];
  email: string = '';


  selectedGenomicRows: any[] = [];


  async ngAfterViewInit(): Promise<void> {

    console.log('Initalising Genomic Data Records');
    await this.getGenomicData();





  }


  async getGenomicData(){



    console.log("Retrieving Uploading Genomic Data Records")

      try {
        const response = await firstValueFrom(this.backendApiService.getGenomicData());
        console.log('Response from backend:', response);
        this.genomicTableData = response;
        console.log(this.genomicTableData);


      } catch (error) {
        console.error('Error:', error);

      }
  }

  async retrieveFastQC(){
    this.loading = true;
    try{
        this.backendApiService.getHtmlReports().subscribe({
                next: (files) => {
                  this.storedReports = files;
                },
                error: (err) => {
                  console.error('Failed to load reports:', err);
                }
              });
            }
            catch(error) {
        console.error('Error:', error);
            }finally{
      this.loading = false;
    }


  
}


  async performFastQC(){
    this.loading = true;
    console.log(this.email);
    console.log(this.selectedGenomicRows);
    const data = [this.selectedGenomicRows, this.email];
    try {
        const response = await firstValueFrom(this.backendApiService.performFastQC(data));
        console.log('Response from backend:', response);

        // Retrieving FastQC Reports 
        this.backendApiService.getHtmlReports().subscribe({
                next: (files) => {
                  this.htmlReports = files;
                },
                error: (err) => {
                  console.error('Failed to load reports:', err);
                }
              });
          
    } catch (error) {
        console.error('Error:', error);

    }finally{
      this.loading = false;
    }
  }


toggleSelection(row: any) {
  const index = this.selectedGenomicRows.findIndex(r => r.id === row.id);
  if (index >= 0) {
    this.selectedGenomicRows.splice(index, 1);
    //console.log(this.selectedGenomicRows);
  } else {
    this.selectedGenomicRows.push(row);
    //console.log(this.selectedGenomicRows);
  }
}

isRowSelected(row: any): boolean {
  return this.selectedGenomicRows.some(r => r.id === row.id);
}


}
