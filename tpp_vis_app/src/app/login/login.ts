import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { MatTab } from '@angular/material/tabs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { backendApiService } from '../services/backEndRequests.service';
import { firstValueFrom } from 'rxjs';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatTab,
    MatTableModule,MatButtonModule, MatInputModule,MatCheckboxModule,ReactiveFormsModule,MatTabsModule,
    MatProgressSpinnerModule,MatIconModule
  ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {

  //error = '';
  loginMessage: string = '';
  signUpMessage: string = '';

  readonly correctPassword = 'liptontea';  // ← set your password here
  constructor(private router: Router,
              private authService: AuthService,
              private backendApiService: backendApiService,
  ) {}

  // Login + SignUp Field
  loginUsername = '';
  loginPassword = '';
  signupUsername = '';
  signupEmail = '';
  signupPassword = '';

  async onLogin() {
    console.log('Checking User Details: ', this.loginUsername, this.loginPassword);
    if (this.loginPassword && this.loginUsername) {

      const data = [this.loginUsername, this.loginPassword];
      try{
        const response = await firstValueFrom(this.backendApiService.checkUserDetails(data));
        console.log(response); 
        if (response == true){
          console.log("Setting User")
          this.authService.setCurrentUser(this.loginUsername);
          this.router.navigate(['/landing-page']);
        }else{
          console.log("Invalid Username or Password");
          this.loginMessage = "Invalid Username or Password";

        }
      }catch(err){
        console.log("Could not connect to server")
      }
    } else {
      if (!this.loginPassword && this.loginUsername){
          console.log("Please Enter Password")
          this.loginMessage = "Please Enter Password";

        }
      if (this.loginPassword && !this.loginUsername){
          console.log("Please Enter Username")
          this.loginMessage = "Please Enter Username";

        }
      if(!this.loginPassword && !this.loginUsername){
          console.log("Please Enter Both Fields")
          this.loginMessage = "Please Enter Both Fields";
  
        }
        
        console.warn("One or both arrays are empty or not arrays.");
    }
  }

  async onSignUp() {
    console.log('Signing up with', this.signupUsername, this.signupEmail, this.signupPassword);
    // Add sign-up logic here
    if (this.signupUsername && this.signupPassword && this.signupEmail) {

    const data = [this.signupUsername, this.signupPassword,this.signupEmail]

    try{
        const response = await firstValueFrom(this.backendApiService.createNewUser(data));
        console.log(response); 
        if (response == true){
          console.log("User Successfully Created")
          this.signUpMessage = "New user created!";
        }else{
          console.log("Invalid Username or Password");
          this.signUpMessage = "Creating New user was unsuccessful";

        }
    }catch(err){
        console.log("Could not connect to server")
      }
    
    }else{
      this.signUpMessage = "Please enter all fields";
      }
  }


  isBottomTabExpanded = false;

  toggleBottomTab(): void {
    this.isBottomTabExpanded = !this.isBottomTabExpanded;
  }
  

}
