import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100"
    >
      <!-- Fondo decorativo -->
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

        <!-- Formulario de login -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <div class="max-w-md w-full space-y-8">
            <div>
              <h2
                class="mt-6 text-center text-3xl font-extrabold text-gray-900"
              >
                Iniciar Sesión
              </h2>
            </div>
            <form
              class="mt-8 space-y-6"
              [formGroup]="loginForm"
              (ngSubmit)="onSubmit()"
            >
              @if (successMessage) {
              <div
                class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded"
              >
                {{ successMessage }}
              </div>
              } @if (errorMessage) {
              <div
                class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded"
              >
                {{ errorMessage }}
              </div>
              }

              <div class="space-y-4">
                <div>
                  <label
                    for="userName"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Correo Electrónico
                  </label>
                  <input
                    id="userName"
                    name="userName"
                    type="email"
                    formControlName="userName"
                    required
                    class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-0 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 sm:text-sm"
                    placeholder="tu-correo@email.com"
                  />
                  @if (loginForm.get('userName')?.invalid &&
                  loginForm.get('userName')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    Ingresa un email válido
                  </p>
                  }
                </div>

                <div>
                  <label
                    for="password"
                    class="block text-sm font-medium text-gray-700"
                  >
                    Contraseña
                  </label>
                  <div
                    class="flex items-center appearance-none mt-1 px-3 py-2 border border-gray-300 rounded-md focus-within:outline-none focus-within:ring-0 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all duration-200"
                  >
                    <input
                      id="password"
                      name="password"
                      [type]="showPassword ? 'text' : 'password'"
                      formControlName="password"
                      required
                      class="appearance-none w-full focus:outline-none placeholder-gray-500 text-gray-900 sm:text-sm"
                      placeholder="Contraseña"
                    />
                    <button
                      type="button"
                      class="ml-3 cursor-pointer"
                      (click)="togglePasswordVisibility()"
                    >
                      @if (showPassword) {
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 text-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
                        />
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                        />
                      </svg>
                      } @else {
                      <svg
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke-width="1.5"
                        stroke="currentColor"
                        class="w-5 h-5 text-gray-400"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88"
                        />
                      </svg>
                      }
                    </button>
                  </div>
                  @if (loginForm.get('password')?.invalid &&
                  loginForm.get('password')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    La contraseña es requerida
                  </p>
                  }
                </div>
              </div>

              <!-- Botón de envío -->
              <button
                type="submit"
                class="bg-[#667eea] inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-[#3353e4] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 w-full cursor-pointer"
                [disabled]="isLoading || loginForm.invalid"
              >
                <span *ngIf="!isLoading">Iniciar Sesión</span>
                <span *ngIf="isLoading">Cargando...</span>
              </button>

              <!-- Opciones adicionales -->
              <div class="text-center m-0">
                <a
                  (click)="navigateToForgotPassword()"
                  class="text-[#667eea] text-decoration-none cursor-pointer text-sm text-center hover:text-[#3353e4]"
                >
                  ¿Olvidaste tu contraseña?
                </a>
              </div>

              <!-- Separador -->
              <div class="flex items-center my-6">
                <div class="flex-grow border-t border-gray-300"></div>
                <span class="mx-4 text-gray-400 text-sm">o</span>
                <div class="flex-grow border-t border-gray-300"></div>
              </div>

              <!-- Login con Google -->
              <button
                type="button"
                (click)="loginWithGoogle()"
                class="text-center w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-200 flex items-center justify-center cursor-pointer"
                [disabled]="isLoading"
              >
                <img
                  src="/assets/icons/Google.png"
                  alt="Google Logo"
                  class="w-4 h-4 mr-2"
                />
                <span>Continuar con Google</span>
              </button>

              <!-- Registro -->
              <div class="text-center mt-4 text-[#6b7280] text-sm m-0">
                <p>
                  ¿No tienes una cuenta?
                  <a
                    (click)="navigateToRegister()"
                    class="text-[#667eea] text-sm text-decoration-none cursor-pointer hover:text-[#3353e4]"
                    >Regístrate aquí</a
                  >
                </p>
              </div>
              <div class="text-center mt-4 text-[#6b7280] text-sm m-0">
                <u
                  ><a
                    (click)="navigateToHome()"
                    class="text-[#667eea] text-sm text-decoration-none cursor-pointer hover:text-[#3353e4]"
                    >Volver al inicio</a
                  ></u
                >
              </div>
            </form>
          </div>
          <!-- Cierre de space-y-8 -->
        </div>
        <!-- Cierre de bg-white rounded-2xl -->

        <!-- Footer mínimo para auth -->
        <div class="text-center mt-8 mb-8 px-4">
          <p class="text-sm text-gray-500 leading-relaxed">
            © 2025 Tambo Delivery. Todos los derechos reservados.
          </p>
        </div>
      </div>
      <!-- Cierre de contenedor principal -->

      <!-- Elementos decorativos -->
      <div
        class="absolute top-10 left-10 w-20 h-20 bg-[#a81b8d]/20 rounded-full blur-xl"
      ></div>
      <div
        class="absolute bottom-10 right-10 w-32 h-32 bg-blue-400/20 rounded-full blur-xl"
      ></div>
      <div
        class="absolute top-1/2 left-1/4 w-16 h-16 bg-purple-300/20 rounded-full blur-xl"
      ></div>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  successMessage = '';
  showPassword = false; // Variable para controlar visibilidad de contraseña

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.required, Validators.email]], // Cambiado de 'email' a 'userName'
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  ngOnInit(): void {
    // Leer mensajes de query parameters
    this.route.queryParams.subscribe((params) => {
      if (params['message']) {
        this.successMessage = params['message'];
        // Limpiar el mensaje después de 5 segundos
        setTimeout(() => {
          this.successMessage = '';
        }, 5000);
      }
      
      // Pre-llenar email si viene del registro
      if (params['email']) {
        this.loginForm.patchValue({
          userName: params['email']
        });
      }
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid && !this.isLoading) {
      this.isLoading = true;
      this.errorMessage = '';

      console.log(
        '🔐 Login: Sending login request with:',
        this.loginForm.value
      );

      this.authService.loginAndLoadProfile(this.loginForm.value).subscribe({
        next: (result) => {
          console.log('🔐 Login: Login and profile result:', result);
          if (result.success) {
            const redirectRoute = result.redirectRoute || '/home';
            console.log(
              '🔐 Login: Login successful, redirecting to:',
              redirectRoute
            );
            this.router.navigate([redirectRoute]);
          } else {
            this.errorMessage = result.error || 'Error al iniciar sesión';
          }
        },
        error: (error: any) => {
          console.error('🔐 Login: Login error:', error);
          if (error.status === 401) {
            if (
              error.error?.message &&
              error.error.message.includes('deshabilitado')
            ) {
              this.errorMessage =
                'Tu cuenta no está verificada. Por favor revisa tu email y usa el código de verificación que te enviamos.';
              // Opcionalmente, redirigir a la página de verificación después de unos segundos
              setTimeout(() => {
                this.router.navigate(['/auth/verify'], {
                  queryParams: {
                    email: this.loginForm.value.userName,
                    message:
                      'Por favor ingresa el código de verificación que te enviamos por email.',
                  },
                });
              }, 3000);
            } else {
              this.errorMessage = 'Email o contraseña incorrectos';
            }
          } else if (error.error?.message) {
            this.errorMessage = error.error.message;
          } else {
            this.errorMessage = 'Error al conectar con el servidor';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    }
  }

  // Método para mostrar/ocultar la contraseña
  togglePasswordVisibility(): void {
    this.showPassword = !this.showPassword;
  }

  navigateToRegister(): void {
    this.router.navigate(['/auth/register']);
  }

  navigateToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }

  loginWithGoogle(): void {
    // Redirigir al endpoint de OAuth2 de Google
    window.location.href = 'http://localhost:8080/oauth2/authorization/google';
  }

  navigateToHome(): void {
    this.router.navigate(['/home']);
  }
}
