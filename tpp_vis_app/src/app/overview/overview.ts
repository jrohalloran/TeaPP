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

interface GridItem {
  url: string;
  name: string;
  gridArea: string; 
  title: string; // <-- add this
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
      MatTabsModule],
  standalone: true,
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})


export class Overview {


    siblingCount: any[] = [];
    rankedCount: any[] = [];
    summaryCount: any[] = [];
    twinCount: any[] = [];
    yearCount: any[] = [];
    basicStats: any[] = [];
    formattedCount: any[] = [];
    images: GridItem[] = [];
    statsImages:GridItem [] = [];

    


    constructor(private backendApiService: backendApiService,
      ){}


    async ngAfterViewInit(): Promise<void> {


      await this.getPedigreeStats();
      await this.getDiagrams();


    }

    async getDiagrams(){
      console.log("Getting Diagrams");


      this.images = [
      { url: this.backendApiService.getDiagramUrl('venn_parents_Gener_2.png'), name: 'clustermap', gridArea: 'hero',
         title: "Parents per Generation" },
      { url: this.backendApiService.getDiagramUrl('year_gen_venn_2.png'), name: 'clustermap', gridArea: 'thumb1', title: "Year of Breeding for Each Generation"  }
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
          //console.log(this.siblingCount);
          //console.log(this.rankedCount);
          //console.log(this.summaryCount);
          //console.log(this.twinCount);
          this.statsImages = [{ url: this.backendApiService.getDiagramUrl('year_histogram.png'), name: 'histogram', gridArea: 'hero',
          title: "Parents per Generation" },]

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
}
