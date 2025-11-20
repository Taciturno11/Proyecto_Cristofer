import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Order, OrderRequest, OrderStatus } from '../../../models/order.model';
import { API_ENDPOINTS } from '../../../constants/app.constants';

// DTOs para respuestas del backend
export interface OrderResponse {
  code: number;
  message: string;
  order?: Order;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  // ============================== CLIENTE - PEDIDOS ==============================

  /**
   * Crear un nuevo pedido
   */
  createOrder(orderData: OrderRequest): Observable<OrderResponse> {
    return this.http
      .post<OrderResponse>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.CREATE}`,
        orderData
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener pedidos del usuario actual
   */
  getUserOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(
        `${API_ENDPOINTS.BASE_URL}/user/order` // Endpoint correcto para obtener pedidos del usuario
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener perfil del usuario autenticado
   */
  getUserProfile(): Observable<any> {
    return this.http
      .get<any>(`${API_ENDPOINTS.BASE_URL}/user/profile`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener detalles de un pedido específico
   */
  getOrderById(orderId: string): Observable<Order> {
    return this.http
      .get<Order>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.CREATE}/${orderId}`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Descargar boleta PDF de un pedido
   */
  downloadBoleta(orderId: string): Observable<Blob> {
    return this.http
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.BOLETA}/${orderId}/boleta`,
        {
          responseType: 'blob',
          headers: new HttpHeaders({
            'Content-Type': 'application/pdf',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Descargar factura PDF de un pedido
   */
  downloadFactura(orderId: string): Observable<Blob> {
    return this.http
      .get(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.FACTURA}/${orderId}/factura`,
        {
          responseType: 'blob',
          headers: new HttpHeaders({
            'Content-Type': 'application/pdf',
          }),
        }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Cancelar un pedido
   */
  cancelOrder(orderId: string): Observable<Order> {
    return this.http
      .put<Order>(
        `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ORDERS.CREATE}/${orderId}/cancel`,
        {}
      )
      .pipe(catchError(this.handleError));
  }

  // ============================== ADMIN - GESTIÓN DE PEDIDOS ==============================

  /**
   * Obtener todos los pedidos (admin)
   */
  getAllOrders(): Observable<Order[]> {
    return this.http
      .get<Order[]>(
        `${API_ENDPOINTS.BASE_URL}${
          API_ENDPOINTS.ADMIN.ORDERS_ALL || '/admin/orders'
        }`
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Actualizar estado de un pedido (admin)
   */
  updateOrderStatus(
    orderId: string,
    newStatus: OrderStatus
  ): Observable<Order> {
    return this.http
      .put<Order>(`${API_ENDPOINTS.BASE_URL}/admin/orders/${orderId}/status`, {
        status: newStatus,
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener pedidos filtrados por estado (admin)
   */
  getOrdersByStatus(status: OrderStatus): Observable<Order[]> {
    let params = new HttpParams().set('status', status);

    return this.http
      .get<Order[]>(`${API_ENDPOINTS.BASE_URL}/admin/orders`, { params })
      .pipe(catchError(this.handleError));
  }

  /**
   * Obtener estadísticas de pedidos (admin)
   */
  getOrderStatistics(): Observable<any> {
    return this.http
      .get<any>(`${API_ENDPOINTS.BASE_URL}/admin/orders/statistics`)
      .pipe(catchError(this.handleError));
  }

  /**
   * Asignar repartidor a un pedido (admin)
   */
  assignDeliveryPerson(
    orderId: string,
    deliveryPersonId: string
  ): Observable<Order> {
    return this.http
      .put<Order>(
        `${API_ENDPOINTS.BASE_URL}/admin/orders/${orderId}/assign-delivery`,
        { deliveryPersonId }
      )
      .pipe(catchError(this.handleError));
  }

  // ============================== UTILIDADES ==============================

  /**
   * Calcular el total de un pedido con descuentos
   */
  calculateOrderTotal(orderItems: any[], discountPercentage?: number): number {
    const subtotal = orderItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    if (discountPercentage) {
      return subtotal - (subtotal * discountPercentage) / 100;
    }

    return subtotal;
  }

  /**
   * Validar si un pedido se puede cancelar
   */
  canCancelOrder(order: Order): boolean {
    const cancelableStatuses: OrderStatus[] = [
      OrderStatus.PENDING,
      OrderStatus.CONFIRMED,
    ];
    return cancelableStatuses.includes(order.orderStatus);
  }

  /**
   * Obtener el color del estado para la UI
   */
  getStatusColor(status: OrderStatus): string {
    const statusColors: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'text-yellow-600 bg-yellow-100',
      [OrderStatus.CONFIRMED]: 'text-blue-600 bg-blue-100',
      [OrderStatus.PREPARING]: 'text-purple-600 bg-purple-100',
      [OrderStatus.OUT_FOR_DELIVERY]: 'text-orange-600 bg-orange-100',
      [OrderStatus.DELIVERED]: 'text-green-600 bg-green-100',
      [OrderStatus.CANCELLED]: 'text-red-600 bg-red-100',
    };

    return statusColors[status] || 'text-gray-600 bg-gray-100';
  }

  /**
   * Obtener texto amigable del estado
   */
  getStatusText(status: OrderStatus): string {
    const statusTexts: { [key in OrderStatus]: string } = {
      [OrderStatus.PENDING]: 'Pendiente',
      [OrderStatus.CONFIRMED]: 'Confirmado',
      [OrderStatus.PREPARING]: 'Preparando',
      [OrderStatus.OUT_FOR_DELIVERY]: 'En camino',
      [OrderStatus.DELIVERED]: 'Entregado',
      [OrderStatus.CANCELLED]: 'Cancelado',
    };

    return statusTexts[status] || 'Desconocido';
  }

  // ============================== MANEJO DE ERRORES ==============================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';

    if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor';
    } else if (error.status === 401) {
      errorMessage = 'No tienes permisos para realizar esta acción';
    } else if (error.status === 403) {
      errorMessage = 'Acceso denegado';
    } else if (error.status === 404) {
      errorMessage = 'Pedido no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('Order Service Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
