import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { User } from '../../models/user.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ConfirmModalComponent],
  template: `
    <div class="flex h-screen bg-gray-100">
      <!-- Sidebar -->
      <div class="w-64 bg-white shadow-lg">
        <!-- Logo/Brand -->
        <div
          class="flex items-center justify-center h-16 bg-[#a81b8d] text-white"
        >
          <h1 class="text-xl font-bold">Tambo Admin</h1>
        </div>

        <!-- User Info -->
        @if (currentUser) {
        <div class="p-4 border-b border-gray-200">
          <div class="flex items-center">
            <div
              class="w-10 h-10 bg-[#a81b8d] rounded-full flex items-center justify-center text-white font-semibold"
            >
              {{ getUserInitials() }}
            </div>
            <div class="ml-3">
              <p class="text-sm font-medium text-gray-900">
                {{ currentUser.firstName }} {{ currentUser.lastName }}
              </p>
              <p class="text-xs text-gray-500">Administrador</p>
            </div>
          </div>
        </div>
        }

        <!-- Navigation Menu -->
        <nav class="mt-4">
          <ul class="space-y-1 px-3">
            <li>
              <a
                (click)="navigateTo('/admin/dashboard')"
                [class]="getNavItemClass('/admin/dashboard')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"
                  ></path>
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z"
                  ></path>
                </svg>
                Dashboard
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/users')"
                [class]="getNavItemClass('/admin/users')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z"
                  ></path>
                </svg>
                Usuarios
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/brands')"
                [class]="getNavItemClass('/admin/brands')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  stroke-width="2"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M6 6h.008v.008H6V6Z"
                  />
                </svg>
                Marcas
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/categories')"
                [class]="getNavItemClass('/admin/categories')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.25 7.125C2.25 6.504 2.754 6 3.375 6h6c.621 0 1.125.504 1.125 1.125v3.75c0 .621-.504 1.125-1.125 1.125h-6a1.125 1.125 0 0 1-1.125-1.125v-3.75ZM14.25 8.625c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v8.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-8.25ZM3.75 16.125c0-.621.504-1.125 1.125-1.125h5.25c.621 0 1.125.504 1.125 1.125v2.25c0 .621-.504 1.125-1.125 1.125h-5.25a1.125 1.125 0 0 1-1.125-1.125v-2.25Z"
                  />
                </svg>
                Categorías
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/products')"
                [class]="getNavItemClass('/admin/products')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                  ></path>
                </svg>
                Productos
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/discounts')"
                [class]="getNavItemClass('/admin/discounts')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
                  ></path>
                </svg>
                Descuentos
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/admin/orders')"
                [class]="getNavItemClass('/admin/orders')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  ></path>
                </svg>
                Pedidos
              </a>
            </li>

            <li>
              <a
                (click)="navigateTo('/perfil')"
                [class]="getNavItemClass('/perfil')"
                class="flex items-center px-3 py-2 text-sm font-medium rounded-md cursor-pointer transition-colors duration-150"
              >
                <svg
                  class="w-5 h-5 mr-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  ></path>
                </svg>
                Perfil
              </a>
            </li>
          </ul>

          <!-- Logout Button -->
          <div class="absolute bottom-4 left-3 right-3">
            <button
              (click)="confirmLogout()"
              class="w-full flex items-center px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-md transition-colors duration-150 cursor-pointer"
            >
              <svg
                class="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Cerrar Sesión
            </button>
          </div>
        </nav>
      </div>

      <!-- Main Content Area -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Top Bar (opcional) -->
        <header class="bg-white shadow-sm border-b border-gray-200">
          <div class="flex items-center justify-between px-6 py-3">
            <h2 class="text-lg font-semibold text-gray-900">
              {{ getCurrentPageTitle() }}
            </h2>
            <div class="flex items-center space-x-4">
              <!-- Notificaciones o controles adicionales -->
              <button
                class="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full"
              >
                <svg
                  class="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 17h5l-5 5-5-5h5z"
                  ></path>
                </svg>
              </button>
            </div>
          </div>
        </header>

        <!-- Page Content -->
        <main class="flex-1 overflow-y-auto bg-gray-50">
          <router-outlet></router-outlet>
        </main>
      </div>
    </div>

    <!-- Modal de confirmación para cerrar sesión -->
    <app-confirm-modal
      [isOpen]="isLogoutModalOpen"
      [title]="'Cerrar Sesión'"
      [message]="'¿Estás seguro de que deseas cerrar sesión?'"
      [confirmText]="'Cerrar Sesión'"
      [cancelText]="'Cancelar'"
      (confirm)="onConfirmLogout()"
      (cancel)="closeLogoutModal()"
    />
  `,
  styles: [],
})
export class AdminLayoutComponent implements OnInit {
  currentUser: User | null = null;
  currentRoute = '';
  isLogoutModalOpen = false; // Modal de confirmación de cierre de sesión

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    // Suscribirse al usuario actual
    this.authService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });

    // Obtener ruta inicial
    this.currentRoute = this.router.url;

    // Suscribirse a cambios de ruta
    this.router.events.subscribe(() => {
      this.currentRoute = this.router.url;
    });
  }

  /**
   * Obtiene las iniciales del usuario para el avatar
   */
  getUserInitials(): string {
    if (!this.currentUser) return 'A';

    const firstName = this.currentUser.firstName || '';
    const lastName = this.currentUser.lastName || '';

    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase() || 'A';
  }

  /**
   * Obtiene las clases CSS para los elementos de navegación
   */
  getNavItemClass(route: string): string {
    const isActive =
      this.currentRoute === route || this.currentRoute.startsWith(route + '/');

    return isActive
      ? 'bg-[#a81b8d] text-white'
      : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900';
  }

  /**
   * Navega a una ruta específica
   */
  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  /**
   * Obtiene el título de la página actual
   */
  getCurrentPageTitle(): string {
    const routeMap: { [key: string]: string } = {
      '/admin': 'Dashboard',
      '/admin/dashboard': 'Dashboard',
      '/admin/users': 'Gestión de Usuarios',
      '/admin/brands': 'Gestión de Marcas',
      '/admin/categories': 'Gestión de Categorías',
      '/admin/products': 'Gestión de Productos',
      '/admin/orders': 'Gestión de Pedidos',
      '/perfil': 'Mi Perfil',
    };

    return routeMap[this.currentRoute] || 'Panel de Administración';
  }

  /**
   * Abre el modal de confirmación para cerrar sesión
   */
  confirmLogout(): void {
    this.isLogoutModalOpen = true;
  }

  /**
   * Cierra el modal de confirmación de logout
   */
  closeLogoutModal(): void {
    this.isLogoutModalOpen = false;
  }

  /**
   * Confirma el cierre de sesión
   */
  onConfirmLogout(): void {
    this.isLogoutModalOpen = false;
    this.logout();
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    this.router.navigate(['/home']);
  }
}
