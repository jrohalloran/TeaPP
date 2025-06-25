
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {
    // You might load this from localStorage or an API call
    this.currentUser = JSON.parse(localStorage.getItem('user') || 'null');
  }

  getCurrentUser() {
    console.log("Current User: "+this.currentUser);
    return this.currentUser;
  }

  setCurrentUser(user: any){
    this.currentUser = user;
    console.log("User Set: "+user);
  }

  // Optionally provide an observable if user info might change
}
