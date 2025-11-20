import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { OrderService } from '../services/order.service';
import { Order, OrderStatus } from '../../../models/order.model';

@Component({
  selector: 'app-orders-list',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  styles: [`
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mis Pedidos</h1>
        <p class="text-gray-600">Historial de tus compras</p>
      </div>

      @if (loading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else if (orders.length > 0) {
        <!-- Lista de pedidos -->
        <div class="space-y-6">
          @for (order of orders; track order.id) {
            <div class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition">
              <!-- Header del pedido -->
              <div class="bg-gradient-to-r from-[#a81b8d] to-[#8b1574] px-6 py-4">
                <div class="flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <p class="text-sm text-pink-100">Pedido realizado el</p>
                    <p class="font-bold text-white text-lg">{{ formatDate(order.orderDate) }}</p>
                  </div>
                  <div class="text-right">
                    <p class="text-sm text-pink-100">Total</p>
                    <p class="text-2xl font-bold text-white">S/ {{ order.totalAmount.toFixed(2) }}</p>
                  </div>
                </div>
              </div>

              <!-- Productos del pedido -->
              <div class="p-6">
                <h3 class="text-lg font-semibold text-gray-900 mb-4">Productos</h3>
                <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  @for (item of (order.orderItemList || order.orderItems || []); track item.id) {
                    <div class="border border-gray-200 rounded-lg p-3 hover:border-[#a81b8d] transition">
                      @if (item.product.thumbnail || item.product.resources?.[0]?.url) {
                        <img 
                          [src]="item.product.thumbnail || item.product.resources?.[0]?.url" 
                          [alt]="item.product.name"
                          class="w-full h-32 object-cover rounded-lg mb-2"
                        />
                      } @else {
                        <div class="w-full h-32 bg-gray-200 rounded-lg flex items-center justify-center mb-2">
                          <span class="text-4xl">📦</span>
                        </div>
                      }
                      <p class="font-medium text-gray-900 text-sm line-clamp-2 mb-1">{{ item.product.name }}</p>
                      <div class="flex items-center justify-between text-xs text-gray-600">
                        <span>Cant: {{ item.quantity }}</span>
                        <span class="font-bold text-[#a81b8d]">S/ {{ ((item.itemPrice || item.price || 0) * item.quantity).toFixed(2) }}</span>
                      </div>
                    </div>
                  }
                </div>

                <!-- Botón ver detalles -->
                <div class="mt-6 pt-4 border-t border-gray-200">
                  <app-button
                    [config]="{
                      text: 'Ver detalles del pedido',
                      type: 'primary',
                      size: 'md'
                    }"
                    (buttonClick)="viewOrderDetails(order)"
                    class="w-full"
                  />
                </div>
              </div>
            </div>
          }
        </div>
      } @else {
        <!-- Estado vacío -->
        <div class="text-center py-12">
          <div class="text-gray-400 mb-4">
            <svg class="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/>
            </svg>
          </div>
          <h3 class="text-lg font-medium text-gray-900 mb-2">No tienes pedidos aún</h3>
          <p class="text-gray-600 mb-6">Cuando realices tu primer pedido, aparecerá aquí.</p>
          <app-button
            [config]="{
              text: 'Ir a la tienda',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="goToStore()"
          />
        </div>
      }
    </div>
  `
})
export class OrdersListComponent implements OnInit {
  orders: Order[] = [];
  loading = true;

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.loading = true;
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.loading = false;
        console.log('✅ Pedidos cargados desde el backend:', orders);
        
        // Debug: Ver la primera orden en detalle
        if (orders.length > 0) {
          console.log('📅 Primera orden - orderDate:', orders[0].orderDate);
          console.log('📅 Tipo de orderDate:', typeof orders[0].orderDate);
          console.log('📅 orderDate completo:', JSON.stringify(orders[0]));
        }
      },
      error: (error) => {
        console.error('❌ Error loading orders from API:', error);
        this.loading = false;
        this.orders = [];
      }
    });
  }

  formatDate(date: Date | string): string {
    if (!date) return 'Fecha no disponible';
    
    // Convertir a Date si es string
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    
    // Verificar si es una fecha válida
    if (isNaN(dateObj.getTime())) {
      console.error('Fecha inválida:', date);
      return 'Fecha inválida';
    }
    
    return dateObj.toLocaleDateString('es-PE', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Lima'
    });
  }

  viewOrderDetails(order: Order): void {
    // Navegar a la página de seguimiento con el orderId
    this.router.navigate(['/cart/seguimiento'], { queryParams: { orderId: order.id } });
  }

  goToStore(): void {
    this.router.navigate(['/products']);
  }
}
