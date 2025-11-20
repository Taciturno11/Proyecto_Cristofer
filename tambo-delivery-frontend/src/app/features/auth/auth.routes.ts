import { Routes } from '@angular/router';
import { AuthLayoutComponent } from '../../layout/auth-layout/auth-layout.component';

export const AUTH_ROUTES: Routes = [
  {
    path: '',
    component: AuthLayoutComponent, // Layout especial para auth
    children: [
      {
        path: 'login',
        loadComponent: () => import('./pages/login.component').then(c => c.LoginComponent)
      },
      {
        path: 'register',
        loadComponent: () => import('./pages/register.component').then(c => c.RegisterComponent)
      },
      {
        path: 'verify',
        loadComponent: () => import('./pages/verify.component').then(c => c.VerifyComponent)
      },
      {
        path: '',
        redirectTo: 'login',
        pathMatch: 'full'
      }
    ]
  }
];
