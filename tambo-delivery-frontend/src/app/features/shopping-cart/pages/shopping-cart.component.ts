import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import { Cart, CartItem, CartSummary } from '../../../models/cart.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <h1 class="text-3xl font-bold text-gray-900 mb-8">Carrito de Compras</h1>

      <!-- Si el carrito está vacío -->
      @if (cart.items.length === 0) {
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg
            class="mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          Tu carrito está vacío
        </h3>
        <p class="text-gray-600 mb-6">
          Agrega algunos productos para comenzar tu pedido.
        </p>
        <app-button
          [config]="{
            text: 'Ver Productos',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="goToProducts()"
        />
      </div>
      } @else {
      <!-- Layout con productos y resumen -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna izquierda: Lista de productos -->
        <div class="lg:col-span-2 space-y-4">
          <h2 class="text-xl font-semibold text-gray-900 mb-4">
            Productos en tu carrito ({{ cart.totalItems }})
          </h2>

          @for (item of cart.items; track item.product.id) {
          <div
            class="bg-white rounded-lg border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div class="flex items-start space-x-4">
              <!-- Imagen del producto -->
              <div class="flex-shrink-0">
                @if (item.product.thumbnail || item.product.resources?.[0]?.url)
                {
                <img
                  [src]="item.product.thumbnail || item.product.resources?.[0]?.url"
                  [alt]="item.product.name"
                  class="h-20 w-20 object-cover rounded-md border"
                  onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                />
                <div
                  class="h-20 w-20 bg-gray-200 rounded-md border items-center justify-center text-2xl hidden"
                >
                  📦
                </div>
                } @else {
                <div
                  class="h-20 w-20 bg-gray-200 rounded-md border flex items-center justify-center text-2xl"
                >
                  📦
                </div>
                }
              </div>

              <!-- Información del producto -->
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-medium text-gray-900 mb-1">
                  {{ item.product.name }}
                </h3>
                @if (item.product.description) {
                <p class="text-sm text-gray-600 mb-2">
                  {{ item.product.description }}
                </p>
                }
                <div>
                  @if (item.product.discountedPrice &&
                  item.product.discountedPrice < item.product.price) {
                  <span class="text-sm text-gray-500 line-through mr-2"
                    >S/ {{ item.product.price.toFixed(2) }}</span
                  >
                  <span class="text-lg font-semibold text-[#a81b8d]"
                    >S/ {{ item.product.discountedPrice.toFixed(2) }}</span
                  >
                  } @else {
                  <span class="text-lg font-semibold text-[#a81b8d]"
                    >S/ {{ item.product.price.toFixed(2) }}</span
                  >
                  }
                </div>
              </div>

              <!-- Controles de cantidad y eliminación -->
              <div class="flex flex-col items-end space-y-2">
                <!-- Botón eliminar -->
                <button
                  (click)="removeItem(item.product.id)"
                  class="text-gray-400 hover:text-red-500 transition-colors cursor-pointer"
                  title="Eliminar producto"
                >
                  <svg
                    class="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    />
                  </svg>
                </button>

                <!-- Controles de cantidad -->
                <div class="flex items-center space-x-2">
                  <button
                    (click)="decreaseQuantity(item.product.id)"
                    [disabled]="item.quantity <= 1"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M20 12H4"
                      />
                    </svg>
                  </button>

                  <span class="w-8 text-center font-medium">{{
                    item.quantity
                  }}</span>

                  <button
                    (click)="increaseQuantity(item.product.id)"
                    class="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 cursor-pointer"
                  >
                    <svg
                      class="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                      />
                    </svg>
                  </button>
                </div>

                <!-- Subtotal del producto -->
                <p class="text-lg font-semibold text-gray-900">
                  S/ {{ item.subtotal.toFixed(2) }}
                </p>
              </div>
            </div>
          </div>
          }

          <!-- Botón continuar comprando -->
          <div class="pt-4 border-t">
            <button
              (click)="goToProducts()"
              class="text-[#a81b8d] hover:text-[#8a1676] font-medium flex items-center space-x-2"
            >
              <svg
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Continuar comprando</span>
            </button>
          </div>
        </div>

        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h3>

            <!-- Lista de productos -->
            <div class="space-y-2 mb-4 max-h-60 overflow-y-auto">
              @for (item of cart.items; track item.product.id) {
              <div
                class="flex justify-between text-sm py-2 border-b border-gray-200"
              >
                <div class="flex-1 pr-2">
                  <p class="text-gray-900 font-medium">
                    {{ item.product.name }}
                  </p>
                  <p class="text-gray-500 text-xs">
                    Cantidad: {{ item.quantity }}
                  </p>
                </div>
                <div class="text-right">
                  @if (item.product.discountedPrice &&
                  item.product.discountedPrice < item.product.price) {
                  <p class="text-gray-900 font-medium">
                    S/ {{ item.subtotal.toFixed(2) }}
                  </p>
                  <p class="text-xs text-gray-500 line-through">
                    S/ {{ (item.product.price * item.quantity).toFixed(2) }}
                  </p>
                  } @else {
                  <p class="text-gray-900 font-medium">
                    S/ {{ item.subtotal.toFixed(2) }}
                  </p>
                  }
                </div>
              </div>
              }
            </div>

            <!-- Desglose de costos -->
            <div class="space-y-3 mb-4 pt-3 border-t-2 border-gray-300">
              <div class="flex justify-between text-sm font-medium">
                <span class="text-gray-900"
                  >Subtotal ({{ getTotalItems() }} productos)</span
                >
                <span class="text-gray-900"
                  >S/ {{ cartSummary.subtotal.toFixed(2) }}</span
                >
              </div>

              <div class="flex justify-between text-sm">
                <span class="text-gray-600">Costo de envío</span>
                <span class="font-medium">
                  @if (cartSummary.deliveryFee === 0) {
                  <span class="text-green-600">Gratis</span>
                  } @else {
                  <span>S/ {{ cartSummary.deliveryFee.toFixed(2) }}</span>
                  }
                </span>
              </div>
            </div>

            <!-- Total -->
            <div class="border-t pt-4 mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900"
                  >Total a pagar</span
                >
                <span class="text-2xl font-bold text-[#a81b8d]"
                  >S/ {{ cartSummary.total.toFixed(2) }}</span
                >
              </div>
            </div>

            <!-- Información de envío gratis -->
            @if (cartSummary.deliveryFee > 0) {
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
              <p class="text-xs text-blue-800">
                <span class="font-medium">¡Envío disponible!</span>
                Costo de envío: S/ {{ cartSummary.deliveryFee.toFixed(2) }}
              </p>
            </div>
            } @else if (cartSummary.subtotal > 0) {
            <div
              class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
            >
              <p class="text-xs text-green-800 font-medium">
                ✅ ¡Felicidades! Tienes envío gratis
              </p>
            </div>
            }

            <!-- Mensaje de autenticación requerida -->
            @if (!isAuthenticated) {
            <div
              class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4"
            >
              <p class="text-xs text-yellow-800">
                <span class="font-medium">⚠️ Inicia sesión</span> para continuar
                con tu compra
              </p>
            </div>
            }

            <!-- Botón continuar compra -->
            <app-button
              [config]="{
                text: isAuthenticated
                  ? 'Continuar con la compra'
                  : 'Iniciar sesión y continuar',
                type: 'primary',
                size: 'lg'
              }"
              (buttonClick)="proceedToCheckout()"
              class="mb-3 w-full"
            />

            <!-- Métodos de pago aceptados -->
            <div class="text-center">
              <p class="text-xs text-gray-500 mb-2">
                Métodos de pago aceptados
              </p>
              <div class="flex justify-center space-x-2">
                <img
                  src="assets/icons/visa.webp"
                  alt="Visa"
                  class="h-6"
                  onerror="this.style.display='none'"
                />
                <img
                  src="assets/icons/mastercard.webp"
                  alt="Mastercard"
                  class="h-6"
                  onerror="this.style.display='none'"
                />
                <img
                  src="assets/icons/yape.webp"
                  alt="Yape"
                  class="h-6"
                  onerror="this.style.display='none'"
                />
                <img
                  src="assets/icons/plin.webp"
                  alt="Plin"
                  class="h-6"
                  onerror="this.style.display='none'"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      }
    </div>
  `,
})
export class ShoppingCartComponent implements OnInit, OnDestroy {
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    updatedAt: new Date(),
  };
  cartSummary: CartSummary = {
    itemCount: 0,
    subtotal: 0,
    deliveryFee: 0,
    total: 0,
  };
  private cartSubscription?: Subscription;
  isAuthenticated = false;

  constructor(
    private cartService: CartService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // Verificar estado de autenticación
    this.isAuthenticated = this.authService.isAuthenticated;

    // Suscribirse a los cambios del carrito
    this.cartSubscription = this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.cartSummary = this.cartService.getCartSummary();
    });
  }

  ngOnDestroy(): void {
    this.cartSubscription?.unsubscribe();
  }

  getTotalItems(): number {
    return this.cart.totalItems;
  }

  getSubtotal(): number {
    return this.cartSummary.subtotal;
  }

  getShippingCost(): number {
    return this.cartSummary.deliveryFee;
  }

  getIGV(): number {
    // IGV está incluido en el total del CartSummary
    const subtotalWithShipping =
      this.cartSummary.subtotal + this.cartSummary.deliveryFee;
    return subtotalWithShipping * 0.18; // 18% IGV
  }

  getTotal(): number {
    return this.cartSummary.total;
  }

  increaseQuantity(productId: string): void {
    this.cartService.incrementQuantity(productId);
  }

  decreaseQuantity(productId: string): void {
    this.cartService.decrementQuantity(productId);
  }

  removeItem(productId: string): void {
    this.cartService.removeFromCart(productId);
  }

  /**
   * Obtiene el precio efectivo del producto (con descuento si está disponible)
   */
  getEffectivePrice(product: any): number {
    return product.discountedPrice || product.price;
  }

  goToProducts(): void {
    this.router.navigate(['/products']);
  }

  proceedToCheckout(): void {
    // Verificar si el usuario está autenticado
    if (!this.isAuthenticated) {
      // Guardar la URL de retorno y redirigir al login
      const returnUrl = '/cart/ubicacion';
      this.router.navigate(['/auth/login'], {
        queryParams: { returnUrl: returnUrl },
        state: {
          message: 'Por favor, inicia sesión para continuar con tu compra',
        },
      });
      return;
    }

    // Si está autenticado, navegar a la página de ubicación de tienda
    this.router.navigate(['/cart/ubicacion']);
  }
}
