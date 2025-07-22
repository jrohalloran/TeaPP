

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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';



interface GridItem {
  url: string;
  name: string;
  gridArea: string;
  type: string;
}



@Component({
  selector: 'app-environmental-data',
  imports: [MatTabsModule,
      MatIconModule,
      MatMenuModule,
      MatProgressSpinnerModule,
      CommonModule,
      SafeUrlPipe,
      MatButtonModule,
      MatExpansionModule,
      MatInputModule ],
  standalone: true,
  templateUrl: './environmental-data.html',
  styleUrl: './environmental-data.css'
})


export class EnvironmentalData {


    selectedTempPlot: 'mean' | 'min' | 'max' = 'mean'; 
    selectedRainPlot: 'year' | 'month' | 'season' = 'year'; 
    imagesRainfall: GridItem[] = [];
    imagesTemp: GridItem[] = [];
    selectedAnalysis: 'rainfall' | 'temperature' | null = null;
    loading: boolean = false;
  
  
    constructor(private backendApiService: backendApiService,
                private dataTransferService: DataTransferService,
                private router: Router) {}



    async ngAfterViewInit(): Promise<void> {

      console.log('Environmental Data Page Initalised');


    }

  async getRainfallData(){
    this.loading = true;
    this.selectedAnalysis = 'rainfall';

      try {
        const response = await firstValueFrom(this.backendApiService.getRainfallStats());
        console.log('Response from backend:', response);
        try{
        this.imagesRainfall = [
                { url: this.backendApiService.getRainfallUrl('annual_Rain_boxplot_Hist.html'), name: 'clustermap', gridArea: 'hero',type: 'html' },
                { url: this.backendApiService.getRainfallUrl('layered_all_rainfall.html'), name: 'histogram', gridArea: 'thumb1',type: 'html'  },
                { url: this.backendApiService.getRainfallUrl('Month_Rain_lineplot.html'), name: 'pca', gridArea: 'thumb2',type: 'html'  },
                { url: this.backendApiService.getRainfallUrl('Rain_Heatmap.html'), name: 'mean_histogram', gridArea: 'thumb3',type: 'html'  },
                { url: this.backendApiService.getRainfallUrl('seasonal_rainfall.html'), name: 'seasonBox', gridArea: 'boxplotArea',type: 'html' },
                { url: this.backendApiService.getRainfallUrl('layered_all_rainfall_boxplot.html'), name: 'yearBox', gridArea: 'boxplotArea',type: 'html'  },
                { url: this.backendApiService.getRainfallUrl('year_rainfall_boxplot.html'), name: 'monthBox', gridArea: 'boxplotArea',type: 'html'  },
                { name: 'stats-box', url: '', gridArea: 'stats',type: 'stats'}
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
    this.loading = true;
    this.selectedAnalysis = 'temperature';

    console.log("Getting Temperature Analysis");

      try {
        const response = await firstValueFrom(this.backendApiService.getTempStats());
        console.log('Response from backend:', response);
        try{
        
        this.imagesTemp = [
                { url: this.backendApiService.getTempUrl('temperature_year_layered.html'), name: 'histogram', gridArea: 'hero', type: 'html' },
                { url: this.backendApiService.getTempUrl('temperature_year_month.html'), name: 'pca', gridArea: 'thumb1', type: 'html' },
                { url: this.backendApiService.getTempUrl('temperature_boxplot_MIN.html'), name: 'minBox', gridArea: 'boxplotArea' , type: 'html'},
                { url: this.backendApiService.getTempUrl('temperature_boxplot_MAX.html'), name: 'maxBox', gridArea: 'boxplotArea', type: 'html' },
                { url: this.backendApiService.getTempUrl('temperature_boxplot_MEAN.html'), name: 'meanBox', gridArea: 'boxplotArea', type: 'html' },
                { name: 'stats-box', url: '', gridArea: 'stats', type: 'stats' }
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

    get maxBoxplotUrl(): string {
      return this.imagesTemp.find(i => i.name === 'maxBox')?.url || '';
    }

    get minBoxplotUrl(): string {
      return this.imagesTemp.find(i => i.name === 'minBox')?.url || '';
    }

    get meanBoxplotUrl(): string {
      return this.imagesTemp.find(i => i.name === 'meanBox')?.url || '';
    }

    get yearBoxplotUrl(): string {
      return this.imagesRainfall.find(i => i.name === 'yearBox')?.url || '';
    }

    get monthBoxplotUrl(): string {
      return this.imagesRainfall.find(i => i.name === 'monthBox')?.url || '';
    }

    get seasonBoxplotUrl(): string {
      return this.imagesRainfall.find(i => i.name === 'seasonBox')?.url || '';
    }


  selectPlot(plot: 'min' | 'max' | 'mean') {
    this.selectedTempPlot = plot;
  }

  selectRainPlot(plot: 'season' | 'year' | 'month') {

    this.selectedRainPlot = plot;
  }


}
