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
import { FormsModule } from '@angular/forms';
import { SafeUrlPipe } from '../services/safe-url.pipe';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

interface GridItem {
  url: string;
  name: string;
  gridArea: string;
  type: string;
}



@Component({
  selector: 'app-kinship',
  imports: [MatTabsModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      CommonModule,
      FormsModule,
      SafeUrlPipe,
      MatExpansionModule,
      MatInputModule,
      MatButtonModule,  
  ],
  standalone: true,
  templateUrl: './kinship.html',
  styleUrls: ['./kinship.css']
})

export class Kinship {


  images: GridItem[] = [];

  loading: boolean = false;
  email: string = '';


  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private router: Router) {}


  async ngAfterViewInit(): Promise<void> {

    console.log('Kinship Page Initalised');

  }




  async getExistingKinship(){

    console.log("Getting Existing Analysis Data")
    this.loading = true;
    

    /*this.images = [
      { url: this.backendApiService.getImageUrl('kinship_clustermap.png'), name: 'clustermap', gridArea: 'hero', type: 'image' },
      { url: this.backendApiService.getImageUrl('kinship_histogram.png'), name: 'histogram', gridArea: 'thumb1',type: 'image' },
      { url: this.backendApiService.getImageUrl('pca_pc1_pc2_colored_by_generation.png'), name: 'pca', gridArea: 'thumb2',type: 'image' },
      { url: this.backendApiService.getImageUrl('kinship_mean_histogram.png'), name: 'mean_histogram', gridArea: 'thumb3',type: 'image' },
      { url: this.backendApiService.getImageUrl('scree_plot.png'), name: 'scree', gridArea: 'thumb4',type: 'image' },
      { name: 'stats-box', url: '', gridArea: 'stats',type: 'stats' } // stats box without URL
    ];*/
    this.images = [
      { url: this.backendApiService.getImageUrl('kinship_heatmap.html'), name: 'clustermap', gridArea: 'hero', type: 'html' },
      { url: this.backendApiService.getImageUrl('kinship_histogram.html'), name: 'histogram', gridArea: 'thumb1',type: 'html' },
      { url: this.backendApiService.getImageUrl('pca_by_generation_pc1_pc2.html'), name: 'pca', gridArea: 'thumb2',type: 'html' },
      { url: this.backendApiService.getImageUrl('kinship_mean_histogram.html'), name: 'mean_histogram', gridArea: 'thumb3',type: 'html' },
      { url: this.backendApiService.getImageUrl('pca_variance_explained.html'), name: 'mean_histogram', gridArea: 'thumb4',type: 'html' },
      { url: this.backendApiService.getImageUrl('scree_plot.png'), name: 'scree', gridArea: 'thumb5',type: 'image' },
      { name: 'stats-box', url: '', gridArea: 'stats',type: 'stats' } // stats box without URL
    ];
    this.loading = false;
    }


  async startNewAnalysis(){
    this.loading = true;
    console.log('Email entered:', this.email);

    // Send data // request (use data already in back-end)
    try {
      const response = await firstValueFrom(this.backendApiService.performKinship(this.email));
      console.log('Response from backend:', response);
      if (response[0] == "Memory"){
        console.log("Not enough Memory");
        console.log(response[1]);
        this.loading=false;
        alert('RAM too low! '+response[1]+'GB detected, 64GB required');
        

      }
      if (response == true){

            this.images = [
            { url: this.backendApiService.getImageUrl('kinship_heatmap.html'), name: 'clustermap', gridArea: 'hero', type: 'html' },
            { url: this.backendApiService.getImageUrl('kinship_histogram.html'), name: 'histogram', gridArea: 'thumb1',type: 'html' },
            { url: this.backendApiService.getImageUrl('pca_by_generation_pc1_pc2.html'), name: 'pca', gridArea: 'thumb2',type: 'html' },
            { url: this.backendApiService.getImageUrl('kinship_mean_histogram.html'), name: 'mean_histogram', gridArea: 'thumb3',type: 'html' },
            { url: this.backendApiService.getImageUrl('pca_variance_explained.html'), name: 'mean_histogram', gridArea: 'thumb4',type: 'html' },
            { url: this.backendApiService.getImageUrl('scree_plot.png'), name: 'scree', gridArea: 'thumb5',type: 'image' },
            { name: 'stats-box', url: '', gridArea: 'stats',type: 'stats' }
          ];
          this.loading = false;
      }
    } catch (error) {
      console.error('Error:', error);
      this.loading = false;

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
