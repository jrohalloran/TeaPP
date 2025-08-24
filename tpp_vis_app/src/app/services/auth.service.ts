/*** 
 * // Jennifer O'Halloran
 * // IBIX Thesis Project - TPP Visualisation
***/

/***
//----------------------------------------
// USER SERVICE FOP UPDATING THE USER NAME IN GUI

***/

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: any = null;

  constructor() {

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

}
