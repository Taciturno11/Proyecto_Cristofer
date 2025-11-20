import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { OrderService } from '../../orders/services/order.service';
import { CartService } from '../../../services/cart.service';
import { OrderRequest, OrderItemRequest, DeliveryMethod, PaymentMethod } from '../../../models/order.model';

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

@Component({
  selector: 'app-order-confirmation',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <ol class="flex items-center space-x-2">
          <li><a (click)="goToCart()" class="text-[#a81b8d] hover:underline cursor-pointer">Carrito</a></li>
          <li class="text-gray-400">/</li>
          <li><a (click)="goToAddress()" class="text-[#a81b8d] hover:underline cursor-pointer">Dirección de entrega</a></li>
          <li class="text-gray-400">/</li>
          <li><a (click)="goToPayment()" class="text-[#a81b8d] hover:underline cursor-pointer">Método de pago</a></li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 font-medium">Confirmación</li>
        </ol>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-8">Confirma tu pedido</h1>
      
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda: Detalles del pedido -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Productos del pedido -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Productos ({{ getTotalItems() }})
            </h2>
            
            <div class="space-y-4">
              @for (item of orderItems; track item.id) {
                <div class="flex items-center space-x-4 pb-4 border-b border-gray-100 last:border-b-0 last:pb-0">
                  @if (item.image) {
                    <img 
                      [src]="item.image" 
                      [alt]="item.name"
                      class="h-16 w-16 object-cover rounded-md border flex-shrink-0"
                      onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                    />
                    <div class="h-16 w-16 bg-gray-200 rounded-md border items-center justify-center text-xl flex-shrink-0 hidden">📦</div>
                  } @else {
                    <div class="h-16 w-16 bg-gray-200 rounded-md border flex items-center justify-center text-xl flex-shrink-0">📦</div>
                  }
                  <div class="flex-1">
                    <h3 class="font-medium text-gray-900">{{ item.name }}</h3>
                    <p class="text-sm text-gray-600">Cantidad: {{ item.quantity }}</p>
                    <p class="text-sm font-medium text-[#a81b8d]">S/ {{ item.price.toFixed(2) }} c/u</p>
                  </div>
                  <div class="text-right">
                    <p class="font-semibold text-gray-900">S/ {{ (item.price * item.quantity).toFixed(2) }}</p>
                  </div>
                </div>
              }
            </div>
          </div>
          
          <!-- Información de entrega -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Información de entrega</h2>
              <button (click)="goToAddress()" class="text-sm text-[#a81b8d] hover:underline">
                Cambiar
              </button>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- Dirección -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Dirección</h3>
                <div class="text-sm text-gray-900">
                  <p class="font-medium">Casa</p>
                  <p>Av. Javier Prado 1234</p>
                  <p>San Isidro</p>
                  <p class="text-gray-600 mt-1">Ref: Casa blanca con reja negra</p>
                </div>
              </div>
              
              <!-- Tiempo de entrega -->
              <div>
                <h3 class="text-sm font-medium text-gray-700 mb-2">Tiempo estimado</h3>
                <div class="flex items-center space-x-2">
                  <svg class="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                  </svg>
                  <span class="text-sm font-medium text-green-800">30-45 minutos</span>
                </div>
                <p class="text-xs text-gray-600 mt-1">Desde la confirmación del pago</p>
              </div>
            </div>
          </div>
          
          <!-- Método de pago -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-xl font-semibold text-gray-900">Método de pago</h2>
              <button (click)="goToPayment()" class="text-sm text-[#a81b8d] hover:underline">
                Cambiar
              </button>
            </div>
            
            <div class="flex items-center space-x-3">
              <img src="assets/icons/logo-yape.webp" alt="Yape" class="h-8 w-auto" />
              <div>
                <p class="font-medium text-gray-900">Yape</p>
                <p class="text-sm text-gray-600">Pago con celular</p>
              </div>
            </div>
          </div>
          
          <!-- Notas adicionales -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
              </svg>
              <div class="text-sm">
                <h4 class="font-medium text-yellow-900 mb-1">Antes de confirmar tu pedido:</h4>
                <ul class="text-yellow-800 space-y-1">
                  <li>• Verifica que todos los productos y cantidades sean correctos</li>
                  <li>• Asegúrate de que la dirección de entrega sea la correcta</li>
                  <li>• Ten tu celular listo para el pago con Yape</li>
                  <li>• Nuestro repartidor se comunicará contigo antes de llegar</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Columna derecha: Resumen final -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen final</h3>
            
            <div class="space-y-3 mb-4">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal ({{ getTotalItems() }} productos)</span>
                <span class="font-medium">S/ {{ getSubtotal().toFixed(2) }}</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Costo de envío</span>
                <span class="font-medium text-green-600">Gratis</span>
              </div>
              
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">IGV (18%)</span>
                <span class="font-medium">S/ {{ getIGV().toFixed(2) }}</span>
              </div>
            </div>
            
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900">Total a pagar</span>
                <span class="text-2xl font-bold text-[#a81b8d]">S/ {{ getTotal().toFixed(2) }}</span>
              </div>
            </div>
            
            <!-- Tiempo estimado de entrega -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div class="text-center">
                <div class="flex items-center justify-center space-x-2 mb-1">
                  <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                  </svg>
                  <span class="text-sm font-medium text-green-800">Entrega rápida</span>
                </div>
                <p class="text-xs text-green-700">Tu pedido llegará en 30-45 min</p>
              </div>
            </div>
            
            <!-- Botón confirmar pedido -->
            <app-button
              [config]="{
                text: isProcessing ? 'Procesando...' : 'Confirmar y pagar',
                type: 'primary',
                size: 'lg'
              }"
              (buttonClick)="confirmOrder()"
              class="w-full mb-3"
            />
            
            <!-- Términos y condiciones -->
            <p class="text-xs text-gray-500 text-center">
              Al confirmar tu pedido, aceptas nuestros 
              <a href="/terminos" class="text-[#a81b8d] hover:underline">términos y condiciones</a>
              y 
              <a href="/politicas" class="text-[#a81b8d] hover:underline">política de privacidad</a>
            </p>
          </div>
        </div>
      </div>
      
      <!-- Botones de navegación -->
      <div class="mt-8 flex justify-between">
        <app-button
          [config]="{
            text: 'Volver al pago',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="goToPayment()"
        />
        
        <div class="flex items-center space-x-4">
          <span class="text-sm text-gray-600">Total: S/ {{ getTotal().toFixed(2) }}</span>
          <app-button
            [config]="{
              text: 'Confirmar pedido',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="confirmOrder()"
          />
        </div>
      </div>
    </div>
  `
})
export class OrderConfirmationComponent implements OnInit {
  isProcessing = false;
  
  orderItems: OrderItem[] = [
    {
      id: 1,
      name: 'Coca Cola 3L',
      price: 8.50,
      quantity: 2,
      image: 'assets/products/coca-cola-500ml.webp'
    },
    {
      id: 2,
      name: 'Pan Integral Bimbo',
      price: 4.20,
      quantity: 1,
      image: 'assets/products/pan-integral.webp'
    },
    {
      id: 3,
      name: 'Leche Evaporada Gloria',
      price: 3.80,
      quantity: 3,
      image: 'assets/products/leche-gloria-entera.webp'
    }
  ];

  deliveryCost = 0; // Gratis
  igvRate = 0.18;

  constructor(
    private router: Router,
    private orderService: OrderService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.loadCartData();
  }

  loadCartData(): void {
    // Cargar datos del carrito desde localStorage o servicio
    const cartData = localStorage.getItem('cart');
    const locationData = localStorage.getItem('deliveryLocation');
    
    if (cartData) {
      try {
        const cart = JSON.parse(cartData);
        // Mapear productos del carrito a orderItems
        this.orderItems = cart.items || [];
      } catch (e) {
        console.error('Error loading cart data:', e);
      }
    }
  }

  getTotalItems(): number {
    return this.orderItems.reduce((total, item) => total + item.quantity, 0);
  }

  getSubtotal(): number {
    return this.orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  }

  getIGV(): number {
    const subtotalWithShipping = this.getSubtotal() + this.deliveryCost;
    return subtotalWithShipping * this.igvRate;
  }

  getTotal(): number {
    return this.getSubtotal() + this.deliveryCost + this.getIGV();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToAddress(): void {
    this.router.navigate(['/cart/direccion']);
  }

  goToPayment(): void {
    this.router.navigate(['/cart/pago']);
  }

  confirmOrder(): void {
    this.isProcessing = true;
    
    // Preparar datos del pedido
    const orderRequest = this.prepareOrderRequest();
    
    // Crear pedido en el backend (esto descuenta automáticamente el inventario)
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Pedido creado exitosamente:', response);
        
        // Guardar información del pedido para la página de seguimiento
        this.saveOrderDataForTracking(response);
        
        // Limpiar carrito
        localStorage.removeItem('cart');
        
        // Redirigir a página de seguimiento
        if (response.order && response.order.id) {
          this.router.navigate(['/cart/seguimiento'], {
            queryParams: { orderId: response.order.id }
          });
        } else {
          // Fallback si no hay orderId
          this.router.navigate(['/cart/seguimiento']);
        }
        
        this.isProcessing = false;
      },
      error: (error) => {
        console.error('Error al crear pedido:', error);
        
        // Si el error es de autenticación (401), redirigir al login
        if (error.message?.includes('401') || error.message?.includes('autenticación') || error.message?.includes('permisos')) {
          alert('Debes iniciar sesión para confirmar tu pedido.');
          this.router.navigate(['/auth/login'], {
            queryParams: { returnUrl: '/cart/confirmacion' }
          });
        } else {
          // Para desarrollo/demo: permitir navegar al tracking incluso si falla
          console.warn('Modo demo: Navegando al tracking sin crear pedido en backend');
          this.saveOrderDataForTracking(null);
          this.router.navigate(['/cart/seguimiento']);
        }
        
        this.isProcessing = false;
      }
    });
  }
  
  saveOrderDataForTracking(response: any): void {
    // Guardar datos del pedido en localStorage para la página de seguimiento
    const trackingData = {
      orderId: response?.order?.id || null,
      items: this.orderItems,
      total: this.getTotal(),
      paymentMethod: localStorage.getItem('selectedPaymentMethod'),
      deliveryLocation: localStorage.getItem('deliveryLocation'),
      timestamp: new Date().toISOString()
    };
    
    localStorage.setItem('orderTrackingData', JSON.stringify(trackingData));
  }
  
  prepareOrderRequest(): OrderRequest {
    // Obtener datos del localStorage
    const paymentMethodData = localStorage.getItem('selectedPaymentMethod') || 'YAPE';
    const locationData = localStorage.getItem('deliveryLocation');
    const cartData = localStorage.getItem('cart');
    
    // Mapear método de pago
    const paymentMethodMap: { [key: string]: PaymentMethod } = {
      'YAPE': PaymentMethod.DIGITAL_WALLET,
      'PLIN': PaymentMethod.DIGITAL_WALLET,
      'CARD': PaymentMethod.CARD,
      'CASH': PaymentMethod.CASH
    };
    
    const paymentMethod = paymentMethodMap[paymentMethodData] || PaymentMethod.DIGITAL_WALLET;
    
    // Preparar items del pedido
    const orderItems: OrderItemRequest[] = this.orderItems.map(item => ({
      productId: item.id.toString(),
      quantity: item.quantity
    }));
    
    // Preparar dirección de entrega
    let deliveryAddress: any = {
      firstName: 'Usuario',
      lastName: 'Tambo',
      phoneNumber: '987654321',
      street: 'Av. Javier Prado 1234',
      district: 'San Isidro',
      province: 'Lima',
      department: 'Lima',
      references: 'Casa blanca con reja negra'
    };
    
    let latitude: number | undefined;
    let longitude: number | undefined;
    
    if (locationData) {
      try {
        const location = JSON.parse(locationData);
        latitude = location.lat;
        longitude = location.lng;
        deliveryAddress.street = location.address || deliveryAddress.street;
        deliveryAddress.district = location.district || deliveryAddress.district;
      } catch (e) {
        console.error('Error parsing location data:', e);
      }
    }
    
    const orderRequest: OrderRequest = {
      deliveryMethod: DeliveryMethod.HOME_DELIVERY,
      paymentMethod: paymentMethod,
      orderItems: orderItems,
      deliveryAddress: deliveryAddress,
      latitude: latitude,
      longitude: longitude
    };
    
    return orderRequest;
  }
}