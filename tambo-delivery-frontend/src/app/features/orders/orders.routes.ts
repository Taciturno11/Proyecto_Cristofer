import { Routes } from '@angular/router';

export const ORDERS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/orders-list.component').then(c => c.OrdersListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/order-detail.component').then(c => c.OrderDetailComponent)
  }
];
