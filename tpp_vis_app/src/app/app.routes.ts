import { Routes } from '@angular/router';
//import { LoginComponent } from './login/login';
import { DisplayComponent } from './display/display';
import { HomeComponent } from './home/home';
import { UploadComponent } from './upload-page/upload-page';
import { LandingPage } from './landing-page/landing-page';
import { Profile } from './profile/profile';

export const routes: Routes = [
  { path: '', redirectTo: 'landing-page', pathMatch: 'full' },
  { path: 'upload-page', component: UploadComponent },
  { path: 'landing-page', component: LandingPage },
  { path: 'home', component: HomeComponent },
  { path: 'display', component: DisplayComponent},
  { path: 'profile', component: Profile}
];