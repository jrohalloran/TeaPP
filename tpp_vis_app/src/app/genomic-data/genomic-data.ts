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
      ReactiveFormsModule],
  templateUrl: './genomic-data.html',
  styleUrl: './genomic-data.css'
})
export class GenomicData {
  
  
  constructor(private backendApiService: backendApiService,
                private dataTransferService: DataTransferService,
                private router: Router) {}


  loading: boolean = false;
  genomicTableColumns = ['clone_id', 'add_info', 'select'];
  genomicTableData: any = [];




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

      } catch (error) {
        console.error('Error:', error);

      }
  }

}
