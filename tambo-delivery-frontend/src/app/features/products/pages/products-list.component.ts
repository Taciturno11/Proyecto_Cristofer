import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Product, ProductFilter } from '../../../models/product.model';
import { ProductSection } from '../../../models/product-section.model';
import { Category } from '../../../models/category.model';
import { ProductService } from '../services/product.service';
import { CartService } from '../../../services/cart.service';
import { ProductCardComponent } from '../components/product-card.component';
import { Utils } from '../../../utils/common.utils';

@Component({
  selector: 'app-products-list',
  standalone: true,
  imports: [CommonModule, FormsModule, ProductCardComponent],
  template: `
    <div class="container mx-auto px-4 py-8">
      <!-- Category Header when filtered -->
      @if (selectedCategoryId && getCurrentCategory()) {
      <div class="mb-8">
        <div class="flex items-center space-x-4">
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-gray-900">
              {{ getCurrentCategory()?.name }}
            </h1>
            <p
              *ngIf="getCurrentCategory()?.description"
              class="text-gray-600 mt-2"
            >
              {{ getCurrentCategory()?.description }}
            </p>
          </div>
          <div class="text-sm text-gray-500">
            {{ products.length }} producto{{ products.length !== 1 ? 's' : '' }}
          </div>
        </div>
      </div>
      }

      <div class="flex justify-between items-center mb-8">
        <h1
          *ngIf="!selectedCategoryId"
          class="text-3xl font-bold text-gray-900"
        >
          Nuestros Productos
        </h1>
        <div class="flex items-center space-x-4">
          <!-- Filtro por precio -->
          <select
            [(ngModel)]="priceRange"
            (change)="onPriceRangeChange()"
            class="w-full px-3 py-2 text-sm text-gray-500 placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] cursor-pointer"
          >
            <option value="">Todos los precios</option>
            <option value="0-10" class="text-gray-900">S/ 0 - S/ 10</option>
            <option value="10-20" class="text-gray-900">S/ 10 - S/ 20</option>
            <option value="20-50" class="text-gray-900">S/ 20 - S/ 50</option>
            <option value="50+" class="text-gray-900">S/ 50+</option>
          </select>

          <!-- Búsqueda -->
          <input
            type="text"
            [(ngModel)]="searchTerm"
            (input)="onSearchChange()"
            placeholder="Buscar productos..."
            class="w-full px-3 py-2 text-sm placeholder-gray-500 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
          />
        </div>
      </div>

      <!-- Indicador de carga -->
      @if (isLoading) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"
        ></div>
        <p class="ml-3 text-gray-600">Cargando productos...</p>
      </div>
      }

      <!-- Lista de productos -->
      @if (!isLoading && products.length > 0) {
      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        @for (product of products; track product.id) {
        <app-product-card
          [product]="product"
          (addToCart)="addToCart($event)"
          (addToWishlist)="addToWishlist($event)"
          (quickView)="quickView($event)"
        />
        }
      </div>
      } @if (products.length === 0 && !isLoading) {
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
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2m-2 0H6m0 0H4m2 0v5a2 2 0 002 2h8a2 2 0 002-2v-5"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No hay productos disponibles
        </h3>
        <p class="text-gray-600">
          Vuelve más tarde para ver nuestros productos.
        </p>
      </div>
      }
    </div>
  `,
})
export class ProductsListComponent implements OnInit {
  products: Product[] = [];
  categories: Category[] = [];
  productSections: ProductSection[] = [];
  isLoading = false;
  error: string | null = null;

  // Filtros
  selectedCategoryId = '';
  selectedCategoryTypeId = '';
  priceRange = '';
  searchTerm = '';

  private currentFilter: ProductFilter = {};

  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    // Verificar si hay parámetros de ruta (route params)
    this.route.params.subscribe((params) => {
      if (params['categoryId']) {
        this.selectedCategoryId = params['categoryId'];
        this.currentFilter.categoryId = params['categoryId'];
      }
    });

    // Verificar si hay parámetros de consulta (query params)
    this.route.queryParams.subscribe((params) => {
      // console.log('Query params:', params);

      if (params['category'] && !this.selectedCategoryId) {
        this.selectedCategoryId = params['category'];
        this.currentFilter.categoryId = params['category'];
      }

      // Nuevo: Filtro por tipo de categoría
      if (params['categoryType']) {
        this.selectedCategoryTypeId = params['categoryType'];
      }

      // Aceptar tanto 'buscar' como 'search' para compatibilidad
      if (params['search'] || params['buscar']) {
        this.searchTerm = params['search'] || params['buscar'];
        this.currentFilter.name = this.searchTerm;
      }

      this.loadInitialData();
    });
  }

  private loadInitialData(): void {
    this.isLoading = true;
    // console.log('=== CARGANDO PRODUCTOS EN /products ===');
    // console.log('🔍 Filtro actual:', this.currentFilter);

    // Cargar productos con el filtro actual
    this.productService.getProducts(this.currentFilter).subscribe({
      next: (products) => {
        this.products = products || [];
        // console.log('✅ Productos cargados desde backend:', this.products.length, 'productos');

        if (this.currentFilter.categoryId) {
          // console.log(`📂 Filtrando por categoría: ${this.currentFilter.categoryId}`);
          const filteredProducts = this.products.filter(
            (p) => p.category?.id === this.currentFilter.categoryId
          );
          // console.log(`🎯 Productos de la categoría ${this.currentFilter.categoryId}:`, filteredProducts.length, 'productos');
          this.products = filteredProducts;
        }

        // Nuevo: Filtrar por tipo de categoría si se especifica
        if (this.selectedCategoryTypeId) {
          // console.log(`📂 Filtrando por tipo de categoría: ${this.selectedCategoryTypeId}`);
          this.products = this.products.filter(
            (p) => p.categoryType?.id === this.selectedCategoryTypeId
          );
          // console.log(`🎯 Productos del tipo ${this.selectedCategoryTypeId}:`, this.products.length, 'productos');
        }

        if (this.currentFilter.name) {
          // console.log(`🔍 Filtrando por búsqueda: "${this.currentFilter.name}"`);
          const searchTerm = this.currentFilter.name.toLowerCase();
          this.products = this.products.filter(
            (p) =>
              p.name.toLowerCase().includes(searchTerm) ||
              p.description.toLowerCase().includes(searchTerm)
          );
          // console.log(`🎯 Productos que coinciden con "${this.currentFilter.name}":`, this.products.length);
        }

        // console.log('📦 Productos finales a mostrar:', this.products);
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error loading products:', error);
        this.error =
          'Error al cargar los productos. Por favor, inténtelo de nuevo.';
        this.products = [];
        this.isLoading = false;
      },
    });

    // Cargar categorías públicas
    this.productService.getPublicCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
        // console.log('Categorías cargadas:', this.categories);
      },
      error: (error) => {
        console.error('Error loading categories:', error);
        this.categories = [];
      },
    });

    // Cargar secciones (con fallback)
    this.productService.getProductSections().subscribe({
      next: (sections) => {
        this.productSections = sections || [];
      },
      error: (error) => {
        console.error('Error loading product sections:', error);
        this.productSections = [];
      },
    });
  }

  onPriceRangeChange(): void {
    if (this.priceRange) {
      if (this.priceRange === '50+') {
        this.currentFilter.minPrice = 50;
        this.currentFilter.maxPrice = undefined;
      } else {
        const [min, max] = this.priceRange.split('-').map(Number);
        this.currentFilter.minPrice = min;
        this.currentFilter.maxPrice = max;
      }
    } else {
      this.currentFilter.minPrice = undefined;
      this.currentFilter.maxPrice = undefined;
    }
    this.loadProducts();
  }

  onSearchChange(): void {
    // Debounce la búsqueda
    if (this.searchTerm.length >= 3 || this.searchTerm.length === 0) {
      this.currentFilter.name = this.searchTerm || undefined;
      this.loadProducts();
    }
  }

  private loadProducts(): void {
    this.isLoading = true;
    this.productService.getProducts(this.currentFilter).subscribe({
      next: (products) => {
        this.products = products;
        this.isLoading = false;
      },
      error: (error) => {
        this.error =
          'Error al cargar los productos. Por favor, inténtelo de nuevo.';
        console.error('Error loading products:', error);
        this.products = [];
        this.isLoading = false;
      },
    });
  }

  addToCart(product: Product): void {
    // console.log('📦 ProductsList: Adding product to cart:', product);
    this.cartService.addToCart(product);
    // console.log('📦 ProductsList: Product added to cart successfully');
    // TODO: Mostrar notificación toast en lugar de alert
    // console.log(`${product.name} agregado al carrito`);
  }

  formatCurrency(amount: number): string {
    return Utils.formatCurrency(amount);
  }

  addToWishlist(product: Product): void {
    // TODO: Implementar servicio de favoritos
    // console.log(`${product.name} agregado a favoritos`);
  }

  quickView(product: Product): void {
    // TODO: Implementar modal de vista rápida
    // console.log(`Vista rápida de ${product.name}`);
  }

  /**
   * Obtiene la cantidad de un producto específico en el carrito
   */
  getProductQuantity(productId: string): number {
    return this.cartService.getProductQuantity(productId);
  }

  /**
   * Verifica si un producto está en el carrito
   */
  isProductInCart(productId: string): boolean {
    return this.cartService.isProductInCart(productId);
  }

  /**
   * Obtiene la categoría actual seleccionada
   */
  getCurrentCategory(): Category | undefined {
    return this.categories.find((cat) => cat.id === this.selectedCategoryId);
  }
}
