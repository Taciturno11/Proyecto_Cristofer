import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  Subscription,
  debounceTime,
  distinctUntilChanged,
  Subject,
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { ProductService } from '../../features/products/services/product.service';
import { CartService } from '../../services/cart.service';
import { Product } from '../../models/product.model';
import { Category } from '../../models/category.model';
import { ConfirmModalComponent } from '../../shared/components/confirm-modal.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ConfirmModalComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 z-50">
      <!-- Encabezado promocional -->
      <div class="mx-auto px-4 sm:px-6 lg:px-8 bg-[#a81b8d]">
        <div
          class="grid grid-cols-1 sm:grid-cols-2 justify-items-center items-center h-20 sm:h-10"
        >
          <h1 class="text-md text-white">
            ¡Sobrin&#64; entregamos tu pedido en 30 minutos!
          </h1>
          <h1 class="text-md text-white border-b-1 border-dotted">
            <!-- border-dashed si se quiere líneas discontinuas -->
            <a routerLink="#">Trabaja con nosotros</a>
          </h1>
        </div>
      </div>
      <!-- Navegación principal -->
      <div class="bg-white shadow-lg relative">
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="flex justify-between items-center h-18">
            <!-- Logo -->
            <div class="flex items-center">
              <a routerLink="/" class="flex items-center">
                <div class="flex-shrink-0 flex items-center">
                  <img
                    src="assets/logo/logo-tambo-1000.webp"
                    alt="Logo Tambo"
                    class="h-12 w-auto mr-3"
                  />
                </div>
              </a>
            </div>

            <!-- Nav -->
            <nav class="hidden md:flex space-x-8 relative">
              <!-- Dropdown de Categorías -->
              <div class="relative">
                <button
                  (click)="toggleCategoriesDropdown()"
                  class="flex items-center gap-2 px-3 py-2 text-sm border-1 border-gray-300 hover:border-[#a81b8d] hover:text-[#a81b8d] rounded-lg transition-colors cursor-pointer"
                >
                  <!-- Ícono de categorías (grid) -->
                  <svg
                    class="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    ></path>
                  </svg>
                  Categorías
                  <!-- Ícono de chevron-down -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-200"
                    [class.rotate-180]="isCategoriesDropdownOpen"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (isCategoriesDropdownOpen) {
                <div
                  class="absolute top-full left-0 mt-2 w-50 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-y-auto"
                >
                  <div class="py-2">
                    @for (category of categories; track category.id) {
                    <div
                      class="relative"
                      (mouseenter)="onCategoryHover(category.id, $event)"
                      (mouseleave)="hoveredCategoryId = null"
                    >
                      <!-- Categoría Principal -->
                      <button
                        #categoryButton
                        (click)="
                          category.categoryTypes &&
                          category.categoryTypes.length > 0
                            ? null
                            : navigateToCategory(category.id)
                        "
                        class="w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-[#a81b8d] transition-colors flex items-center justify-between"
                        [class.cursor-pointer]="
                          !category.categoryTypes ||
                          category.categoryTypes.length === 0
                        "
                        [class.cursor-default]="
                          category.categoryTypes &&
                          category.categoryTypes.length > 0
                        "
                      >
                        <div class="flex items-center gap-3">
                          <div class="w-2 h-2 bg-[#a81b8d] rounded-full"></div>
                          <div class="font-semibold">{{ category.name }}</div>
                        </div>
                        @if (category.categoryTypes &&
                        category.categoryTypes.length > 0) {
                        <svg
                          class="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                        }
                      </button>

                      <!-- Submenu de tipos de categoría (aparece al lado) -->
                      @if (category.categoryTypes &&
                      category.categoryTypes.length > 0 && hoveredCategoryId ===
                      category.id) {
                      <div
                        class="fixed w-45 bg-white rounded-lg shadow-2xl border border-gray-200 z-[60] max-h-[400px] overflow-y-auto"
                        [style.left.px]="submenuPosition.left"
                        [style.top.px]="submenuPosition.top"
                      >
                        <div class="py-2">
                          <!-- Lista de tipos -->
                          @for (type of category.categoryTypes; track type.id) {
                          <button
                            (click)="
                              navigateToCategoryType(category.id, type.id)
                            "
                            class="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-[#fef2f9] hover:text-[#a81b8d] transition-all flex items-center gap-2 cursor-pointer border-l-2 border-transparent hover:border-[#a81b8d]"
                          >
                            <svg
                              class="w-3.5 h-3.5 text-gray-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                stroke-linecap="round"
                                stroke-linejoin="round"
                                stroke-width="2"
                                d="M9 5l7 7-7 7"
                              ></path>
                            </svg>
                            <span class="font-medium">{{ type.name }}</span>
                          </button>
                          }

                          <!-- Ver todos de esta categoría -->
                          <div class="border-t border-gray-100 mt-1 bg-gray-50">
                            <button
                              (click)="navigateToCategory(category.id)"
                              class="w-full text-left px-4 py-2.5 text-xs text-[#a81b8d] hover:bg-[#fef2f9] transition-colors font-semibold flex items-center gap-2 cursor-pointer"
                            >
                              <svg
                                class="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="2"
                                  d="M13 7l5 5m0 0l-5 5m5-5H6"
                                ></path>
                              </svg>
                              Ver todos de {{ category.name }}
                            </button>
                          </div>
                        </div>
                      </div>
                      }
                    </div>
                    }
                    <!-- Ver todas las categorías -->
                    <div class="border-t border-gray-100 mt-2 pt-2">
                      <a
                        routerLink="/products"
                        (click)="closeCategoriesDropdown()"
                        class="w-full text-left px-4 py-2 text-sm text-[#a81b8d] hover:bg-gray-100 transition-colors flex items-center gap-3 font-medium"
                      >
                        <svg
                          class="w-4 h-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M9 5l7 7-7 7"
                          ></path>
                        </svg>
                        Ver todos
                      </a>
                    </div>
                  </div>
                </div>
                }
              </div>
              <a
                routerLink="/products"
                routerLinkActive="text-indigo-600"
                class="flex items-center gap-2 px-3 py-2 text-sm border-1 border-gray-300 hover:text-[#a81b8d] hover:border-[#a81b8d] rounded-lg transition-colors"
              >
                <!-- Ícono de ubicación (location pin) -->
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                ¿Dónde quieres pedir?
                <!-- Ícono de chevron-down -->
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </a>
            </nav>

            <!-- Barra de búsqueda -->
            <div class="hidden md:flex items-center max-w-md mx-4 relative">
              <div class="relative w-full">
                <div
                  class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                >
                  <svg
                    class="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="2"
                      d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  [(ngModel)]="searchTerm"
                  (input)="onSearch()"
                  (focus)="onSearchFocus()"
                  (blur)="onSearchBlur()"
                  placeholder="Buscar productos..."
                  class="w-full pl-10 pr-4 py-2 border-1 border-gray-300 rounded-lg focus:outline-none focus:ring-[#a81b8d] focus:border-[#a81b8d] text-sm"
                />
                @if (searchTerm && searchResults.length > 0) {
                <div
                  class="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto"
                >
                  @for (result of searchResults; track result.id) {
                  <a
                    [routerLink]="['/products', result.id]"
                    (click)="clearSearch()"
                    class="flex items-center px-4 py-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  >
                    <img
                      [src]="result.thumbnail || 'assets/images/no-image.webp'"
                      [alt]="result.name"
                      class="w-10 h-10 rounded-lg object-cover mr-3"
                    />
                    <div class="flex-1">
                      <div class="text-sm font-medium text-gray-900">
                        {{ result.name }}
                      </div>
                      <div class="text-xs text-gray-600">
                        {{ result.category.name }} • S/
                        {{ result.price.toFixed(2) }}
                      </div>
                    </div>
                  </a>
                  }
                </div>
                }
              </div>
            </div>

            <!-- Menú usuario -->
            <div class="flex items-center space-x-2">
              <!-- Botón menú móvil -->
              <button
                (click)="toggleMobileMenu()"
                class="md:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#a81b8d] cursor-pointer"
              >
                <svg
                  class="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  ></path>
                </svg>
              </button>

              <!-- Carrito -->
              <a
                routerLink="/cart"
                class="relative text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium flex items-center gap-2"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="size-6"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                  />
                </svg>
                @if (cartItemCount > 0) {
                <span
                  class="absolute -top-1 -right-1 bg-[#a81b8d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px]"
                >
                  {{ cartItemCount }}
                </span>
                }
              </a>

              <!-- Perfil Dropdown -->
              <div class="relative">
                @if (!isAuthenticated) {
                <!-- Ícono de perfil para no autenticados -->
                <a
                  routerLink="/auth/login"
                  class="text-gray-900 hover:text-[#a81b8d] px-3 py-2 flex items-center cursor-pointer"
                  title="Iniciar sesión"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                </a>
                } @else {
                <!-- Dropdown para usuarios autenticados -->
                <button
                  (click)="toggleProfileDropdown()"
                  class="flex items-center gap-2 text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="size-6"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                    />
                  </svg>
                  <span class="hidden md:inline">{{
                    currentUser?.firstName || 'Usuario'
                  }}</span>
                  <!-- Ícono de chevron -->
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 20 20"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 transition-transform duration-200"
                    [class.rotate-180]="isProfileDropdownOpen"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="m19.5 8.25-7.5 7.5-7.5-7.5"
                    />
                  </svg>
                </button>

                <!-- Dropdown Menu -->
                @if (isProfileDropdownOpen) {
                <div
                  class="absolute right-0 top-full mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div class="py-2">
                    <!-- Info del usuario -->
                    <div class="px-4 py-2 border-b border-gray-100">
                      <div class="text-sm font-medium text-gray-900">
                        {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                      </div>
                      <div class="text-xs text-gray-500">
                        {{ currentUser?.email }}
                      </div>
                    </div>

                    <!-- Enlaces del menú -->
                    <a
                      routerLink="/orders"
                      (click)="closeProfileDropdown()"
                      class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#a81b8d] transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                        />
                      </svg>
                      Mis Pedidos
                    </a>

                    <a
                      routerLink="/profile"
                      (click)="closeProfileDropdown()"
                      class="flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-[#a81b8d] transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      Mi Perfil
                    </a>

                    <!-- Separador -->
                    <div class="border-t border-gray-100 my-2"></div>

                    <!-- Cerrar sesión -->
                    <button
                      (click)="confirmLogout(); closeProfileDropdown()"
                      class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-colors cursor-pointer"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-4 h-4"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                        />
                      </svg>
                      Cerrar Sesión
                    </button>
                  </div>
                </div>
                } }
              </div>
            </div>
          </div>

          <!-- Menú móvil -->
          @if (isMobileMenuOpen) {
          <div
            class="md:hidden absolute top-full left-0 right-0 bg-white shadow-lg z-40 border-t"
          >
            <div class="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gray-50">
              <!-- Barra de búsqueda móvil -->
              <div class="px-3 py-2">
                <div class="relative">
                  <div
                    class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none"
                  >
                    <svg
                      class="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="m21 21-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    type="text"
                    [(ngModel)]="searchTerm"
                    (input)="onSearch()"
                    (keydown.enter)="
                      navigateToSearchResults(); closeMobileMenu()
                    "
                    placeholder="Buscar productos..."
                    class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#a81b8d] focus:border-[#a81b8d] text-sm"
                  />
                </div>
              </div>

              <!-- Categorías dinámicas en móvil -->
              <div class="mb-4">
                <h3 class="text-sm font-semibold text-gray-900 px-3 py-2">
                  Categorías
                </h3>
                @for (category of categories; track category.id) {
                <button
                  (click)="navigateToCategory(category.id); closeMobileMenu()"
                  class="w-full text-left flex items-center gap-3 text-gray-700 hover:text-[#a81b8d] hover:bg-white px-3 py-2 text-sm rounded-lg transition-colors"
                >
                  <div class="w-2 h-2 bg-[#a81b8d] rounded-full"></div>
                  <div>
                    <div class="font-medium">{{ category.name }}</div>
                    @if (category.description) {
                    <div class="text-xs text-gray-500">
                      {{ category.description }}
                    </div>
                    }
                  </div>
                </button>
                }
              </div>

              <!-- Separador -->
              <div class="border-t border-gray-200 my-2"></div>

              <!-- Enlaces principales -->
              <a
                routerLink="/products"
                (click)="closeMobileMenu()"
                class="flex items-center gap-2 text-gray-700 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium transition-colors"
              >
                Todos los productos
              </a>
              <a
                routerLink="/products"
                (click)="closeMobileMenu()"
                class="flex items-center gap-2 text-[#a81b8d] px-3 py-2 text-sm font-medium border-1 border-[#a81b8d] hover:bg-[#a81b8d] hover:text-white rounded-lg transition-colors mb-2"
              >
                <!-- Ícono de ubicación (location pin) -->
                <svg
                  class="w-4 h-4"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
                ¿Dónde quieres pedir?
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 20 20"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-4 h-4"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="m19.5 8.25-7.5 7.5-7.5-7.5"
                  />
                </svg>
              </a>
              <a
                routerLink="/cart"
                (click)="closeMobileMenu()"
                class="relative text-gray-900 hover:text-indigo-600 px-3 py-2 text-sm font-medium flex items-center gap-2"
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5-6M17 13v6a2 2 0 01-2 2H7a2 2 0 01-2-2v-6"
                  />
                </svg>
                Carrito @if (cartItemCount > 0) {
                <span
                  class="bg-[#a81b8d] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center min-w-[20px] ml-auto"
                >
                  {{ cartItemCount }}
                </span>
                }
              </a>

              <!-- Separador -->
              <div class="border-t border-gray-200 my-2"></div>

              <!-- Enlaces de perfil para móvil -->
              @if (!isAuthenticated) {
              <!-- Login para usuarios no autenticados -->
              <a
                routerLink="/auth/login"
                (click)="closeMobileMenu()"
                class="flex items-center gap-2 text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z"
                  />
                </svg>
                Iniciar Sesión
              </a>
              } @else {
              <!-- Información del usuario -->
              <div class="px-3 py-2 border-b border-gray-200 mb-2">
                <div class="text-sm font-medium text-gray-900">
                  {{ currentUser?.firstName }} {{ currentUser?.lastName }}
                </div>
                <div class="text-xs text-gray-500">
                  {{ currentUser?.email }}
                </div>
              </div>

              <!-- Enlaces para usuarios autenticados -->
              <a
                routerLink="/orders"
                (click)="closeMobileMenu()"
                class="flex items-center gap-2 text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M15.75 10.5V6a3.75 3.75 0 1 0-7.5 0v4.5m11.356-1.993 1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 0 1-1.12-1.243l1.264-12A1.125 1.125 0 0 1 5.513 7.5h12.974c.576 0 1.059.435 1.119 1.007ZM8.625 10.5a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm7.5 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
                  />
                </svg>
                Mis Pedidos
              </a>
              <a
                routerLink="/profile"
                (click)="closeMobileMenu()"
                class="flex items-center gap-2 text-gray-900 hover:text-[#a81b8d] px-3 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                  />
                </svg>
                Mi Perfil
              </a>

              <!-- Cerrar sesión -->
              <button
                (click)="confirmLogout(); closeMobileMenu()"
                class="w-full flex items-center gap-2 text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-2 text-sm font-medium transition-colors"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke-width="1.5"
                  stroke="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15"
                  />
                </svg>
                Cerrar Sesión
              </button>
              }
            </div>
          </div>
          }
        </div>
      </div>
    </header>

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
export class HeaderComponent implements OnInit, OnDestroy {
  currentUser: any = null;
  isAuthenticated = false;
  isMobileMenuOpen = false;
  isCategoriesDropdownOpen = false;
  isProfileDropdownOpen = false; // Nueva propiedad para el dropdown del perfil
  hoveredCategoryId: string | null = null; // Para controlar el submenu
  submenuPosition = { left: 0, top: 0 }; // Posición fija del submenu
  isLogoutModalOpen = false; // Modal de confirmación de cierre de sesión
  categories: Category[] = [];
  cartItemCount = 0;

  // Propiedades de búsqueda
  searchTerm = '';
  searchResults: Product[] = [];
  isSearching = false;
  private searchSubject = new Subject<string>();

  private subscriptions: Subscription[] = [];

  constructor(
    private authService: AuthService,
    private productService: ProductService,
    private cartService: CartService,
    private router: Router
  ) {
    // Suscripción al usuario autenticado
    this.subscriptions.push(
      this.authService.currentUser$.subscribe((user) => {
        this.currentUser = user;
        this.isAuthenticated = this.authService.isAuthenticated;
      })
    );
  }

  ngOnInit(): void {
    this.loadCategories();
    this.setupSearchSubscription();
    this.setupCartSubscription();
  }

  /**
   * Configura la suscripción al carrito
   */
  private setupCartSubscription(): void {
    // Obtener el estado inicial del carrito
    this.cartItemCount = this.cartService.getTotalItemCount();

    // Suscribirse a los cambios del carrito
    this.subscriptions.push(
      this.cartService.cart$.subscribe((cart) => {
        this.cartItemCount = cart.totalItems;
      })
    );
  }

  /**
   * Configura la suscripción de búsqueda con debounce
   */
  private setupSearchSubscription(): void {
    this.subscriptions.push(
      this.searchSubject
        .pipe(debounceTime(300), distinctUntilChanged())
        .subscribe((searchTerm) => {
          this.performSearch(searchTerm);
        })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga las categorías desde el backend
   */
  private loadCategories(): void {
    // Primero intentar obtener categorías públicas
    this.productService.getPublicCategories().subscribe({
      next: (categories) => {
        this.categories = categories || [];
      },
      error: (error) => {
        console.error(
          '🏠 Header: Error loading public categories, trying admin endpoint as fallback:',
          error
        );

        // Si falla el endpoint público, intentar con el de admin (solo si el usuario está autenticado)
        if (this.isAuthenticated) {
          this.productService.getAllCategories().subscribe({
            next: (categories) => {
              this.categories = categories || [];
            },
            error: (adminError) => {
              // Si ambos fallan, usar categorías por defecto
              // this.categories = this.getFallbackCategories();
            },
          });
        } else {
          // this.categories = this.getFallbackCategories();
        }
      },
    });
  }

  /**
   * Alterna el dropdown de categorías
   */
  toggleCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = !this.isCategoriesDropdownOpen;
  }

  /**
   * Cierra el dropdown de categorías
   */
  closeCategoriesDropdown(): void {
    this.isCategoriesDropdownOpen = false;
    this.hoveredCategoryId = null;
  }

  /**
   * Maneja cuando el mouse entra sobre una categoría
   * Calcula y guarda la posición del submenu una sola vez
   */
  onCategoryHover(categoryId: string, event: MouseEvent): void {
    this.hoveredCategoryId = categoryId;

    // Calcular la posición del submenu basándose en el elemento actual
    const target = event.currentTarget as HTMLElement;
    const rect = target.getBoundingClientRect();

    // Obtener la posición del dropdown principal
    const dropdownElement = document.querySelector(
      '.absolute.top-full.left-0.mt-2'
    );
    if (dropdownElement) {
      const dropdownRect = dropdownElement.getBoundingClientRect();

      this.submenuPosition = {
        left: dropdownRect.right + 4, // 4px de separación
        top: rect.top, // Alineado con el item de la categoría
      };
    }
  }

  /**
   * Maneja cuando el mouse sale de una categoría
   */
  onCategoryMouseLeave(): void {
    this.hoveredCategoryId = null;
  }

  /**
   * Navega a productos filtrados por categoría
   */
  navigateToCategory(categoryId: string): void {
    this.closeCategoriesDropdown();
    this.router.navigate(['/products'], {
      queryParams: { category: categoryId },
    });
  }

  /**
   * Navega a productos filtrados por tipo de categoría
   */
  navigateToCategoryType(categoryId: string, categoryTypeId: string): void {
    this.closeCategoriesDropdown();
    this.router.navigate(['/products'], {
      queryParams: {
        category: categoryId,
        categoryType: categoryTypeId,
      },
    });
  }

  /**
   * Alterna el dropdown del perfil
   */
  toggleProfileDropdown(): void {
    this.isProfileDropdownOpen = !this.isProfileDropdownOpen;
  }

  /**
   * Cierra el dropdown del perfil
   */
  closeProfileDropdown(): void {
    this.isProfileDropdownOpen = false;
  }

  /**
   * Cierra dropdowns cuando se hace clic fuera
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    const dropdownElement = target.closest('.relative');

    if (!dropdownElement) {
      this.closeCategoriesDropdown();
      this.closeProfileDropdown();
    }
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
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
   * Cierra sesión del usuario
   */
  logout(): void {
    this.authService.logout();
    window.location.href = '/home';
  }

  /**
   * Maneja el evento de entrada de texto en el campo de búsqueda
   */
  onSearch(): void {
    this.searchSubject.next(this.searchTerm);
  }

  /**
   * Maneja el evento focus del campo de búsqueda
   */
  onSearchFocus(): void {
    if (this.searchTerm && this.searchResults.length > 0) {
      // Ya tenemos resultados, los mostramos
    }
  }

  /**
   * Maneja el evento blur del campo de búsqueda
   */
  onSearchBlur(): void {
    // Agregamos un delay para permitir clic en los resultados
    setTimeout(() => {
      // No limpiamos aquí para mantener los resultados visibles
    }, 200);
  }

  /**
   * Realiza la búsqueda de productos
   */
  private performSearch(searchTerm: string): void {
    if (!searchTerm.trim()) {
      this.searchResults = [];
      return;
    }

    this.isSearching = true;

    this.productService.searchProducts(searchTerm).subscribe({
      next: (products) => {
        this.searchResults = products.slice(0, 8); // Limitamos a 8 resultados
        this.isSearching = false;
      },
      error: (error) => {
        console.error('Error en búsqueda:', error);
        this.searchResults = [];
        this.isSearching = false;
      },
    });
  }

  /**
   * Limpia la búsqueda y cierra los resultados
   */
  clearSearch(): void {
    this.searchTerm = '';
    this.searchResults = [];
  }

  /**
   * Navega a la página de resultados de búsqueda
   */
  navigateToSearchResults(): void {
    if (this.searchTerm.trim()) {
      this.router.navigate(['/products'], {
        queryParams: { search: this.searchTerm.trim() },
      });
      this.clearSearch();
    }
  }
}
