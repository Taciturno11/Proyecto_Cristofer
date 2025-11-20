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
} from '@angular/forms';
import { Discount } from '../../../models/discount.model';
import { Product } from '../../../models/product.model';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';

@Component({
  selector: 'app-discount-modal',
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
      <form
        [formGroup]="discountForm"
        (ngSubmit)="onSubmit()"
        class="space-y-5"
      >
        <!-- Layout de dos columnas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- COLUMNA IZQUIERDA: Información General -->
          <div class="space-y-4">
            <!-- Section Header -->
            <div class="border-b border-gray-200 pb-3">
              <h3
                class="text-lg font-semibold text-gray-900 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-[#a81b8d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                Información General
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                Datos básicos de descuento
              </p>
            </div>

            <!-- Discount Name -->
            <div>
              <label
                for="name"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Nombre del Descuento <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                formControlName="name"
                placeholder="Ej: Descuento de Verano..."
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  discountForm.get('name')?.invalid &&
                  discountForm.get('name')?.touched
                "
              />
              @if (discountForm.get('name')?.invalid &&
              discountForm.get('name')?.touched) {
              <p class="mt-1 text-sm text-red-600">
                @if (discountForm.get('name')?.errors?.['required']) { El nombre
                es requerido } @if
                (discountForm.get('name')?.errors?.['minlength']) { El nombre
                debe tener al menos 2 caracteres }
              </p>
              }
            </div>

            <!-- Discount Percentage -->
            <div>
              <label
                for="percentage"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Descuento (%) <span class="text-red-500">*</span>
              </label>
              <input
                type="number"
                id="percentage"
                formControlName="percentage"
                placeholder="Ej: 10, 25, 50..."
                min="0"
                max="100"
                class="w-full px-3 py-2 placeholder-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  discountForm.get('percentage')?.invalid &&
                  discountForm.get('percentage')?.touched
                "
              />
              @if (discountForm.get('percentage')?.invalid &&
              discountForm.get('percentage')?.touched) {
              <p class="mt-1 text-sm text-red-600">
                @if (discountForm.get('percentage')?.errors?.['required']) { El
                % es requerido } @if
                (discountForm.get('percentage')?.errors?.['min']) { El % debe
                ser mayor a 0 } @if
                (discountForm.get('percentage')?.errors?.['max']) { El % no
                puede ser mayor a 100 }
              </p>
              }
            </div>

            <!-- Start Date -->
            <div>
              <label
                for="startDate"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Inicio <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="startDate"
                formControlName="startDate"
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  discountForm.get('startDate')?.invalid &&
                  discountForm.get('startDate')?.touched
                "
              />
              @if (discountForm.get('startDate')?.invalid &&
              discountForm.get('startDate')?.touched) {
              <p class="mt-1 text-sm text-red-600">
                La fecha de inicio es requerida
              </p>
              }
            </div>

            <!-- End Date -->
            <div>
              <label
                for="endDate"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Fecha de Fin <span class="text-red-500">*</span>
              </label>
              <input
                type="date"
                id="endDate"
                formControlName="endDate"
                class="w-full px-3 py-2 placeholder-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                [class.border-red-500]="
                  discountForm.get('endDate')?.invalid &&
                  discountForm.get('endDate')?.touched
                "
              />
              @if (discountForm.get('endDate')?.invalid &&
              discountForm.get('endDate')?.touched) {
              <p class="mt-1 text-sm text-red-600">
                La fecha de fin es requerida
              </p>
              }
            </div>

            <!-- Is Active -->
            <div>
              <label
                for="isActive"
                class="block text-sm font-medium text-gray-700 mb-2"
              >
                Estado <span class="text-red-500">*</span>
              </label>
              <select
                id="isActive"
                formControlName="isActive"
                class="w-full px-3 py-2 placeholder-gray-400 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              >
                <option [ngValue]="true">Activo</option>
                <option [ngValue]="false">Inactivo</option>
              </select>
            </div>
          </div>

          <!-- COLUMNA DERECHA: Selección de Productos -->
          <div class="space-y-4">
            <!-- Section Header -->
            <div class="border-b border-gray-200 pb-3">
              <h3
                class="text-lg font-semibold text-gray-900 flex items-center gap-2"
              >
                <svg
                  class="w-5 h-5 text-[#a81b8d]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                  />
                </svg>
                Productos Asociados
              </h3>
              <p class="text-sm text-gray-500 mt-1">
                @if (selectedProductIds.length === 0) { Ningún producto
                seleccionado } @else if (selectedProductIds.length === 1) { 1
                seleccionado } @else{
                {{ selectedProductIds.length }} seleccionados}
              </p>
            </div>

            <!-- Buscador de productos -->
            <div>
              <input
                type="text"
                [(ngModel)]="productSearchTerm"
                [ngModelOptions]="{ standalone: true }"
                placeholder="Buscar productos..."
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              />
            </div>

            <!-- Lista de productos con scroll -->
            <div class="border border-gray-200 rounded-lg overflow-hidden">
              <div class="max-h-96 overflow-y-auto">
                @if (filteredProducts().length === 0) {
                <div class="p-4 text-center text-gray-500">
                  @if (productSearchTerm) { No se encontraron productos } @else
                  { No hay productos disponibles }
                </div>
                } @else { @for (product of filteredProducts(); track product.id)
                {
                <div
                  class="p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors"
                  (click)="toggleProductSelection(product.id)"
                >
                  <div class="flex items-center gap-3">
                    <!-- Checkbox -->
                    <input
                      type="checkbox"
                      [checked]="isProductSelected(product.id)"
                      (click)="$event.stopPropagation()"
                      (change)="toggleProductSelection(product.id)"
                      class="w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
                    />

                    <!-- Imagen del producto -->
                    <img
                      [src]="
                        product.thumbnail ||
                        '/assets/images/no-image.webp'
                      "
                      [alt]="product.name"
                      class="w-12 h-12 object-cover rounded"
                    />

                    <!-- Info del producto -->
                    <div class="flex-1 min-w-0">
                      <p class="text-sm font-medium text-gray-900 truncate">
                        {{ product.name }}
                      </p>
                      <p class="text-xs text-gray-500">
                        S/ {{ product.price.toFixed(2) }}
                      </p>
                    </div>

                    <!-- Badge de estado -->
                    <span
                      class="px-2 py-1 text-xs rounded-full"
                      [class]="
                        product.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      "
                    >
                      {{ product.isActive ? 'Activo' : 'Inactivo' }}
                    </span>
                  </div>
                </div>
                } }
              </div>
            </div>

            <!-- Contador y acciones rápidas -->
            <div class="flex gap-2">
              <button
                type="button"
                (click)="selectAllProducts()"
                class="flex-1 px-3 py-2 text-xs text-[#a81b8d] border border-[#a81b8d] rounded-lg hover:bg-[#a81b8d] hover:text-white transition-colors"
              >
                Seleccionar todos
              </button>
              <button
                type="button"
                (click)="clearAllProducts()"
                class="flex-1 px-3 py-2 text-xs text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Limpiar selección
              </button>
            </div>
          </div>
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
              text: mode === 'create' ? 'Crear Descuento' : 'Guardar Cambios',
              type: 'primary',
              size: 'md',
              disabled: discountForm.invalid || isSubmitting
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `,
})
export class DiscountModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() discount: Discount | null = null;
  @Input() products: Product[] = []; // ✅ Lista de productos disponibles

  @Output() closeModal = new EventEmitter<void>();
  @Output() saveDiscount = new EventEmitter<{
    discount: Discount;
    productIds: string[];
  }>();

  discountForm!: FormGroup;
  isSubmitting = false;

  // ✅ Gestión de productos seleccionados
  selectedProductIds: string[] = [];
  productSearchTerm = '';

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Solo reinicializar cuando se abre el modal
    if (
      changes['isOpen'] &&
      this.isOpen &&
      changes['isOpen'].previousValue === false
    ) {
      this.initForm();
      this.loadSelectedProducts();
      this.isSubmitting = false;
    }
  }

  private initForm(): void {
    this.discountForm = this.fb.group({
      name: [
        this.discount?.name || '',
        [Validators.required, Validators.minLength(2)],
      ],
      percentage: [
        this.discount?.percentage || null,
        [Validators.required, Validators.min(1), Validators.max(100)],
      ],
      startDate: [
        this.discount?.startDate
          ? this.formatDateForInput(this.discount.startDate)
          : null,
        [Validators.required],
      ],
      endDate: [
        this.discount?.endDate
          ? this.formatDateForInput(this.discount.endDate)
          : null,
        [Validators.required],
      ],
      isActive: [this.discount?.isActive ?? true],
    });
  }

  /**
   * Cargar productos que ya tienen este descuento
   */
  private loadSelectedProducts(): void {
    if (this.discount && this.discount.products) {
      this.selectedProductIds = this.discount.products.map((p) => p.id);
    } else {
      this.selectedProductIds = [];
    }
  }

  /**
   * Formatear fecha para input type="date" (YYYY-MM-DD)
   * Corrige problemas de zona horaria usando UTC para evitar el desfase de un día
   */
  private formatDateForInput(date: Date | string): string {
    // Si ya es un string en formato YYYY-MM-DD, retornarlo directamente
    if (typeof date === 'string') {
      // Extraer solo la parte de la fecha (YYYY-MM-DD) ignorando la hora
      return date.split('T')[0];
    }
    
    // Si es un Date object, usar UTC para evitar problemas de zona horaria
    const d = new Date(date);
    const year = d.getUTCFullYear();
    const month = String(d.getUTCMonth() + 1).padStart(2, '0');
    const day = String(d.getUTCDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Filtrar productos por búsqueda
   */
  filteredProducts(): Product[] {
    if (!this.productSearchTerm.trim()) {
      return this.products;
    }

    const search = this.productSearchTerm.toLowerCase().trim();
    return this.products.filter(
      (product) =>
        product.name.toLowerCase().includes(search) ||
        product.brand?.name?.toLowerCase().includes(search)
    );
  }

  /**
   * Verificar si un producto está seleccionado
   */
  isProductSelected(productId: string): boolean {
    return this.selectedProductIds.includes(productId);
  }

  /**
   * Toggle selección de producto
   */
  toggleProductSelection(productId: string): void {
    const index = this.selectedProductIds.indexOf(productId);
    if (index > -1) {
      this.selectedProductIds.splice(index, 1);
    } else {
      this.selectedProductIds.push(productId);
    }
  }

  /**
   * Seleccionar todos los productos filtrados
   */
  selectAllProducts(): void {
    const filteredIds = this.filteredProducts().map((p) => p.id);
    // Agregar solo los que no están ya seleccionados
    filteredIds.forEach((id) => {
      if (!this.selectedProductIds.includes(id)) {
        this.selectedProductIds.push(id);
      }
    });
  }

  /**
   * Limpiar selección
   */
  clearAllProducts(): void {
    this.selectedProductIds = [];
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Nuevo Descuento'
      : 'Editar Descuento';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Completa la información para agregar un nuevo descuento'
      : 'Actualiza la información del descuento';
  }

  onSubmit(): void {
    if (this.discountForm.invalid || this.isSubmitting) {
      this.discountForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    const discountData: Discount = {
      id: this.discount?.id || '',
      name: this.discountForm.value.name.trim(),
      percentage: this.discountForm.value.percentage,
      startDate: this.discountForm.value.startDate,
      endDate: this.discountForm.value.endDate,
      isActive: this.discountForm.value.isActive,
      products: this.discount?.products || [],
    };

    // ✅ Emitir tanto el descuento como los IDs de productos
    this.saveDiscount.emit({
      discount: discountData,
      productIds: this.selectedProductIds,
    });
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.discountForm.reset();
      this.selectedProductIds = [];
      this.productSearchTerm = '';
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }
}
