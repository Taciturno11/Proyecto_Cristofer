import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { OrderService } from '../../orders/services/order.service';
import { Order, OrderStatus } from '../../../models/order.model';

// Interfaz para el display de órdenes con propiedades adicionales
interface OrderDisplay extends Order {
  orderNumber: string;
  status: OrderStatus;
  items: { id: string; product: { name: string }; quantity: number; price: number }[];
}

@Component({
  selector: 'app-orders-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">Gestión de Pedidos</h1>
          <p class="text-gray-600">Administra todos los pedidos de Tambo Delivery</p>
        </div>
        <div class="flex gap-3">
          <button
            (click)="refreshOrders()"
            class="px-4 py-2 text-[#a81b8d] bg-white border border-[#a81b8d] rounded-lg hover:bg-[#a81b8d] hover:text-white transition-colors"
          >
            🔄 Actualizar
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="text-2xl font-bold text-blue-600">{{ orderStats.pending }}</div>
          <div class="text-sm text-gray-600">Pendientes</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="text-2xl font-bold text-yellow-600">{{ orderStats.preparing }}</div>
          <div class="text-sm text-gray-600">En Preparación</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="text-2xl font-bold text-orange-600">{{ orderStats.delivering }}</div>
          <div class="text-sm text-gray-600">En Camino</div>
        </div>
        <div class="bg-white p-4 rounded-lg shadow-md">
          <div class="text-2xl font-bold text-green-600">{{ orderStats.delivered }}</div>
          <div class="text-sm text-gray-600">Entregados Hoy</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar por ID, cliente..."
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
          <div>
            <select
              [(ngModel)]="selectedStatus"
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Todos los estados</option>
              <option value="PENDING">Pendientes</option>
              <option value="CONFIRMED">Confirmados</option>
              <option value="PREPARING">En Preparación</option>
              <option value="READY">Listos</option>
              <option value="DELIVERING">En Camino</option>
              <option value="DELIVERED">Entregados</option>
              <option value="CANCELLED">Cancelados</option>
            </select>
          </div>
          <div>
            <input
              type="date"
              [(ngModel)]="selectedDate"
              (change)="applyFilters()"
              class="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"></div>
        </div>
      } @else {
        <!-- Orders List -->
        <div class="space-y-4">
          @if (filteredOrders.length === 0) {
            <div class="bg-white p-12 rounded-lg shadow-md text-center text-gray-500">
              @if (searchTerm || selectedStatus || selectedDate) {
                No se encontraron pedidos que coincidan con los filtros
              } @else {
                No hay pedidos disponibles
              }
            </div>
          } @else {
            @for (order of filteredOrders; track order.id) {
              <div class="bg-white rounded-lg shadow-md overflow-hidden">
                <div class="p-6">
                  <div class="flex justify-between items-start mb-4">
                    <div>
                      <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-800">Pedido #{{ order.orderNumber }}</h3>
                        <span 
                          class="px-3 py-1 text-xs font-medium rounded-full"
                          [class]="getStatusBadgeClass(order.status)"
                        >
                          {{ getStatusText(order.status) }}
                        </span>
                      </div>
                      <div class="text-sm text-gray-600 space-y-1">
                        <div>Cliente: {{ order.user?.firstName }} {{ order.user?.lastName }}</div>
                        <div>Email: {{ order.user?.email }}</div>
                        <div>Teléfono: {{ order.user?.phoneNumber || 'No especificado' }}</div>
                        <div>Fecha: {{ formatDate(order.orderDate) }}</div>
                      </div>
                    </div>
                    <div class="text-right">
                      <div class="text-2xl font-bold text-[#a81b8d]">S/ {{ order.totalAmount.toFixed(2) }}</div>
                      <div class="text-sm text-gray-600">{{ order.items.length }} item(s)</div>
                    </div>
                  </div>

                  <!-- Order Items -->
                  <div class="border-t pt-4 mb-4">
                    <h4 class="font-medium text-gray-800 mb-2">Productos:</h4>
                    <div class="space-y-2">
                      @for (item of order.items; track item.id) {
                        <div class="flex justify-between items-center text-sm">
                          <span>{{ item.product.name }} x{{ item.quantity }}</span>
                          <span class="font-medium">S/ {{ (item.price * item.quantity).toFixed(2) }}</span>
                        </div>
                      }
                    </div>
                  </div>

                  <!-- Actions -->
                  <div class="flex gap-2 pt-4 border-t">
                    @if (order.status === 'PENDING') {
                      <button
                        (click)="updateOrderStatus(order, OrderStatus.CONFIRMED)"
                        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        Confirmar
                      </button>
                      <button
                        (click)="updateOrderStatus(order, OrderStatus.CANCELLED)"
                        class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        Cancelar
                      </button>
                    }
                    @if (order.status === 'CONFIRMED') {
                      <button
                        (click)="updateOrderStatus(order, OrderStatus.PREPARING)"
                        class="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors text-sm"
                      >
                        Iniciar Preparación
                      </button>
                    }
                    @if (order.status === 'PREPARING') {
                      <button
                        (click)="updateOrderStatus(order, OrderStatus.OUT_FOR_DELIVERY)"
                        class="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm"
                      >
                        Marcar Listo
                      </button>
                    }
                    @if (order.status === 'OUT_FOR_DELIVERY') {
                      <button
                        (click)="updateOrderStatus(order, OrderStatus.DELIVERED)"
                        class="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        Marcar Entregado
                      </button>
                    }
                    <button
                      (click)="viewOrderDetails(order)"
                      class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            }
          }
        </div>
      }
    </div>
  `
})
export class OrdersManagementComponent implements OnInit, OnDestroy {
  orders: OrderDisplay[] = [];
  filteredOrders: OrderDisplay[] = [];
  isLoading = false;
  error: string | null = null;
  
  // Make enum available in template
  OrderStatus = OrderStatus;
  
  // Filters
  searchTerm = '';
  selectedStatus = '';
  selectedDate = '';
  
  // Statistics
  orderStats = {
    pending: 0,
    preparing: 0,
    delivering: 0,
    delivered: 0
  };
  
  private subscriptions: Subscription[] = [];

  constructor(
    private orderService: OrderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Carga todas las órdenes
   */
  private loadOrders(): void {
    this.isLoading = true;
    this.error = null;
    
    // Por ahora mostrar estado vacío hasta implementar OrderService
    setTimeout(() => {
      this.orders = [];
      this.calculateStats();
      this.applyFilters();
      this.isLoading = false;
    }, 500);
  }

  /**
   * Calcula las estadísticas de pedidos
   */
  private calculateStats(): void {
    const today = new Date().toDateString();
    
    this.orderStats = {
      pending: this.orders.filter(order => order.status === 'PENDING').length,
      preparing: this.orders.filter(order => order.status === 'PREPARING').length,
      delivering: this.orders.filter(order => order.status === 'OUT_FOR_DELIVERY').length,
      delivered: this.orders.filter(order => 
        order.status === 'DELIVERED' && 
        new Date(order.orderDate).toDateString() === today
      ).length
    };
  }

  /**
   * Aplica los filtros a la lista de órdenes
   */
  applyFilters(): void {
    let filtered = [...this.orders];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(order =>
        order.orderNumber.toLowerCase().includes(term) ||
        (order.user?.firstName?.toLowerCase().includes(term)) ||
        (order.user?.lastName?.toLowerCase().includes(term)) ||
        (order.user?.email?.toLowerCase().includes(term))
      );
    }

    // Filtro por estado
    if (this.selectedStatus) {
      filtered = filtered.filter(order => order.status === this.selectedStatus);
    }

    // Filtro por fecha
    if (this.selectedDate) {
      const filterDate = new Date(this.selectedDate).toDateString();
      filtered = filtered.filter(order => 
        new Date(order.orderDate).toDateString() === filterDate
      );
    }

    this.filteredOrders = filtered.sort((a, b) => 
      new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime()
    );
  }

  /**
   * Actualiza el estado de una orden
   */
  updateOrderStatus(order: OrderDisplay, newStatus: OrderStatus): void {
    if (confirm(`¿Estás seguro de cambiar el estado del pedido #${order.orderNumber}?`)) {
      // TODO: Implementar llamada al backend
      order.status = newStatus;
      order.orderStatus = newStatus; // También actualizar el campo original
      this.calculateStats();
      console.log(`Pedido ${order.orderNumber} actualizado a ${newStatus}`);
    }
  }

  /**
   * Muestra los detalles completos de una orden
   */
  viewOrderDetails(order: OrderDisplay): void {
    // TODO: Abrir modal con detalles completos
    alert(`Ver detalles del pedido #${order.orderNumber}`);
  }

  /**
   * Refresca la lista de órdenes
   */
  refreshOrders(): void {
    this.loadOrders();
  }

  /**
   * Obtiene la clase CSS para el badge de estado
   */
  getStatusBadgeClass(status: OrderStatus): string {
    const classes: Record<OrderStatus, string> = {
      'PENDING': 'bg-yellow-100 text-yellow-800',
      'CONFIRMED': 'bg-blue-100 text-blue-800',
      'PREPARING': 'bg-orange-100 text-orange-800',
      'OUT_FOR_DELIVERY': 'bg-indigo-100 text-indigo-800',
      'DELIVERED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800'
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  /**
   * Obtiene el texto del estado en español
   */
  getStatusText(status: OrderStatus): string {
    const texts: Record<OrderStatus, string> = {
      'PENDING': 'Pendiente',
      'CONFIRMED': 'Confirmado',
      'PREPARING': 'En Preparación',
      'OUT_FOR_DELIVERY': 'En Camino',
      'DELIVERED': 'Entregado',
      'CANCELLED': 'Cancelado'
    };
    return texts[status] || status;
  }

  /**
   * Formatea una fecha
   */
  formatDate(date: Date): string {
    return new Date(date).toLocaleString('es-PE');
  }

  /**
   * Vuelve al dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}