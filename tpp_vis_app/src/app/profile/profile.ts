import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { DataTransferService } from '../services/dataTransferService';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms'; 





@Component({
  selector: 'app-profile',
  imports: [MatTabsModule,
            MatIconModule,
            MatMenuModule,
            CommonModule,
          FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile {

  currentView: string = 'profile';
  fontSizes: number[] = [12, 14, 16, 18, 20, 24, 28, 32];
  fontSize: number = 16;
  constructor(private backendApiService: backendApiService,
              private dataTransferService: DataTransferService,
              private authService: AuthService,
              private router: Router) {}

  colorThemes = [
    { name: 'Light', background: '#ffffff', text: '#000000' },
    { name: 'Dark', background: '#1e1e1e', text: '#ffffff' },
    { name: 'Ocean', background: '#e0f7fa', text: '#006064' },
    { name: 'Sunset', background: '#ffccbc', text: '#4e342e' },
    { name: 'Mint', background: '#e0ffe0', text: '#004d00' }
  ];

  palettes = [
    { name: 'Warm', colors: ['#ff6f61', '#ffb74d', '#ffe082'] },
    { name: 'Cool', colors: ['#4fc3f7', '#81d4fa', '#b3e5fc'] },
    { name: 'Earthy', colors: ['#a1887f', '#8d6e63', '#bcaaa4'] },
    { name: 'Vibrant', colors: ['#e91e63', '#9c27b0', '#673ab7'] },
    { name: 'Pastel', colors: ['#f8bbd0', '#e1bee7', '#d1c4e9'] }
  ];

  selectedPalette = this.palettes[0]; // default

  selectedTheme2 = this.colorThemes[0];
  
  currentUser = '';
  isHelpOpen = false;


  allPrivileges = [
    'Perform Analysis',
    'Upload Pedigree Data',
    'Upload Environmental Data',
    'Upload Genomic Data',
    'Edit Users',
    'Manage Settings',
    'View Analytics',
    'Delete Content'
  ];


  async ngOnInit() {

    console.log('Welcome to the home page');
    /*
    const user = await this.authService.getCurrentUser();
    if (user){
      console.log(user);
      this.currentUser = user;
    }else{
      this.router.navigate(['/login'])

    }*/
  }

  selectedPrivileges: string[] = [];

  togglePrivilege(privilege: string) {
    const index = this.selectedPrivileges.indexOf(privilege);
    if (index === -1) {
      this.selectedPrivileges.push(privilege);
    } else {
      this.selectedPrivileges.splice(index, 1);
    }
  }

  isSelected(privilege: string): boolean {
    return this.selectedPrivileges.includes(privilege);
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
