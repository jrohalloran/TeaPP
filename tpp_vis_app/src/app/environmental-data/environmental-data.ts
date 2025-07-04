

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
  selector: 'app-environmental-data',
  imports: [MatTabsModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      CommonModule ],
  standalone: true,
  templateUrl: './environmental-data.html',
  styleUrl: './environmental-data.css'
})


export class EnvironmentalData {

    imagesRainfall: GridItem[] = [];
    imagesTemp: GridItem[] = [];
  
    loading: boolean = false;
  
  
    constructor(private backendApiService: backendApiService,
                private dataTransferService: DataTransferService,
                private router: Router) {}



    async ngAfterViewInit(): Promise<void> {

      console.log('Environmental Data Page Initalised');


    }

  async getRainfallData(){

      try {
        const response = await firstValueFrom(this.backendApiService.getRainfallStats());
        console.log('Response from backend:', response);
        try{
        this.imagesRainfall = [
                { url: this.backendApiService.getRainfallUrl('annual_Rain_boxplot_Hist.png'), name: 'clustermap', gridArea: 'hero' },
                { url: this.backendApiService.getRainfallUrl('layered_all_rainfall.png'), name: 'histogram', gridArea: 'thumb1' },
                { url: this.backendApiService.getRainfallUrl('Month_Rain_lineplot.png'), name: 'pca', gridArea: 'thumb2' },
                { url: this.backendApiService.getRainfallUrl('Rain_Heatmap.png'), name: 'mean_histogram', gridArea: 'thumb3' },
                { url: this.backendApiService.getRainfallUrl('seasonal_rainfall.png'), name: 'scree', gridArea: 'thumb4' },
                { name: 'stats-box', url: '', gridArea: 'stats' }
              ];
      this.loading = false;}
        catch(error){
                console.error('Error:', error);
      }
      } catch (error) {
        console.error('Error:', error);

      }


    }


  async getTempData(){

    console.log("Getting Temperature Analysis");

      try {
        const response = await firstValueFrom(this.backendApiService.getTempStats());
        console.log('Response from backend:', response);
        try{
        
        this.imagesTemp = [
                { url: this.backendApiService.getTempUrl('temperature_boxplot_year.png'), name: 'clustermap', gridArea: 'hero' },
                { url: this.backendApiService.getTempUrl('temperature_year_layered.png'), name: 'histogram', gridArea: 'thumb1' },
                { url: this.backendApiService.getTempUrl('temperature_year_month.png'), name: 'pca', gridArea: 'thumb2' },
                { name: 'stats-box', url: '', gridArea: 'stats' }
              ];
      this.loading = false;}
        catch(error){
                console.error('Error:', error);
      }
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
