import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { Subscription } from 'rxjs';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { RoleService } from '../../../services/role.service';
import { ToastService } from '../../../shared/services/toast.service';
import { Role, RoleRequestDto } from '../../../models/role.model';

@Component({
  selector: 'app-roles-modal',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ModalComponent,
    ConfirmModalComponent
  ],
  template: `
    <app-modal
      [isOpen]="isOpen"
      title="Gestión de Roles"
      subtitle="Administra los roles del sistema"
      size="lg"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <div class="space-y-6">
        <!-- Formulario para crear/editar rol -->
        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
          <h3 class="text-base font-semibold text-gray-900 mb-4">
            {{ editingRole ? 'Editar Rol' : 'Crear Nuevo Rol' }}
          </h3>
          
          <form [formGroup]="roleForm" (ngSubmit)="onSubmit()" class="space-y-4">
            <div class="grid grid-cols-1 gap-4">
              <!-- Role Code -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Código del Rol <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="roleCode"
                  placeholder="Ej: MANAGER"
                  class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                  [class.border-red-500]="
                    roleForm.get('roleCode')?.invalid &&
                    roleForm.get('roleCode')?.touched
                  "
                />
                @if (roleForm.get('roleCode')?.invalid && roleForm.get('roleCode')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    El código del rol es requerido (mín. 2 caracteres)
                  </p>
                }
              </div>

              <!-- Role Description -->
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">
                  Descripción <span class="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  formControlName="roleDescription"
                  placeholder="Ej: Gerente de operaciones"
                  class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                  [class.border-red-500]="
                    roleForm.get('roleDescription')?.invalid &&
                    roleForm.get('roleDescription')?.touched
                  "
                />
                @if (roleForm.get('roleDescription')?.invalid && roleForm.get('roleDescription')?.touched) {
                  <p class="mt-1 text-sm text-red-600">
                    La descripción es requerida (mín. 3 caracteres)
                  </p>
                }
              </div>
            </div>

            <!-- Botones del formulario -->
            <div class="flex justify-end gap-3 pt-2">
              @if (editingRole) {
                <button
                  type="button"
                  (click)="cancelEdit()"
                  class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancelar
                </button>
              }
              <button
                type="submit"
                [disabled]="roleForm.invalid || isSubmitting"
                class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {{ editingRole ? 'Actualizar' : 'Crear' }} Rol
              </button>
            </div>
          </form>
        </div>

        <!-- Lista de roles existentes -->
        <div>
          <h3 class="text-base font-semibold text-gray-900 mb-4">
            Roles Existentes ({{ roles.length }})
          </h3>

          @if (isLoadingRoles) {
            <div class="flex justify-center items-center py-8">
              <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          } @else if (roles.length === 0) {
            <div class="text-center py-8 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p>No hay roles registrados</p>
            </div>
          } @else {
            <div class="space-y-2 max-h-96 overflow-y-auto">
              @for (role of roles; track role.id) {
                <div class="bg-white border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                  <div class="flex items-center justify-between">
                    <div class="flex-1">
                      <div class="flex items-center gap-2 mb-1">
                        <h4 class="text-sm font-semibold text-gray-900">
                          {{ role.roleCode }}
                        </h4>
                      </div>
                      <p class="text-sm text-gray-600">
                        {{ role.roleDescription }}
                      </p>
                      <p class="text-xs text-gray-400 mt-1">
                        ID: {{ role.id }}
                      </p>
                    </div>
                    <div class="flex items-center gap-2 ml-4">
                      <button
                        (click)="editRole(role)"
                        class="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                        title="Editar rol"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button
                        (click)="confirmDeleteRole(role)"
                        class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                        title="Eliminar rol"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Botón de cerrar al final -->
        <div class="flex justify-end pt-4 border-t">
          <button
            type="button"
            (click)="onClose()"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </app-modal>

    <!-- Confirm Delete Modal -->
    <app-confirm-modal
      *ngIf="isDeleteModalOpen"
      [isOpen]="isDeleteModalOpen"
      title="Eliminar Rol"
      [message]="'¿Estás seguro de que deseas eliminar el rol ' + roleToDelete?.roleCode + '? Esta acción no se puede deshacer.'"
      confirmText="Eliminar"
      cancelText="Cancelar"
      type="danger"
      (confirm)="deleteRole()"
      (cancel)="closeDeleteModal()"
    />
  `,
  styles: []
})
export class RolesModalComponent implements OnInit, OnDestroy {
  @Input() isOpen = false;
  @Output() closeModal = new EventEmitter<void>();

  roles: Role[] = [];
  roleForm: FormGroup;
  editingRole: Role | null = null;
  
  isLoadingRoles = false;
  isSubmitting = false;
  
  isDeleteModalOpen = false;
  roleToDelete: Role | null = null;
  
  private destroy$ = new Subscription();

  constructor(
    private fb: FormBuilder,
    private roleService: RoleService,
    private toastService: ToastService
  ) {
    this.roleForm = this.createRoleForm();
  }

  ngOnInit(): void {
    if (this.isOpen) {
      this.loadRoles();
    }
  }

  ngOnDestroy(): void {
    this.destroy$.unsubscribe();
  }

  /**
   * Crea el formulario para roles
   */
  private createRoleForm(): FormGroup {
    return this.fb.group({
      roleCode: ['', [Validators.required, Validators.minLength(2)]],
      roleDescription: ['', [Validators.required, Validators.minLength(3)]]
    });
  }

  /**
   * Carga todos los roles
   */
  loadRoles(): void {
    this.isLoadingRoles = true;
    
    const sub = this.roleService.getAllRoles().subscribe({
      next: (roles) => {
        this.roles = roles;
        this.isLoadingRoles = false;
      },
      error: (error) => {
        this.toastService.show(error.message || 'Error al cargar los roles', 'error');
        this.isLoadingRoles = false;
      }
    });
    
    this.destroy$.add(sub);
  }

  /**
   * Maneja el envío del formulario
   */
  onSubmit(): void {
    if (this.roleForm.invalid) {
      Object.keys(this.roleForm.controls).forEach(key => {
        this.roleForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.isSubmitting = true;
    
    const roleData: RoleRequestDto = {
      roleCode: this.roleForm.value.roleCode.toUpperCase().trim(),
      roleDescription: this.roleForm.value.roleDescription.trim()
    };

    const operation = this.editingRole
      ? this.roleService.updateRole(this.editingRole.id, roleData)
      : this.roleService.createRole(roleData);

    const sub = operation.subscribe({
      next: () => {
        this.toastService.show(
          `Rol ${this.editingRole ? 'actualizado' : 'creado'} exitosamente`,
          'success'
        );
        this.isSubmitting = false;
        this.roleForm.reset();
        this.editingRole = null;
        this.loadRoles();
      },
      error: (error) => {
        this.toastService.show(error.message || 'Error al guardar el rol', 'error');
        this.isSubmitting = false;
      }
    });

    this.destroy$.add(sub);
  }

  /**
   * Prepara el formulario para editar un rol
   */
  editRole(role: Role): void {
    this.editingRole = role;
    this.roleForm.patchValue({
      roleCode: role.roleCode,
      roleDescription: role.roleDescription
    });
  }

  /**
   * Cancela la edición
   */
  cancelEdit(): void {
    this.editingRole = null;
    this.roleForm.reset();
  }

  /**
   * Abre el modal de confirmación para eliminar
   */
  confirmDeleteRole(role: Role): void {
    this.roleToDelete = role;
    this.isDeleteModalOpen = true;
  }

  /**
   * Cierra el modal de confirmación
   */
  closeDeleteModal(): void {
    this.isDeleteModalOpen = false;
    this.roleToDelete = null;
  }

  /**
   * Elimina un rol
   */
  deleteRole(): void {
    if (!this.roleToDelete) return;

    const sub = this.roleService.deleteRole(this.roleToDelete.id).subscribe({
      next: () => {
        this.toastService.show('Rol eliminado exitosamente', 'success');
        this.closeDeleteModal();
        this.loadRoles();
      },
      error: (error) => {
        this.toastService.show(error.message || 'Error al eliminar el rol', 'error');
        this.closeDeleteModal();
      }
    });

    this.destroy$.add(sub);
  }

  /**
   * Cierra el modal
   */
  onClose(): void {
    this.closeModal.emit();
  }
}
