import { Routes } from '@angular/router';
import { AdminGuard } from '../../core/guards/admin.guard';

export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () => import('../../layout/admin-layout/admin-layout.component').then(c => c.AdminLayoutComponent),
    canActivate: [AdminGuard], // Solo administradores
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard.component').then(c => c.DashboardComponent)
      },
      {
        path: 'brands',
        loadComponent: () => import('./pages/brands-management.component').then(c => c.BrandsManagementComponent)
      },
      {
        path: 'categories',
        loadComponent: () => import('./pages/categories-management.component').then(c => c.CategoriesManagementComponent)
      },
      {
        path: 'discounts',
        loadComponent: () => import('./pages/discounts-management.component').then(c => c.DiscountsManagementComponent)
      },
      {
        path: 'products',
        loadComponent: () => import('./pages/products-management.component').then(c => c.ProductsManagementComponent)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/orders-management.component').then(c => c.OrdersManagementComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./pages/users-management.component').then(c => c.UsersManagementComponent)
      }
    ]
  }
];
