import { Routes } from '@angular/router';

export const ABOUT_US_ROUTES: Routes = [
  {
    path: 'legals',
    loadComponent: () => import('./pages/legals.component').then(c => c.LegalsComponent)
  },
  // TODO: Agregar estas rutas cuando crees los componentes:
  // {
  //   path: 'terms',
  //   loadComponent: () => import('./features/about-us/pages/terms.component').then(c => c.TermsComponent)
  // },
  // {
  //   path: 'dispatch-areas',
  //   loadComponent: () => import('./features/about-us/pages/dispatch-areas.component').then(c => c.DispatchAreasComponent)
  // },
  // {
  //   path: 'vouchers',
  //   loadComponent: () => import('./features/about-us/pages/vouchers.component').then(c => c.VouchersComponent)
  // },
  // {
  //   path: 'privacity',
  //   loadComponent: () => import('./features/about-us/pages/privacity.component').then(c => c.PrivacityComponent)
  // },
  // {
  //   path: 'contact',
  //   loadComponent: () => import('./features/about-us/pages/contact.component').then(c => c.ContactComponent)
  // },
  // Ruta por defecto para /about-us
  {
    path: '',
    redirectTo: 'legals',
    pathMatch: 'full'
  }
];
