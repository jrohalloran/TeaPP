import { Component, ViewChild } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatSort } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/dataTransferService';
import { MatTableDataSource } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';




export interface postgreSQLTableData {
  table_name: string;
  seq_scan: string;
  idx_scan: string;
  rows: string;
  total_size: string;
}

export interface Neo4jTableData{
  labels: string;
  nodeCount: number;
  propertyKeys: string;
  relationshipCount: number;
  relationshipTypes: string;
}

export interface Neo4jStatRow {
  key: string;
  value: string | number;
}

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
      MatTabsModule,
      MatSort,
      MatIcon,
      MatExpansionModule],
  standalone: true,
  templateUrl: './database-page.html',
  styleUrls: ['./database-page.css']
})

export class DatabasePage {
  loading: boolean = false;
  searchloading: boolean = false;

  //@Input() dataSource: postgreSQLTableData[] = [];

    postgreSQLTableData: any[] = [];
    neo4jTableData: any[] = [];

    pgStatus = false;
    neoStatus = false;
    neoStatusMessage: string = '';
    pgStatusMessage = '';

    postgresTableColumns = ['table_name','rows', 'total_size'];
    neo4jDisplayedColumns: string[] = ['key', 'value'];

    postgresSearchColumns  = ['correct_id', 'correct_female', 'correct_male', 'year', 'generation'];
    neo4jSearchColumns = ['source', 'relation', 'target'];
    groupedSearchColumns = ['expand', 'female_parent', 'male_parent', 'year', 'entries'];

        // Search Attributes 
    searchInput: string = '';
    searchResults: any[] = [];
    searchPerformed = false;
   // postgresSearch: any[] = [];
   // neo4jSearch: any[] = [];
    postgresSearch = new MatTableDataSource<any>([]);  // initialize with empty array
    neo4jSearch = new MatTableDataSource<any>([]); 
    groupedPGSearch: any[] = [];

    expandedElement:  any | null = null;


    postgreRestartFlag: boolean | undefined;
    neo4jRestartFlag: boolean | undefined;


    @ViewChild('postgresSort') postgresSort!: MatSort;
    @ViewChild('neo4jSort') neo4jSort!: MatSort;



    constructor(private backendApiService: backendApiService,
                  private router: Router,
                  private dataTransferService: DataTransferService
      ){}


    async ngAfterViewInit(): Promise<void> {
      this.loading = true;

      await this.getDBStatus();// Getting the Status of the Databases - are they live?
      await this.getPostgresStats();// Get Statistics for PostgreSQL DB
      await this.getNeo4jStats();// Get Statistics for Neo4j DB
      this.postgresSearch.sort = this.postgresSort;
      this.postgresSearch.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'rows':
          case 'total_size':
            return Number(item[property]) || 0;
          default:
            return (item[property] || '').toString().toLowerCase();
        }
      };

      this.neo4jSearch.sort = this.neo4jSort;
      this.neo4jSearch.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'nodeCount':
          case 'relationshipCount':
            return Number(item[property]) || 0;
          default:
            return (item[property] || '').toString().toLowerCase();
        }
      };
      this.loading = false;


    }

    populateSQLTable(response: any[]){
        this.postgreSQLTableData = response;

    }

    populateNeo4jTable(response: any[]){
      this.neo4jTableData = response;

    }

    neo4jDataSource: Neo4jStatRow[] = [];


    async getNeo4jStats(){
      console.log('Getting stats for Neo4J database')

      console.log("Uploading Neo4j Data");
        try {
          const response = await firstValueFrom(this.backendApiService.getNeo4jStats());
          console.log('Neo4J Stats Response from backend:', response);
             this.neo4jDataSource = Object.entries(response).map(([key, value]) => ({
                    key,
                    value: Array.isArray(value) ? value.join(', ') : (value as string | number)
                  }));
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
          this.postgreSQLTableData = response;
        } catch (error) {
              console.error('Error:', error);
      }

    }


    async getDBStatus(){
      
      console.log('Getting DB Status');

        try {
          const response = await firstValueFrom(this.backendApiService.getDBStatus());
          console.log('Postgres Stats Response from backend:', response);
          this.postgreSQLTableData = response;
          this.pgStatus = response.pg;
          this.neoStatus = response.neo;
          if (this.pgStatus){
            this.pgStatusMessage = "Live";
          }else{
            this.pgStatusMessage = "Offline";

          }
          if (this.neoStatus){
            this.neoStatusMessage = "Live";
          }else{
            this.neoStatusMessage = "Offline";

          }






        } catch (error) {
              console.error('Error:', error);

      }

    }

    async performSearch() {
    this.searchloading=true;
    const term = this.searchInput?.toLowerCase().trim();
    this.searchPerformed = true;
    console.log(this.searchInput);

    if (!term) {
      this.searchResults = [];
      return;
    }
    try{
      const response = await firstValueFrom(this.backendApiService.searchID([this.searchInput]));
      console.log('Search Response from backend:', response);
      this.postgresSearch.data = response['postgres'] || [];
      this.neo4jSearch.data = response['neo4j'] || [];
      this.groupedPGSearch = response['grouped'] || [];
      this.searchloading=false;
    }
    catch(error){
      console.error('Error:', error);
    }
  }

    async refreshAll(){
      this.loading = true;

      console.log("Refresh Database tables");
            await this.getDBStatus();
      await this.getPostgresStats();
      await this.getNeo4jStats();
      this.postgresSearch.sort = this.postgresSort;
      this.postgresSearch.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'rows':
          case 'total_size':
            return Number(item[property]) || 0;
          default:
            return (item[property] || '').toString().toLowerCase();
        }
      };

      this.neo4jSearch.sort = this.neo4jSort;
      this.neo4jSearch.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'nodeCount':
          case 'relationshipCount':
            return Number(item[property]) || 0;
          default:
            return (item[property] || '').toString().toLowerCase();
        }
      };
      this.loading = false;


    }

    toggleRow(row: any) {
    console.log(this.expandedElement);
    this.expandedElement = this.expandedElement === row ? null : row;
  }


  async restartPostgres(){
    this.loading = true;
    console.log("Restart Postgres Selected");
        try {
        const response = await firstValueFrom(this.backendApiService.restartPostgreSQL());
        console.log('Response from backend:', response);
        this.postgreRestartFlag=response;
        this.loading = false;
        if(response.message == "success"){
          alert('PostgreSQL Database Sucessfully Restarted - Please refresh the Database Tables.');
        }else{
          alert('Error in PostgreSQL Database Restart');
        }
    } catch (error) {
            console.error('Error:', error);
    
    }

  }

  async restartNeo4j(){
    this.loading = true;
    console.log("Restart Neo4j Selected");
    try {
        const response = await firstValueFrom(this.backendApiService.restartNeo4j());
        console.log('Response from backend:', response);
        this.neo4jRestartFlag=response;
        this.loading = false;
        if(response.success){
          alert('Neo4j Database Sucessfully Restarted - Please refresh the Database Tables.');
        }else{
          alert('Error in Neo4j Database Restart');
        }
    } catch (error) {
            console.error('Error:', error);
    
    }


  }

}
