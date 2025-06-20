import { Component } from '@angular/core';
import { FileUploadComponent } from '../file-upload/file-upload';

@Component({
  selector: 'app-home',
  imports:[],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  openDisplay() {
  window.open('/display', '_blank');
}

  openDirectory() {
    console.log("Opening Local Directory");



  }
}
