import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
})
export class LoginComponent {
  username = '';
  password = '';
  error = '';
  readonly correctPassword = 'liptontea';  // ← set your password here

  constructor(private router: Router,
              private authService: AuthService
  ) {}

  onSubmit() {
    if (this.password === this.correctPassword) {
      console.log("Setting User")
      this.authService.setCurrentUser(this.username);
      this.router.navigate(['/landing-page']);
    } else {
      this.error = 'Incorrect password. Try again.';
    }
  }
}
