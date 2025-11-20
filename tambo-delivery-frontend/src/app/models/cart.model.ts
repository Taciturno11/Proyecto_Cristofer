import { Product } from './product.model';

export interface CartItem {
  product: Product;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  updatedAt: Date;
}

export interface CartSummary {
  itemCount: number;
  subtotal: number;
  deliveryFee: number;
  total: number;
}