import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../models/product.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { Utils } from '../../../utils/common.utils';
import { ProductService } from '../services/product.service';
import { CartService } from '../../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      @if (isLoading) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
        </div>
      } @else if (error) {
        <div class="text-center py-12">
          <div class="text-red-600 text-lg mb-4">
            <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            {{ error }}
          </div>
          <button 
            (click)="ngOnInit()" 
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      } @else if (product) {
        <div class="max-w-6xl mx-auto">
          <!-- Breadcrumb -->
          <nav class="flex mb-8" aria-label="Breadcrumb">
            <ol class="inline-flex items-center space-x-1 md:space-x-3">
              <li>
                <a routerLink="/products" class="text-gray-700 hover:text-indigo-600">
                  Productos
                </a>
              </li>
              <li>
                <div class="flex items-center">
                  <svg class="w-6 h-6 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd"></path>
                  </svg>
                  <span class="ml-1 text-gray-500">{{ product.name }}</span>
                </div>
              </li>
            </ol>
          </nav>

          <div class="lg:grid lg:grid-cols-2 lg:gap-x-8 lg:items-start">
            <!-- Imagen del producto -->
            <div class="flex flex-col-reverse">
              <div class="aspect-w-1 aspect-h-1 w-full">
                <img 
                  [src]="product.thumbnail || ''" 
                  [alt]="product.name"
                  class="w-full h-full object-center object-cover sm:rounded-lg"
                />
              </div>
            </div>

            <!-- Información del producto -->
            <div class="mt-10 px-4 sm:px-0 sm:mt-16 lg:mt-0">
              <h1 class="text-3xl font-extrabold tracking-tight text-gray-900">
                {{ product.name }}
              </h1>

              <div class="mt-3">
                <p class="text-3xl text-gray-900 font-bold">
                  {{ formatCurrency(product.price) }}
                </p>
              </div>

              <!-- Disponibilidad -->
              <div class="mt-6">
                @if (product.isActive && product.stock > 0) {
                  <div class="flex items-center">
                    <svg class="flex-shrink-0 h-5 w-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="ml-2 text-sm text-gray-500">En stock ({{ product.stock }} disponibles)</p>
                  </div>
                } @else {
                  <div class="flex items-center">
                    <svg class="flex-shrink-0 h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd"></path>
                    </svg>
                    <p class="ml-2 text-sm text-gray-500">Producto agotado</p>
                  </div>
                }
              </div>

              <div class="mt-6">
                <h3 class="sr-only">Descripción</h3>
                <div class="text-base text-gray-700 space-y-6">
                  <p>{{ product.description }}</p>
                </div>
              </div>

              <!-- Categoría -->
              <div class="mt-6">
                <p class="text-sm font-medium text-gray-900">Categoría:</p>
                <span class="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                  {{ product.category.name }}
                </span>
              </div>

              <!-- Cantidad y botón agregar -->
              <form class="mt-10">
                <div class="flex items-center space-x-3 mb-6">
                  <label for="quantity" class="block text-sm font-medium text-gray-700">
                    Cantidad:
                  </label>
                  <select 
                    id="quantity" 
                    [(ngModel)]="selectedQuantity"
                    name="quantity"
                    class="max-w-full rounded-md border border-gray-300 py-1.5 text-base leading-5 font-medium text-gray-700 text-left shadow-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    [disabled]="!product.isActive || product.stock === 0"
                  >
                    @for (i of getQuantityOptions(); track i) {
                      <option [value]="i">{{ i }}</option>
                    }
                  </select>
                </div>

                <app-button
                  [config]="{
                    text: 'Agregar al Carrito',
                    type: 'primary',
                    size: 'lg',
                    disabled: !product.isActive || product.stock === 0
                  }"
                  (buttonClick)="addToCart()"
                  class="w-full"
                />

                <div class="mt-4">
                  <app-button
                    [config]="{
                      text: 'Volver a Productos',
                      type: 'secondary',
                      size: 'md'
                    }"
                    (buttonClick)="goBack()"
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      } @else {
        <div class="text-center py-12">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">Producto no encontrado</h2>
          <p class="text-gray-600 mb-6">El producto que buscas no existe o no está disponible.</p>
          <app-button
            [config]="{
              text: 'Volver a Productos',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="goBack()"
          />
        </div>
      }
    </div>
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  isLoading = true;
  selectedQuantity = 1;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productService: ProductService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadProduct(id);
    }
  }

  loadProduct(id: string): void {
    this.isLoading = true;
    this.error = null;
    
    this.productService.getProductBySlug(id).subscribe({
      next: (product) => {
        this.product = product;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('Error loading product:', error);
        this.error = 'Error al cargar el producto. Por favor, inténtelo de nuevo.';
        this.product = null;
        this.isLoading = false;
      }
    });
  }

  getQuantityOptions(): number[] {
    if (!this.product) return [1];
    const maxQuantity = Math.min(this.product.stock, 10);
    return Array.from({ length: maxQuantity }, (_, i) => i + 1);
  }

  addToCart(): void {
    if (this.product) {
      // Agregar la cantidad seleccionada al carrito
      for (let i = 0; i < this.selectedQuantity; i++) {
        this.cartService.addToCart(this.product);
      }
      // console.log(`${this.selectedQuantity} unidad(es) de ${this.product.name} agregado(s) al carrito`);
    }
  }

  goBack(): void {
    this.router.navigate(['/products']);
  }

  formatCurrency(amount: number): string {
    return Utils.formatCurrency(amount);
  }
}
