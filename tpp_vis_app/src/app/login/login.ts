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
  //username = '';
  //password = '';
  error = '';

  readonly correctPassword = 'liptontea';  // ← set your password here
  constructor(private router: Router,
              private authService: AuthService
  ) {}

  /*
  onSubmit() {
    if (this.password === this.correctPassword) {
      console.log("Setting User")
      this.authService.setCurrentUser(this.username);
      this.router.navigate(['/landing-page']);
    } else {
      this.error = 'Incorrect password. Try again.';
    }
  }*/

  loginUsername = '';
  loginPassword = '';
  signupUsername = '';
  signupEmail = '';
  signupPassword = '';

  onLogin() {
    console.log('Logging in with', this.loginUsername, this.loginPassword);

      if (this.loginPassword === this.correctPassword) {
        console.log("Setting User")
        this.authService.setCurrentUser(this.loginUsername);
        this.router.navigate(['/landing-page']);
    } else {
      this.error = 'Incorrect password. Try again.';
    }
    // Add login logic here
  }

  onSignUp() {
    console.log('Signing up with', this.signupUsername, this.signupEmail, this.signupPassword);
    // Add sign-up logic here
  }


  isBottomTabExpanded = false;

  toggleBottomTab(): void {
    this.isBottomTabExpanded = !this.isBottomTabExpanded;
  }
  

}
