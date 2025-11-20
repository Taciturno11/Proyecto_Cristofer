import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { 
  Product, 
  ProductFilter, 
  CreateProductCompleteDto,
  ProductPhase1Data,
  ProductResource
} from '../../../models/product.model';
import { ProductSection } from '../../../models/product-section.model';
import { Category, CategoryType } from '../../../models/category.model';
import { Brand } from '../../../models/brand.model';
import { Discount } from '../../../models/discount.model';
import { API_ENDPOINTS } from '../../../constants/app.constants';

// DTOs para el backend Spring Boot (mantener compatibilidad)
export interface CreateProductRequest {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  categoryTypeId: string;
  thumbnail?: string;
  isNewArrival?: boolean;
  isActive?: boolean;
}

export interface UpdateProductRequest extends CreateProductRequest {
  id: string;
  resources?: ProductResource[];
  discountIds?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) {}

  // ============================== PRODUCTOS PÚBLICOS ==============================

  /**
   * Obtener productos con filtros (público)
   */
  getProducts(filter: ProductFilter = {}): Observable<Product[]> {
    let params = new HttpParams();

    if (filter.categoryId) params = params.set('categoryId', filter.categoryId);
    if (filter.typeId) params = params.set('typeId', filter.typeId);
    if (filter.slug) params = params.set('slug', filter.slug);
    if (filter.name) params = params.set('name', filter.name);
    if (filter.minPrice) params = params.set('minPrice', filter.minPrice.toString());
    if (filter.maxPrice) params = params.set('maxPrice', filter.maxPrice.toString());
    if (filter.newArrival !== undefined) params = params.set('newArrival', filter.newArrival.toString());

    const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCTS}`;
    // console.log('🌐 [ProductService] GET:', url, 'params:', params.toString());

    return this.http.get<Product[]>(url, { params }).pipe(
      map((products: Product[]) => {
        // console.log('✅ [ProductService] Productos recibidos:', products?.length || 0);
        return products || [];
      }),
      catchError((error) => {
        console.error('❌ [ProductService] Error en getProducts:', error);
        return this.handleError(error);
      })
    );
  }

  /**
   * Obtener un producto por slug (público)
   */
  getProductBySlug(slug: string): Observable<Product> {
    return this.getProducts({ slug }).pipe(
      map(products => {
        if (products.length === 0) {
          throw new Error('Producto no encontrado');
        }
        return products[0];
      })
    );
  }

  /**
   * Buscar productos por nombre (público)
   */
  searchProducts(searchTerm: string): Observable<Product[]> {
    return this.getProducts({ name: searchTerm });
  }

  /**
   * Obtener secciones de productos (público)
   */
  getProductSections(): Observable<ProductSection[]> {
    return this.http.get<ProductSection[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCT_SECTIONS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener categorías públicas (para mostrar en header/navegación)
   */
  getPublicCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.CATEGORIES}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener productos agrupados por categorías (para home page)
   */
  getProductsByCategories(limit: number = 6): Observable<{category: Category, products: Product[]}[]> {
    // console.log('🏠 [ProductService] Obteniendo productos por categorías con límite:', limit);
    
    return this.getPublicCategories().pipe(
      map((categories: Category[]) => {
        // console.log('📂 [ProductService] Categorías obtenidas:', categories.length);
        return categories.sort((a, b) => a.name.localeCompare(b.name)); // Ordenar alfabéticamente
      }),
      switchMap((categories: Category[]) => {
        // console.log('🔄 [ProductService] Obteniendo productos para cada categoría...');
        const requests = categories.map((category: Category) => {
          // Usar el nuevo endpoint optimizado por categoría
          let params = new HttpParams()
            .set('categoryId', category.id)
            .set('limit', limit.toString());
          
          const url = `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.PUBLIC.PRODUCTS_BY_CATEGORY}`;
          
          return this.http.get<Product[]>(url, { params }).pipe(
            map((products: Product[]) => {
              // console.log(`📦 [ProductService] Categoría "${category.name}" (ID: ${category.id}): ${products.length} productos encontrados`);
              if (products.length > 0) {
                // console.log(`📦 [ProductService] Primeros productos de "${category.name}":`, products.slice(0, 3).map(p => ({ id: p.id, name: p.name })));
              }
              return {
                category,
                products: products // Ya viene limitado desde el backend
              };
            }),
            catchError((error) => {
              console.error(`❌ [ProductService] Error obteniendo productos para categoría "${category.name}":`, error);
              return [{
                category,
                products: []
              }];
            })
          );
        });
        return forkJoin(requests);
      }),
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - PRODUCTOS ==============================

  /**
   * Obtener todos los productos (admin)
   */
  getAllProductsAdmin(): Observable<Product[]> {
    return this.http.get<Product[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear producto completo en una sola petición (admin)
   * Soporta datos básicos, recursos/imágenes y asignación de descuentos
   */
  createProductComplete(productData: CreateProductCompleteDto): Observable<Product> {
    return this.http.post<Product>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCT_CREATE}`,
      productData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar producto (admin)
   */
  updateProduct(productId: string, productData: UpdateProductRequest): Observable<Product> {
    return this.http.put<Product>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCT_UPDATE}/${productId}`,
      productData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar producto (admin)
   */
  deleteProduct(productId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCT_DELETE}/${productId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - MARCAS ==============================

  /**
   * Obtener todas las marcas (admin)
   */
  getAllBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRANDS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear marca (admin)
   */
  createBrand(brandData: { name: string; description?: string; imageUrl?: string }): Observable<Brand> {
    return this.http.post<Brand>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRAND_CREATE}`,
      brandData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar marca (admin)
   */
  updateBrand(brandId: string, brandData: { name: string; description?: string; imageUrl?: string }): Observable<Brand> {
    return this.http.put<Brand>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRAND_UPDATE}/${brandId}`,
      brandData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar marca (admin)
   */
  deleteBrand(brandId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.BRAND_DELETE}/${brandId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - CATEGORÍAS ==============================

  /**
   * Obtener todas las categorías (admin)
   */
  getAllCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORIES}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear categoría (admin) con tipos asociados
   */
  createCategory(categoryData: Category): Observable<Category> {
    return this.http.post<Category>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_CREATE}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar categoría (admin) con tipos asociados
   */
  updateCategory(categoryId: string, categoryData: Category): Observable<Category> {
    return this.http.put<Category>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_UPDATE}/${categoryId}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar categoría (admin)
   */
  deleteCategory(categoryId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_DELETE}/${categoryId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - TIPOS DE CATEGORÍAS ==============================

  /**
   * Obtener todos los tipos de categoría (admin)
   */
  getAllCategoryTypes(): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPES}`
    ).pipe(
      catchError(this.handleError)
    );
  }
  
  /**
   * Obtener tipos de categoría por ID de categoría (admin)
   */
  getAllCategoryTypesByCategory(categoryId: string): Observable<CategoryType[]> {
    return this.http.get<CategoryType[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPES_BY_CATEGORY}/${categoryId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Obtener un tipo de categoría por ID (admin)
   */
  getCategoryTypeById(categoryTypeId: string): Observable<CategoryType> {
    return this.http.get<CategoryType>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPES_BY_ID}/${categoryTypeId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear tipo de categoría (admin)
   */
  createCategoryType(categoryData: { name: string; description?: string; }): Observable<CategoryType> {
    return this.http.post<CategoryType>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPE_CREATE}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar tipo de categoría (admin)
   */
  updateCategoryType(categoryTypeId: string, categoryData: { name: string; description?: string; imageUrl?: string }): Observable<CategoryType> {
    return this.http.put<CategoryType>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPE_UPDATE}/${categoryTypeId}`,
      categoryData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar tipo de categoría (admin)
   */
  deleteCategoryType(categoryTypeId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.CATEGORY_TYPE_DELETE}/${categoryTypeId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== ADMIN - DESCUENTOS ==============================

  /**
   * Obtener todos los descuentos (admin)
   */
  getAllDiscounts(): Observable<Discount[]> {
    return this.http.get<Discount[]>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.DISCOUNTS}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Crear descuento (admin)
   */
  createDiscount(discountData: { name: string; percentage: number; startDate?: Date; endDate?: Date; isActive: boolean }): Observable<Discount> {
    return this.http.post<Discount>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.DISCOUNT_CREATE}`,
      discountData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Actualizar descuento (admin)
   */
  updateDiscount(discountId: string, discountData: { name: string; percentage: number; startDate?: Date; endDate?: Date; isActive: boolean }): Observable<Discount> {
    return this.http.put<Discount>(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.DISCOUNT_UPDATE}/${discountId}`,
      discountData
    ).pipe(
      catchError(this.handleError)
    );
  }

  /**
   * Eliminar descuento (admin)
   */
  deleteDiscount(discountId: string): Observable<any> {
    return this.http.delete(
      `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.DISCOUNT_DELETE}/${discountId}`
    ).pipe(
      catchError(this.handleError)
    );
  }

  // ============================== MANEJO DE ERRORES ==============================

  private handleError(error: any): Observable<never> {
    let errorMessage = 'Ha ocurrido un error';
    
    console.error('❌ [ProductService] Error completo:', error);
    console.error('❌ [ProductService] Error status:', error.status);
    console.error('❌ [ProductService] Error statusText:', error.statusText);
    console.error('❌ [ProductService] Error url:', error.url);
    
    if (error.status === 401) {
      errorMessage = 'Error de autorización - El endpoint requiere autenticación';
      console.error('🔒 [ProductService] Error 401: Endpoint protegido o problema de CORS/Seguridad');
    } else if (error.error?.message) {
      errorMessage = error.error.message;
    } else if (error.message) {
      errorMessage = error.message;
    } else if (error.status === 0) {
      errorMessage = 'No se puede conectar con el servidor - Posible problema de CORS';
    } else if (error.status === 404) {
      errorMessage = 'Recurso no encontrado';
    } else if (error.status === 500) {
      errorMessage = 'Error interno del servidor';
    }

    console.error('❌ [ProductService] Error Message:', errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}