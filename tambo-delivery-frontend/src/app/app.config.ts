import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }), 
    provideRouter(routes),
    // Usar interceptor funcional para Angular 17+
    // jwtInterceptor ahora maneja tanto rutas públicas como privadas
    provideHttpClient(
      withInterceptors([jwtInterceptor])
    )
  ]
};
