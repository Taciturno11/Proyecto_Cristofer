import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonComponent } from '../../../shared/components/button.component';
import { AuthService } from '../../../core/services/auth.service';
import { OrderService } from '../../orders/services/order.service';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  template: `
    <div class="container mx-auto px-4 py-8 max-w-4xl">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900 mb-2">Mi Perfil</h1>
        <p class="text-gray-600">Administra tu información personal</p>
      </div>

      @if (loading) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a81b8d]"
        ></div>
      </div>
      } @else if (user) {
      <div class="space-y-6">
        <!-- Tarjeta de información personal -->
        <div class="bg-white rounded-lg shadow-md overflow-hidden">
          <div class="bg-gradient-to-r from-[#a81b8d] to-[#8b1574] px-6 py-4">
            <div class="flex items-center space-x-4">
              <div
                class="w-20 h-20 bg-white rounded-full flex items-center justify-center"
              >
                <span class="text-3xl font-bold text-[#a81b8d]">
                  {{ getInitials() }}
                </span>
              </div>
              <div class="text-white">
                <h2 class="text-2xl font-bold">
                  {{ user.firstName }} {{ user.lastName }}
                </h2>
                <p class="text-pink-100">{{ user.email }}</p>
              </div>
            </div>
          </div>

          <div class="p-6 space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Nombre -->
              <div>
                <label class="text-sm font-medium text-gray-500 block mb-1">
                  Nombre
                </label>
                <div class="flex items-center space-x-2 text-gray-900">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{{ user.firstName }}</span>
                </div>
              </div>

              <!-- Apellido -->
              <div>
                <label class="text-sm font-medium text-gray-500 block mb-1">
                  Apellido
                </label>
                <div class="flex items-center space-x-2 text-gray-900">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span>{{ user.lastName }}</span>
                </div>
              </div>

              <!-- Email -->
              <div>
                <label class="text-sm font-medium text-gray-500 block mb-1">
                  Correo electrónico
                </label>
                <div class="flex items-center space-x-2 text-gray-900">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                  <span>{{ user.email }}</span>
                </div>
              </div>

              <!-- Teléfono -->
              <div>
                <label class="text-sm font-medium text-gray-500 block mb-1">
                  Teléfono
                </label>
                <div class="flex items-center space-x-2 text-gray-900">
                  <svg
                    class="w-5 h-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                    />
                  </svg>
                  <span>{{ user.phoneNumber || 'No registrado' }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tarjeta de estado de cuenta -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Estado de cuenta
          </h3>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Pedidos totales</p>
                  <p class="text-2xl font-bold text-blue-600">
                    {{ stats.totalOrders }}
                  </p>
                </div>
                <svg
                  class="w-10 h-10 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  />
                </svg>
              </div>
            </div>

            <div class="bg-green-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Pedidos entregados</p>
                  <p class="text-2xl font-bold text-green-600">
                    {{ stats.deliveredOrders }}
                  </p>
                </div>
                <svg
                  class="w-10 h-10 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>

            <div class="bg-purple-50 rounded-lg p-4">
              <div class="flex items-center justify-between">
                <div>
                  <p class="text-sm text-gray-600">Total gastado</p>
                  <p class="text-2xl font-bold text-purple-600">
                    S/ {{ stats.totalSpent.toFixed(2) }}
                  </p>
                </div>
                <svg
                  class="w-10 h-10 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Acciones -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">Acciones</h3>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <app-button
              [config]="{
                text: 'Ver mis pedidos',
                type: 'primary',
                size: 'md',
                icon: 'box'
              }"
              (buttonClick)="goToOrders()"
            />

            <app-button
              [config]="{
                text: 'Editar perfil',
                type: 'secondary',
                size: 'md',
                icon: 'edit'
              }"
              (buttonClick)="editProfile()"
            />

            <app-button
              [config]="{
                text: 'Cambiar contraseña',
                type: 'secondary',
                size: 'md',
                icon: 'lock'
              }"
              (buttonClick)="changePassword()"
            />

            <app-button
              [config]="{
                text: 'Cerrar sesión',
                type: 'danger',
                size: 'md',
                icon: 'logout'
              }"
              (buttonClick)="logout()"
            />
          </div>
        </div>
      </div>
      } @else {
      <div class="text-center py-12">
        <div class="text-gray-400 mb-4">
          <svg
            class="mx-auto h-24 w-24"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
            />
          </svg>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mb-2">
          No se pudo cargar el perfil
        </h3>
        <p class="text-gray-600 mb-4">Por favor, inicia sesión nuevamente.</p>
        <app-button
          [config]="{
            text: 'Iniciar sesión',
            type: 'primary',
            size: 'md'
          }"
          (buttonClick)="goToLogin()"
        />
      </div>
      }
    </div>
  `,
})
export class UserProfileComponent implements OnInit {
  user: any = null;
  loading = true;
  stats = {
    totalOrders: 0,
    deliveredOrders: 0,
    totalSpent: 0,
  };

  constructor(
    private authService: AuthService,
    private router: Router,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadUserData();
  }

  loadUserData(): void {
    this.loading = true;

    // Obtener perfil del usuario desde el backend
    this.orderService.getUserProfile().subscribe({
      next: (profile) => {
        this.user = {
          firstName: profile.firstName || 'Usuario',
          lastName: profile.lastName || '',
          email: profile.email || '',
          phoneNumber: profile.phoneNumber || 'No registrado',
        };

        // Guardar en localStorage para cache
        localStorage.setItem('user', JSON.stringify(this.user));

        // Cargar estadísticas
        this.loadUserStats();
        this.loading = false;

        console.log('✅ Perfil cargado desde el backend:', this.user);
      },
      error: (error) => {
        console.error('❌ Error loading user profile from API:', error);
        this.loading = false;
        this.user = null;
      },
    });
  }

  loadUserStats(): void {
    // Obtener estadísticas desde el backend (pedidos del usuario)
    this.orderService.getUserOrders().subscribe({
      next: (orders) => {
        this.stats.totalOrders = orders.length;
        this.stats.deliveredOrders = orders.filter(
          (o) => o.orderStatus === 'DELIVERED'
        ).length;
        this.stats.totalSpent = orders.reduce(
          (sum, o) => sum + (o.totalAmount || 0),
          0
        );

        console.log('✅ Estadísticas calculadas:', this.stats);
      },
      error: (error) => {
        console.error('❌ Error loading user stats:', error);
        // Dejar stats en 0 si hay error
      },
    });
  }

  getInitials(): string {
    if (!this.user) return '?';
    const firstInitial = this.user.firstName?.charAt(0) || '';
    const lastInitial = this.user.lastName?.charAt(0) || '';
    return (firstInitial + lastInitial).toUpperCase();
  }

  goToOrders(): void {
    this.router.navigate(['/orders']);
  }

  editProfile(): void {
    alert('Funcionalidad de edición de perfil en desarrollo');
  }

  changePassword(): void {
    alert('Funcionalidad de cambio de contraseña en desarrollo');
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }
}
