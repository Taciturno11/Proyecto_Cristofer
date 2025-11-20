import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { OrderService } from '../../orders/services/order.service';
import {
  Order,
  OrderStatus,
  DeliveryStatus,
} from '../../../models/order.model';

interface TrackingStep {
  status: OrderStatus;
  label: string;
  icon: string;
  completed: boolean;
  current: boolean;
}

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-6xl">
      <!-- Header -->
      <div class="text-center mb-8">
        <div
          class="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4"
        >
          <svg
            class="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 class="text-3xl font-bold text-gray-900 mb-2">
          ¡Pedido confirmado!
        </h1>
        <p class="text-gray-600">
          Tu pedido #{{ orderTrackingCode }} está en proceso
        </p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna izquierda: Tracking -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Tiempo estimado con moto animada -->
          <div
            class="bg-gradient-to-r from-[#a81b8d] to-[#8b1574] rounded-lg p-8 text-white relative overflow-hidden"
          >
            <!-- Decoración de fondo -->
            <div class="absolute inset-0 opacity-10">
              <div
                class="absolute -right-10 -top-10 w-40 h-40 bg-white rounded-full"
              ></div>
              <div
                class="absolute -left-10 -bottom-10 w-32 h-32 bg-white rounded-full"
              ></div>
            </div>

            <div class="relative z-10">
              <div class="flex items-center justify-between mb-6">
                <div>
                  <h2 class="text-2xl font-bold mb-2">
                    Tiempo estimado de entrega
                  </h2>
                  <p class="text-pink-100">Tu pedido está siendo preparado</p>
                </div>

                <!-- Icono de moto animado -->
                <div class="motorcycle-container">
                  <svg
                    class="w-20 h-20 motorcycle-icon"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M12,4C13.93,4 15.5,5.57 15.5,7.5C15.5,8.5 15.08,9.39 14.42,10L17,10C17.55,10 18,10.45 18,11C18,11.55 17.55,12 17,12L15,12L14,13L16.5,13C17.33,13 18,13.67 18,14.5C18,15.33 17.33,16 16.5,16L14,16L13,17L15.5,17C16.33,17 17,17.67 17,18.5C17,19.33 16.33,20 15.5,20L12,20C10.89,20 10,19.11 10,18L10,16.83C9.42,17.54 8.56,18 7.59,18C5.5,18 3.81,16.31 3.81,14.22C3.81,12.13 5.5,10.44 7.59,10.44C8.56,10.44 9.42,10.9 10,11.61L10,11C10,10.45 10.45,10 11,10L12.58,10C13.24,9.39 13.66,8.5 13.66,7.5C13.66,6.67 13.08,6 12.25,6C11.42,6 10.84,6.67 10.84,7.5L9,7.5C9,5.57 10.57,4 12.5,4M7.59,12.28C6.5,12.28 5.63,13.15 5.63,14.22C5.63,15.29 6.5,16.16 7.59,16.16C8.68,16.16 9.55,15.29 9.55,14.22C9.55,13.15 8.68,12.28 7.59,12.28M19,15C17.62,15 16.5,16.12 16.5,17.5C16.5,18.88 17.62,20 19,20C20.38,20 21.5,18.88 21.5,17.5C21.5,16.12 20.38,15 19,15M19,16.5C19.55,16.5 20,16.95 20,17.5C20,18.05 19.55,18.5 19,18.5C18.45,18.5 18,18.05 18,17.5C18,16.95 18.45,16.5 19,16.5Z"
                    />
                  </svg>
                </div>
              </div>

              <!-- Contador de tiempo -->
              <div
                class="bg-white/20 backdrop-blur-sm rounded-lg p-6 flex items-center justify-center"
              >
                <div class="text-center">
                  <div class="text-5xl font-bold mb-2">
                    {{ estimatedMinutes }}
                  </div>
                  <div class="text-lg text-pink-100">
                    minutos aproximadamente
                  </div>
                </div>
              </div>

              <div
                class="mt-4 flex items-center justify-center space-x-2 text-sm text-pink-100"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span
                  >Nuestro repartidor se comunicará contigo antes de
                  llegar</span
                >
              </div>
            </div>
          </div>

          <!-- Estado del pedido -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-6">
              Estado del pedido
            </h2>

            <!-- Timeline de estados -->
            <div class="space-y-4">
              @for (step of trackingSteps; track step.status; let last = $last)
              {
              <div class="flex items-start">
                <!-- Icono y línea -->
                <div class="flex flex-col items-center mr-4">
                  <div
                    class="flex items-center justify-center w-10 h-10 rounded-full transition-all duration-300"
                    [ngClass]="{
                      'bg-green-500 text-white': step.completed,
                      'bg-[#a81b8d] text-white animate-pulse': step.current,
                      'bg-gray-200 text-gray-400':
                        !step.completed && !step.current
                    }"
                  >
                    @if (step.completed) {
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    } @else {
                    <span [innerHTML]="step.icon"></span>
                    }
                  </div>
                  @if (!last) {
                  <div
                    class="w-0.5 h-16 mt-2 transition-all duration-300"
                    [ngClass]="{
                      'bg-green-500': step.completed,
                      'bg-gray-200': !step.completed
                    }"
                  ></div>
                  }
                </div>

                <!-- Información del paso -->
                <div class="flex-1 pt-1">
                  <h3
                    class="font-medium mb-1"
                    [ngClass]="{
                      'text-green-600': step.completed,
                      'text-[#a81b8d]': step.current,
                      'text-gray-400': !step.completed && !step.current
                    }"
                  >
                    {{ step.label }}
                  </h3>
                  <p class="text-sm text-gray-500">
                    @if (step.completed) {
                    <span class="text-green-600">✓ Completado</span>
                    } @else if (step.current) {
                    <span class="text-[#a81b8d] animate-pulse"
                      >En proceso...</span
                    >
                    } @else {
                    <span>Pendiente</span>
                    }
                  </p>
                </div>
              </div>
              }
            </div>
          </div>

          <!-- Información del repartidor (cuando esté en camino) -->
          @if (currentStatus === 'OUT_FOR_DELIVERY' && deliveryPerson) {
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-4">
                <div
                  class="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg"
                >
                  {{ deliveryPerson.firstName.charAt(0)
                  }}{{ deliveryPerson.lastName.charAt(0) }}
                </div>
                <div>
                  <h3 class="font-semibold text-gray-900">
                    {{ deliveryPerson.firstName }} {{ deliveryPerson.lastName }}
                  </h3>
                  <p class="text-sm text-gray-600">
                    {{ deliveryPerson.vehicleType }}
                  </p>
                </div>
              </div>
              <a
                [href]="'tel:' + deliveryPerson.phoneNumber"
                class="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span>Llamar</span>
              </a>
            </div>
          </div>
          }

          <!-- Detalles del pedido -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Detalles del pedido
            </h2>

            <div class="space-y-3">
              @if (orderItems && orderItems.length > 0) { @for (item of
              orderItems; track item.id) {
              <div
                class="flex items-center justify-between pb-3 border-b border-gray-100 last:border-b-0"
              >
                <div class="flex items-center space-x-3">
                  @if (item.image || item.product?.thumbnail ||
                  item.product?.resources?.[0]?.url) {
                  <img
                    [src]="item.image || item.product?.thumbnail || item.product?.resources?.[0]?.url"
                    [alt]="item.name"
                    class="w-12 h-12 object-cover rounded"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                  />
                  <div
                    class="w-12 h-12 bg-gray-200 rounded items-center justify-center text-lg hidden"
                  >
                    📦
                  </div>
                  } @else {
                  <div
                    class="w-12 h-12 bg-gray-200 rounded flex items-center justify-center text-lg"
                  >
                    📦
                  </div>
                  }
                  <div>
                    <p class="font-medium text-gray-900">{{ item.name }}</p>
                    <p class="text-sm text-gray-600">
                      Cantidad: {{ item.quantity }}
                    </p>
                  </div>
                </div>
                <p class="font-semibold text-gray-900">
                  S/ {{ getItemPrice(item) }}
                </p>
              </div>
              } }
            </div>

            <div class="mt-4 pt-4 border-t border-gray-200 space-y-2">
              <div class="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>S/ {{ getSubtotal().toFixed(2) }}</span>
              </div>
              <div class="flex justify-between text-sm text-gray-600">
                <span>Costo de envío</span>
                <span>S/ {{ deliveryCost.toFixed(2) }}</span>
              </div>
              <div
                class="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-gray-200"
              >
                <span>Total pagado</span>
                <span class="text-[#a81b8d]"
                  >S/ {{ totalAmount.toFixed(2) }}</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha: Información adicional -->
        <div class="lg:col-span-1 space-y-6">
          <!-- Dirección de entrega -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-5 h-5 mr-2 text-[#a81b8d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Dirección de entrega
            </h3>
            <div class="text-sm text-gray-600">
              @if (deliveryAddress.name) {
              <p class="font-semibold text-gray-900 mb-2">
                {{ deliveryAddress.name }}
              </p>
              }
              <p class="text-gray-700 leading-relaxed">
                {{ deliveryAddress.fullAddress || deliveryAddress.street }}
              </p>
              @if (deliveryAddress.references) {
              <p class="mt-2 text-gray-500 italic">
                Ref: {{ deliveryAddress.references }}
              </p>
              }
            </div>
          </div>

          <!-- Método de pago -->
          <div class="bg-white rounded-lg border border-gray-200 p-6">
            <h3 class="font-semibold text-gray-900 mb-4 flex items-center">
              <svg
                class="w-5 h-5 mr-2 text-[#a81b8d]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                />
              </svg>
              Método de pago
            </h3>
            <div class="flex items-center space-x-3">
              <img
                [src]="paymentMethodIcon"
                [alt]="paymentMethodName"
                class="h-8 w-auto"
              />
              <div>
                <p class="font-medium text-gray-900">{{ paymentMethodName }}</p>
                <p class="text-sm text-green-600">✓ Pagado</p>
              </div>
            </div>
          </div>

          <!-- Código de seguimiento -->
          <div
            class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200 p-6"
          >
            <h3 class="font-semibold text-gray-900 mb-3">
              Código de seguimiento
            </h3>
            <div
              class="bg-white rounded-lg p-3 text-center border-2 border-dashed border-gray-300"
            >
              <p class="text-2xl font-mono font-bold text-[#a81b8d]">
                {{ orderTrackingCode }}
              </p>
            </div>
            <p class="text-xs text-gray-500 mt-2 text-center">
              Usa este código para consultar tu pedido
            </p>
          </div>

          <!-- Acciones -->
          <div class="space-y-3">
            <app-button
              [config]="{
                text: 'Descargar boleta',
                type: 'secondary',
                size: 'md'
              }"
              (buttonClick)="downloadBoleta()"
              class="w-full"
            />

            <app-button
              [config]="{
                text: 'Ver mis pedidos',
                type: 'secondary',
                size: 'md'
              }"
              (buttonClick)="goToOrders()"
              class="w-full"
            />

            <app-button
              [config]="{
                text: 'Volver al inicio',
                type: 'primary',
                size: 'md'
              }"
              (buttonClick)="goToHome()"
              class="w-full"
            />
          </div>

          <!-- Ayuda -->
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div class="flex items-start space-x-2">
              <svg
                class="w-5 h-5 text-yellow-600 mt-0.5 flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <div class="text-sm text-yellow-800">
                <p class="font-medium mb-1">¿Necesitas ayuda?</p>
                <p>
                  Contáctanos al
                  <a href="tel:016511111" class="underline font-medium"
                    >01-651-1111</a
                  >
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      @keyframes motorcycle-move {
        0%,
        100% {
          transform: translateX(-10px);
        }
        50% {
          transform: translateX(10px);
        }
      }

      @keyframes motorcycle-bounce {
        0%,
        100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-5px);
        }
      }

      .motorcycle-container {
        position: relative;
      }

      .motorcycle-icon {
        animation: motorcycle-move 2s ease-in-out infinite,
          motorcycle-bounce 1s ease-in-out infinite;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.1));
      }

      @keyframes pulse {
        0%,
        100% {
          opacity: 1;
        }
        50% {
          opacity: 0.5;
        }
      }
    `,
  ],
})
export class OrderTrackingComponent implements OnInit, OnDestroy {
  orderId: string = '';
  orderTrackingCode: string = '';
  currentStatus: OrderStatus = OrderStatus.CONFIRMED;
  estimatedMinutes: number = 35;
  totalAmount: number = 0;
  deliveryCost: number = 5.0; // Costo de envío estándar

  orderItems: any[] = [];
  deliveryAddress: any = {
    name: '',
    street: 'Av. Javier Prado 1234',
    district: 'San Isidro',
    references: 'Casa blanca con reja negra',
  };

  paymentMethodName: string = 'Yape';
  paymentMethodIcon: string = 'assets/icons/logo-yape.webp';

  deliveryPerson: any = null;

  trackingSteps: TrackingStep[] = [
    {
      status: OrderStatus.CONFIRMED,
      label: 'Pedido confirmado',
      icon: '📋',
      completed: true,
      current: false,
    },
    {
      status: OrderStatus.PREPARING,
      label: 'Preparando tu pedido',
      icon: '📦',
      completed: false,
      current: true,
    },
    {
      status: OrderStatus.OUT_FOR_DELIVERY,
      label: 'En camino',
      icon: '🏍️',
      completed: false,
      current: false,
    },
    {
      status: OrderStatus.DELIVERED,
      label: 'Entregado',
      icon: '✓',
      completed: false,
      current: false,
    },
  ];

  private statusUpdateInterval: any;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    // Obtener orderId de la ruta
    this.route.queryParams.subscribe((params) => {
      this.orderId = params['orderId'] || '';
      if (this.orderId) {
        this.loadOrderDetails();
      } else {
        this.loadFromLocalStorage();
      }
    });

    // Simular actualización de estado cada 10 segundos (opcional)
    this.startStatusSimulation();
  }

  ngOnDestroy(): void {
    if (this.statusUpdateInterval) {
      clearInterval(this.statusUpdateInterval);
    }
  }

  loadOrderDetails(): void {
    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order: Order) => {
        this.orderTrackingCode =
          order.delivery?.trackingCode || this.generateTrackingCode();
        this.currentStatus = order.orderStatus;
        this.totalAmount = order.totalAmount;
        this.estimatedMinutes = order.delivery?.estimatedTime || 35;

        // Mapear items
        this.orderItems = (order.orderItemList || order.orderItems || []).map(
          (item) => {
            // Obtener la imagen principal del producto
            const primaryResource = item.product.resources?.find(
              (r) => r.isPrimary
            );
            const imageUrl =
              primaryResource?.url ||
              item.product.thumbnail ||
              'assets/products/default.webp';

            return {
              id: item.product.id,
              name: item.product.name,
              price: item.price,
              quantity: item.quantity,
              image: imageUrl,
            };
          }
        );

        // Información de entrega
        if (order.delivery) {
          this.deliveryPerson = order.delivery.deliveryPerson;
        }

        // Cargar dirección de entrega desde localStorage (siempre)
        // porque el backend no devuelve la dirección como string
        this.loadDeliveryAddressFromLocalStorage();

        // Actualizar tracking steps
        this.updateTrackingSteps();
      },
      error: (error) => {
        console.error('Error loading order:', error);
        this.loadFromLocalStorage();
      },
    });
  }

  loadFromLocalStorage(): void {
    // Cargar datos del localStorage (fallback)
    const trackingData = localStorage.getItem('orderTrackingData');
    const cartData = localStorage.getItem('cart');
    const paymentData = localStorage.getItem('selectedPaymentMethod');

    // Priorizar datos de tracking si existen (datos más recientes)
    if (trackingData) {
      try {
        const tracking = JSON.parse(trackingData);
        this.orderItems = tracking.items || [];
        this.totalAmount = tracking.total || 0;

        if (tracking.deliveryLocation) {
          const location =
            typeof tracking.deliveryLocation === 'string'
              ? JSON.parse(tracking.deliveryLocation)
              : tracking.deliveryLocation;

          // Si tiene 'name' y 'address', viene de delivery-address (formato nuevo)
          if (
            location.name ||
            (location.address && location.district && !location.lat)
          ) {
            this.deliveryAddress = {
              name: location.name || '',
              fullAddress: location.address || 'Dirección no disponible',
              street: location.address || 'Dirección no disponible',
              district: location.district || '',
              references: location.reference || location.references || '',
            };
            console.log(
              '📍 Dirección cargada desde deliveryAddress (tracking):',
              this.deliveryAddress
            );
          } else {
            // Formato antiguo del mapa (tiene lat/lng)
            const fullAddress =
              location.address || 'Av. Javier Prado 1234, San Isidro';
            const addressParts = fullAddress
              .split(',')
              .map((p: string) => p.trim());

            this.deliveryAddress = {
              fullAddress: fullAddress,
              street: addressParts[0] || 'Av. Javier Prado 1234',
              district: location.district || addressParts[1] || 'San Isidro',
              references: location.references || '',
            };
            console.log(
              '📍 Dirección cargada desde mapa (tracking):',
              this.deliveryAddress
            );
          }
        } else {
          // Si no hay deliveryLocation, intentar cargar desde localStorage directo
          this.loadDeliveryAddressFromLocalStorage();
        }
      } catch (e) {
        console.error('Error parsing tracking data:', e);
        // Limpiar localStorage corrupto
        localStorage.removeItem('orderTrackingData');
      }
    } else if (cartData) {
      // Fallback a datos del carrito si no hay tracking data
      try {
        const cart = JSON.parse(cartData);
        this.orderItems = cart.items || [];
        this.totalAmount = cart.total || 0;
      } catch (e) {
        console.error('Error parsing cart data:', e);
      }
    }

    if (paymentData) {
      this.paymentMethodName = this.getPaymentMethodDisplayName(paymentData);
      this.paymentMethodIcon = this.getPaymentMethodIcon(paymentData);
    }

    this.orderTrackingCode = this.generateTrackingCode();
  }

  updateTrackingSteps(): void {
    const statusOrder = [
      OrderStatus.CONFIRMED,
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    const currentIndex = statusOrder.indexOf(this.currentStatus);

    this.trackingSteps = this.trackingSteps.map((step, index) => ({
      ...step,
      completed: index < currentIndex,
      current: index === currentIndex,
    }));
  }

  startStatusSimulation(): void {
    // Simular progreso del pedido (demo)
    let simulationStep = 0;
    const statuses = [
      OrderStatus.PREPARING,
      OrderStatus.OUT_FOR_DELIVERY,
      OrderStatus.DELIVERED,
    ];

    this.statusUpdateInterval = setInterval(() => {
      if (
        simulationStep < statuses.length &&
        this.currentStatus !== OrderStatus.DELIVERED
      ) {
        this.currentStatus = statuses[simulationStep];
        this.updateTrackingSteps();

        // Actualizar tiempo estimado
        this.estimatedMinutes = Math.max(5, this.estimatedMinutes - 10);

        // Simular asignación de repartidor cuando está "en camino"
        if (
          this.currentStatus === OrderStatus.OUT_FOR_DELIVERY &&
          !this.deliveryPerson
        ) {
          this.deliveryPerson = {
            firstName: 'Carlos',
            lastName: 'Rodríguez',
            phoneNumber: '+51987654321',
            vehicleType: 'Moto Honda 150cc',
          };
        }

        simulationStep++;
      } else {
        clearInterval(this.statusUpdateInterval);
      }
    }, 15000); // Cada 15 segundos (solo para demo)
  }

  generateTrackingCode(): string {
    return 'TB-' + Math.random().toString(36).substring(2, 10).toUpperCase();
  }

  getPaymentMethodDisplayName(method: string): string {
    const names: { [key: string]: string } = {
      YAPE: 'Yape',
      PLIN: 'Plin',
      CARD: 'Tarjeta de crédito/débito',
      CASH: 'Efectivo',
    };
    return names[method] || method;
  }

  getPaymentMethodIcon(method: string): string {
    const icons: { [key: string]: string } = {
      YAPE: 'assets/icons/logo-yape.webp',
      PLIN: 'assets/icons/logo-plin.png',
      CARD: 'assets/icons/credit-card.svg',
      CASH: 'assets/icons/cash.svg',
    };
    return icons[method] || 'assets/icons/payment.svg';
  }

  private loadDeliveryAddressFromLocalStorage(): void {
    // PRIORIDAD 1: Cargar desde deliveryAddress (seleccionada en delivery-address)
    const addressData = localStorage.getItem('deliveryAddress');
    if (addressData) {
      try {
        const address = JSON.parse(addressData);
        this.deliveryAddress = {
          name: address.name || '',
          fullAddress: address.address || 'Dirección no disponible',
          street: address.address || 'Dirección no disponible',
          district: address.district || '',
          references: address.reference || '',
        };
        console.log(
          '📍 Dirección cargada desde deliveryAddress:',
          this.deliveryAddress
        );
        return;
      } catch (e) {
        console.error('Error loading delivery address:', e);
      }
    }

    // PRIORIDAD 2: Fallback a deliveryLocation (del mapa)
    const locationData = localStorage.getItem('deliveryLocation');
    if (locationData) {
      try {
        const location = JSON.parse(locationData);
        const fullAddress =
          location.address || 'Av. Javier Prado 1234, San Isidro';
        const addressParts = fullAddress
          .split(',')
          .map((p: string) => p.trim());

        this.deliveryAddress = {
          fullAddress: fullAddress,
          street: addressParts[0] || 'Av. Javier Prado 1234',
          district: location.district || addressParts[1] || 'San Isidro',
          references: '',
        };

        console.log(
          '📍 Dirección cargada desde deliveryLocation (fallback):',
          this.deliveryAddress
        );
      } catch (e) {
        console.error('Error loading delivery location:', e);
      }
    }
  }

  downloadBoleta(): void {
    // Generar PDF y descargarlo directamente
    this.generateAndDownloadPDF();
  }

  private generateAndDownloadPDF(): void {
    const currentDate = new Date().toLocaleDateString('es-PE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    let itemsHTML = '';
    this.orderItems.forEach((item) => {
      const itemTotal = parseFloat(this.getItemPrice(item));
      itemsHTML += `
        <tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">${
            item.name
          }</td>
          <td style="padding: 8px; text-align: center; border-bottom: 1px solid #e5e7eb;">${
            item.quantity
          }</td>
          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">S/ ${(
            itemTotal / item.quantity
          ).toFixed(2)}</td>
          <td style="padding: 8px; text-align: right; border-bottom: 1px solid #e5e7eb;">S/ ${itemTotal.toFixed(
            2
          )}</td>
        </tr>
      `;
    });

    const subtotal = this.getSubtotal();
    const total = this.totalAmount;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Boleta - ${this.orderTrackingCode}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #1f2937;
            max-width: 800px;
            margin: 0 auto;
          }
          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 3px solid #a81b8d;
            padding-bottom: 20px;
          }
          .logo {
            font-size: 32px;
            font-weight: bold;
            color: #a81b8d;
            margin-bottom: 5px;
          }
          .subtitle {
            color: #6b7280;
            font-size: 14px;
          }
          .info-section {
            margin: 20px 0;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
          }
          .info-row {
            display: flex;
            justify-content: space-between;
            margin: 8px 0;
          }
          .label {
            font-weight: bold;
            color: #4b5563;
          }
          .value {
            color: #1f2937;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
          }
          th {
            background-color: #a81b8d;
            color: white;
            padding: 12px 8px;
            text-align: left;
          }
          th:nth-child(2), th:nth-child(3), th:nth-child(4) {
            text-align: center;
          }
          th:nth-child(3), th:nth-child(4) {
            text-align: right;
          }
          .totals {
            margin-top: 20px;
            padding: 15px;
            background-color: #f9fafb;
            border-radius: 8px;
          }
          .total-row {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            font-size: 14px;
          }
          .total-final {
            font-size: 18px;
            font-weight: bold;
            color: #a81b8d;
            border-top: 2px solid #d1d5db;
            padding-top: 12px;
            margin-top: 8px;
          }
          .footer {
            margin-top: 40px;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
            border-top: 1px solid #e5e7eb;
            padding-top: 20px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">TAMBO+</div>
          <div class="subtitle">Boleta Electrónica</div>
        </div>

        <div class="info-section">
          <div class="info-row">
            <span class="label">Código de pedido:</span>
            <span class="value">${this.orderTrackingCode}</span>
          </div>
          <div class="info-row">
            <span class="label">Fecha de emisión:</span>
            <span class="value">${currentDate}</span>
          </div>
          <div class="info-row">
            <span class="label">Estado:</span>
            <span class="value">Confirmado</span>
          </div>
        </div>

        <div class="info-section">
          <div style="margin-bottom: 10px; font-weight: bold; color: #a81b8d;">Dirección de entrega:</div>
          ${
            this.deliveryAddress.name
              ? `<div style="margin: 5px 0;"><strong>${this.deliveryAddress.name}</strong></div>`
              : ''
          }
          <div style="margin: 5px 0;">${
            this.deliveryAddress.fullAddress || this.deliveryAddress.street
          }</div>
          ${
            this.deliveryAddress.references
              ? `<div style="margin: 5px 0; color: #6b7280; font-style: italic;">Ref: ${this.deliveryAddress.references}</div>`
              : ''
          }
        </div>

        <table>
          <thead>
            <tr>
              <th>Producto</th>
              <th>Cant.</th>
              <th>Precio Unit.</th>
              <th>Subtotal</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHTML}
          </tbody>
        </table>

        <div class="totals">
          <div class="total-row">
            <span>Subtotal:</span>
            <span>S/ ${subtotal.toFixed(2)}</span>
          </div>
          <div class="total-row">
            <span>Costo de envío:</span>
            <span>S/ ${this.deliveryCost.toFixed(2)}</span>
          </div>
          <div class="total-row total-final">
            <span>Total:</span>
            <span>S/ ${total.toFixed(2)}</span>
          </div>
        </div>

        <div class="info-section">
          <div style="margin-bottom: 10px; font-weight: bold; color: #a81b8d;">Método de pago:</div>
          <div>${this.paymentMethodName}</div>
          <div style="color: #059669; margin-top: 5px;">✓ Pagado</div>
        </div>

        <div class="footer">
          <p>Gracias por tu compra en Tambo+</p>
          <p>Para consultas: 01-651-1111 | soporte@tambo.com.pe</p>
          <p>www.tambo.com.pe</p>
        </div>
      </body>
      </html>
    `;

    // Crear un iframe oculto para generar el PDF
    const iframe = document.createElement('iframe');
    iframe.style.display = 'none';
    document.body.appendChild(iframe);

    const iframeDoc = iframe.contentWindow?.document;
    if (iframeDoc) {
      iframeDoc.open();
      iframeDoc.write(htmlContent);
      iframeDoc.close();

      // Esperar a que se cargue el contenido y luego imprimir
      iframe.contentWindow?.focus();
      setTimeout(() => {
        iframe.contentWindow?.print();
        // Remover el iframe después de un delay
        setTimeout(() => {
          document.body.removeChild(iframe);
        }, 1000);
      }, 250);
    }
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  goToHome(): void {
    this.router.navigate(['/']);
  }

  getItemPrice(item: any): string {
    // Intentar obtener el precio del item de diferentes formas
    let unitPrice = 0;

    if (item.price !== undefined && item.price !== null) {
      // Si tiene price directamente (del backend)
      unitPrice = item.price;
    } else if (item.product?.discountedPrice) {
      // Si tiene product.discountedPrice (del carrito)
      unitPrice = item.product.discountedPrice;
    } else if (item.product?.price) {
      // Si tiene product.price (del carrito sin descuento)
      unitPrice = item.product.price;
    }

    const total = unitPrice * (item.quantity || 1);
    return total.toFixed(2);
  }

  getSubtotal(): number {
    // Calcular el subtotal (sin costo de envío)
    return this.totalAmount - this.deliveryCost;
  }
}
