import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { OrderService } from '../../orders/services/order.service';
import { CartService } from '../../../services/cart.service';
import { AuthService } from '../../../core/services/auth.service';
import {
  OrderRequest,
  OrderItemRequest,
  DeliveryMethod,
  PaymentMethod as PaymentMethodEnum,
} from '../../../models/order.model';
import { Cart } from '../../../models/cart.model';
import * as QRCode from 'qrcode';

// Declarar Culqi globalmente
declare const Culqi: any;

interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'digital' | 'cash';
  icon: string;
  description: string;
  enabled: boolean;
}

@Component({
  selector: 'app-payment-method',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Breadcrumb -->
      <nav class="text-sm mb-6">
        <ol class="flex items-center space-x-2">
          <li>
            <a
              (click)="goToCart()"
              class="text-[#a81b8d] hover:underline cursor-pointer"
              >Carrito</a
            >
          </li>
          <li class="text-gray-400">/</li>
          <li>
            <a
              (click)="goToAddress()"
              class="text-[#a81b8d] hover:underline cursor-pointer"
              >Dirección de entrega</a
            >
          </li>
          <li class="text-gray-400">/</li>
          <li class="text-gray-600 font-medium">Pago y confirmación</li>
        </ol>
      </nav>

      <h1 class="text-3xl font-bold text-gray-900 mb-2">
        Confirma y paga tu pedido
      </h1>
      <p class="text-gray-600 mb-8">
        Selecciona tu método de pago preferido para finalizar tu compra
      </p>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Columna izquierda: Métodos de pago -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Métodos de pago disponibles -->
          <div>
            <h2 class="text-xl font-semibold text-gray-900 mb-4">
              Selecciona tu método de pago
            </h2>

            <div class="space-y-3">
              @for (method of paymentMethods; track method.id) {
              <div
                class="border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md"
                [class.border-[#a81b8d]]="
                  selectedPaymentMethod === method.id && method.enabled
                "
                [class.bg-purple-50]="
                  selectedPaymentMethod === method.id && method.enabled
                "
                [class.border-gray-200]="
                  selectedPaymentMethod !== method.id || !method.enabled
                "
                [class.opacity-50]="!method.enabled"
                [class.cursor-not-allowed]="!method.enabled"
                (click)="method.enabled ? selectPaymentMethod(method.id) : null"
              >
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-3">
                    <input
                      type="radio"
                      [checked]="selectedPaymentMethod === method.id"
                      [disabled]="!method.enabled"
                      class="text-[#a81b8d] focus:ring-[#a81b8d] disabled:opacity-50"
                      readonly
                    />
                    <img
                      [src]="method.icon"
                      [alt]="method.name"
                      class="h-8 w-auto"
                    />
                    <div>
                      <h3 class="font-medium text-gray-900">
                        {{ method.name }}
                      </h3>
                      <p class="text-sm text-gray-600">
                        {{ method.description }}
                      </p>
                    </div>
                  </div>
                  @if (!method.enabled) {
                  <span
                    class="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded"
                    >Próximamente</span
                  >
                  }
                </div>
              </div>
              }
            </div>
          </div>

          <!-- Formulario de tarjeta (si se selecciona tarjeta) -->
          @if (selectedPaymentMethod === 'card') {
          <div class="bg-gray-50 rounded-lg p-6">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Información de la tarjeta
            </h3>

            <form [formGroup]="cardForm" class="space-y-4">
              <!-- Número de tarjeta -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Número de tarjeta *
                </label>
                <input
                  type="text"
                  formControlName="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  maxlength="19"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  (input)="formatCardNumber($event)"
                />
                @if (cardForm.get('cardNumber')?.touched &&
                cardForm.get('cardNumber')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                }
              </div>

              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <!-- Fecha de vencimiento -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    Vencimiento *
                  </label>
                  <input
                    type="text"
                    formControlName="expiryDate"
                    placeholder="MM/YY"
                    maxlength="5"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                    (input)="formatExpiryDate($event)"
                  />
                  @if (cardForm.get('expiryDate')?.touched &&
                  cardForm.get('expiryDate')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-600">
                    Este campo es requerido
                  </p>
                  }
                </div>

                <!-- CVV -->
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">
                    CVV *
                  </label>
                  <input
                    type="text"
                    formControlName="cvv"
                    placeholder="123"
                    maxlength="4"
                    class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                  />
                  @if (cardForm.get('cvv')?.touched &&
                  cardForm.get('cvv')?.errors?.['required']) {
                  <p class="mt-1 text-sm text-red-600">
                    Este campo es requerido
                  </p>
                  }
                </div>
              </div>

              <!-- Nombre del titular -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del titular *
                </label>
                <input
                  type="text"
                  formControlName="cardHolderName"
                  placeholder="Como aparece en la tarjeta"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                />
                @if (cardForm.get('cardHolderName')?.touched &&
                cardForm.get('cardHolderName')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                }
              </div>

              <!-- Email -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  formControlName="email"
                  placeholder="tu@email.com"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-transparent"
                />
                @if (cardForm.get('email')?.touched &&
                cardForm.get('email')?.errors?.['required']) {
                <p class="mt-1 text-sm text-red-600">Este campo es requerido</p>
                } @if (cardForm.get('email')?.touched &&
                cardForm.get('email')?.errors?.['email']) {
                <p class="mt-1 text-sm text-red-600">Email inválido</p>
                }
              </div>

              <!-- Guardar tarjeta -->
              <div class="flex items-center">
                <input
                  id="saveCard"
                  type="checkbox"
                  formControlName="saveCard"
                  class="rounded border-gray-300 text-[#a81b8d] focus:ring-[#a81b8d]"
                />
                <label for="saveCard" class="ml-2 text-sm text-gray-700">
                  Guardar esta tarjeta para futuras compras
                </label>
              </div>

              <!-- Información de seguridad -->
              <div class="bg-green-50 border border-green-200 rounded-lg p-3">
                <div class="flex items-center space-x-2">
                  <svg
                    class="h-4 w-4 text-green-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                  <p class="text-xs text-green-800">
                    Tu información está encriptada y segura
                  </p>
                </div>
              </div>
            </form>
          </div>
          }

          <!-- Información para pagos digitales -->
          @if (selectedPaymentMethod === 'yape' || selectedPaymentMethod ===
          'plin') {
          <div class="bg-white border-2 border-gray-200 rounded-lg p-6">
            <div class="text-center space-y-4">
              <div class="flex items-center justify-center space-x-3 mb-4">
                <img
                  [src]="
                    selectedPaymentMethod === 'yape'
                      ? 'assets/icons/logo-yape.webp'
                      : 'assets/icons/logo-plin.png'
                  "
                  class="h-12"
                />
                <div class="text-left">
                  <h3 class="text-lg font-semibold text-gray-900">
                    {{ getPaymentMethodName(selectedPaymentMethod) }}
                  </h3>
                  <p
                    class="text-2xl font-bold"
                    [class.text-purple-600]="selectedPaymentMethod === 'yape'"
                    [class.text-blue-600]="selectedPaymentMethod === 'plin'"
                  >
                    S/ {{ cartSummary.total.toFixed(2) }}
                  </p>
                </div>
              </div>

              <div class="bg-gray-50 rounded-lg p-4">
                <h4 class="font-medium text-gray-900 mb-2 text-sm">
                  Pasos para pagar:
                </h4>
                <ol class="text-sm text-gray-600 space-y-1.5 text-left">
                  <li class="flex items-start">
                    <span class="font-bold mr-2 text-[#a81b8d]">1.</span>
                    <span>Haz clic en "Generar código QR"</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2 text-[#a81b8d]">2.</span>
                    <span
                      >Abre tu app de
                      {{ getPaymentMethodName(selectedPaymentMethod) }}</span
                    >
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2 text-[#a81b8d]">3.</span>
                    <span>Escanea el código QR</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2 text-[#a81b8d]">4.</span>
                    <span
                      >Confirma el pago y luego haz clic en "Confirmar
                      pedido"</span
                    >
                  </li>
                </ol>
              </div>

              <button
                (click)="openQRModal()"
                class="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
                [class.bg-purple-600]="selectedPaymentMethod === 'yape'"
                [class.hover:bg-purple-700]="selectedPaymentMethod === 'yape'"
                [class.bg-blue-600]="selectedPaymentMethod === 'plin'"
                [class.hover:bg-blue-700]="selectedPaymentMethod === 'plin'"
              >
                <div class="flex items-center justify-center space-x-2">
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
                      d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z"
                    />
                  </svg>
                  <span>Generar código QR</span>
                </div>
              </button>

              <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-start space-x-2">
                  <svg
                    class="h-4 w-4 text-blue-600 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p class="text-xs text-blue-800 text-left">
                    El código QR es válido por 10 minutos. Paga antes de
                    confirmar tu pedido.
                  </p>
                </div>
              </div>
            </div>
          </div>
          }
        </div>

        <!-- Columna derecha: Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="bg-gray-50 rounded-lg p-6 sticky top-32">
            <h3 class="text-lg font-semibold text-gray-900 mb-4">
              Resumen del pedido
            </h3>

            <!-- Lista de productos -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-3">
                Productos ({{ cart.totalItems }})
              </h4>
              <div class="space-y-2 max-h-48 overflow-y-auto">
                @for (item of cart.items; track item.product.id) {
                <div class="flex items-center space-x-2 text-xs">
                  @if (item.product.thumbnail ||
                  item.product.resources?.[0]?.url) {
                  <img
                    [src]="item.product.thumbnail || item.product.resources?.[0]?.url"
                    [alt]="item.product.name"
                    class="h-10 w-10 object-cover rounded border"
                    onerror="this.style.display='none'; this.nextElementSibling.style.display='flex'"
                  />
                  <div
                    class="h-10 w-10 bg-gray-200 rounded border items-center justify-center text-gray-400 text-xs hidden"
                  >
                    📦
                  </div>
                  } @else {
                  <div
                    class="h-10 w-10 bg-gray-200 rounded border flex items-center justify-center text-gray-400 text-xs"
                  >
                    📦
                  </div>
                  }
                  <div class="flex-1 min-w-0">
                    <p class="font-medium text-gray-900 truncate">
                      {{ item.product.name }}
                    </p>
                    <p class="text-gray-500">
                      {{ item.quantity }} x S/
                      {{ getEffectivePrice(item.product).toFixed(2) }}
                    </p>
                  </div>
                  <p class="font-medium text-gray-900">
                    S/ {{ item.subtotal.toFixed(2) }}
                  </p>
                </div>
                }
              </div>
            </div>

            <!-- Dirección de entrega -->
            <div class="mb-4 pb-4 border-b border-gray-200">
              <h4 class="text-sm font-medium text-gray-700 mb-2">
                Dirección de entrega
              </h4>
              <p class="text-sm text-gray-600">{{ deliveryAddress }}</p>
              <button
                (click)="goToAddress()"
                class="text-xs text-[#a81b8d] hover:underline mt-1"
              >
                Cambiar dirección
              </button>
            </div>

            <!-- Desglose de costos -->
            <div class="space-y-3 mb-4 pb-4 border-b-2 border-gray-300">
              <div class="flex justify-between text-sm font-medium">
                <span class="text-gray-900">Subtotal</span>
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
            <div class="mb-6">
              <div class="flex justify-between items-center">
                <span class="text-lg font-semibold text-gray-900"
                  >Total a pagar</span
                >
                <span class="text-2xl font-bold text-[#a81b8d]"
                  >S/ {{ cartSummary.total.toFixed(2) }}</span
                >
              </div>
            </div>

            <!-- Seguridad -->
            <div
              class="bg-green-50 border border-green-200 rounded-lg p-3 mb-4"
            >
              <div class="flex items-center space-x-2">
                <svg
                  class="h-5 w-5 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <div>
                  <p class="text-sm font-medium text-green-800">
                    Pago 100% seguro
                  </p>
                  <p class="text-xs text-green-700">
                    Protegemos tu información
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Error de pago -->
      @if (paymentError) {
      <div class="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
        <div class="flex items-start space-x-3">
          <svg
            class="h-5 w-5 text-red-600 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <div>
            <h4 class="font-medium text-red-900">Error en el pago</h4>
            <p class="text-sm text-red-800 mt-1">{{ paymentError }}</p>
          </div>
        </div>
      </div>
      }

      <!-- Botones de navegación -->
      <div class="mt-8 flex justify-between items-center">
        <app-button
          [config]="{
            text: 'Volver a dirección',
            type: 'secondary',
            size: 'md',
            disabled: processing
          }"
          (buttonClick)="goToAddress()"
        />

        <div class="flex items-center space-x-3">
          @if (processing) {
          <div class="flex items-center space-x-2 text-[#a81b8d]">
            <svg class="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span class="text-sm font-medium">Procesando pedido...</span>
          </div>
          }

          <app-button
            [config]="{
              text: processing ? 'Procesando...' : 'Confirmar y pagar',
              type: 'primary',
              size: 'lg',
              disabled: processing || !canProceed()
            }"
            (buttonClick)="confirmOrder()"
          />
        </div>
      </div>
    </div>

    <!-- Modal de QR Code -->
    @if (showQRModal) {
    <div
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      (click)="showQRModal = false"
    >
      <div
        class="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative"
        (click)="$event.stopPropagation()"
      >
        <!-- Botón cerrar -->
        <button
          (click)="showQRModal = false"
          class="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <!-- Header -->
        <div class="text-center mb-6">
          <div class="flex items-center justify-center space-x-3 mb-3">
            <img
              [src]="
                selectedPaymentMethod === 'yape'
                  ? 'assets/icons/logo-yape.webp'
                  : 'assets/icons/logo-plin.png'
              "
              class="h-12"
            />
            <h2 class="text-2xl font-bold text-gray-900">
              {{ getPaymentMethodName(selectedPaymentMethod) }}
            </h2>
          </div>
          <p
            class="text-3xl font-bold"
            [class.text-purple-600]="selectedPaymentMethod === 'yape'"
            [class.text-blue-600]="selectedPaymentMethod === 'plin'"
          >
            S/ {{ cartSummary.total.toFixed(2) }}
          </p>
        </div>

        <!-- QR Code -->
        <div class="flex justify-center mb-6">
          <div
            class="bg-white p-6 rounded-xl shadow-lg border-4"
            [class.border-purple-400]="selectedPaymentMethod === 'yape'"
            [class.border-blue-400]="selectedPaymentMethod === 'plin'"
          >
            <canvas #qrCanvas class="rounded-lg"></canvas>
          </div>
        </div>

        <!-- Información -->
        <div class="space-y-3">
          <div class="bg-gray-50 rounded-lg p-4">
            <h4 class="font-semibold text-gray-900 mb-2 text-sm">
              Instrucciones:
            </h4>
            <ol class="text-sm text-gray-600 space-y-1.5">
              <li class="flex items-start">
                <span class="font-bold mr-2 text-[#a81b8d]">1.</span>
                <span
                  >Abre tu app de
                  {{ getPaymentMethodName(selectedPaymentMethod) }}</span
                >
              </li>
              <li class="flex items-start">
                <span class="font-bold mr-2 text-[#a81b8d]">2.</span>
                <span>Toca "Escanear QR" o "Yapear/Plin"</span>
              </li>
              <li class="flex items-start">
                <span class="font-bold mr-2 text-[#a81b8d]">3.</span>
                <span>Escanea este código</span>
              </li>
              <li class="flex items-start">
                <span class="font-bold mr-2 text-[#a81b8d]">4.</span>
                <span
                  >Confirma el pago de S/
                  {{ cartSummary.total.toFixed(2) }}</span
                >
              </li>
            </ol>
          </div>

          <div
            class="rounded-lg p-3"
            [class.bg-purple-50]="selectedPaymentMethod === 'yape'"
            [class.border-purple-200]="selectedPaymentMethod === 'yape'"
            [class.bg-blue-50]="selectedPaymentMethod === 'plin'"
            [class.border-blue-200]="selectedPaymentMethod === 'plin'"
            class="border"
          >
            <div class="flex items-start space-x-2">
              <svg
                class="h-4 w-4 mt-0.5"
                [class.text-purple-600]="selectedPaymentMethod === 'yape'"
                [class.text-blue-600]="selectedPaymentMethod === 'plin'"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <p
                class="text-xs"
                [class.text-purple-800]="selectedPaymentMethod === 'yape'"
                [class.text-blue-800]="selectedPaymentMethod === 'plin'"
              >
                Este código QR es válido por 10 minutos. Una vez que hayas
                pagado, cierra esta ventana y confirma tu pedido.
              </p>
            </div>
          </div>

          <button
            (click)="showQRModal = false"
            class="w-full py-3 px-4 rounded-lg font-medium text-white transition-colors"
            [class.bg-purple-600]="selectedPaymentMethod === 'yape'"
            [class.hover:bg-purple-700]="selectedPaymentMethod === 'yape'"
            [class.bg-blue-600]="selectedPaymentMethod === 'plin'"
            [class.hover:bg-blue-700]="selectedPaymentMethod === 'plin'"
          >
            Ya pagué, cerrar
          </button>
        </div>
      </div>
    </div>
    }
  `,
})
export class PaymentMethodComponent implements OnInit, AfterViewInit {
  @ViewChild('qrCanvas') qrCanvas!: ElementRef<HTMLCanvasElement>;

  // Datos del carrito
  cart: Cart = {
    items: [],
    totalItems: 0,
    totalPrice: 0,
    updatedAt: new Date(),
  };
  cartSummary = { itemCount: 0, subtotal: 0, deliveryFee: 0, total: 0 };
  deliveryAddress = 'Av. Javier Prado 1234, San Isidro';

  paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: 'Tarjeta de crédito/débito',
      type: 'card',
      icon: 'assets/icons/logo-tarjeta.png',
      description: 'Visa, MasterCard, American Express',
      enabled: true,
    },
    {
      id: 'yape',
      name: 'Yape',
      type: 'digital',
      icon: 'assets/icons/logo-yape.webp',
      description: 'Paga con tu celular de forma rápida',
      enabled: true,
    },
    {
      id: 'plin',
      name: 'Plin',
      type: 'digital',
      icon: 'assets/icons/logo-plin.png',
      description: 'Transferencia instantánea',
      enabled: true,
    },
    {
      id: 'cash',
      name: 'Efectivo',
      type: 'cash',
      icon: 'assets/icons/logo-cash.png',
      description: 'Paga al recibir tu pedido',
      enabled: false, // Deshabilitado por ahora
    },
  ];

  selectedPaymentMethod: string | null = null;
  cardForm: FormGroup;
  processing = false;
  paymentError = '';
  showQRModal = false;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService
  ) {
    this.cardForm = this.fb.group({
      cardNumber: [
        '',
        [
          Validators.required,
          Validators.pattern(/^\d{4}\s\d{4}\s\d{4}\s\d{4}$/),
        ],
      ],
      expiryDate: [
        '',
        [Validators.required, Validators.pattern(/^\d{2}\/\d{2}$/)],
      ],
      cvv: ['', [Validators.required, Validators.pattern(/^\d{3,4}$/)]],
      cardHolderName: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      saveCard: [false],
    });
  }

  ngOnInit(): void {
    this.loadCulqiScript();
    this.loadCartData();
    this.loadDeliveryAddress();
  }

  ngAfterViewInit(): void {
    // No generar QR automáticamente, solo cuando se abra el modal
  }

  private loadCartData(): void {
    // Cargar datos del carrito
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.cartSummary = this.cartService.getCartSummary();
    });
  }

  private loadDeliveryAddress(): void {
    // PRIORIDAD 1: Dirección seleccionada/creada en delivery-address
    const addressData = localStorage.getItem('deliveryAddress');
    if (addressData) {
      try {
        const address = JSON.parse(addressData);
        this.deliveryAddress = `${address.address}, ${address.district}${
          address.reference ? ' - ' + address.reference : ''
        }`;
        console.log(
          '📍 Dirección cargada desde delivery-address:',
          this.deliveryAddress
        );
        return;
      } catch (e) {
        console.error('Error loading delivery address:', e);
      }
    }

    // PRIORIDAD 2: Dirección del mapa (fallback)
    const locationData = localStorage.getItem('deliveryLocation');
    if (locationData) {
      try {
        const location = JSON.parse(locationData);
        this.deliveryAddress = location.address || 'Dirección no disponible';
        console.log(
          '📍 Dirección cargada desde mapa (fallback):',
          this.deliveryAddress
        );
        return;
      } catch (e) {
        console.error('Error loading delivery location:', e);
      }
    }

    // PRIORIDAD 3: Dirección predeterminada
    this.deliveryAddress = 'Av. Javier Prado 1234, San Isidro';
    console.warn('⚠️ Usando dirección predeterminada');
  }

  getEffectivePrice(product: any): number {
    return product.discountedPrice || product.price;
  }

  private loadCulqiScript(): void {
    // Verificar si Culqi ya está cargado
    if (typeof Culqi !== 'undefined') {
      this.configureCulqi();
      return;
    }

    // Cargar script de Culqi
    const script = document.createElement('script');
    script.src = 'https://checkout.culqi.com/js/v4';
    script.onload = () => this.configureCulqi();
    document.head.appendChild(script);
  }

  private configureCulqi(): void {
    // Configurar Culqi con clave pública de prueba
    // Para producción, usar tu clave pública real
    const publicKey = 'pk_test_e91aae7d3ffcf948'; // Clave de prueba de Culqi

    if (typeof Culqi !== 'undefined') {
      Culqi.publicKey = publicKey;
      Culqi.init();

      // Manejar respuesta de Culqi
      Culqi.options({
        lang: 'es',
        installments: false,
        modal: false,
        style: {
          logo: 'https://tambo.pe/static/version1731445023/frontend/Tambo/default/es_PE/images/logo.svg',
          maincolor: '#a81b8d',
          buttontext: '#ffffff',
          maintext: '#4A4A4A',
          desctext: '#AAAAAA',
        },
      });
    }
  }

  selectPaymentMethod(methodId: string): void {
    this.selectedPaymentMethod = methodId;

    // Resetear formulario si cambia de método
    if (methodId !== 'card') {
      this.cardForm.reset();
    }
  }

  openQRModal(): void {
    this.showQRModal = true;
    // Esperar a que el canvas esté en el DOM antes de generar el QR
    setTimeout(() => {
      this.generateQRCode();
    }, 100);
  }

  async generateQRCode(): Promise<void> {
    if (!this.qrCanvas) {
      console.error('Canvas no disponible');
      return;
    }

    const canvas = this.qrCanvas.nativeElement;

    // Datos del pago para el QR
    const paymentData = {
      method: this.selectedPaymentMethod,
      amount: this.cartSummary.total,
      currency: 'PEN',
      merchant: 'Tambo Delivery',
      merchantId: '123456789',
      orderId: 'ORD-' + Date.now(),
      description: 'Pedido Tambo Delivery',
      expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(), // 10 minutos
    };

    // Convertir a string JSON
    const qrData = JSON.stringify(paymentData);

    try {
      // Generar QR real usando la librería qrcode
      await QRCode.toCanvas(canvas, qrData, {
        width: 250,
        margin: 2,
        color: {
          dark: this.selectedPaymentMethod === 'yape' ? '#722F8A' : '#00A9E0',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      });
      console.log('QR generado exitosamente');
    } catch (error) {
      console.error('Error generando QR:', error);
    }
  }

  formatCardNumber(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    value = value.replace(/(\d{4})(?=\d)/g, '$1 ');
    event.target.value = value;
    this.cardForm.patchValue({ cardNumber: value });
  }

  formatExpiryDate(event: any): void {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.cardForm.patchValue({ expiryDate: value });
  }

  getPaymentMethodName(methodId: string | null): string {
    if (!methodId) return '';
    const method = this.paymentMethods.find((m) => m.id === methodId);
    return method ? method.name : '';
  }

  canProceed(): boolean {
    if (!this.selectedPaymentMethod) {
      return false;
    }

    if (this.selectedPaymentMethod === 'card') {
      return this.cardForm.valid;
    }

    return true;
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToAddress(): void {
    this.router.navigate(['/cart/ubicacion']);
  }

  confirmOrder(): void {
    if (!this.canProceed()) {
      this.paymentError = 'Por favor selecciona un método de pago válido';
      return;
    }

    this.processing = true;
    this.paymentError = '';

    // Guardar método de pago seleccionado
    localStorage.setItem(
      'selectedPaymentMethod',
      this.selectedPaymentMethod!.toUpperCase()
    );

    // Preparar datos del pedido
    const orderRequest = this.prepareOrderRequest();

    // Verificar token y crear pedido
    this.createOrderWithValidToken(orderRequest);
  }

  // Método que asegura tener un token válido antes de crear el pedido
  private createOrderWithValidToken(orderRequest: any): void {
    const token = localStorage.getItem('tambo_token');
    console.log('🔍 Verificando token...');
    console.log('🔑 Token existe:', !!token);

    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const exp = payload.exp;
        const now = Date.now();
        const expDate = new Date(exp * 1000);
        const nowDate = new Date(now);

        console.log('⏰ Fecha actual:', nowDate.toLocaleString());
        console.log('⏰ Token expira:', expDate.toLocaleString());
        console.log(
          '⏰ Tiempo restante:',
          Math.floor((exp * 1000 - now) / 1000),
          'segundos'
        );
      } catch (e) {
        console.error('Error decodificando token:', e);
      }
    }

    // Si el token está expirado, redirigir al login inmediatamente
    if (this.authService.isTokenExpired()) {
      console.error('❌ Token expirado, redirigiendo a login...');
      this.paymentError = 'Tu sesión ha expirado. Redirigiendo al login...';
      setTimeout(() => {
        this.router.navigate(['/auth/login'], {
          queryParams: { returnUrl: '/cart/pago' },
        });
      }, 1500);
      this.processing = false;
      return;
    }

    console.log('✅ Token válido, creando pedido...');

    // Token válido, proceder a crear el pedido
    this.orderService.createOrder(orderRequest).subscribe({
      next: (response) => {
        console.log('Pedido creado exitosamente:', response);

        // Guardar información del pedido para la página de seguimiento
        this.saveOrderDataForTracking(response);

        // Limpiar carrito
        this.cartService.clearCart();

        // Redirigir a página de seguimiento
        if (response.order && response.order.id) {
          this.router.navigate(['/cart/seguimiento'], {
            queryParams: { orderId: response.order.id },
          });
        } else {
          // Fallback si no hay orderId
          this.router.navigate(['/cart/seguimiento']);
        }

        this.processing = false;
      },
      error: (error) => {
        console.error('❌ Error al crear pedido:', error);

        const errorStatus = error?.status || error?.error?.status;
        const errorMessage =
          error?.error?.message || error?.message || 'Error desconocido';

        // Si es 401, el token expiró durante la petición - redirigir a login
        if (errorStatus === 401) {
          console.error('🚫 Token expirado durante la petición');
          this.paymentError = 'Tu sesión ha expirado. Redirigiendo al login...';
          setTimeout(() => {
            localStorage.removeItem('tambo_token');
            localStorage.removeItem('tambo_user');
            this.router.navigate(['/auth/login'], {
              queryParams: { returnUrl: '/cart/pago' },
            });
          }, 1500);
        } else {
          this.paymentError = `Error: ${errorMessage}`;
          console.error('⚠️ Error al crear pedido:', errorStatus, errorMessage);
        }

        this.processing = false;
      },
    });
  }

  saveOrderDataForTracking(response: any): void {
    // PRIORIDAD 1: Cargar dirección desde delivery-address (la que el usuario escogió)
    const addressData = localStorage.getItem('deliveryAddress');
    let deliveryLocationObj: any = null;

    if (addressData) {
      try {
        const address = JSON.parse(addressData);
        deliveryLocationObj = {
          address: address.address,
          district: address.district,
          reference: address.reference || '',
          name: address.name || 'Mi dirección',
        };
        console.log(
          '📍 Usando dirección de delivery-address:',
          deliveryLocationObj
        );
      } catch (e) {
        console.error('Error parsing deliveryAddress:', e);
      }
    }

    // PRIORIDAD 2: Fallback a deliveryLocation (del mapa)
    if (!deliveryLocationObj) {
      const locationData = localStorage.getItem('deliveryLocation');
      if (locationData) {
        try {
          deliveryLocationObj = JSON.parse(locationData);
          console.log(
            '📍 Usando dirección del mapa (fallback):',
            deliveryLocationObj
          );
        } catch (e) {
          console.error('Error parsing deliveryLocation:', e);
        }
      }
    }

    // Guardar datos del pedido en localStorage para la página de seguimiento
    const trackingData = {
      orderId: response?.order?.id || null,
      items: this.cart.items.map((item) => ({
        id: item.product.id,
        name: item.product.name,
        quantity: item.quantity,
        price: item.product.discountedPrice || item.product.price, // Precio unitario efectivo
        image: item.product.thumbnail || item.product.resources?.[0]?.url || '',
        product: item.product, // Mantener referencia al producto completo
      })),
      total: this.cartSummary.total,
      paymentMethod: this.selectedPaymentMethod,
      deliveryLocation: deliveryLocationObj,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('orderTrackingData', JSON.stringify(trackingData));
    console.log('💾 Tracking data guardado:', trackingData);
  }

  prepareOrderRequest(): OrderRequest {
    // Obtener datos del localStorage
    const paymentMethodData = this.selectedPaymentMethod || 'YAPE';
    const locationData = localStorage.getItem('deliveryLocation');

    // Mapear método de pago según los valores que acepta el backend
    const paymentMethodMap: { [key: string]: PaymentMethodEnum } = {
      YAPE: PaymentMethodEnum.YAPE,
      PLIN: PaymentMethodEnum.TRANSFERENCIA,
      CARD: PaymentMethodEnum.TARJETA_CREDITO,
      CASH: PaymentMethodEnum.EFECTIVO,
    };

    const paymentMethod =
      paymentMethodMap[paymentMethodData.toUpperCase()] ||
      PaymentMethodEnum.YAPE;

    // Preparar items del pedido
    const orderItems: OrderItemRequest[] = this.cart.items.map((item) => ({
      productId: item.product.id,
      quantity: item.quantity,
    }));

    // Preparar dirección de entrega
    let deliveryAddress: any = {
      firstName: 'Usuario',
      lastName: 'Tambo',
      phoneNumber: '987654321',
      street: this.deliveryAddress,
      district: 'San Isidro',
      province: 'Lima',
      department: 'Lima',
      references: 'Casa blanca con reja negra',
    };

    let latitude: number | undefined;
    let longitude: number | undefined;

    if (locationData) {
      try {
        const location = JSON.parse(locationData);
        latitude = location.lat;
        longitude = location.lng;
        deliveryAddress.street = location.address || deliveryAddress.street;
        deliveryAddress.district =
          location.district || deliveryAddress.district;
      } catch (e) {
        console.error('Error parsing location data:', e);
      }
    }

    // Calcular el total del pedido
    const totalAmount = this.cart.items.reduce((total: number, item: any) => {
      const price = item.product.discountedPrice || item.product.price;
      return total + price * item.quantity;
    }, 0);

    const orderRequest: OrderRequest = {
      orderDate: new Date(), // Fecha actual del pedido
      deliveryMethod: DeliveryMethod.DELIVERY,
      paymentMethod: paymentMethod,
      orderItemRequests: orderItems, // Backend espera orderItemRequests
      totalAmount: totalAmount, // Monto total calculado del carrito
      receiptType: 'BOLETA', // Por defecto boleta
      docType: 'DNI', // Por defecto DNI
      docNumber: 12345678, // Número de documento temporal
      deliveryAddress: deliveryAddress,
      latitude: latitude,
      longitude: longitude,
    };

    return orderRequest;
  }
}
