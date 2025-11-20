import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryType } from '../../../models/category.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-category-type-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      size="md"
      [showFooter]="false"
      (closeModal)="onClose()"
    >
      <form [formGroup]="typeForm" (ngSubmit)="onSubmit()" class="space-y-5">
        <!-- Type Name -->
        <div>
          <label for="typeName" class="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Tipo <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="typeName"
            formControlName="name"
            placeholder="Ej: Gaseosas, Jugos, etc."
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] transition-all"
            [class.border-red-500]="typeForm.get('name')?.invalid && typeForm.get('name')?.touched"
          />
          @if (typeForm.get('name')?.invalid && typeForm.get('name')?.touched) {
            <p class="mt-1 text-sm text-red-600">
              @if (typeForm.get('name')?.errors?.['required']) {
                El nombre es requerido
              }
              @if (typeForm.get('name')?.errors?.['minlength']) {
                El nombre debe tener al menos 2 caracteres
              }
            </p>
          }
        </div>

        <!-- Description -->
        <div>
          <label for="typeDescription" class="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <textarea
            id="typeDescription"
            formControlName="description"
            rows="3"
            placeholder="Descripción del tipo (opcional)"
            class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d] transition-all resize-none"
          ></textarea>
        </div>

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
              text: mode === 'create' ? 'Agregar Tipo' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: typeForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `
})
export class CategoryTypeModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() categoryType: CategoryType | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveType = new EventEmitter<CategoryType>();

  typeForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initForm();
      this.isSubmitting = false;
    }
  }

  private initForm(): void {
    this.typeForm = this.fb.group({
      name: [this.categoryType?.name || '', [Validators.required, Validators.minLength(2)]],
      description: [this.categoryType?.description || '']
    });
  }

  get modalTitle(): string {
    return this.mode === 'create' ? 'Agregar Tipo de Categoría' : 'Editar Tipo de Categoría';
  }

  get modalSubtitle(): string {
    return this.mode === 'create' 
      ? 'Completa la información del nuevo tipo' 
      : 'Actualiza la información del tipo';
  }

  onSubmit(): void {
    if (this.typeForm.invalid || this.isSubmitting) {
      this.typeForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const typeData: CategoryType = {
      id: this.categoryType?.id || this.generateTempId(),
      name: this.typeForm.value.name.trim(),
      description: this.typeForm.value.description || ''
    };

    this.saveType.emit(typeData);
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.typeForm.reset();
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }

  private generateTempId(): string {
    return `temp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
