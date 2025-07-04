


import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { AuthService } from '../services/auth.service';


@Component({
  selector: 'app-landing-page',
  imports: [
    MatButtonModule,
    MatInputModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatTabsModule,
    MatIconModule,
    MatMenuModule ],
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPage {

  constructor(private router: Router,
    private authService: AuthService){}
  
  isHelpOpen = false;
  currentUser = '';


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
  
  uploadNewData(){

    console.log("Navigating to Upload Page");
    this.router.navigate(['/upload-page']);


  }
  analyseExisting(){
        console.log("Navigating to Upload Page");
        this.router.navigate(['/home']);
  }

  toggleHelpPanel() {
    this.isHelpOpen = !this.isHelpOpen;
  }

  onProfile() {
    // navigate or show profile
    console.log('Profile clicked');
  }

  onSettings() {
    // navigate or show settings
    console.log('Settings clicked');
  }

  onLogout() {
    // logout logic here
    console.log('Logout clicked');
  }

  
}
