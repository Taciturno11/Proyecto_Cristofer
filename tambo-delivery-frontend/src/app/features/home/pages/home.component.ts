import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../products/services/product.service';
import { Product } from '../../../models/product.model';
import { Category } from '../../../models/category.model';
import { CartService } from '../../../services/cart.service';
import { ProductCardComponent } from '../../products/components/product-card.component';
import { forkJoin } from 'rxjs';

interface SliderImage {
  desktop: string;
  mobile: string;
  alt: string;
}

interface CategoryProducts {
  category: Category;
  products: Product[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, ProductCardComponent],
  template: `
    <div class="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <!-- Slider -->
      <div class="relative w-full overflow-hidden">
        <!-- Contenedor de slider -->
        <div class="relative w-full">
          <!-- Slides -->
          <div
            class="flex transition-transform duration-500 ease-in-out"
            [style.transform]="'translateX(-' + currentSlide * 100 + '%)'"
          >
            <div
              *ngFor="let image of sliderImages; let i = index"
              class="w-full flex-shrink-0 bg-gray-100"
            >
              <!-- Desktop -->
              <img
                [src]="image.desktop"
                [alt]="image.alt"
                class="w-full h-auto object-contain hidden md:block"
                [loading]="i === 0 ? 'eager' : 'lazy'"
              />
              <!-- Mobile -->
              <img
                [src]="image.mobile"
                [alt]="image.alt"
                class="w-full h-auto object-contain block md:hidden"
                [loading]="i === 0 ? 'eager' : 'lazy'"
              />
            </div>
          </div>

          <!-- Flechas de navegación -->
          <button
            (click)="previousSlide()"
            class="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            aria-label="Imagen anterior"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
          </button>

          <button
            (click)="nextSlide()"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            aria-label="Siguiente imagen"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              ></path>
            </svg>
          </button>

          <!-- Indicadores (puntos) -->
          <div
            class="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-2"
          >
            <button
              *ngFor="let image of sliderImages; let i = index"
              (click)="goToSlide(i)"
              [class]="
                'w-3 h-3 rounded-full transition-all duration-500 cursor-pointer border-2 ' +
                (currentSlide === i
                  ? 'bg-[#a81b8d] border-[#a81b8d] shadow-lg shadow-[#a81b8d]/50 scale-125'
                  : 'bg-white/90 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d]/20 hover:scale-110')
              "
              [attr.aria-label]="'Ir a imagen ' + (i + 1)"
            ></button>
          </div>

          <!-- Controles de auto-reproducción (pause/stop) -->
          <button
            (click)="toggleAutoPlay()"
            class="absolute top-4 right-4 bg-white/90 border-2 border-gray-400 hover:border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white text-gray-700 p-2 rounded-full transition-all duration-500 z-10 cursor-pointer shadow-lg backdrop-blur-sm"
            [attr.aria-label]="
              isAutoPlaying ? 'Pausar slider' : 'Reproducir slider'
            "
          >
            <svg
              *ngIf="isAutoPlaying"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 9v6m4-6v6"
              ></path>
            </svg>
            <svg
              *ngIf="!isAutoPlaying"
              class="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1M9 16v-6a1 1 0 011-1h4a1 1 0 011 1v6"
              ></path>
            </svg>
          </button>
        </div>
      </div>

      <!-- Sección de Productos Destacados -->
      <div class="py-16 lg:py-20">
        <div class="container mx-auto px-4">
          <!-- Header de la sección -->
          <div class="text-center mb-12">
            <h2 class="font-bold text-3xl lg:text-4xl text-center mb-4">
              Nuestros <span class="text-[#a81b8d]">productos</span>
            </h2>
            <p class="text-gray-600 mt-2 max-w-2xl mx-auto text-center text-lg">
              Descubre la mejor calidad y nuestras ofertas disponibles
            </p>
          </div>
          
          <!-- Loading State -->
          <div *ngIf="isLoading" class="flex justify-center items-center py-12">
            <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a81b8d]"></div>
          </div>

          <!-- Error State -->
          <div *ngIf="error && !isLoading" class="text-center py-12">
            <div class="text-red-600 text-lg mb-4">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
              </svg>
              {{ error }}
            </div>
            <button 
              (click)="loadProducts()" 
              class="bg-[#a81b8d] hover:bg-[#8a1674] text-white px-6 py-2 rounded-lg transition-colors"
            >
              Intentar de nuevo
            </button>
          </div>

          <!-- Products by Category -->
          <div *ngIf="!isLoading && !error && categoryProducts.length > 0">
            <div *ngFor="let categoryData of categoryProducts; trackBy: trackByCategory" class="mb-16">
              <!-- Category Header -->
              <div class="flex justify-between items-center mb-8">
                <div>
                  <h3 class="text-2xl font-bold text-gray-800 mb-2">{{ categoryData.category.name }}</h3>
                  <!-- <p *ngIf="categoryData.category.description" class="text-gray-600">{{ categoryData.category.description }}</p> -->
                </div>
                <button
                  (click)="navigateToCategory(categoryData.category.id)"
                  class="bg-[#a81b8d] hover:bg-[#8a1674] text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Ver más
                </button>
              </div>
              
              <!-- Products Grid for Category -->
              <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                <app-product-card
                  *ngFor="let product of categoryData.products; trackBy: trackByProduct"
                  [product]="product"
                  (addToCart)="addToCart($event)"
                  (addToWishlist)="addToWishlist($event)"
                  (quickView)="quickView($event)"
                ></app-product-card>
              </div>
            </div>
          </div>

          <!-- No Products State -->
          <div *ngIf="!isLoading && !error && categoryProducts.length === 0" class="text-center py-12">
            <div class="text-gray-500 text-lg">
              <svg class="w-16 h-16 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
              </svg>
              No hay productos disponibles en este momento
            </div>
          </div>

          <!-- Ver todos los productos -->
          <div *ngIf="!isLoading && !error && categoryProducts.length > 0" class="text-center">
            <button
              [routerLink]="['/products']"
              class="bg-[#a81b8d] hover:bg-[#8a1674] text-white px-8 py-3 rounded-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Ver todos los productos
            </button>
          </div>
        </div>
      </div>
      <!-- Features Section -->
      <div class="py-16 lg:py-20 bg-gray-50">
        <div class="container mx-auto px-4">
          <div class="text-center mb-16">
            <h2 class="font-bold text-3xl lg:text-4xl text-center">
              ¿Qué nos hace <span class="text-yellow-500">diferentes</span>?
            </h2>
            <p class="text-gray-500 mt-2 max-w-2xl mx-auto text-center">
              Descubre las ventajas que hacen de nuestra tienda tu mejor opción
            </p>
          </div>

          <div class="grid md:grid-cols-3 gap-8">
            <div class="text-center">
              <div
                class="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Entrega Rápida
              </h3>
              <p class="text-gray-500">
                Recibe tus pedidos en tiempo récord con nuestro sistema de
                entrega optimizado.
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Calidad Garantizada
              </h3>
              <p class="text-gray-500">
                Productos frescos y de la mejor calidad, seleccionados
                especialmente para ti.
              </p>
            </div>
            <div class="text-center">
              <div
                class="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 scale-up"
              >
                <svg
                  class="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  ></path>
                </svg>
              </div>
              <h3 class="text-xl font-semibold text-gray-800 mb-2">
                Mejores Precios
              </h3>
              <p class="text-gray-500">
                Ofertas competitivas y descuentos especiales para nuestros
                clientes.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      /* Animación de scale-up */
      .scale-up {
        transition: transform 1.2s ease;
      }
      .scale-up:hover {
        transform: scale(1.2);
      }
    `,
  ],
})
export class HomeComponent implements OnInit, OnDestroy {
  currentSlide = 0;
  isAutoPlaying = true;
  private autoPlayInterval: any;
  private readonly autoPlayDelay = 4000; // 4 segundos

  // Estado de carga
  isLoading = false;
  error: string | null = null;
  
  // Productos destacados (solo del backend)
  featuredProducts: Product[] = [];
  
  // Productos por categoría
  categoryProducts: CategoryProducts[] = [];

  sliderImages: SliderImage[] = [
    {
      desktop: 'assets/slider/banner-01-desktop.webp',
      mobile: 'assets/slider/banner-01-mobile.webp',
      alt: 'Banner promocional 1',
    },
    {
      desktop: 'assets/slider/banner-02-desktop.webp',
      mobile: 'assets/slider/banner-02-mobile.webp',
      alt: 'Banner promocional 2',
    },
    {
      desktop: 'assets/slider/banner-03-desktop.webp',
      mobile: 'assets/slider/banner-03-mobile.webp',
      alt: 'Banner promocional 3',
    },
    {
      desktop: 'assets/slider/banner-04-desktop.webp',
      mobile: 'assets/slider/banner-04-mobile.webp',
      alt: 'Banner promocional 4',
    },
    {
      desktop: 'assets/slider/banner-05-desktop.webp',
      mobile: 'assets/slider/banner-05-mobile.webp',
      alt: 'Banner promocional 5',
    },
    {
      desktop: 'assets/slider/banner-06-desktop.webp',
      mobile: 'assets/slider/banner-06-mobile.webp',
      alt: 'Banner promocional 6',
    },
  ];

  constructor(
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.startAutoPlay();
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  loadProducts(): void {
    // console.log('[Home] Iniciando carga de productos por categorías...');
    this.isLoading = true;
    this.error = null;

    // Cargar productos agrupados por categorías (6 productos por categoría)
    this.productService.getProductsByCategories(6).subscribe({
      next: (categoryProducts) => {
        // console.log('[Home] Productos por categorías cargados exitosamente:', categoryProducts);
        this.categoryProducts = categoryProducts.filter(cp => cp.products.length > 0); // Solo mostrar categorías con productos
        this.isLoading = false;
      },
      error: (error) => {
        console.error('[Home] Error al cargar productos por categorías:', error);
        this.error = 'Error al cargar los productos. Por favor, inténtelo de nuevo.';
        this.categoryProducts = [];
        this.isLoading = false;
      }
    });
  }

  // Métodos del slider
  nextSlide(): void {
    this.currentSlide = (this.currentSlide + 1) % this.sliderImages.length;
  }

  previousSlide(): void {
    this.currentSlide =
      this.currentSlide === 0
        ? this.sliderImages.length - 1
        : this.currentSlide - 1;
  }

  goToSlide(index: number): void {
    this.currentSlide = index;
  }

  toggleAutoPlay(): void {
    if (this.isAutoPlaying) {
      this.stopAutoPlay();
    } else {
      this.startAutoPlay();
    }
    this.isAutoPlaying = !this.isAutoPlaying;
  }

  private startAutoPlay(): void {
    this.autoPlayInterval = setInterval(() => {
      this.nextSlide();
    }, this.autoPlayDelay);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayInterval) {
      clearInterval(this.autoPlayInterval);
      this.autoPlayInterval = null;
    }
  }

  // Navegación a categoría específica
  navigateToCategory(categoryId: string): void {
    this.router.navigate(['/products'], { queryParams: { category: categoryId } });
  }

  // Métodos para manejar eventos del ProductCard
  addToCart(product: Product): void {
    this.cartService.addToCart(product);
    // console.log('Producto agregado al carrito:', product.name);
  }

  addToWishlist(product: Product): void {
    // console.log('Producto agregado a favoritos:', product.name);
    // Implementar lógica de favoritos en el futuro
  }

  quickView(product: Product): void {
    // console.log('Vista rápida del producto:', product.name);
    // Navegar al detalle del producto
    this.router.navigate(['/products', product.id]);
  }

  // TrackBy functions para optimizar el rendering
  trackByCategory(index: number, item: CategoryProducts): string {
    return item.category.id;
  }

  trackByProduct(index: number, item: Product): string {
    return item.id;
  }
}
