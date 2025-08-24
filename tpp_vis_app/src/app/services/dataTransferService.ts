

/*** 
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
//----------------------------------------
// SERVICE FOR SENDING DATA BETWEEN COMPONENTS

***/

import { Injectable } from '@angular/core';


@Injectable({ providedIn: 'root' })


export class DataTransferService {
  private responseData: any;

  setResponse(data: any) {
    this.responseData = data;
  }

  getResponse(): any {
    return this.responseData;
  }

  clearResponse() {
    this.responseData = null;
  }
}