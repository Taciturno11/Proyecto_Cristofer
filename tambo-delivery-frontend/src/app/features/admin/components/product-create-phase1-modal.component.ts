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
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ProductService } from '../../products/services/product.service';
import { ProductPhase1Data } from '../../../models/product.model';
import { Category, CategoryType } from '../../../models/category.model';
import { Brand } from '../../../models/brand.model';

@Component({
  selector: 'app-product-create-phase1-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      [size]="'xl'"
      (closeModal)="onClose()"
    >
      <!-- Body -->
      <form (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Nombre -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Producto <span class="text-red-500">*</span>
          </label>
          <input
            type="text"
            [(ngModel)]="formData.name"
            name="name"
            required
            class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            placeholder="Ej: Coca Cola 500ml"
          />
        </div>

        <!-- Descripción -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">
            Descripción <span class="text-red-500">*</span>
          </label>
          <textarea
            [(ngModel)]="formData.description"
            name="description"
            required
            rows="4"
            class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            placeholder="Describe el producto..."
          ></textarea>
        </div>

        <!-- Precio y Stock -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Precio (S/) <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              [(ngModel)]="formData.price"
              name="price"
              required
              min="0"
              step="0.01"
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              placeholder="0.00"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Stock <span class="text-red-500">*</span>
            </label>
            <input
              type="number"
              [(ngModel)]="formData.stock"
              name="stock"
              required
              min="0"
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              placeholder="0"
            />
          </div>
        </div>

        <div class="grid grid-cols-2 gap-4">
          <!-- Marca -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Marca <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="formData.brandId"
              name="brandId"
              required
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Selecciona una marca</option>
              @for (brand of brands; track brand.id) {
              <option [value]="brand.id">{{ brand.name }}</option>
              }
            </select>
          </div>
          <!-- Slug (auto-generado) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Slug (URL amigable) <span class="text-red-500">*</span>
            </label>
            <input
              type="text"
              [(ngModel)]="formData.slug"
              name="slug"
              required
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              placeholder="Se genera automáticamente"
            />
            <p class="text-xs text-gray-500 mt-1">
              Se generará automáticamente del nombre
            </p>
          </div>
        </div>

        <!-- Categoría y Tipo de Categoría -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Categoría <span class="text-red-500">*</span>
            </label>
            <select
              [(ngModel)]="formData.categoryId"
              name="categoryId"
              required
              (change)="onCategoryChange()"
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Selecciona una categoría</option>
              @for (category of categories; track category.id) {
              <option [value]="category.id">{{ category.name }}</option>
              }
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Categoría
            </label>
            <select
              [(ngModel)]="formData.categoryTypeId"
              name="categoryTypeId"
              [disabled]="!formData.categoryId || categoryTypes.length === 0"
              class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            >
              <option value="">Sin tipo específico</option>
              @for (type of categoryTypes; track type.id) {
              <option [value]="type.id">{{ type.name }}</option>
              }
            </select>
          </div>
        </div>

        <!-- Opciones adicionales -->
        <div class="flex gap-6">
          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isNewArrival"
              name="isNewArrival"
              class="w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
            />
            <span class="ml-2 text-sm text-gray-700">Nuevo Ingreso</span>
          </label>

          <label class="flex items-center cursor-pointer">
            <input
              type="checkbox"
              [(ngModel)]="formData.isActive"
              name="isActive"
              class="w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
            />
            <span class="ml-2 text-sm text-gray-700">Activo</span>
          </label>
        </div>

        <!-- Error message -->
        @if (errorMessage) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ errorMessage }}
        </div>
        }
      </form>

      <!-- Footer -->
      <div footer class="flex gap-3">
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
            text: isLoading ? 'Guardando...' : 'Continuar a Fase 2',
            type: 'primary',
            size: 'md',
            disabled: isLoading
          }"
          (buttonClick)="onSubmit()"
        />
      </div>
    </app-modal>
  `,
})
export class ProductCreatePhase1ModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialData?: ProductPhase1Data; // Para editar
  @Output() closeModal = new EventEmitter<void>();
  @Output() phase1Completed = new EventEmitter<ProductPhase1Data>(); // Emite los datos

  formData: ProductPhase1Data = {
    slug: '',
    name: '',
    description: '',
    price: 0,
    stock: 0,
    brandId: '',
    categoryId: '',
    categoryTypeId: undefined,
    isNewArrival: false,
    isActive: true,
  };

  brands: Brand[] = [];
  categories: Category[] = [];
  categoryTypes: CategoryType[] = [];

  isLoading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadBrands();
    this.loadCategories();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Detectar cuando cambia initialData (modo edición)
    if (changes['initialData'] && changes['initialData'].currentValue) {
      this.formData = { ...changes['initialData'].currentValue };

      // Si hay categoría, cargar sus tipos
      if (this.formData.categoryId) {
        this.onCategoryChange();
      }
    }

    // Resetear formulario cuando se abre en modo creación (sin initialData)
    if (
      changes['isOpen'] &&
      changes['isOpen'].currentValue &&
      !this.initialData
    ) {
      this.resetForm();
    }
  }

  private loadBrands(): void {
    this.productService.getAllBrands().subscribe({
      next: (brands) => (this.brands = brands),
      error: (err) => console.error('Error loading brands:', err),
    });
  }

  private loadCategories(): void {
    this.productService.getAllCategories().subscribe({
      next: (categories) => (this.categories = categories),
      error: (err) => console.error('Error loading categories:', err),
    });
  }

  onCategoryChange(): void {
    if (this.formData.categoryId) {
      this.productService
        .getAllCategoryTypesByCategory(this.formData.categoryId)
        .subscribe({
          next: (types) => {
            this.categoryTypes = types;
            this.formData.categoryTypeId = undefined;
          },
          error: (err) => {
            console.error('Error loading category types:', err);
            this.categoryTypes = [];
          },
        });
    } else {
      this.categoryTypes = [];
      this.formData.categoryTypeId = undefined;
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    // Auto-generar slug si está vacío
    if (!this.formData.slug.trim()) {
      this.formData.slug = this.generateSlug(this.formData.name);
    }

    // Emitir los datos de la fase 1 sin llamar API
    this.phase1Completed.emit({ ...this.formData });
    this.resetForm();
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Producto - Fase 1: Información Básica'
      : 'Editar Producto - Fase 1: Información Básica';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Ingresa los datos principales del producto'
      : 'Actualiza los datos principales del producto';
  }

  private validateForm(): boolean {
    if (!this.formData.name.trim()) {
      this.errorMessage = 'El nombre es requerido';
      return false;
    }
    if (!this.formData.description.trim()) {
      this.errorMessage = 'La descripción es requerida';
      return false;
    }
    if (this.formData.price <= 0) {
      this.errorMessage = 'El precio debe ser mayor a 0';
      return false;
    }
    if (this.formData.stock < 0) {
      this.errorMessage = 'El stock no puede ser negativo';
      return false;
    }
    if (!this.formData.brandId) {
      this.errorMessage = 'Debes seleccionar una marca';
      return false;
    }
    if (!this.formData.categoryId) {
      this.errorMessage = 'Debes seleccionar una categoría';
      return false;
    }
    return true;
  }

  private generateSlug(name: string): string {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '') // Eliminar acentos
      .replace(/[^a-z0-9\s-]/g, '') // Eliminar caracteres especiales
      .trim()
      .replace(/\s+/g, '-') // Reemplazar espacios por guiones
      .replace(/-+/g, '-'); // Eliminar guiones duplicados
  }

  private resetForm(): void {
    this.formData = {
      slug: '',
      name: '',
      description: '',
      price: 0,
      stock: 0,
      brandId: '',
      categoryId: '',
      categoryTypeId: undefined,
      isNewArrival: false,
      isActive: true,
    };
    this.categoryTypes = [];
  }

  onClose(): void {
    this.resetForm();
    this.errorMessage = '';
    this.closeModal.emit();
  }
}
