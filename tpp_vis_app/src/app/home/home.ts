import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { catchError, firstValueFrom } from 'rxjs';
import { DataTransferService } from '../services/dataTransferService';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { DisplayComponent } from '../display/display';
import { Kinship } from '../kinship/kinship';
import { Overview } from '../overview/overview';
import { EnvironmentalData } from '../environmental-data/environmental-data';
import { DatabasePage } from '../database-page/database-page';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  imports:[MatTabsModule,
            DisplayComponent,
            MatIconModule,
            MatMenuModule,
            Kinship,
            Overview,
            DatabasePage,
            EnvironmentalData ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class HomeComponent {

  dataFlag = false;
  graphDBloaded = true;
  synbreedFlag = false;
  isHelpOpen = false;

  data: any[]=[];
  currentUser = '';

  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private authService: AuthService,
              private router: Router) {}


  async ngOnInit() {

    console.log('Welcome to the home page');
    const response = this.dataTransferService.getResponse();
      if (response) {
        // Use the response
        console.log('Received:', response);
        this.data = response;
        this.dataFlag = true;
      } else {
        console.warn('No data received');
      }
    console.log('Welcome to the home page');
    const user = await this.authService.getCurrentUser();
    if (user){
      console.log(user);
      this.currentUser = user;
    }else{
      this.router.navigate(['/login'])

    }

  }

  async ngAfterViewInit(): Promise<void> {

    console.log('Welcome to the home page');

  }



  toggleHelpPanel() {
    this.isHelpOpen = !this.isHelpOpen;
  }

  onProfile() {
    // navigate or show profile
    console.log('Profile clicked');

    this.router.navigate(['/profile']);
  }

  onSettings() {
    // navigate or show settings
    console.log('Settings clicked');

    this.router.navigate(['/profile']);
  }

  onLogout() {
    // logout logic here
    console.log('Logout clicked');

    this.router.navigate(['/login']);
  }

  newAnalysis(){

    console.log('Directing to Land Page');

    this.router.navigate(['/landing-page']);
  }

  onUpload() {
    // navigate or show settings
    console.log('Directing to Upload-Page');

    this.router.navigate(['/upload-page']);
  }

}
