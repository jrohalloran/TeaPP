import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DisplayComponent } from './display/display';
import { HomeComponent } from './home/home';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: '**', redirectTo: 'login' }, 
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'display', component: DisplayComponent}
];