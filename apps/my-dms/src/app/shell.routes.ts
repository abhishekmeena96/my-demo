import { Route } from '@angular/router';
import { AuthGuard } from '@alfresco/adf-core';
import { HomeComponent } from './components/home/home.component';

export const SHELL_ROUTES: Route[] = [
  {
    path: '',
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        component: HomeComponent
      },
      {
        path: 'home',
        component: HomeComponent
      }
      
    ]
  }
];