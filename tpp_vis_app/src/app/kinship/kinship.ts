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


interface GridItem {
  url: string;
  name: string;
  gridArea: string;
}



@Component({
  selector: 'app-kinship',
  imports: [MatTabsModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      CommonModule 
  ],
  standalone: true,
  templateUrl: './kinship.html',
  styleUrls: ['./kinship.css']
})

export class Kinship {


  images: GridItem[] = [];

  loading: boolean = false;
  //images: { url: string, name: string }[] = [];


  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private router: Router) {}


  async ngAfterViewInit(): Promise<void> {

    console.log('Kinship Page Initalised');

  }




  async getExistingKinship(){

    console.log("Getting Existing Analysis Data")
    this.loading = true;
    
    /*this.backendApiService.getImages().subscribe(fileNames => {
      this.images = fileNames.map(name => ({
        url: this.backendApiService.getImageUrl(name),
        name: name
      }));
    });*/

    this.images = [
      { url: this.backendApiService.getImageUrl('kinship_clustermap.png'), name: 'clustermap', gridArea: 'hero' },
      { url: this.backendApiService.getImageUrl('kinship_histogram.png'), name: 'histogram', gridArea: 'thumb1' },
      { url: this.backendApiService.getImageUrl('pca_pc1_pc2_colored_by_generation.png'), name: 'pca', gridArea: 'thumb2' },
      { url: this.backendApiService.getImageUrl('kinship_mean_histogram.png'), name: 'mean_histogram', gridArea: 'thumb3' },
      { url: this.backendApiService.getImageUrl('scree_plot.png'), name: 'scree', gridArea: 'thumb4' },
      { name: 'stats-box', url: '', gridArea: 'stats' } // stats box without URL
    ];
    this.loading = false;
    }


  async startNewAnalysis(){

    // Send data // request (use data already in back-end)
    try {
      const response = await firstValueFrom(this.backendApiService.performKinship());
      console.log('Response from backend:', response);
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
