import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
 providedIn: 'root'
})
export class UploadService {
 private uploadUrl = 'http://localhost:3333/uploadFile'; // Replace with your backend URL

 constructor(private httpClient: HttpClient) {}

 uploadFile(file: File): Observable<any> {
   const formData = new FormData();
   formData.append('file', file);
   return this.httpClient.post(this.uploadUrl, formData);
 }
}