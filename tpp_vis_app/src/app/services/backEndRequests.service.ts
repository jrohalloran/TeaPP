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
  private imageBaseUrl = 'http://localhost:3333/kinshipImages';
  private imageKinshipBaseUrl = 'http://localhost:3333/calculatedKinship';
  private diagramsBaseUrl = 'http://localhost:3333/diagramImages';
  private rainfallBaseUrl = 'http://localhost:3333/rainfallImages';
  private temperatureBaseUrl = 'http://localhost:3333/temperatureImages';

  constructor(private http: HttpClient) {}



  /// --------------- AUTHENTICATION -------------------------


  getUsername(): Observable<any>{
        console.log("Getting Username");
        return this.http.get(`${this.apiUrl}/user`);

  }

  // Database Management 

   emptyPostgreSQL(): Observable<any>{
        console.log("Sending Emptying request to backend");
        return this.http.get(`${this.apiUrl}/emptyPostgreSQL`);

  }

  restartPostgreSQL(): Observable<any>{
        console.log("Sending PostgreSQL Restart request to backend");
        return this.http.get(`${this.apiUrl}/restartPostgreSQL`);

  }

  emptyNeo4j(): Observable<any>{
        console.log("Sending Emptying request to backend");
        return this.http.get(`${this.apiUrl}/emptyNeo4j`);

  }

  restartNeo4j(): Observable<any>{
        console.log("Sending Neo4j Restart request to backend");
        return this.http.get(`${this.apiUrl}/restartNeo4j`);

  }

  /// -------------- File processing requests ------------------

  processUploadFile(): Observable<any>{
        console.log("Sending Processing Request to back-end");
        return this.http.get(`${this.apiUrl}/processData`);

  }

  compareData(data:any[]): Observable<any>{
        console.log("Sending Processing Request to back-end");
        return this.http.post(`${this.apiUrl}/compareData`,data);

  }


  getCleanData(data:any[]): Observable<any>{
        console.log("Sending Processing Request to back-end");
        return this.http.post(`${this.apiUrl}/getCleanData`,data);

  }

  processPedigree(data:any[]): Observable<any>{
        console.log("Sending Synbreed Pedigree Processing Request to back-end");
        return this.http.post(`${this.apiUrl}/processPedigree`,data);

  }

  insertNeo4j(): Observable<any>{
        console.log("Sending Neo4j insertion Request to back-end");
        return this.http.get(`${this.apiUrl}/insertNeo4j`);

  }

  insertAdminNeo4j(): Observable<any>{
        console.log("Sending Neo4j insertion ADMIN Request to back-end");
        return this.http.get(`${this.apiUrl}/insertAdminNeo4j`);

  }

  updateParents(data:any[]):Observable<any> {
    console.log("Sending Data to /api/updateParents");
    return this.http.post(`${this.apiUrl}/updateParents`,data);
  }


  //---------------- STATS + SEARCHING------------------------


  getNeo4jStats(): Observable<any> {
    console.log("Getting /getNeo4jStats");
    return this.http.get(`${this.apiUrl}/getNeo4jStats`);
  }

  getPostgresStats(): Observable<any> {
    console.log("Getting /getPostgresStats");
    return this.http.get(`${this.apiUrl}/getPostgresStats`);

  }

  getPedigreeStats(): Observable<any> {
    console.log("Getting /getStats");
    return this.http.get(`${this.apiUrl}/getStats`);

  }

  searchID(ID:any[]): Observable<any> {
    console.log("Sending /searchID");
    return this.http.post(`${this.apiUrl}/searchID`,ID);

  }

  getDBStatus(): Observable<any> {
    console.log("Getting /getDBStatus");
    return this.http.get(`${this.apiUrl}/getDBStatus`);

  }

  // ------------- VISUALISATION ------------------
  /// NEO4J API REQUESTS 

  // GET REQUESTS 
  getAllNodesEdges(): Observable<any> {
    console.log("Retrieving all Nodes and Edges");
    return this.http.get(`${this.apiUrl}/getAllNodesEdges`);
  }
  /*
  // POST REQUESTS 
  getNuclearFamily2(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getNuclearFamily");
    return this.http.post(`${this.apiUrl}/getNuclearFamily2`,nodeID);
  }*/

  /*
  getWholeFamily(nodeID: string):Observable<any> {
    console.log("Sending Data to /api/getWholeFamily");
    return this.http.post(`${this.apiUrl}/getWholeFamily`,nodeID);
  }*/

  getPedigree(nodeID: any[]):Observable<any> {
    console.log("Sending Data to /api/getPedigree");
    return this.http.post(`${this.apiUrl}/getPedigree`,nodeID);
  }

  getUpdatedNodesEdges(data: any[]): Observable<any> {
    console.log("Retrieving Updated Nodes and Edges");
    return this.http.post(`${this.apiUrl}/getUpdatedNodesEdges`,data);
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



  // ------------ KINSHIP ANALYSIS -------------------

  getKinship(): Observable<any> {
    console.log("Retrieving Existing Kinship Data");
    return this.http.get(`${this.apiUrl}/getKinship`);
  }

  performKinship(email: string): Observable<any> {
    console.log("Requesting Kinhsip Analysis");
    return this.http.post(`${this.apiUrl}/performKinship`, email);
  }


  getImageUrl(fileName: string): string {
    return `${this.imageBaseUrl}/${fileName}`;
  }

  getKinshipUrl(fileName: string): string {
    return `${this.imageKinshipBaseUrl}/${fileName}`;
  }

  getDiagramUrl(fileName: string): string {
    return `${this.diagramsBaseUrl}/${fileName}`;
  }






  // ------------ ENVIRONMENTAL DATA  ---------------



  // RAINFALL
  getRainfallStats(): Observable<any> {
    console.log("Getting Rainfall Stats");
    return this.http.get(`${this.apiUrl}/getRainfallStats`);
  }

  processRainfallFile(): Observable<any> {
    console.log("Processing Rainfall File");
    return this.http.get(`${this.apiUrl}/processRainfallFile`);
  }


  getTempStats(): Observable<any> {
    console.log("Getting Temperature Stats");
    return this.http.get(`${this.apiUrl}/getTemperatureStats`);
  }

  processTempFile(): Observable<any> {
    console.log("Processing Temperature File");
    return this.http.get(`${this.apiUrl}/processTempFile`);
  }

  // IMAGE DISPLAY 
  getRainfallUrl(fileName: string): string {
    return `${this.rainfallBaseUrl}/${fileName}`;
  }

  getTempUrl(fileName: string): string {
    return `${this.temperatureBaseUrl}/${fileName}`;
  }

    // ------------ GENOMIC DATA  ---------------


  getGenomicData(): Observable<any> {
    console.log("Getting Genomic Table Entries");
    return this.http.get(`${this.apiUrl}/getGenomicData`);
  }

  processGenomFile(data: any): Observable<any> {
    console.log("Processing Genomic Data File");
    return this.http.post(`${this.apiUrl}/processGenomFile`, data);
  }

  performFastQC(data: any): Observable<any> {
    console.log("Performing FastQC");
    return this.http.post(`${this.apiUrl}/performFastQC`, data);
  }

  getHtmlReports() {
    return this.http.get<string[]>(`${this.apiUrl}/fastQCreports`);
  }

  
}

