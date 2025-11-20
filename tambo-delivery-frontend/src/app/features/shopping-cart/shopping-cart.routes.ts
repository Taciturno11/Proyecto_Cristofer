import { Routes } from '@angular/router';
import { AuthGuard } from '../../core/guards/auth.guard';

export const CART_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/shopping-cart.component').then(
        (c) => c.ShoppingCartComponent
      ),
  },
  {
    path: 'ubicacion',
    loadComponent: () =>
      import('./pages/store-location.component').then(
        (c) => c.StoreLocationComponent
      ),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  {
    path: 'direccion',
    loadComponent: () =>
      import('./pages/delivery-address.component').then(
        (c) => c.DeliveryAddressComponent
      ),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  {
    path: 'pago',
    loadComponent: () =>
      import('./pages/payment-method.component').then(
        (c) => c.PaymentMethodComponent
      ),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  // Ruta de confirmación eliminada - ahora payment-method maneja todo el proceso
  // {
  //   path: 'confirmacion',
  //   loadComponent: () => import('./pages/order-confirmation.component').then(c => c.OrderConfirmationComponent),
  //   canActivate: [AuthGuard]
  // },
  {
    path: 'resumen',
    loadComponent: () =>
      import('./pages/order-summary.component').then(
        (c) => c.OrderSummaryComponent
      ),
    canActivate: [AuthGuard], // Requiere autenticación
  },
  {
    path: 'seguimiento',
    loadComponent: () =>
      import('./pages/order-tracking.component').then(
        (c) => c.OrderTrackingComponent
      ),
    canActivate: [AuthGuard], // Requiere autenticación
  },
];
