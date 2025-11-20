import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  OnDestroy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { RoleService } from '../../../services/role.service';
import { Role } from '../../../models/role.model';

export interface User {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  enabled: boolean;
  authorityList: string[];
}

export interface UserFormData {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  enabled: boolean;
  roles: string[];
}

@Component({
  selector: 'app-user-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ButtonComponent,
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      size="xl"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <form
        [formGroup]="userForm"
        (ngSubmit)="onSubmit()"
        class="space-y-4"
      >
        <!-- Información Personal -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Información Personal
          </h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Nombres -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombres <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="firstName"
                placeholder="Ej: Juan Diego"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  userForm.get('firstName')?.invalid &&
                  userForm.get('firstName')?.touched
                "
              />
              @if (userForm.get('firstName')?.invalid &&
              userForm.get('firstName')?.touched) {
              <p class="mt-1 text-sm text-red-600">El nombre es requerido</p>
              }
            </div>

            <!-- Apellidos -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Apellidos <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                formControlName="lastName"
                placeholder="Ej: Pérez Gómez"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  userForm.get('lastName')?.invalid &&
                  userForm.get('lastName')?.touched
                "
              />
              @if (userForm.get('lastName')?.invalid &&
              userForm.get('lastName')?.touched) {
              <p class="mt-1 text-sm text-red-600">El apellido es requerido</p>
              }
            </div>
          </div>
        </div>

        <!-- Información de Contacto -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Información de Contacto
          </h3>
          
          <div class="grid grid-cols-2 gap-4">
            <!-- Email -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Correo Electrónico <span class="text-red-500">*</span>
              </label>
              <input
                type="email"
                formControlName="email"
                placeholder="usuario@example.com"
                [readonly]="mode === 'edit'"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.bg-gray-50]="mode === 'edit'"
                [class.cursor-not-allowed]="mode === 'edit'"
                [class.border-red-500]="
                  userForm.get('email')?.invalid &&
                  userForm.get('email')?.touched
                "
              />
              @if (mode === 'edit') {
              <p class="mt-1 text-xs text-gray-500">El email no se puede modificar</p>
              }
              @if (userForm.get('email')?.invalid &&
              userForm.get('email')?.touched) {
              <p class="mt-1 text-sm text-red-600">
                @if (userForm.get('email')?.errors?.['required']) {
                  El email es requerido
                }
                @if (userForm.get('email')?.errors?.['email']) {
                  Email inválido
                }
              </p>
              }
            </div>

            <!-- Teléfono -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Teléfono
              </label>
              <input
                type="tel"
                formControlName="phoneNumber"
                placeholder="987654321"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              />
            </div>
          </div>
        </div>

        <!-- Imagen de Perfil -->
        <div class="border-b border-gray-200 pb-4">
          <h3 class="text-lg font-semibold text-gray-900 mb-4">
            Imagen de Perfil
          </h3>
          
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              URL de la imagen
            </label>
            <input
              type="url"
              formControlName="profileImageUrl"
              placeholder="https://ejemplo.com/imagen.jpg"
              class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
            @if (userForm.get('profileImageUrl')?.value) {
              <div class="mt-2">
                <img
                  [src]="userForm.get('profileImageUrl')?.value"
                  alt="Vista previa"
                  class="h-20 w-20 object-cover rounded-full border border-gray-300"
                  (error)="onImageError($event)"
                />
              </div>
            }
          </div>
        </div>

        <!-- Roles y Estado -->
        <div class="space-y-4">
          <h3 class="text-lg font-semibold text-gray-900">
            Permisos y Estado
          </h3>
          
          <!-- Roles -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Roles <span class="text-red-500">*</span>
            </label>
            
            <!-- Loading state -->
            @if (isLoadingRoles) {
              <div class="flex items-center justify-center py-4">
                <div class="animate-spin rounded-full h-6 w-6 border-b-2 border-[#a81b8d]"></div>
                <span class="ml-2 text-sm text-gray-500">Cargando roles...</span>
              </div>
            } @else if (availableRoles.length === 0) {
              <div class="text-sm text-gray-500 py-2">
                No hay roles disponibles
              </div>
            } @else {
              <div class="space-y-2">
                @for (role of availableRoles; track role.code) {
                  <label class="flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      [value]="role.code"
                      [checked]="isRoleSelected(role.code)"
                      (change)="toggleRole(role.code)"
                      class="w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
                    />
                    <span class="ml-2 text-sm text-gray-700">{{ role.code }}</span>
                  </label>
                }
              </div>
            }
            @if (selectedRoles.length === 0 && userForm.touched) {
              <p class="mt-1 text-sm text-red-600">Selecciona al menos un rol</p>
            }
          </div>

          <!-- Estado -->
          <div>
            <label class="flex items-center cursor-pointer">
              <input
                type="checkbox"
                formControlName="enabled"
                class="w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
              />
              <span class="ml-2 text-sm font-medium text-gray-700">Usuario activo</span>
            </label>
            <p class="mt-1 text-xs text-gray-500">
              Los usuarios inactivos no podrán iniciar sesión
            </p>
          </div>
        </div>

        <!-- Botones -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <app-button
            [config]="{
              text: 'Cancelar',
              type: 'secondary',
              size: 'md'
            }"
            (buttonClick)="onClose()"
          />

          <button
            type="submit"
            [disabled]="userForm.invalid || isSubmitting || selectedRoles.length === 0"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear Usuario' : 'Guardar Cambios' }}
          </button>
        </div>
      </form>
    </app-modal>
  `,
})
export class UserModalComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() user: User | null = null;

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveUser = new EventEmitter<UserFormData>();

  userForm!: FormGroup;
  isSubmitting = false;
  selectedRoles: string[] = [];
  availableRoles: { code: string; description: string }[] = [];
  isLoadingRoles = false;

  private subscriptions: Subscription[] = [];

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.loadRoles();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  /**
   * Carga los roles desde la base de datos
   */
  private loadRoles(): void {
    this.isLoadingRoles = true;
    this.subscriptions.push(
      this.roleService.getAllRoles().subscribe({
        next: (roles: Role[]) => {
          this.availableRoles = roles.map(role => ({
            code: role.roleCode,
            description: role.roleDescription
          }));
          this.isLoadingRoles = false;
        },
        error: (error) => {
          console.error('Error loading roles:', error);
          this.isLoadingRoles = false;
          // Fallback a roles por defecto en caso de error
          this.availableRoles = [
            { code: 'ADMIN', description: 'Administrador' },
            { code: 'USER', description: 'Cliente' },
          ];
        }
      })
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['user'] && this.user) {
      this.initForm();
      this.selectedRoles = [...(this.user.authorityList || [])];
    }

    if (changes['isOpen'] && this.isOpen && !this.user) {
      this.initForm();
      this.selectedRoles = [];
    }
  }

  private initForm(): void {
    this.userForm = this.fb.group({
      email: [
        { value: this.user?.email || '', disabled: this.mode === 'edit' },
        [Validators.required, Validators.email],
      ],
      firstName: [this.user?.firstName || '', [Validators.required]],
      lastName: [this.user?.lastName || '', [Validators.required]],
      phoneNumber: [this.user?.phoneNumber || ''],
      profileImageUrl: [this.user?.profileImageUrl || ''],
      enabled: [this.user?.enabled !== undefined ? this.user.enabled : true],
    });
  }

  get modalTitle(): string {
    return this.mode === 'create' ? 'Crear Nuevo Usuario' : 'Editar Usuario';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Completa los datos del nuevo usuario'
      : `Modificando: ${this.user?.email}`;
  }

  isRoleSelected(role: string): boolean {
    return this.selectedRoles.includes(role);
  }

  toggleRole(role: string): void {
    const index = this.selectedRoles.indexOf(role);
    if (index > -1) {
      this.selectedRoles.splice(index, 1);
    } else {
      this.selectedRoles.push(role);
    }
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = '/assets/images/user-default.png';
  }

  onSubmit(): void {
    if (this.userForm.invalid || this.selectedRoles.length === 0) {
      this.userForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const formData: UserFormData = {
      email: this.mode === 'create' ? this.userForm.get('email')?.value : this.user!.email,
      firstName: this.userForm.get('firstName')?.value,
      lastName: this.userForm.get('lastName')?.value,
      phoneNumber: this.userForm.get('phoneNumber')?.value || undefined,
      profileImageUrl: this.userForm.get('profileImageUrl')?.value || undefined,
      enabled: this.userForm.get('enabled')?.value,
      roles: [...this.selectedRoles],
    };

    this.saveUser.emit(formData);
  }

  onClose(): void {
    this.userForm.reset();
    this.selectedRoles = [];
    this.isSubmitting = false;
    this.closeModal.emit();
  }
}
