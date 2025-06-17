


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../services/upload.service';


@Component({
  selector: 'app-file-upload',
  imports: [CommonModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})


export class FileUploadComponent {
 selectedFile: File | null = null;
 uploadStatus: string = 'waiting';

 constructor(private uploadService: UploadService) {}

 handleFileSelection(event: any) {
   this.selectedFile = event.target.files[0];
   console.log('Selected file:', this.selectedFile);
 }

 uploadFile() {
   if (this.selectedFile) {
     this.uploadStatus = 'inProgress';

      console.log(this.selectedFile.name);
      console.log(this.selectedFile.type);
      if(this.selectedFile.type == "text/plain"||this.selectedFile.name.endsWith(".txt")){
        console.log("File is correct format -- Text file");
        this.uploadStatus = 'completed'

        this.uploadService.uploadFile(this.selectedFile).subscribe({
          next:()=>{
            console.log(Response);
            this.uploadStatus = 'completed';
          },
          error:()=>{
            console.log(Response);
            console.log("An error occurred")
            this.uploadStatus = 'error';

        }});
      }else{
        console.log("File is not the correct format");
        alert("Please select a text file.");

      }

     // Add error handling and actual upload logic as needed
   } else {
     alert("Please select a file before uploading.");
   }
 }
}