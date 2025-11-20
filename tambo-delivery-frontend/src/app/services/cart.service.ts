import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { Cart, CartItem, CartSummary } from '../models/cart.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private readonly CART_STORAGE_KEY = 'tambo-cart';
  private readonly DELIVERY_FEE = 5.00;

  private cartSubject = new BehaviorSubject<Cart>(this.getCartFromStorage());
  public cart$ = this.cartSubject.asObservable();

  constructor() {
    // Cargar carrito desde localStorage al inicializar
    this.loadCart();
  }

  /**
   * Obtiene el carrito actual
   */
  getCurrentCart(): Cart {
    return this.cartSubject.value;
  }

  /**
   * Añade un producto al carrito o incrementa su cantidad si ya existe
   */
  addToCart(product: Product, quantity: number = 1): void {
    console.log('🛒 CartService: Adding to cart:', product.name, 'quantity:', quantity);
    const currentCart = this.getCurrentCart();
    console.log('🛒 CartService: Current cart before adding:', currentCart);
    
    const existingItemIndex = currentCart.items.findIndex(item => item.product.id === product.id);
    
    // Obtener el precio efectivo (con descuento si existe)
    const effectivePrice = this.getEffectivePrice(product);

    if (existingItemIndex > -1) {
      // El producto ya existe, incrementar cantidad
      currentCart.items[existingItemIndex].quantity += quantity;
      currentCart.items[existingItemIndex].subtotal = 
        currentCart.items[existingItemIndex].quantity * effectivePrice;
      console.log('🛒 CartService: Product already exists, updated quantity:', currentCart.items[existingItemIndex].quantity);
    } else {
      // Añadir nuevo producto
      const newItem: CartItem = {
        product,
        quantity,
        subtotal: effectivePrice * quantity
      };
      currentCart.items.push(newItem);
      console.log('🛒 CartService: Added new product to cart:', newItem);
    }

    this.updateCart(currentCart);
  }

  /**
   * Quita un producto completamente del carrito
   */
  removeFromCart(productId: string): void {
    const currentCart = this.getCurrentCart();
    currentCart.items = currentCart.items.filter(item => item.product.id !== productId);
    this.updateCart(currentCart);
  }

  /**
   * Incrementa la cantidad de un producto en el carrito
   */
  incrementQuantity(productId: string): void {
    const currentCart = this.getCurrentCart();
    const itemIndex = currentCart.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      currentCart.items[itemIndex].quantity++;
      currentCart.items[itemIndex].subtotal = 
        currentCart.items[itemIndex].quantity * this.getEffectivePrice(currentCart.items[itemIndex].product);
      this.updateCart(currentCart);
    }
  }

  /**
   * Decrementa la cantidad de un producto en el carrito
   */
  decrementQuantity(productId: string): void {
    const currentCart = this.getCurrentCart();
    const itemIndex = currentCart.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      if (currentCart.items[itemIndex].quantity > 1) {
        currentCart.items[itemIndex].quantity--;
        currentCart.items[itemIndex].subtotal = 
          currentCart.items[itemIndex].quantity * this.getEffectivePrice(currentCart.items[itemIndex].product);
        this.updateCart(currentCart);
      } else {
        // Si la cantidad es 1, remover el producto del carrito
        this.removeFromCart(productId);
      }
    }
  }

  /**
   * Actualiza la cantidad específica de un producto
   */
  updateQuantity(productId: string, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentCart = this.getCurrentCart();
    const itemIndex = currentCart.items.findIndex(item => item.product.id === productId);
    
    if (itemIndex > -1) {
      currentCart.items[itemIndex].quantity = quantity;
      currentCart.items[itemIndex].subtotal = 
        quantity * this.getEffectivePrice(currentCart.items[itemIndex].product);
      this.updateCart(currentCart);
    }
  }

  /**
   * Obtiene la cantidad de un producto específico en el carrito
   */
  getProductQuantity(productId: string): number {
    const item = this.getCurrentCart().items.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  }

  /**
   * Verifica si un producto está en el carrito
   */
  isProductInCart(productId: string): boolean {
    return this.getCurrentCart().items.some(item => item.product.id === productId);
  }

  /**
   * Obtiene el resumen del carrito con totales calculados
   */
  getCartSummary(): CartSummary {
    const cart = this.getCurrentCart();
    const subtotal = cart.totalPrice;
    const deliveryFee = cart.items.length > 0 ? this.DELIVERY_FEE : 0;
    
    return {
      itemCount: cart.totalItems,
      subtotal,
      deliveryFee,
      total: subtotal + deliveryFee
    };
  }

  /**
   * Limpia completamente el carrito
   */
  clearCart(): void {
    const emptyCart: Cart = {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      updatedAt: new Date()
    };
    this.updateCart(emptyCart);
  }

  /**
   * Obtiene el número total de productos únicos en el carrito
   */
  getUniqueItemCount(): number {
    return this.getCurrentCart().items.length;
  }

  /**
   * Obtiene el número total de productos (sumando cantidades)
   */
  getTotalItemCount(): number {
    return this.getCurrentCart().totalItems;
  }

  /**
   * Obtiene el precio total del carrito
   */
  getTotalPrice(): number {
    return this.getCurrentCart().totalPrice;
  }

  /**
   * Actualiza el carrito y lo guarda
   */
  private updateCart(cart: Cart): void {
    console.log('🛒 CartService: Updating cart:', cart);
    
    // Recalcular totales
    cart.totalItems = cart.items.reduce((total, item) => total + item.quantity, 0);
    cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);
    cart.updatedAt = new Date();

    console.log('🛒 CartService: Cart after recalculation - totalItems:', cart.totalItems, 'totalPrice:', cart.totalPrice);

    // Guardar en localStorage
    this.saveCartToStorage(cart);
    
    // Emitir el nuevo estado
    console.log('🛒 CartService: Emitting new cart state to subscribers');
    this.cartSubject.next(cart);
  }

  /**
   * Carga el carrito desde localStorage
   */
  private loadCart(): void {
    const cart = this.getCartFromStorage();
    this.cartSubject.next(cart);
  }

  /**
   * Obtiene el carrito desde localStorage
   */
  private getCartFromStorage(): Cart {
    try {
      const cartData = localStorage.getItem(this.CART_STORAGE_KEY);
      if (cartData) {
        const parsedCart = JSON.parse(cartData);
        // Validar estructura del carrito
        if (parsedCart && Array.isArray(parsedCart.items)) {
          return {
            ...parsedCart,
            updatedAt: new Date(parsedCart.updatedAt)
          };
        }
      }
    } catch (error) {
      console.error('Error loading cart from storage:', error);
    }

    // Carrito vacío por defecto
    return {
      items: [],
      totalItems: 0,
      totalPrice: 0,
      updatedAt: new Date()
    };
  }

  /**
   * Guarda el carrito en localStorage
   */
  private saveCartToStorage(cart: Cart): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to storage:', error);
    }
  }

  /**
   * Obtiene el precio efectivo de un producto (con descuento si está disponible)
   */
  private getEffectivePrice(product: Product): number {
    return product.discountedPrice || product.price;
  }
}