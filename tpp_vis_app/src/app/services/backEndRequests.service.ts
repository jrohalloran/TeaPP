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

  getJSON(): Observable<any> {
    return this.http.get(`${this.apiUrl}/getJSON`);
  }

  /// NEO4J API REQUESTS 

  // GET REQUESTS 
  getAllNodesEdges(): Observable<any> {
    console.log("Retrieving all Nodes and Edges");
    return this.http.get(`${this.apiUrl}/getAllNodesEdges`);
  }

  // POST REQUESTS 
  getNuclearFamily2(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getNuclearFamily");
    return this.http.post(`${this.apiUrl}/getNuclearFamily2`,nodeID);
  }

  getWholeFamily(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getWholeFamily");
    return this.http.post(`${this.apiUrl}/getWholeFamily`,nodeID);
  }

  getPedigree(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getPedigree");
    return this.http.post(`${this.apiUrl}/getPedigree`,nodeID);
  }

  getPartnerOf(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getPartnerOf");
    return this.http.post(`${this.apiUrl}/getPartnerOf`,nodeID);
  }




  /// POSTGRES API REQUESTS 
  getAllPlants(): Observable<any> {
    console.log("Retrieving all Nodes and Edges");
    return this.http.get(`${this.apiUrl}/getAllPlants`);
  }

  getSelectedPlantPG(nodeID: any): Observable<any> {
    console.log("Retrieving all Nodes and Edges");
    return this.http.post(`${this.apiUrl}/getSelectedPlant`, nodeID);
  }

  
}
