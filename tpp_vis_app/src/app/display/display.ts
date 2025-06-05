import { Component, AfterViewInit } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';

@Component({
  selector: 'app-display',
  templateUrl: './display.html',
  styleUrls: ['./display.css']
})
export class DisplayComponent implements AfterViewInit {
  stats = {
    nodes: 0,
    edges: 0,
  };

  constructor(
    private backendApiService: backendApiService,
  ){}

  ngAfterViewInit(): void {
    // Initialize Sigma here
    console.log('Initialize Sigma in #sigma-container');
    this.getTrial();

  }


  async getTrial(): Promise<void>{
    console.log("--------------------")
    console.log('Getting Trial Data')
    console.log("--------------------")

    this.backendApiService.getTrial().subscribe(response => {

        console.log('Response from backend:');
        console.log(response);
      },
      (error) => {
        // Handle errors
        console.error('Error:', error);
      }
    );
  }

  zoomIn() {
    console.log('Zoom in clicked');
  }

  zoomOut() {
    console.log('Zoom out clicked');
  }
}
