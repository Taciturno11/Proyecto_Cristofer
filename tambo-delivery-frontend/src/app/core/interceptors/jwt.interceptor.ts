import { HttpInterceptorFn } from '@angular/common/http';
import { APP_CONSTANTS } from '../../constants/app.constants';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  // Rutas públicas que NO deben llevar JWT
  const publicRoutes = [
    '/api/auth/',                 // Autenticación (login, register, verify, etc.)
    '/api/public/product',        // Productos públicos
    '/api/public/category',       // Categorías públicas
    '/api/public/product-sections', // Secciones de productos
    '/api/public/test'            // Endpoint de prueba
  ];
  
  // Verificar si es una ruta pública
  const isPublicRoute = publicRoutes.some(route => req.url.includes(route));
  
  // Obtener el token del localStorage
  const token = localStorage.getItem(APP_CONSTANTS.TOKEN_KEY);
  
  // Si es una ruta pública, NO agregar token
  if (isPublicRoute) {
    return next(req);
  }
  
  // Si existe un token y la petición es hacia nuestro backend (y no es pública), agregarlo
  if (token && req.url.includes('/api/')) {
    
    // Clonar la petición y agregar el header de Authorization
    const authReq = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
    
    return next(authReq);
  }
  
  return next(req);
};