// API Endpoints - Basado en el backend Spring Boot
export const API_ENDPOINTS = {
  BASE_URL: 'http://localhost:8080/api',
  
  // Autenticación (AuthController)
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    VERIFY: '/auth/verify',
    FORGOT_PASSWORD: '/auth/forgot-password',
    RESET_PASSWORD: '/auth/reset-password'
  },

  // Productos públicos (PublicController)
  PUBLIC: {
    PRODUCTS: '/public/product',
    PRODUCTS_BY_CATEGORY: '/public/product/by-category',
    PRODUCT_SECTIONS: '/public/product-sections',
    CATEGORIES: '/public/category/get-all' // Endpoint público para obtener categorías
  },

  // Usuarios (UserDetailController)
  USERS: {
    PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    ADDRESSES: '/user/address',
    CREATE_ADDRESS: '/user/address',
    UPDATE_ADDRESS: '/user/address',
    DELETE_ADDRESS: '/user/address'
  },

  // Pedidos (OrderController)
  ORDERS: {
    CREATE: '/order',
    BOLETA: '/order', // /{orderId}/boleta
    FACTURA: '/order' // /{orderId}/factura
  },

  // Panel de administración (AdminController)
  ADMIN: {
    // Marcas
    BRANDS: '/admin/brand/get-all',
    BRAND_CREATE: '/admin/brand/create',
    BRAND_UPDATE: '/admin/brand/update',
    BRAND_DELETE: '/admin/brand/delete',
    
    // Categorías
    CATEGORIES: '/admin/category/get-all',
    CATEGORY_CREATE: '/admin/category/create',
    CATEGORY_UPDATE: '/admin/category/update',
    CATEGORY_DELETE: '/admin/category/delete',

    // Tipos de Categorías
    CATEGORY_TYPES: '/admin/category-type/get-all', // Obtener todos los tipos de categoría
    CATEGORY_TYPES_BY_CATEGORY: '/admin/category-type/by-category', // Obtener tipos de categoría por ID de categoría
    CATEGORY_TYPES_BY_ID: '/admin/category-type', // Obtener un tipo de categoría por su ID
    CATEGORY_TYPE_CREATE: '/admin/category-type/create',
    CATEGORY_TYPE_UPDATE: '/admin/category-type/update',
    CATEGORY_TYPE_DELETE: '/admin/category-type/delete',

    // Descuentos
    DISCOUNTS: '/admin/discount/get-all',
    DISCOUNT_CREATE: '/admin/discount/create',
    DISCOUNT_UPDATE: '/admin/discount/update',
    DISCOUNT_DELETE: '/admin/discount/delete',
    
    // Productos
    PRODUCTS: '/admin/product/get-all',
    PRODUCT_BY_ID: '/admin/product', // Obtener un producto por su ID
    PRODUCT_CREATE: '/admin/product/create',
    PRODUCT_UPDATE: '/admin/product/update',
    PRODUCT_DELETE: '/admin/product/delete',

    // Secciones de productos
    PRODUCT_SECTIONS: '/admin/product-sections',
    PRODUCT_SECTION_CREATE: '/admin/product-sections/create',
    PRODUCT_SECTION_UPDATE: '/admin/product-sections/update',
    PRODUCT_SECTION_DELETE: '/admin/product-sections/delete',

    // Roles
    ROLES: '/admin/role',
    ROL_CREATE: '/admin/role/create',
    ROL_UPDATE: '/admin/role/update',
    ROL_DELETE: '/admin/role/delete',

    // Usuarios
    USERS: '/admin/users',
    USERS_CREATE: '/admin/users/create',
    USERS_UPDATE: '/admin/users/update', // Requiere /{email}
    USERS_BY_EMAIL: '/admin/users', // Requiere /{email}
    USERS_DELETE: '/admin/users/delete', // Desactivar usuario, requiere /{email}
    USERS_ACTIVATE: '/admin/users/activate', // Activar usuario, requiere /{email}
    USERS_TOGGLE_STATUS: '/admin/users/toggle-status', // Alternar estado activo/inactivo, requiere /{email}
    
    // Pedidos
    ORDERS: '/admin/orders',
    ORDERS_ALL: '/admin/orders/get-all',
    ORDERS_STATISTICS: '/admin/orders/statistics',
    
    // Imágenes slider
    SLIDER_IMAGES: '/admin/slider-image',
    SLIDER_IMAGES_ALL: '/admin/slider-image/get-all'
  },

  // Pagos (PaymentController) 
  PAYMENTS: {
    PROCESS: '/payment/process'
  }
} as const;

// Application Constants
export const APP_CONSTANTS = {
  TOKEN_KEY: 'tambo_token',
  REFRESH_TOKEN_KEY: 'tambo_refresh_token',
  USER_KEY: 'tambo_user',
  ITEMS_PER_PAGE: 10,
  MAX_CART_ITEMS: 50,
  DELIVERY_FEE: 5.0,
  FREE_DELIVERY_THRESHOLD: 30.0
} as const;

// Order Status Colors
export const ORDER_STATUS_COLORS = {
  PENDING: 'text-yellow-600 bg-yellow-100',
  CONFIRMED: 'text-blue-600 bg-blue-100',
  PREPARING: 'text-purple-600 bg-purple-100',
  OUT_FOR_DELIVERY: 'text-orange-600 bg-orange-100',
  DELIVERED: 'text-green-600 bg-green-100',
  CANCELLED: 'text-red-600 bg-red-100'
} as const;
