import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../../shared/components/button.component';

interface OrderSummary {
  orderId: string;
  orderDate: Date;
  status: 'confirmed' | 'preparing' | 'on-way' | 'delivered';
  deliveryTime: string;
  total: number;
}

@Component({
  selector: 'app-order-summary',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      
      <!-- Header de éxito -->
      <div class="text-center mb-8">
        <div class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
          <svg class="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">¡Pedido confirmado!</h1>
        <p class="text-lg text-gray-600">
          Tu pedido <span class="font-semibold text-[#a81b8d]">#{{ orderSummary.orderId }}</span> ha sido procesado exitosamente
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Columna izquierda: Información del pedido -->
        <div class="lg:col-span-2 space-y-6">
          
          <!-- Estado del pedido -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Estado de tu pedido</h2>
            
            <div class="relative">
              <!-- Línea de progreso -->
              <div class="absolute left-4 top-6 bottom-6 w-0.5 bg-gray-200"></div>
              
              <div class="space-y-6">
                <!-- Pedido confirmado -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-sm font-medium text-gray-900">Pedido confirmado</h3>
                    <p class="text-sm text-gray-600">{{ formatDate(orderSummary.orderDate) }}</p>
                  </div>
                </div>
                
                <!-- Preparando pedido -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-sm font-medium text-gray-900">Preparando tu pedido</h3>
                    <p class="text-sm text-gray-600">Estimado: 15-20 minutos</p>
                  </div>
                </div>
                
                <!-- En camino -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-sm font-medium text-gray-500">En camino</h3>
                    <p class="text-sm text-gray-400">Te avisaremos cuando salga</p>
                  </div>
                </div>
                
                <!-- Entregado -->
                <div class="relative flex items-start">
                  <div class="flex-shrink-0">
                    <div class="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                      <svg class="w-4 h-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"/>
                      </svg>
                    </div>
                  </div>
                  <div class="ml-4">
                    <h3 class="text-sm font-medium text-gray-500">Entregado</h3>
                    <p class="text-sm text-gray-400">{{ orderSummary.deliveryTime }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Información de contacto -->
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="flex items-start space-x-3">
              <svg class="h-5 w-5 text-blue-600 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/>
              </svg>
              <div>
                <h4 class="font-medium text-blue-900 mb-1">¿Necesitas ayuda?</h4>
                <p class="text-sm text-blue-800 mb-2">
                  Nuestro equipo está listo para ayudarte con tu pedido
                </p>
                <div class="space-y-1">
                  <p class="text-sm text-blue-700">📞 WhatsApp: <span class="font-medium">+51 999 999 999</span></p>
                  <p class="text-sm text-blue-700">📧 Email: <span class="font-medium">soporte&#64;tambo.pe</span></p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- Dirección de entrega -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">Dirección de entrega</h2>
            <div class="flex items-start space-x-3">
              <svg class="h-5 w-5 text-gray-400 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
              </svg>
              <div>
                <p class="font-medium text-gray-900">Casa</p>
                <p class="text-gray-600">Av. Javier Prado 1234</p>
                <p class="text-gray-600">San Isidro</p>
                <p class="text-sm text-gray-500 mt-1">Ref: Casa blanca con reja negra</p>
              </div>
            </div>
          </div>
          
          <!-- Qué hacer mientras esperas -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 class="font-medium text-yellow-900 mb-2">Mientras esperas tu pedido:</h3>
            <ul class="text-sm text-yellow-800 space-y-1">
              <li>• Mantén tu celular cerca, te contactaremos por WhatsApp</li>
              <li>• Prepara el pago exacto si seleccionaste efectivo</li>
              <li>• Asegúrate de estar en la dirección de entrega</li>
              <li>• Puedes seguir el estado de tu pedido en tiempo real</li>
            </ul>
          </div>
        </div>
        
        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">Resumen del pedido</h3>
            
            <!-- Número de pedido -->
            <div class="bg-white rounded-lg p-3 mb-4 border">
              <div class="text-center">
                <p class="text-xs text-gray-500">Número de pedido</p>
                <p class="text-lg font-bold text-[#a81b8d]">#{{ orderSummary.orderId }}</p>
              </div>
            </div>
            
            <!-- Productos -->
            <div class="space-y-3 mb-4">
              <h4 class="text-sm font-medium text-gray-700">Productos:</h4>
              <div class="space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">2x Coca Cola 3L</span>
                  <span>S/ 17.00</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">1x Pan Integral</span>
                  <span>S/ 4.20</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-600">3x Leche Gloria</span>
                  <span>S/ 11.40</span>
                </div>
              </div>
            </div>
            
            <!-- Totales -->
            <div class="space-y-3 mb-4 pt-4 border-t">
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Subtotal</span>
                <span>S/ 32.60</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Envío</span>
                <span class="text-green-600">Gratis</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-600">IGV (18%)</span>
                <span>S/ 5.87</span>
              </div>
            </div>
            
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="font-semibold text-gray-900">Total pagado</span>
                <span class="text-xl font-bold text-[#a81b8d]">S/ {{ orderSummary.total.toFixed(2) }}</span>
              </div>
            </div>
            
            <!-- Método de pago -->
            <div class="bg-white rounded-lg p-3 mb-4 border">
              <div class="flex items-center space-x-3">
                <img src="assets/icons/logo-yape.webp" alt="Yape" class="h-6 w-auto" />
                <div>
                  <p class="text-sm font-medium text-gray-900">Yape</p>
                  <p class="text-xs text-gray-500">Pago completado</p>
                </div>
              </div>
            </div>
            
            <!-- Tiempo estimado -->
            <div class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
              <div class="flex items-center space-x-2">
                <svg class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <div>
                  <p class="text-sm font-medium text-green-800">Tiempo estimado</p>
                  <p class="text-xs text-green-700">{{ orderSummary.deliveryTime }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Botones de acción -->
      <div class="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
        <app-button
          [config]="{
            text: 'Ver mis pedidos',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="goToOrders()"
        />
        
        <app-button
          [config]="{
            text: 'Seguir comprando',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="goToProducts()"
        />
        
        <app-button
          [config]="{
            text: 'Compartir pedido',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="shareOrder()"
        />
      </div>
      
      <!-- Información adicional -->
      <div class="mt-8 text-center">
        <p class="text-sm text-gray-500">
          ¿Tienes alguna pregunta sobre tu pedido? 
          <a href="/contact" class="text-[#a81b8d] hover:underline">Contáctanos</a>
        </p>
      </div>
    </div>
  `
})
export class OrderSummaryComponent {
  orderSummary: OrderSummary = {
    orderId: 'TB-' + Math.random().toString(36).substr(2, 8).toUpperCase(),
    orderDate: new Date(),
    status: 'confirmed',
    deliveryTime: '30-45 minutos',
    total: 38.47
  };

  formatDate(date: Date): string {
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return date.toLocaleDateString('es-PE', options);
  }

  goToOrders(): void {
    window.location.href = '/orders';
  }

  goToProducts(): void {
    window.location.href = '/products';
  }

  shareOrder(): void {
    const text = `¡Acabo de hacer mi pedido #${this.orderSummary.orderId} en Tambo! 🛒✨`;
    const url = window.location.href;
    
    if (navigator.share) {
      navigator.share({
        title: 'Mi pedido en Tambo',
        text: text,
        url: url
      });
    } else {
      // Fallback para navegadores que no soportan Web Share API
      const shareUrl = `https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`;
      window.open(shareUrl, '_blank');
    }
  }
}