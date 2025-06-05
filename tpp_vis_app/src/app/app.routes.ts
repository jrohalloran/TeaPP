import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DisplayComponent } from './display/display';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'display', component: DisplayComponent },
  //{ path: '**', redirectTo: '/login' }
];