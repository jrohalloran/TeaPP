import { Component, EventEmitter, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { UploadService } from '../services/upload.service';
import { backendApiService } from '../services/backEndRequests.service';

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html'
})
export class FileUploadComponent {

  @Output() uploadResponse = new EventEmitter<any>();

  selectedFile: File | null = null;
  uploadStatus: string = 'waiting';

  processedData : any[] = [];
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

  // New method: Check if file is tab-delimited by reading first chunk
  checkIfTabDelimited(file: File): Promise<boolean> {
    return new Promise((resolve, reject) => {
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

      reader.onerror = () => {
        resolve(false);
      };

      reader.readAsText(blob);
    });
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

    // New: Check if file is tab-delimited
    const isTabDelimited = await this.checkIfTabDelimited(this.selectedFile);
    if (!isTabDelimited) {
      alert("The selected file does not appear to be tab-delimited.");
      this.uploadStatus = 'error';
      return;
    }
    console.log("File is correct format -- Text file and tab-delimited");

    this.uploadService.uploadFile(this.selectedFile).subscribe({
      next: (response) => {
        console.log('Upload response:', response);
        this.uploadStatus = 'completed';
        try {
          this.processFile();
        } catch (error) {
          console.error('Error:', error);
          this.processed = false;
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

  async processFile() {
    console.log("Requesting File Process....");
    try {
      const response = await firstValueFrom(this.backendApiService.processUploadFile());
      console.log('Response from backend:', response);

      this.processedData = response; // Saving to global attribute
      this.processed = true;
      this.onUploadComplete(response);
    } catch (error) {
      console.error('Error:', error);
      this.processed = false;
    }
  }

  onUploadComplete(response: any) {
    console.log("Emitting response to Parent component");
    this.uploadResponse.emit(response);
  }

}
