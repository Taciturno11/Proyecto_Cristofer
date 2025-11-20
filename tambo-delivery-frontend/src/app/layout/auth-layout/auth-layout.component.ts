import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet],
  template: `
    <div class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100">
      <!-- Fondo decorativo opcional -->
      <div class="absolute inset-0 bg-white/30 backdrop-blur-sm"></div>
      
      <!-- Contenedor principal -->
      <div class="relative z-10 w-full max-w-md mx-4">
        <!-- Logo de Tambo -->
        <div class="text-center mb-8">
          <img 
            src="/assets/logo/logo-tambo-800.webp" 
            alt="Tambo Logo" 
            class="h-16 mx-auto mb-4"
          />
          <h1 class="text-2xl font-bold text-gray-800">Tambo Delivery</h1>
          <p class="text-gray-600">Tu tienda de conveniencia favorita</p>
        </div>
        
        <!-- Aquí se cargan login/register -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <router-outlet></router-outlet>
        </div>
        
        <!-- Footer mínimo para auth -->
        <div class="text-center mt-6">
          <p class="text-sm text-gray-500">
            © 2025 Tambo Delivery. Todos los derechos reservados.
          </p>
        </div>
      </div>
      
      <!-- Elementos decorativos -->
      <div class="absolute top-10 left-10 w-20 h-20 bg-[#a81b8d]/20 rounded-full blur-xl"></div>
      <div class="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"></div>
      <div class="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-xl"></div>
    </div>
  `
})
export class AuthLayoutComponent {}