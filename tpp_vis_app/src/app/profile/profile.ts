import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { DataTransferService } from '../services/dataTransferService';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';




@Component({
  selector: 'app-profile',
  imports: [MatTabsModule,
            MatIconModule,
            MatMenuModule,
            CommonModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  currentView: string = 'profile';

  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private authService: AuthService,
              private router: Router) {}

  
  
  currentUser = '';
  isHelpOpen = false;

  async ngOnInit() {

    console.log('Welcome to the home page');
    const user = await this.authService.getCurrentUser();
    if (user){
      console.log(user);
      this.currentUser = user;
    }else{
      this.router.navigate(['/login'])

    }


  }
  
  toggleHelpPanel() {
    this.isHelpOpen = !this.isHelpOpen;
  }

  onHome() {
    // navigate or show profile
    console.log('Directing to Home');

    this.router.navigate(['/home']);
  }

  onUpload() {
    // navigate or show settings
    console.log('Directing to Upload-Page');

    this.router.navigate(['/upload-page']);
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

  selectedTheme: string | null = null;

    selectTheme(option: string) {
    if (this.selectedTheme === option) {
      // Deselecting the currently selected option
      this.selectedTheme = null;
    } else {
      this.selectedTheme = option;
    }
  }


  

}
