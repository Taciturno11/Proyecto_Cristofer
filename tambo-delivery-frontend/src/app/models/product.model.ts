import { Category, CategoryType } from './category.model';
import { Brand } from './brand.model';
import { Discount } from './discount.model';

export interface Product {
  id: string; // UUID en el backend
  slug: string;
  name: string;
  description: string;
  price: number; // BigDecimal del backend
  discountPercentage?: number;
  discountedPrice?: number;
  stock: number;
  thumbnail?: string;
  rating?: number;
  isNewArrival?: boolean;
  isActive: boolean;
  brand: Brand;
  category: Category;
  categoryType?: CategoryType;
  resources?: ProductResource[];
  discounts?: Discount[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Recursos del producto (imágenes, etc.)
export interface ProductResource {
  id?: string;
  name: string;
  url: string;
  isPrimary: boolean;
  type: string; // 'IMAGE', 'VIDEO', etc.
}

// Para el carrito de compras
export interface CartItem {
  id?: string;
  product: Product;
  quantity: number;
  subtotal: number;
}

// Para filtros de productos
export interface ProductFilter {
  categoryId?: string;
  typeId?: string;
  slug?: string;
  name?: string;
  minPrice?: number;
  maxPrice?: number;
  newArrival?: boolean;
}

// DTO para crear producto completo en UNA SOLA PETICIÓN
export interface CreateProductCompleteDto {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  isNewArrival: boolean;
  isActive: boolean;
  categoryId: string;
  categoryTypeId?: string;
  resources?: ProductResource[];
  discountIds?: string[];
}

// DTO para la Fase 1 (datos locales)
export interface ProductPhase1Data {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  isNewArrival: boolean;
  isActive: boolean;
  categoryId: string;
  categoryTypeId?: string;
}

// DTO para agregar recursos (Fase 2) - DEPRECATED - solo para compatibilidad
export interface AddProductResourcesDto {
  resources: ProductResource[];
}

// DTO para asignar descuentos (Fase 3) - DEPRECATED - solo para compatibilidad
export interface AssignProductDiscountsDto {
  discountIds: string[];
}
