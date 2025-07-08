import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
 providedIn: 'root'
})
export class UploadService {
  //private uploadUrl = 'http://localhost:3333/uploadFile'; // Replace with your backend URL
  //private uploadEnvRAINUrl = 'http://localhost:3333/uploadEnvRAINFile'; 
  //private uploadEnvTEMPUrl = 'http://localhost:3333/uploadEnvTEMPFile'; 

  private uploadUrl = environment.uploadUrl;
  private uploadEnvRAINUrl = environment.uploadEnvRAINUrl;
  private uploadEnvTEMPUrl = environment.uploadEnvTEMPUrl;




  constructor(private httpClient: HttpClient) {}   

 uploadFile(file: File): Observable<any> {
   const formData = new FormData();
   formData.append('file', file);
   return this.httpClient.post(this.uploadUrl, formData);
 }

 uploadEnvRAINFile(file: File): Observable<any> {
   const formData = new FormData();
   formData.append('file', file);
   return this.httpClient.post(this.uploadEnvRAINUrl, formData);
 }


 uploadEnvTEMPFile(file: File): Observable<any> {
   const formData = new FormData();
   formData.append('file', file);
   return this.httpClient.post(this.uploadEnvTEMPUrl, formData);
 }
}