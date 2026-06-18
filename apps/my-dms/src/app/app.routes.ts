import { Route } from '@angular/router';
import { AppLoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { AuthGuard } from '@alfresco/adf-core';

export const appRoutes: Route[] = [
  {
    path: 'login',
    component: AppLoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }
];




