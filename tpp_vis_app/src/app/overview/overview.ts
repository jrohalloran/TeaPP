import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/dataTransferService';
import { SafeUrlPipe } from '../services/safe-url.pipe';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';


interface GridItem {
  url: string;
  name: string;
  gridArea: string; 
  title: string;
  type: string;
}



@Component({
  selector: 'app-overview',
  imports: [CommonModule,
      MatButtonModule,
      MatInputModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatTabsModule,
      MatIcon,
      SafeUrlPipe,
      MatSort ],
  standalone: true,
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})


export class Overview {


    loading = false;
    searchloading: boolean = false;

    siblingCount: any[] = [];
    rankedCount: any[] = [];
    summaryCount: any[] = [];
    twinCount: any[] = [];
    yearCount: any[] = [];
    basicStats: any[] = [];
    formattedCount: any[] = [];
    genCount: any[] = [];
    yearVenn:GridItem [] = [];
    parentVenn:GridItem [] = [];
    statsImages:GridItem [] = [];


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


    


    constructor(private backendApiService: backendApiService,
      ){}


    async ngAfterViewInit(): Promise<void> {
      this.loading = true;

      await this.getPedigreeStats();
      await this.getDiagrams();
      this.loading = false;

    }

    async getDiagrams(){
      console.log("Getting Diagrams");


      this.parentVenn = [
      { url: this.backendApiService.getDiagramUrl('venn_parents_Gener_2.png'), name: 'vennParents', gridArea: 'hero', type: "image",
         title: "Parents per Generation" }];
      this.yearVenn = [
      { url: this.backendApiService.getDiagramUrl('year_gen_venn_2.png'), name: 'vennYear', gridArea: 'thumb1', title: "Year of Breeding for Each Generation",type: "image"}
    ];

    }

    async getPedigreeStats(){

        console.log("Getting Pedigree Stats")

        try {
          const response = await firstValueFrom(this.backendApiService.getPedigreeStats());
          console.log('Pedigree Stats Response from backend:', response);
          this.siblingCount = response[0];
          this.rankedCount = response[1];
          this.summaryCount = response[2];
          this.twinCount = response[3];
          this.yearCount = response[4];
          this.basicStats = response[5];
          this.formattedCount = response[6];
          this.genCount = response[7];

          this.statsImages = [
        { url: this.backendApiService.getDiagramUrl('year_histogram.html'), name: 'histogram', gridArea: 'hero',
          title: "Parents per Generation",type: "html" }]

          } catch (error) {
              console.error('Error:', error);
        }
    }


  getImageClass(name: string): string {
      if (name.includes('pca')) {
        return 'thumbnail-img';
      } else if (name.includes('clustermap')) {
        return 'banner-img';
      } else {
        return 'default-img';
      }
    }

  selectedImageUrl: string | null = null;

  openModal(url: string): void {
    this.selectedImageUrl = url;
  }

  closeModal(): void {
    this.selectedImageUrl = null;
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
  toggleRow(row: any) {
    console.log(this.expandedElement);
    this.expandedElement = this.expandedElement === row ? null : row;
  }




}
