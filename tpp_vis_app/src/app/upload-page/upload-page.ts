import { Component } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-upload-page',
  imports: [CommonModule,FileUploadComponent],
  templateUrl: './upload-page.html',
  styleUrl: './upload-page.css'
})
export class UploadComponent {

  apiResult: any;
  processedData : any[] = [];
  cleanData : any[] = [];

  constructor(private backendApiService: backendApiService){}


  getCleanDataFormat(){
      const updatedData = this.processedData.map(item => ({
    ...item,
    removed: 0,
  }));
    this.cleanData = updatedData;
  }

  async handleUploadResponse(event: any): Promise<void> {
    console.log('Upload response received:', event);
    this.processedData = event;
    this.getCleanDataFormat()
    this.apiResult = this.cleanData;
    try {
          const response = await firstValueFrom(this.backendApiService.compareData(this.cleanData));
          console.log('Response from backend:', response);

          } catch (error) {
          console.error('Error:', error);
    }

  }


}
