import { Component } from '@angular/core';

@Component({
  selector: 'app-display',
  standalone: true,
  template: `
    <div class="display-page">
      <h1>Welcome! 🎉</h1>
      <p>You have successfully logged in.</p>
    </div>
  `,
  styles: [`
    .display-page {
      padding: 2rem;
      text-align: center;
      font-family: sans-serif;
    }
  `]
})
export class DisplayComponent {}

