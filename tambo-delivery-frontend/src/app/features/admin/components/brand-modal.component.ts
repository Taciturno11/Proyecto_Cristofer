import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Brand } from '../../../models/brand.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-brand-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      size="lg"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <form [formGroup]="brandForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Brand Name -->
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Marca <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            formControlName="name"
            placeholder="Ej: Coca-Cola, Sublime, etc."
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            [class.border-red-500]="brandForm.get('name')?.invalid && brandForm.get('name')?.touched"
          />
          @if (brandForm.get('name')?.invalid && brandForm.get('name')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (brandForm.get('name')?.errors?.['required']) {
                El nombre es requerido
              }
              @if (brandForm.get('name')?.errors?.['minlength']) {
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
            placeholder="Descripción de la marca (opcional)"
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
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
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            [class.border-red-500]="brandForm.get('imageUrl')?.invalid && brandForm.get('imageUrl')?.touched"
          />
          @if (brandForm.get('imageUrl')?.invalid && brandForm.get('imageUrl')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              Ingresa una URL válida
            </p>
          }
        </div>

        <!-- Image Preview -->
        @if (brandForm.get('imageUrl')?.value) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Vista Previa
            </label>
            <div class="flex items-center justify-center p-4 bg-gray-50 rounded-lg border border-gray-200">
              <img
                [src]="brandForm.get('imageUrl')?.value"
                alt="Preview"
                class="h-24 w-24 object-contain rounded-lg"
                (error)="onImageError($event)"
              />
            </div>
          </div>
        }

        <!-- Action Buttons -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
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
              text: mode === 'create' ? 'Crear Marca' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: brandForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `
})
export class BrandModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() brand: Brand | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveBrand = new EventEmitter<Brand>();

  brandForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initForm();
      this.isSubmitting = false; // ✅ Resetear cuando se abre el modal
    }
  }

  private initForm(): void {
    this.brandForm = this.fb.group({
      name: [this.brand?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [this.brand?.description || ''],
      imageUrl: [this.brand?.imageUrl || '', [Validators.pattern('https?://.+')]]
    });
  }

  get modalTitle(): string {
    return this.mode === 'create' ? 'Crear Nueva Marca' : 'Editar Marca';
  }

  get modalSubtitle(): string {
    return this.mode === 'create' 
      ? 'Completa la información para agregar una nueva marca' 
      : 'Actualiza la información de la marca';
  }

  onSubmit(): void {
    if (this.brandForm.invalid || this.isSubmitting) {
      this.brandForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const brandData: Brand = {
      id: this.brand?.id || '',
      name: this.brandForm.value.name.trim(),
      description: this.brandForm.value.description || '',
      imageUrl: this.brandForm.value.imageUrl || ''
    };

    this.saveBrand.emit(brandData);
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.brandForm.reset();
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = '/assets/brands/brand-default.png';
  }
}
