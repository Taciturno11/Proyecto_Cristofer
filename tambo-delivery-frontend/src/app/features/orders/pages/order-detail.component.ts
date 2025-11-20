import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container mx-auto px-4 py-8">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Detalle del Pedido</h1>
      
      <div class="text-center py-12">
        <h3 class="text-lg font-medium text-gray-900 mb-2">Pedido en desarrollo</h3>
        <p class="text-gray-600">Esta funcionalidad estará disponible pronto.</p>
      </div>
    </div>
  `
})
export class OrderDetailComponent {}
