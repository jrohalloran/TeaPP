import { Routes } from '@angular/router';
import { LoginComponent } from './login/login';
import { DisplayComponent } from './display/display';
import { HomeComponent } from './home/home';
import { UploadComponent } from './upload-page/upload-page';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  //{ path: '**', redirectTo: 'login' }, 
  { path: 'login', component: LoginComponent },
  { path: 'upload-page', component: UploadComponent },
  { path: 'home', component: HomeComponent },
  { path: 'display', component: DisplayComponent}
];