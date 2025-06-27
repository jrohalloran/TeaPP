import { Component } from '@angular/core';
import { backendApiService } from '../services/backEndRequests.service';
import { CommonModule } from '@angular/common';
import { firstValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Router } from '@angular/router';
import { DataTransferService } from '../services/dataTransferService';
import { ModalComponent } from '../modal/modal';





@Component({
  selector: 'app-overview',
  imports: [CommonModule,
      MatButtonModule,
      MatInputModule,
      MatTableModule,
      FormsModule,
      ReactiveFormsModule,
      MatCheckboxModule,
      MatProgressSpinnerModule,
      MatTabsModule,
      ModalComponent],
  standalone: true,
  templateUrl: './overview.html',
  styleUrls: ['./overview.css']
})
export class Overview {

      // Search Attributes 
    searchInput: string = '';
    searchResults: any[] = [];
    searchPerformed = false;

    constructor(private backendApiService: backendApiService,
                  private router: Router,
                  private dataTransferService: DataTransferService
      ){}





    performSearch() {
    const term = this.searchInput?.toLowerCase().trim();
    this.searchPerformed = true;

    if (!term) {
      this.searchResults = [];
      return;
    }
    /*
    this.searchResults = this.cleanData.filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(term)
      )
    );*/
  }

}
