import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-verify',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div
      class="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-100 via-blue-50 to-indigo-100"
    >
      <div class="w-full max-w-md p-8">
        <!-- Contenedor principal -->
        <div class="bg-white rounded-2xl shadow-xl p-8">
          <!-- Logo -->
          <div class="text-center mb-8">
            <div class="w-20 h-20 bg-[#a81b8d] rounded-full mx-auto flex items-center justify-center mb-4">
              <span class="text-white text-2xl font-bold">T</span>
            </div>
            <h2 class="text-2xl font-bold text-gray-800 mb-2">Verificar tu cuenta</h2>
            <p class="text-gray-600 text-sm">
              Hemos enviado un código de verificación a tu email
            </p>
            @if (email) {
              <p class="text-[#a81b8d] text-sm font-medium mt-2">{{ email }}</p>
            }
          </div>

          <!-- Mensaje de información -->
          @if (message) {
            <div class="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p class="text-blue-800 text-sm">{{ message }}</p>
            </div>
          }

          <!-- Mensaje de error -->
          @if (errorMessage) {
            <div
              class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6"
              role="alert"
            >
              {{ errorMessage }}
            </div>
          }

          <!-- Formulario -->
          <form [formGroup]="verifyForm" (ngSubmit)="onSubmit()">
            <div class="space-y-6">
              <div>
                <label for="code" class="block text-sm font-medium text-gray-700">
                  Código de verificación
                </label>
                <input
                  id="code"
                  name="code"
                  type="text"
                  formControlName="code"
                  required
                  maxlength="6"
                  class="mt-1 appearance-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm text-center text-lg tracking-widest"
                  placeholder="000000"
                />
                @if (verifyForm.get('code')?.invalid && verifyForm.get('code')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    El código de verificación es requerido
                  </p>
                }
              </div>

              <!-- Botón de verificación -->
              <div>
                <button
                  type="submit"
                  [disabled]="isLoading || verifyForm.invalid"
                  class="cursor-pointer group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#a81b8d] hover:bg-[#8e1578] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#a81b8d] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  @if (isLoading) {
                    <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  }
                  {{ isLoading ? 'Verificando...' : 'Verificar cuenta' }}
                </button>
              </div>
            </div>
          </form>

          <!-- Enlaces adicionales -->
          <div class="text-center mt-6 space-y-2">
            <p class="text-gray-600 text-sm">
              ¿No recibiste el código?
              <button
                (click)="resendCode()"
                [disabled]="isResending"
                class="cursor-pointer text-[#667eea] hover:text-[#3353e4] font-medium disabled:opacity-50"
              >
                {{ isResending ? 'Reenviando...' : 'Reenviar código' }}
              </button>
            </p>
            
            <!-- Botón temporal para desarrollo -->
            <p class="text-yellow-600 text-xs bg-yellow-50 p-2 rounded border">
              🔧 Modo desarrollo: 
              <button
                (click)="getDevCode()"
                class="cursor-pointer text-yellow-700 hover:text-yellow-900 font-medium underline"
              >
                Obtener código de verificación
              </button>
            </p>
            
            <div class="text-center mt-4">
              <button
                (click)="goToLogin()"
                class="cursor-pointer text-[#667eea] text-sm hover:text-[#3353e4]"
              >
                Volver al login
              </button>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div class="text-center mt-8">
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
  `,
})
export class VerifyComponent implements OnInit {
  verifyForm: FormGroup;
  isLoading = false;
  isResending = false;
  errorMessage = '';
  message = '';
  email = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient
  ) {
    this.verifyForm = this.fb.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  ngOnInit(): void {
    // Obtener parámetros de la URL
    this.route.queryParams.subscribe(params => {
      this.email = params['email'] || '';
      this.message = params['message'] || '';
    });
  }

  onSubmit(): void {
    if (this.verifyForm.valid && !this.isLoading && this.email) {
      this.isLoading = true;
      this.errorMessage = '';

      const verifyData = {
        userName: this.email, // El backend usa userName pero es el email
        code: this.verifyForm.value.code
      };

      console.log('🔐 Verify: Sending verification request:', verifyData);

      this.authService.verifyAccount(verifyData).subscribe({
        next: (response) => {
          console.log('🔐 Verify: Verification response:', response);
          // Redirigir al login con mensaje de éxito
          this.router.navigate(['/auth/login'], {
            queryParams: { 
              message: 'Tu cuenta ha sido verificada exitosamente. Ahora puedes iniciar sesión.' 
            }
          });
        },
        error: (error: any) => {
          console.error('🔐 Verify: Verification error:', error);
          if (error.status === 400) {
            this.errorMessage = 'El código de verificación es incorrecto o ha expirado.';
          } else {
            this.errorMessage = 'Error al verificar la cuenta. Por favor intenta de nuevo.';
          }
          this.isLoading = false;
        },
        complete: () => {
          this.isLoading = false;
        },
      });
    } else if (!this.email) {
      this.errorMessage = 'No se ha proporcionado el email. Por favor regístrate de nuevo.';
    }
  }

  resendCode(): void {
    if (this.email && !this.isResending) {
      this.isResending = true;
      this.errorMessage = '';

      // Por ahora, simulamos el reenvío
      // En el futuro podrías crear un endpoint específico para reenviar códigos
      console.log('🔐 Verify: Resending code for email:', this.email);
      
      setTimeout(() => {
        this.isResending = false;
        this.message = 'Se ha reenviado el código de verificación a tu email.';
      }, 2000);
    }
  }

  goToLogin(): void {
    this.router.navigate(['/auth/login']);
  }

  // Método temporal para desarrollo - obtener código de verificación
  getDevCode(): void {
    if (!this.email) {
      this.errorMessage = 'No se ha proporcionado el email';
      return;
    }

    console.log('🔧 Dev: Getting verification code for:', this.email);
    const url = `http://localhost:8080/api/dev/verification-code/${this.email}`;
    console.log('🔧 Dev: Making request to:', url);
    
    // Llamar al endpoint temporal de desarrollo
    this.http.get<any>(url).subscribe({
      next: (response) => {
        console.log('🔧 Dev: Code retrieved successfully:', response);
        // Auto-rellenar el formulario con el código
        this.verifyForm.patchValue({ code: response.verificationCode });
        this.message = `Código obtenido: ${response.verificationCode} (auto-completado)`;
        this.errorMessage = '';
      },
      error: (error) => {
        console.error('🔧 Dev: Full error object:', error);
        console.error('🔧 Dev: Error status:', error.status);
        console.error('🔧 Dev: Error message:', error.message);
        console.error('🔧 Dev: Error url:', error.url);
        
        let errorMsg = 'Error desconocido';
        if (error.status === 0) {
          errorMsg = 'No se puede conectar al backend. Verifica que esté corriendo en http://localhost:8080';
        } else if (error.status === 404) {
          errorMsg = 'Endpoint no encontrado. Verifica que el DevController esté implementado correctamente';
        } else if (error.status === 500) {
          errorMsg = 'Error interno del servidor. Revisa los logs del backend';
        } else {
          errorMsg = `Error ${error.status}: ${error.error?.message || error.message}`;
        }
        
        this.errorMessage = errorMsg;
      }
    });
  }
}