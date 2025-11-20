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
import { Discount } from '../../../models/discount.model';

@Component({
  selector: 'app-product-create-phase3-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ModalComponent, ButtonComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="modalTitle"
      [subtitle]="modalSubtitle"
      [size]="'lg'"
      (closeModal)="onClose()"
    >
      <!-- Body -->
      <div class="space-y-4">
        <!-- Lista de descuentos disponibles -->
        @if (isLoadingDiscounts) {
        <div class="flex justify-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"
          ></div>
        </div>
        } @else if (availableDiscounts.length === 0) {
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            No hay descuentos activos disponibles. Puedes crear descuentos desde
            el módulo de administración.
          </p>
        </div>
        } @else {
        <div class="space-y-2">
          <p class="text-sm font-medium text-gray-700 mb-3">
            Descuentos disponibles ({{ selectedDiscountIds.length }}
            seleccionados)
          </p>
          @for (discount of availableDiscounts; track discount.id) {
          <label
            class="flex items-start p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
            [class.border-[#a81b8d]]="isDiscountSelected(discount.id)"
            [class.bg-pink-50]="isDiscountSelected(discount.id)"
          >
            <input
              type="checkbox"
              [checked]="isDiscountSelected(discount.id)"
              (change)="toggleDiscount(discount.id)"
              class="mt-1 w-4 h-4 text-[#a81b8d] border-gray-300 rounded focus:ring-[#a81b8d]"
            />
            <div class="ml-3 flex-1">
              <div class="flex items-center justify-between">
                <span class="font-medium text-gray-900">{{
                  discount.name
                }}</span>
                <span class="text-lg font-bold text-[#a81b8d]">
                  -{{ discount.percentage }}%
                </span>
              </div>
              <div class="flex items-center gap-4 mt-1 text-xs text-gray-500">
                @if (discount.startDate && discount.endDate) {
                <span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="currentColor"
                    class="w-4 h-4 inline-block mr-1"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                    />
                  </svg>
                  {{ formatDate(discount.startDate) }} -
                  {{ formatDate(discount.endDate) }}
                </span>
                }
                <span
                  class="px-2 py-0.5 rounded-full"
                  [class]="
                    discount.isActive
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  "
                >
                  {{ discount.isActive ? 'Activo' : 'Inactivo' }}
                </span>
              </div>
            </div>
          </label>
          }
        </div>
        }

        <!-- Información -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p class="text-sm text-blue-800">
            <strong>Nota:</strong> Puedes seleccionar múltiples descuentos. El
            sistema aplicará automáticamente el descuento más beneficioso para
            el cliente.
          </p>
        </div>

        <!-- Error message -->
        @if (errorMessage) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg"
        >
          {{ errorMessage }}
        </div>
        }
      </div>

      <!-- Footer -->
      <div footer class="flex gap-3">
        <app-button
          [config]="{
            text: 'Omitir',
            type: 'secondary',
            size: 'md'
          }"
          (buttonClick)="onSkip()"
        />
        <app-button
          [config]="{
            text: isLoading ? 'Guardando...' : 'Finalizar',
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
export class ProductCreatePhase3ModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialDiscountIds?: string[]; // Para editar
  @Output() closeModal = new EventEmitter<void>();
  @Output() phase3Completed = new EventEmitter<string[]>(); // Emite IDs de descuentos
  @Output() skipPhase = new EventEmitter<void>(); // Para omitir esta fase

  availableDiscounts: Discount[] = [];
  selectedDiscountIds: string[] = [];

  isLoadingDiscounts = false;
  isLoading = false;
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadDiscounts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // ✅ Detectar cuando se abre el modal
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      // Si hay IDs de descuentos iniciales (modo edición), cargarlos
      if (this.initialDiscountIds && this.initialDiscountIds.length > 0) {
        this.selectedDiscountIds = [...this.initialDiscountIds];
        // console.log('✅ [Phase3] Descuentos cargados para edición:', this.selectedDiscountIds);
      } else {
        // Modo creación: resetear
        this.selectedDiscountIds = [];
      }
    }

    // Detectar cuando cambian los IDs de descuentos mientras el modal está abierto
    if (changes['initialDiscountIds'] && !changes['initialDiscountIds'].firstChange && this.isOpen) {
      this.selectedDiscountIds = [...this.initialDiscountIds!];
      // console.log('✅ [Phase3] Descuentos actualizados:', this.selectedDiscountIds);
    }
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Producto - Fase 3: Asignar Descuentos'
      : 'Editar Producto - Fase 3: Asignar Descuentos';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Selecciona los descuentos que aplicarán al producto (opcional)'
      : 'Actualiza los descuentos que aplicarán al producto (opcional)';
  }

  private loadDiscounts(): void {
    this.isLoadingDiscounts = true;
    this.productService.getAllDiscounts().subscribe({
      next: (discounts) => {
        // Filtrar solo descuentos activos
        this.availableDiscounts = discounts.filter((d) => d.isActive);
        this.isLoadingDiscounts = false;
      },
      error: (err) => {
        console.error('Error loading discounts:', err);
        this.isLoadingDiscounts = false;
      },
    });
  }

  isDiscountSelected(discountId: string): boolean {
    return this.selectedDiscountIds.includes(discountId);
  }

  toggleDiscount(discountId: string): void {
    const index = this.selectedDiscountIds.indexOf(discountId);
    if (index > -1) {
      this.selectedDiscountIds.splice(index, 1);
    } else {
      this.selectedDiscountIds.push(discountId);
    }
  }

  onSubmit(): void {
    // Emitir los IDs de descuentos seleccionados
    this.phase3Completed.emit([...this.selectedDiscountIds]);
    this.resetForm();
  }

  onSkip(): void {
    // Emitir fase omitida (array vacío)
    this.skipPhase.emit();
    this.resetForm();
  }

  formatDate(date: Date | string): string {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('es-PE', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  }

  private resetForm(): void {
    this.selectedDiscountIds = [];
  }

  onClose(): void {
    this.resetForm();
    this.errorMessage = '';
    this.closeModal.emit();
  }
}
