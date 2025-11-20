import { User } from './user.model';
import { Product } from './product.model';

export interface Order {
  id: string; // UUID en el backend
  orderDate: Date;
  user?: User;
  latitude?: number;
  longitude?: number;
  deliveryMethod: DeliveryMethod;
  totalAmount: number;
  orderStatus: OrderStatus;
  orderItems?: OrderItem[]; // Para crear pedidos
  orderItemList?: OrderItem[]; // Para recibir del backend
  shipmentNumber?: string; // Código de seguimiento
  expectedDeliveryDate?: Date;
  discount?: Discount;
  payment?: Payment;
  deliveryPerson?: DeliveryPerson;
  delivery?: Delivery;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderItem {
  id?: string;
  product: Product;
  quantity: number;
  price?: number; // Para crear pedidos
  itemPrice?: number; // Precio que retorna el backend
  subtotal?: number;
}

export interface Discount {
  id: string;
  code: string;
  name: string;
  description?: string;
  discountPercentage: number;
  isActive: boolean;
}

export interface Payment {
  id: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: PaymentStatus;
  transactionId?: string;
}

export interface DeliveryPerson {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  vehicleType: string;
  licenseNumber: string;
}

export interface Delivery {
  id: string;
  deliveryPerson: DeliveryPerson;
  estimatedTime: number; // en minutos
  deliveryStatus: DeliveryStatus;
  trackingCode: string;
}

// Enums
export enum OrderStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  PREPARING = 'PREPARING',
  OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY',
  DELIVERED = 'DELIVERED',
  CANCELLED = 'CANCELLED'
}

export enum DeliveryMethod {
  DELIVERY = 'DELIVERY',  // Entrega a domicilio
  STORE = 'STORE'         // Recojo en tienda
}

export enum PaymentMethod {
  EFECTIVO = 'EFECTIVO',
  YAPE = 'YAPE',
  TRANSFERENCIA = 'TRANSFERENCIA',
  TARJETA_CREDITO = 'TARJETA_CREDITO',
  TARJETA_DEBITO = 'TARJETA_DEBITO',
  PAYPAL = 'PAYPAL'
}

export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  REFUNDED = 'REFUNDED'
}

export enum DeliveryStatus {
  PREPARING = 'PREPARING',
  ON_THE_WAY = 'ON_THE_WAY',
  DELIVERED = 'DELIVERED'
}

// DTOs para requests
export interface OrderRequest {
  orderDate?: Date;         // Fecha del pedido (opcional, el backend la genera si no viene)
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
  orderItemRequests: OrderItemRequest[];  // Backend espera orderItemRequests, no orderItems
  totalAmount: number;      // Monto total del pedido (requerido por la BD)
  discountCode?: string;
  receiptType: string;      // Tipo de comprobante: 'BOLETA' o 'FACTURA'
  docType: string;          // Tipo de documento: 'DNI', 'RUC', 'CE', etc.
  docNumber: number;        // Número de documento
  ruc?: string;             // RUC (solo para facturas)
  razonSocial?: string;     // Razón social (solo para facturas)
  deliveryAddress?: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    street: string;
    references?: string;
    district: string;
    province: string;
    department: string;
  };
  latitude?: number;
  longitude?: number;
}

export interface OrderItemRequest {
  productId: string;
  quantity: number;
  itemPrice?: number;       // Precio unitario (opcional, el backend lo toma del producto si no viene)
}
