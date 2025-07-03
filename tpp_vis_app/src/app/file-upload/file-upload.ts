
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

@Component({
  selector: 'app-file-upload',
  imports: [CommonModule, 
      MatTab,
      MatTableModule,
      MatTabsModule,
      MatInputModule,
      MatButtonModule,
      MatCheckboxModule,
      MatIconModule],
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

 
 processedData : any[] = [];

 uploaded: boolean = false;
 clicked: boolean = false;
 processed: boolean = false;


 constructor(private uploadService: UploadService,
    private backendApiService: backendApiService) {}


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
      this.selectedFile = null;
      return;
    }

    const isTabDelimited = await this.checkIfTabDelimited(file);
    if (!isTabDelimited) {
      alert("The selected file is not tab-delimited.");
      this.selectedFile = null;
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
      this.selectedFile = null;
      return;
    }

    const isTabDelimited = await this.checkIfTabDelimited(file);
    if (!isTabDelimited) {
      alert("The selected file is not tab-delimited.");
      this.selectedFile = null;
      return;
    }

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

    const isTextFile = file.name.endsWith('.txt');
    if (!isTextFile) {
      alert("Please select a .txt file.");
      this.selectedFile = null;
      return;
    }

    const isTabDelimited = await this.checkIfTabDelimited(file);
    if (!isTabDelimited) {
      alert("The selected file is not tab-delimited.");
      this.selectedFile = null;
      return;
    }

    // ✅ All checks passed — safe to assign and show info
    this.selectedFile = file;
    console.log('Selected file:', this.selectedFile.name);
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
      return;
    }

    console.log("File is correct format -- Text file");
    
    this.uploadService.uploadEnvRAINFile(this.selectedEnvFile).subscribe({
      next: (response) => {
        console.log('Upload response:', response);

        this.uploadStatus = 'completed';
        

      },
      error: (error) => {
        console.error('Upload error:', error);
        this.uploadStatus = 'error';
      }
    });
    this.loadingChange.emit(false);
  }


  async uploadGenomFile() {
    this.loadingChange.emit(true);
  }




  actionMethod(event: any) {
    event.target.disabled = true;
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


  onUploadComplete(response: any) {
    this.loadingChange.emit(true);

    console.log("Emitting response to Parent component")
    this.uploadResponse.emit(response);
  }

  isBottomTabExpanded = false;

  toggleBottomTab(): void {
    this.isBottomTabExpanded = !this.isBottomTabExpanded;
  }
  

}