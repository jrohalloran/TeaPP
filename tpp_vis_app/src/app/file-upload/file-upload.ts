


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../services/upload.service';
import { backendApiService } from '../services/backEndRequests.service';
import { catchError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})


export class FileUploadComponent {
 selectedFile: File | null = null;
 uploadStatus: string = 'waiting';


 uploaded: boolean = false;
 clicked: boolean = false;
 processed: boolean = false;




 constructor(private uploadService: UploadService,
    private backendApiService: backendApiService) {}

 handleFileSelection(event: any) {
   this.selectedFile = event.target.files[0];
   console.log('Selected file:', this.selectedFile);
   console.log("clicked?: "+this.clicked);
 }

  async uploadFile() {
    if (!this.selectedFile) {
      alert("Please select a file before uploading.");
      return;
    }
    console.log(this.clicked);
    this.uploadStatus = 'inProgress';

    console.log('Selected File:', this.selectedFile.name);
    console.log('File Type:', this.selectedFile.type);

    // Check for .txt extension (more reliable than MIME)
    const isTextFile = this.selectedFile.name.endsWith('.txt');

    if (!isTextFile) {
      console.log("File is not the correct format");
      alert("Please select a text file (.txt).");
      this.uploadStatus = 'error';
      return;
    }

    console.log("File is correct format -- Text file");
    
    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload response:', response);

        this.uploadStatus = 'completed';
        try{
          this.processFile();
        }catch (error) {
          console.error('Error:', error);
          this.processed=false;
        }

      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadStatus = 'error';
      }
    });
  }

  actionMethod(event: any) {
    event.target.disabled = true;
  }


  async processFile(){

    console.log("Requesting File Process....");
    try {
      const response = await firstValueFrom(this.backendApiService.processUploadFile());
      console.log('Response from backend:', response);
      this.processed = true
      } catch (error) {
      console.error('Error:', error);
      this.processed=false;
    }
  }


}