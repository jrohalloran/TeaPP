/*** 
 * // Date: 05/06/2025
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
//----------------------------------------
// POST request service to backend Express Node API
// Makes Post Requests to Server.js via localhost
// PORT : 3333

***/

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';



@Injectable({
  providedIn: 'root',
})
export class backendApiService {
  private apiUrl = 'http://localhost:3333/api';

  constructor(private http: HttpClient) {}

  getTrial(): Observable<any> {
    return this.http.get(`${this.apiUrl}/trial`);
  }

  getJSON(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getJSON`);
  }

  /*
  getNuclearFamily(nodeID: string):Observable<any> {
    return this.http.post(`${this.apiUrl}/getNuclearFamily`,nodeID);
  }
  */
 
  getNuclearFamily2(nodeID: string):Observable<any> {
    return this.http.post(`${this.apiUrl}/getNuclearFamily2`,nodeID);
  }
}
