
import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UploadService } from '../services/upload.service';
import { backendApiService } from '../services/backEndRequests.service';
import { firstValueFrom } from 'rxjs';
import { MatTab } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 


@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, 
      MatTab,
      MatTableModule,
      MatTabsModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule,
      FormsModule],
  templateUrl: './file-upload.html',
  styleUrl: './file-upload.css'
})


export class FileUploadComponent {

@Output() uploadResponse = new EventEmitter<any>();
@Output() loadingChange = new EventEmitter<boolean>();


 selectedFile: File | null = null;
 selectedEnvFile: File | null = null;
 selectedGenomFile: File | null = null;
 uploadStatus: string = 'waiting';

 processing = false;

 selectedEnvType: string = '';
  userIDInput: string = '';
 
 processedData : any[] = [];

 uploaded: boolean = false;
 clicked: boolean = false;
 processed: boolean = false;


  envMessage: string = '';
  pedMessage: string = '';


 constructor(private uploadService: UploadService,
    private backendApiService: backendApiService,
    private router: Router) {}


  checkIfTabDelimited(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const chunkSize = 1024;
      const blob = file.slice(0, chunkSize);
      const reader = new FileReader();

      reader.onload = (e) => {
        const text = e.target?.result as string;
        const lines = text.split(/\r?\n/).filter(line => line.trim().length > 0);

        if (lines.length === 0) {
          resolve(false);
          return;
        }

        const tabDelimitedLines = lines.slice(0, 5).filter(line => line.includes('\t'));
        const isTabDelimited = tabDelimitedLines.length / Math.min(lines.length, 5) > 0.6;

        resolve(isTabDelimited);
      };

      reader.onerror = () => resolve(false);

      reader.readAsText(blob);
    });
  }




  async handleFileSelection(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    const isTextFile = file.name.endsWith('.txt');
    if (!isTextFile) {
      alert("Please select a .txt file.");
      this.pedMessage = 'File is not a Text file - Please choose another';
      this.selectedFile = null;
      return;
    }

    const isTabDelimited = await this.checkIfTabDelimited(file);
    if (!isTabDelimited) {
      alert("The selected file is not tab-delimited.");
      this.selectedFile = null;
      this.pedMessage = 'File is not Tab-deliminated - Please choose another';
      return;
    }

    // ✅ All checks passed — safe to assign and show info
    this.selectedFile = file;
    console.log('Selected file:', this.selectedFile.name);
    console.log("clicked?: " + this.clicked);
  }


  async handleFileEnvSelection(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    const isTextFile = file.name.endsWith('.txt');
    if (!isTextFile) {
      alert("Please select a .txt file.");
      this.envMessage = 'File is not a Text file - Please choose another';
      this.selectedFile = null;
      return;
    }

    const isTabDelimited = await this.checkIfTabDelimited(file);
    if (!isTabDelimited) {
      alert("The selected file is not tab-delimited.");
      this.envMessage = 'File is not tab-delimited - Please choose another';
      this.selectedFile = null;
      return;
    }
    this.envMessage = '';

    // ✅ All checks passed — safe to assign and show info
    this.selectedEnvFile = file;
    console.log('Selected file:', this.selectedEnvFile.name);
    console.log("clicked?: " + this.clicked);
  }


  async handleFileGenomSelection(event: any) {
    const file: File = event.target.files[0];

    if (!file) {
      return;
    }

    const isTextFile = (file.name.endsWith('.fastq')||file.name.endsWith('.fq'));
    if (!isTextFile) {
      alert("Please select a fastQ file.");
      this.selectedFile = null;
      return;
    }

    // ✅ All checks passed — safe to assign and show info
    this.selectedGenomFile = file;
    console.log('Selected file:', this.selectedGenomFile.name);
    console.log("clicked?: " + this.clicked);
  }



  async uploadFile() {
    this.loadingChange.emit(true);
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
    this.loadingChange.emit(false);
  }

  async uploadEnvFile() {
    this.loadingChange.emit(true);
        if (!this.selectedEnvFile) {
      alert("Please select a file before uploading.");
      return;
    }

    console.log(this.clicked);
    this.uploadStatus = 'inProgress';

    console.log('Selected File:', this.selectedEnvFile.name);
    console.log('File Type:', this.selectedEnvFile.type);

    // Check for .txt extension (more reliable than MIME)
    const isTextFile = this.selectedEnvFile.name.endsWith('.txt');

    if (!isTextFile) {
      console.log("File is not the correct format");
      alert("Please select a text file (.txt).");
      this.uploadStatus = 'error';
      this.envMessage = "Please Select a Text File";
      return;
    }

    console.log("File is correct format -- Text file");
    if (this.selectedEnvType){
        if (this.selectedEnvType == 'rainfall'){
          console.log("Performing Rainfall processing")
          this.uploadService.uploadEnvRAINFile(this.selectedEnvFile).subscribe({
          next: (response) => {
            console.log('Upload response:', response);

            this.uploadStatus = 'completed';
            this.processRainfallFile();
          },
          error: (error) => {
            console.error('Upload error:', error);
            this.uploadStatus = 'error';
          }
        });
        this.loadingChange.emit(false);
      }
      if(this.selectedEnvType == 'temperature'){
          console.log("Performing temperature processing");
                this.uploadService.uploadEnvTEMPFile(this.selectedEnvFile).subscribe({
          next: (response) => {
            console.log('Upload response:', response);

            this.uploadStatus = 'completed';
            this.processTempFile();
          },
          error: (error) => {
            console.error('Upload error:', error);
            this.uploadStatus = 'error';
          }
        });
          }
        else{
          this.loadingChange.emit(false);
          this.envMessage = "Please select a Data Type";
          console.log("please select a file type ")
        }
  }else{
    this.loadingChange.emit(false);
    console.log("please select a file type ");
    this.envMessage = "Please select a Data Type";
  }

}



  async uploadGenomFile() {
    this.loadingChange.emit(true);

    console.log(this.userIDInput);

    if (!this.selectedGenomFile) {
      alert("Please select a file before uploading.");
      return;
    }
    if (!this.userIDInput || this.userIDInput== null || this.userIDInput==''|| this.userIDInput==' ') {
      alert("Please Enter Clone ID for the Fastq file.");
      return;
    }
    if (this.userIDInput){
          console.log("Sending File for Upload")
          this.uploadService.uploadGENOMFile(this.selectedGenomFile).subscribe({
          next: (response) => {
            console.log('Upload response:', response);
            try{
              this.processGenomFile()
            }catch (error){
              console.error('Error:', error);
            }

            this.uploadStatus = 'completed';
            this.processing = true;


          },
          error: (error) => {
            console.error('Upload error:', error);
            this.uploadStatus = 'error';
          }
        });
        this.loadingChange.emit(false);
      }

  }




  actionMethod(event: any) {
    //event.target.disabled = true;
  }


  async processFile(){
    this.loadingChange.emit(true);

    console.log("Requesting File Process....");
    try {
      const response = await firstValueFrom(this.backendApiService.processUploadFile());
      console.log('Response from backend:', response);

      this.processedData = response; // Saving to global attribute
      this.processed = true
      this.onUploadComplete(response);
      } catch (error) {
      console.error('Error:', error);
      this.processed=false;
    }
  }

    async processRainfallFile(){
    this.loadingChange.emit(true);

    console.log("Requesting File Process....");
    try {
      const response = await firstValueFrom(this.backendApiService.processRainfallFile());
      console.log('Response from backend:', response);
      if (response){
        this.loadingChange.emit(false);
        this.router.navigate(['/home']);
      }

      } catch (error) {
      console.error('Error:', error);
    }
  }


  async processTempFile(){
    this.loadingChange.emit(true);

    console.log("Requesting File Process....");
    try {
      const response = await firstValueFrom(this.backendApiService.processTempFile());
      console.log('Response from backend:', response);
      if (response){
        this.loadingChange.emit(false);
        this.router.navigate(['/home']);
      }

      } catch (error) {
      console.error('Error:', error);
    }
  }


  async processGenomFile(){
    this.loadingChange.emit(true);
        console.log("Requesting File Process....");
    const clone_id = this.userIDInput;
    try {
      const response = await firstValueFrom(this.backendApiService.processGenomFile(clone_id));
      console.log('Response from backend:', response);
      if (response){
        this.loadingChange.emit(false);
        //this.router.navigate(['/home']);
      }

      } catch (error) {
      console.error('Error:', error);
    }

  }

  onUploadComplete(response: any) {
    this.loadingChange.emit(true);

    console.log("Emitting response to Parent component")
    this.uploadResponse.emit(response);
  }

  isBottomTabExpanded = false;

  toggleBottomTab(): void {
    this.isBottomTabExpanded = !this.isBottomTabExpanded;
  }

  onUserChoice(uploadAgain: boolean) {
    this.processing = false;
    if (uploadAgain) {
      this.selectedGenomFile = null;
    } else {
      // Process GENOM FILES
      console.log('User chose not to upload another file.');
    }
  }
  

}