import { Routes } from '@angular/router';

export const PRODUCTS_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/products-list.component').then(c => c.ProductsListComponent)
  },
  {
    path: 'categoria/:categoryId',
    loadComponent: () => import('./pages/products-list.component').then(c => c.ProductsListComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./pages/product-detail.component').then(c => c.ProductDetailComponent)
  }
];
