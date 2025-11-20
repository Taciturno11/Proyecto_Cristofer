import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { Utils } from '../../../utils/common.utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonComponent],
  template: `
    <div
      class="group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-[#a81b8d]/20"
    >
      <!-- Badges superiores izquierdos -->
      <div class="absolute top-3 left-3 z-10 flex flex-col gap-2">
        <!-- Badge de descuento -->
        @if (hasDiscount()) {
        <span
          class="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-bold bg-red-500 text-white shadow-md animate-pulse"
        >
          <svg class="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path
              d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"
            ></path>
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
              clip-rule="evenodd"
            ></path>
          </svg>
          -{{ product.discountPercentage }}%
        </span>
        }

        <!-- Badge de stock bajo -->
        @if (product.stock > 0 && product.stock <= 10) {
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
        >
          ¡Solo {{ product.stock }}!
        </span>
        }

        <!-- Badge de nuevo ingreso -->
        @if (product.isNewArrival) {
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
        >
          Nuevo
        </span>
        }
      </div>

      <!-- Badge de agotado -->
      @if (!product.isActive || product.stock === 0) {
      <div class="absolute top-3 left-3 z-10">
        <span
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800"
        >
          Agotado
        </span>
      </div>
      <div class="absolute inset-0 bg-gray-900/20 z-5"></div>
      }

      <!-- Imagen del producto -->
      <div class="relative aspect-square overflow-hidden bg-gray-100">
        <a [routerLink]="['/products', product.id]" class="block">
          <img
            [src]="product.resources && product.resources.length > 0 ? product.resources[0].url : 'assets/images/no-image.webp'"
            [alt]="product.name"
            class="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
        </a>

        <!-- Overlay con botón de vista rápida -->
        <div
          class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <div class="absolute bottom-4 left-4 right-4">
            <button
              (click)="onQuickView()"
              class="w-full bg-white/90 backdrop-blur-sm text-gray-900 px-4 py-2 rounded-lg font-medium text-sm hover:bg-white transition-colors"
            >
              Vista Rápida
            </button>
          </div>
        </div>
      </div>

      <!-- Contenido de la tarjeta -->
      <div class="p-4 space-y-3">
        <!-- Marca y Categoría -->
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <!-- Logo/Marca -->
            @if (product.brand) {
            <span
              class="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium bg-[#a81b8d]/10 text-[#a81b8d] border border-gray-200"
            >
              <svg
                class="w-3 h-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                ></path>
              </svg>
              {{ product.brand.name }}
            </span>
            }
            <!-- Categoría -->
            <!-- <span
              class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-[#a81b8d]/10 text-[#a81b8d]"
            >
              {{ product.category.name }}
            </span> -->
          </div>

          @if (product.isActive && product.stock > 0) {
          <div class="flex items-center text-xs text-green-600">
            <div
              class="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"
            ></div>
            Disponible
          </div>
          }
        </div>

        <!-- Título del producto -->
        <div>
          <h3
            class="text-base font-semibold text-gray-900 line-clamp-2 min-h-[3rem] group-hover:text-[#a81b8d] transition-colors"
          >
            <a [routerLink]="['/products', product.id]">
              {{ product.name }}
            </a>
          </h3>
        </div>

        <!-- Descripción -->
        <p class="text-sm text-gray-600 line-clamp-2 min-h-[2.5rem]">
          {{ product.description }}
        </p>

        <!-- Precio, descuento y rating -->
        <div
          class="flex items-end justify-between border-t border-gray-100 pt-3"
        >
          <div class="space-y-1">
            @if (hasDiscount()) {
            <!-- Precio con descuento -->
            <div class="flex items-center gap-2">
              <span class="text-xl font-bold text-red-600">
                {{ formatCurrency(product.discountedPrice || product.price) }}
              </span>
              <span
                class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-semibold bg-red-50 text-red-600"
              >
                Ahorra
                {{
                  formatCurrency(
                    product.price - (product.discountedPrice || product.price)
                  )
                }}
              </span>
            </div>
            <!-- Precio original tachado -->
            <div class="flex items-baseline gap-2">
              <span class="text-sm text-gray-400 line-through">
                {{ formatCurrency(product.price) }}
              </span>
            </div>
            } @else {
            <!-- Precio normal -->
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-[#a81b8d]">
                {{ formatCurrency(product.price) }}
              </span>
            </div>
            }
          </div>

          <!-- Rating -->
          <div class="flex flex-col items-end">
            <div class="flex items-center space-x-0.5">
              @for (star of [1,2,3,4,5]; track star) {
              <svg
                class="w-3.5 h-3.5 text-yellow-400"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"
                ></path>
              </svg>
              }
            </div>
            <span class="text-xs text-gray-500 mt-0.5">(4.5)</span>
          </div>
        </div>

        <!-- Botones de acción -->
        <div class="flex items-center gap-2 pt-2">
          @if (product.isActive && product.stock > 0) {
          <app-button
            [config]="{
              text: hasDiscount() ? '¡Aprovechar!' : 'Agregar',
              type: 'primary',
              size: 'sm'
            }"
            (buttonClick)="onAddToCart()"
            class="flex-1"
          />
          <button
            (click)="onAddToWishlist()"
            class="p-2 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
            aria-label="Agregar a favoritos"
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
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 000-6.364 4.5 4.5 0 00-6.364 0L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
          </button>
          } @else {
          <div
            class="flex-1 text-center py-2 px-4 bg-gray-100 text-gray-500 rounded-lg text-sm font-medium"
          >
            @if (!product.isActive) { No Disponible } @else { Agotado }
          </div>
          }
        </div>

        <!-- Stock indicator bar -->
        @if (product.isActive && product.stock > 0 && product.stock <= 20) {
        <div class="space-y-1">
          <div class="flex justify-between text-xs">
            <span class="text-gray-500">Stock disponible:</span>
            <span class="font-medium text-gray-700"
              >{{ product.stock }} unid.</span
            >
          </div>
          <div class="w-full bg-gray-200 rounded-full h-1.5">
            <div
              class="h-1.5 rounded-full transition-all duration-300"
              [class]="getStockBarClass()"
              [style.width.%]="getStockPercentage()"
            ></div>
          </div>
        </div>
        }
      </div>
    </div>
  `,
})
export class ProductCardComponent {
  @Input() product!: Product;
  @Output() addToCart = new EventEmitter<Product>();
  @Output() addToWishlist = new EventEmitter<Product>();
  @Output() quickView = new EventEmitter<Product>();

  formatCurrency(price: number): string {
    return Utils.formatCurrency(price);
  }

  hasDiscount(): boolean {
    return !!(
      this.product.discountPercentage && this.product.discountPercentage > 0
    );
  }

  onAddToCart(): void {
    console.log(
      '🛒 ProductCard: Emitting addToCart event for product:',
      this.product
    );
    this.addToCart.emit(this.product);
  }

  onAddToWishlist(): void {
    this.addToWishlist.emit(this.product);
  }

  onQuickView(): void {
    this.quickView.emit(this.product);
  }

  getStockBarClass(): string {
    const percentage = this.getStockPercentage();
    if (percentage <= 25) return 'bg-red-500';
    if (percentage <= 50) return 'bg-orange-500';
    return 'bg-green-500';
  }

  getStockPercentage(): number {
    // Asumimos un stock máximo de 100 para el cálculo del porcentaje
    const maxStock = 100;
    return Math.min((this.product.stock / maxStock) * 100, 100);
  }
}
