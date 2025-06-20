import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
//import { FileUploadComponent } from './file-upload/file-upload'; // Setting up Upload Component

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, FormsModule],
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {}
