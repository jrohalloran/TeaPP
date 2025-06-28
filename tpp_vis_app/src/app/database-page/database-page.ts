import { Component } from '@angular/core';
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

@Component({
  selector: 'app-database-page',
  imports: [CommonModule,
      MatButtonModule,
      MatInputModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatTabsModule],
  standalone: true,
  templateUrl: './database-page.html',
  styleUrls: ['./database-page.css']
})

export class DatabasePage {

        // Search Attributes 
    searchInput: string = '';
    searchResults: any[] = [];
    searchPerformed = false;

    constructor(private backendApiService: backendApiService,
                  private router: Router,
                  private dataTransferService: DataTransferService
      ){}


    async ngAfterViewInit(): Promise<void> {


      await this.getPostgresStats();
      await this.getNeo4jStats();


    }
  


    async getNeo4jStats(){
      console.log('Getting stats for Neo4J database')

      console.log("Uploading Neo4j Data");
        try {
          const response = await firstValueFrom(this.backendApiService.getNeo4jStats());
          console.log('Neo4J Stats Response from backend:', response);
        } catch (error) {
              console.error('Error:', error);
        }
    }

    async getPostgresStats(){
      console.log('Getting stats for postgres database');

      console.log("Uploading PostgreSQL Data");
        try {
          const response = await firstValueFrom(this.backendApiService.getPostgresStats());
          console.log('Postgres Stats Response from backend:', response);
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
    /*
    this.searchResults = this.cleanData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );*/
  }


}
