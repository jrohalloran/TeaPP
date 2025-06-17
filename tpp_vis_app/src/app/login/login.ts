import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { Router } from '@angular/router';

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

  constructor(private router: Router) {}

  onSubmit() {
    if (this.password === this.correctPassword) {
      this.router.navigate(['/home']);
    } else {
      this.error = 'Incorrect password. Try again.';
    }
  }
}
