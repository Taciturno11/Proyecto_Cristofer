export interface User {
  id: string; // UUID en el backend
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  provider?: string; // OAuth provider
  enabled: boolean;
  authorities: Authority[];
  addresses?: Address[];
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Authority {
  id: string;
  authority: string; // Nombre del rol
}

export interface Address {
  id?: string; // UUID en el backend
  firstName: string;
  lastName: string;
  phoneNumber: string;
  street: string;
  references?: string;
  district: string;
  province: string;
  department: string;
  postalCode?: string;
  isDefault?: boolean;
}

export enum UserRole {
  CUSTOMER = 'CUSTOMER',
  ADMIN = 'ADMIN',
  DELIVERY = 'DELIVERY'
}
