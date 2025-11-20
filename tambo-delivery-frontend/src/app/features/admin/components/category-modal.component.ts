import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  FormArray,
} from '@angular/forms';
import { Category, CategoryType } from '../../../models/category.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-category-modal',
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
      size="2xl"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <form [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <!-- Two Column Layout -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          <!-- LEFT COLUMN: Información General -->
          <div class="space-y-5">
            <!-- Section Header -->
            <div class="border-b border-gray-200 pb-3">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#a81b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información General
              </h3>
              <p class="text-sm text-gray-500 mt-1">Datos básicos de la categoría</p>
            </div>

            <!-- Category Name -->
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Categoría <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                formControlName="name"
                placeholder="Ej: Bebidas, Snacks, etc."
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] transition-all"
                [class.border-red-500]="categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched"
              />
              @if (categoryForm.get('name')?.invalid && categoryForm.get('name')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  @if (categoryForm.get('name')?.errors?.['required']) {
                    El nombre es requerido
                  }
                  @if (categoryForm.get('name')?.errors?.['minlength']) {
                    El nombre debe tener al menos 2 caracteres
                  }
                </p>
              }
            </div>

            <!-- Description -->
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 mb-2">
                Descripción
              </label>
              <textarea
                id="description"
                formControlName="description"
                rows="3"
                placeholder="Descripción de la categoría (opcional)"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] transition-all resize-none"
              ></textarea>
            </div>

            <!-- Image URL -->
            <div>
              <label for="imageUrl" class="block text-sm font-medium text-gray-700 mb-2">
                URL de la Imagen
              </label>
              <input
                type="url"
                id="imageUrl"
                formControlName="imageUrl"
                placeholder="https://ejemplo.com/imagen.jpg"
                class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] transition-all"
                [class.border-red-500]="categoryForm.get('imageUrl')?.invalid && categoryForm.get('imageUrl')?.touched"
              />
              @if (categoryForm.get('imageUrl')?.invalid && categoryForm.get('imageUrl')?.touched) {
                <p class="mt-1 text-sm text-red-600">
                  Ingresa una URL válida
                </p>
              }
            </div>

            <!-- Image Preview -->
            @if (categoryForm.get('imageUrl')?.value) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  Vista Previa
                </label>
                <div class="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <img
                    [src]="categoryForm.get('imageUrl')?.value"
                    alt="Preview"
                    class="h-24 w-24 object-contain rounded-lg"
                    (error)="onImageError($event)"
                  />
                </div>
              </div>
            }
          </div>

          <!-- RIGHT COLUMN: Tipos de Categoría -->
          <div class="space-y-5">
            <!-- Section Header -->
            <div class="border-b border-gray-200 pb-3">
              <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
                <svg class="w-5 h-5 text-[#a81b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
                Tipos de Categoría
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                {{ categoryTypes.length }} tipo(s) asociado(s)
              </p>
            </div>

            <!-- Add Type Button -->
            <button
              type="button"
              (click)="addNewType()"
              class="w-full px-4 py-2.5 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-[#a81b8d] hover:text-[#a81b8d] transition-all flex items-center justify-center gap-2 font-medium"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Agregar Tipo
            </button>

            <!-- Types List -->
            <div class="space-y-3 max-h-96 overflow-y-auto pr-2">
              @if (categoryTypes.length === 0) {
                <div class="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  <p class="text-sm text-gray-500">No hay tipos asociados</p>
                  <p class="text-xs text-gray-400 mt-1">Haz click en "Agregar Tipo" para comenzar</p>
                </div>
              } @else {
                @for (type of categoryTypes; track type.id; let idx = $index) {
                  <div class="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div class="flex items-start gap-3">
                      <!-- Type Info -->
                      <div class="flex-1 min-w-0">
                        <h4 class="text-sm font-semibold text-gray-900 truncate">
                          {{ type.name }}
                        </h4>
                        @if (type.description) {
                          <p class="text-xs text-gray-500 mt-1 line-clamp-2">
                            {{ type.description }}
                          </p>
                        }
                      </div>

                      <!-- Actions -->
                      <div class="flex-shrink-0 flex gap-1">
                        <button
                          type="button"
                          (click)="editType(type)"
                          class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Editar tipo"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </button>
                        <button
                          type="button"
                          (click)="removeType(type.id)"
                          class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Eliminar tipo"
                        >
                          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                }
              }
            </div>
          </div>
        </div>

        <!-- Action Buttons (Full Width) -->
        <div class="flex justify-end gap-3 pt-6 mt-6 border-t border-gray-200">
          <app-button
            [config]="{
              text: 'Cancelar',
              type: 'secondary',
              size: 'md'
            }"
            (buttonClick)="onClose()"
          />
          
          <app-button
            [config]="{
              text: mode === 'create' ? 'Crear Categoría' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: categoryForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `
})
         
export class CategoryModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() category: Category | null = null;
  @Input() categoryTypes: CategoryType[] = []; // ✅ Recibe los tipos desde el padre

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveCategory = new EventEmitter<{
    category: Category;
    types: CategoryType[];
  }>();
  @Output() addType = new EventEmitter<void>(); // ✅ Evento para abrir modal de tipo
  @Output() editTypeEvent = new EventEmitter<CategoryType>(); // ✅ Evento para editar tipo
  @Output() removeTypeEvent = new EventEmitter<string>(); // ✅ Evento para eliminar tipo

  categoryForm!: FormGroup;
  isSubmitting = false;
  private isFormInitialized = false; // ✅ Flag para evitar reinicializar

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
    this.isFormInitialized = true;
  }

  ngOnChanges(changes: SimpleChanges): void {
    // ✅ Cuando se cierra el modal
    if (changes['isOpen'] && !this.isOpen) {
      this.isFormInitialized = false;
      return;
    }
    
    // ✅ Cuando se ABRE el modal (isOpen cambia de false a true)
    if (changes['isOpen'] && this.isOpen && changes['isOpen'].previousValue === false) {
      this.initForm();
      this.isFormInitialized = true;
      this.isSubmitting = false;
      return;
    }
    
    // ✅ Si cambia la categoría mientras el modal YA está abierto
    if (changes['category'] && this.isOpen) {
      this.initForm();
      return;
    }
    
    // ⚠️ Si solo cambian categoryTypes (agregar/editar tipos), NO reinicializar
    // El formulario mantiene los datos que el usuario ya escribió
  }

  private initForm(): void {
    this.categoryForm = this.fb.group({
      name: [
        this.category?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      description: [this.category?.description || ''],
      imageUrl: [
        this.category?.imageUrl || '',
        [Validators.pattern('https?://.+')],
      ],
    });
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Nueva Categoría'
      : 'Editar Categoría';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Completa la información y asocia los tipos correspondientes'
      : 'Actualiza la información y gestiona los tipos asociados';
  }

  /**
   * Agregar nuevo tipo
   */
  addNewType(): void {
    this.addType.emit();
  }

  /**
   * Editar tipo existente
   */
  editType(type: CategoryType): void {
    this.editTypeEvent.emit(type);
  }

  /**
   * Eliminar tipo
   */
  removeType(typeId: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este tipo?')) {
      this.removeTypeEvent.emit(typeId);
    }
  }

  /**
   * Enviar formulario
   */
  onSubmit(): void {
    if (this.categoryForm.invalid || this.isSubmitting) {
      this.categoryForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const categoryData: Category = {
      id: this.category?.id || '',
      name: this.categoryForm.value.name.trim(),
      description: this.categoryForm.value.description || '',
      imageUrl: this.categoryForm.value.imageUrl || '',
    };

    this.saveCategory.emit({
      category: categoryData,
      types: this.categoryTypes,
    });
  }

  /**
   * Cerrar modal
   */
  onClose(): void {
    if (!this.isSubmitting) {
      this.categoryForm.reset();
      this.isSubmitting = false;
      this.isFormInitialized = false; // ✅ Resetear flag al cerrar
      this.closeModal.emit();
    }
  }

  /**
   * Error al cargar imagen de categoría
   */
  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/categories/category-default.png';
  }

  /**
   * Error al cargar imagen de tipo
   */
  onTypeImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/categories/type-default.png';
  }
}

 