import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModalComponent } from '../../../../shared/components/modal.component';
import {
  CreateProductCompleteDto,
  ProductResource,
} from '../../../../models/product.model';
import { Brand } from '../../../../models/brand.model';
import { Category } from '../../../../models/category.model';
import { Discount } from '../../../../models/discount.model';

@Component({
  selector: 'app-product-create-summary-modal',
  standalone: true,
  imports: [CommonModule, ModalComponent],
  template: `
    <app-modal
      [isOpen]="isOpen"
      [title]="mode === 'create' ? 'Resumen del Producto' : 'Confirmar Cambios'"
      [showCloseButton]="true"
      [size]="'2xl'"
      (closeModal)="onClose()"
    >
      <div class="product-summary">
        <!-- Información Básica -->
        <div class="summary-section">
          <h3 class="section-title">
            <svg class="w-5 h-5 text-[#a81b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Información Básica</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="label">Nombre:</span>
              <span class="value">{{ productData.name }}</span>
            </div>
            <div class="info-item">
              <span class="label">Slug:</span>
              <span class="value">{{ productData.slug }}</span>
            </div>
            <div class="info-item">
              <span class="label">Precio:</span>
              <span class="value"
                >S/ {{ productData.price | number : '1.2-2' }}</span
              >
            </div>
            <div class="info-item">
              <span class="label">Stock:</span>
              <span class="value">{{ productData.stock }} unidades</span>
            </div>
            <div class="info-item">
              <span class="label">Marca:</span>
              <span class="value">{{ getBrandName(productData.brandId) }}</span>
            </div>
            <div class="info-item">
              <span class="label">Categoría:</span>
              <span class="value">{{
                getCategoryName(productData.categoryId)
              }}</span>
            </div>
            <div class="info-item full-width">
              <span class="label">Descripción:</span>
              <span class="value">{{ productData.description }}</span>
            </div>
            <div class="info-item">
              <span class="label">Nuevo Arribo:</span>
              <span class="value">
                <span
                  [class]="productData.isNewArrival ? 'badge-yes' : 'badge-no'"
                >
                  {{ productData.isNewArrival ? 'Sí' : 'No' }}
                </span>
              </span>
            </div>
            <div class="info-item">
              <span class="label">Activo:</span>
              <span class="value">
                <span [class]="productData.isActive ? 'badge-yes' : 'badge-no'">
                  {{ productData.isActive ? 'Sí' : 'No' }}
                </span>
              </span>
            </div>
          </div>
        </div>

        <!-- Imágenes -->
        <div class="summary-section">
          <h3 class="section-title"><svg class="w-5 h-5 text-[#a81b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
  <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
</svg>
Imágenes</h3>
          <div
            *ngIf="
              productData.resources && productData.resources.length > 0;
              else noImages
            "
          >
            <div class="images-grid">
              <div
                *ngFor="let resource of productData.resources; let i = index"
                class="image-card"
                [class.primary]="resource.isPrimary"
              >
                <div class="image-wrapper">
                  <img
                    [src]="resource.url"
                    [alt]="resource.name || 'Imagen del producto'"
                  />
                  <div *ngIf="resource.isPrimary" class="primary-badge">
                    Principal
                  </div>
                </div>
                <p class="image-type">{{ resource.type }}</p>
              </div>
            </div>
          </div>
          <ng-template #noImages>
            <p class="empty-message">No se agregaron imágenes</p>
          </ng-template>
        </div>

        <!-- Descuentos -->
        <div class="summary-section">
          <h3 class="section-title"><svg class="w-5 h-5 text-[#a81b8d]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>Descuentos Asignados</h3>
          <div
            *ngIf="
              productData.discountIds && productData.discountIds.length > 0;
              else noDiscounts
            "
          >
            <div class="discounts-list">
              <span
                *ngFor="let discountId of productData.discountIds"
                class="discount-tag"
              >
                {{ getDiscountName(discountId) }}
              </span>
            </div>
          </div>
          <ng-template #noDiscounts>
            <p class="empty-message">No se asignaron descuentos</p>
          </ng-template>
        </div>

        <!-- Acciones -->
        <div class="actions-section">
          <button type="button" class="btn-secondary" (click)="onBackToEdit()">
            ← Volver a Editar
          </button>
          <div class="action-buttons">
            <button type="button" class="btn-cancel" (click)="onClose()">
              Cancelar
            </button>
            <button
              type="button"
              class="btn-primary"
              (click)="onConfirm()"
              [disabled]="isSubmitting"
            >
              {{
                isSubmitting
                  ? mode === 'create'
                    ? 'Creando...'
                    : 'Guardando...'
                  : mode === 'create'
                  ? 'Crear Producto'
                  : 'Guardar Cambios'
              }}
            </button>
          </div>
        </div>
      </div>
    </app-modal>
  `,
  styles: [
    `
      .product-summary {
        padding: 1.5rem;
      }

      .summary-section {
        margin-bottom: 2rem;
        padding-bottom: 1.5rem;
        border-bottom: 1px solid #e5e7eb;
      }

      .summary-section:last-of-type {
        border-bottom: none;
      }

      .section-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: #1f2937;
        margin-bottom: 1rem;
        display: flex;
        align-items: center;
        gap: 0.5rem;
      }

      .info-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
      }

      .info-item {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
      }

      .info-item.full-width {
        grid-column: 1 / -1;
      }

      .label {
        font-size: 0.875rem;
        font-weight: 600;
        color: #6b7280;
        text-transform: uppercase;
        letter-spacing: 0.025em;
      }

      .value {
        font-size: 1rem;
        color: #1f2937;
        word-break: break-word;
      }

      .badge-yes,
      .badge-no {
        display: inline-block;
        padding: 0.25rem 0.75rem;
        border-radius: 9999px;
        font-size: 0.875rem;
        font-weight: 500;
      }

      .badge-yes {
        background-color: #d1fae5;
        color: #065f46;
      }

      .badge-no {
        background-color: #fee2e2;
        color: #991b1b;
      }

      .images-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
        gap: 1rem;
      }

      .image-card {
        border: 2px solid #e5e7eb;
        border-radius: 0.5rem;
        overflow: hidden;
        transition: all 0.2s;
      }

      .image-card.primary {
        border-color: #3b82f6;
        box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
      }

      .image-wrapper {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
        background-color: #f3f4f6;
      }

      .image-wrapper img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .primary-badge {
        position: absolute;
        top: 0.5rem;
        right: 0.5rem;
        background-color: #3b82f6;
        color: white;
        padding: 0.25rem 0.5rem;
        border-radius: 0.25rem;
        font-size: 0.75rem;
        font-weight: 600;
      }

      .image-type {
        padding: 0.5rem;
        text-align: center;
        font-size: 0.875rem;
        color: #6b7280;
        background-color: #f9fafb;
        text-transform: capitalize;
      }

      .discounts-list {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }

      .discount-tag {
        display: inline-block;
        padding: 0.5rem 1rem;
        background-color: #fef3c7;
        color: #92400e;
        border-radius: 0.375rem;
        font-size: 0.875rem;
        font-weight: 500;
        border: 1px solid #fbbf24;
      }

      .empty-message {
        color: #6b7280;
        font-style: italic;
        text-align: center;
        padding: 1rem;
        background-color: #f9fafb;
        border-radius: 0.5rem;
      }

      .actions-section {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding-top: 1.5rem;
        margin-top: 1.5rem;
        border-top: 2px solid #e5e7eb;
      }

      .action-buttons {
        display: flex;
        gap: 1rem;
      }

      .btn-primary,
      .btn-secondary,
      .btn-cancel {
        padding: 0.625rem 1.5rem;
        border-radius: 0.5rem;
        font-weight: 600;
        font-size: 0.875rem;
        cursor: pointer;
        transition: all 0.2s;
        border: none;
      }

      .btn-primary {
        background-color: #3b82f6;
        color: white;
      }

      .btn-primary:hover:not(:disabled) {
        background-color: #2563eb;
      }

      .btn-primary:disabled {
        background-color: #9ca3af;
        cursor: not-allowed;
      }

      .btn-secondary {
        background-color: white;
        color: #3b82f6;
        border: 2px solid #3b82f6;
      }

      .btn-secondary:hover {
        background-color: #eff6ff;
      }

      .btn-cancel {
        background-color: white;
        color: #6b7280;
        border: 1px solid #d1d5db;
      }

      .btn-cancel:hover {
        background-color: #f9fafb;
        color: #374151;
      }

      @media (max-width: 640px) {
        .info-grid {
          grid-template-columns: 1fr;
        }

        .actions-section {
          flex-direction: column;
          gap: 1rem;
        }

        .action-buttons {
          width: 100%;
          flex-direction: column;
        }

        .btn-primary,
        .btn-secondary,
        .btn-cancel {
          width: 100%;
        }
      }
    `,
  ],
})
export class ProductCreateSummaryModalComponent {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() productData!: CreateProductCompleteDto;
  @Input() brands: Brand[] = [];
  @Input() categories: Category[] = [];
  @Input() discounts: Discount[] = [];
  @Input() isSubmitting = false;

  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmCreation = new EventEmitter<void>();
  @Output() backToEdit = new EventEmitter<'phase1' | 'phase2' | 'phase3'>();

  onClose(): void {
    this.closeModal.emit();
  }

  onConfirm(): void {
    this.confirmCreation.emit();
  }

  onBackToEdit(): void {
    // Emitir para volver a la fase 3 (la última visitada)
    // El componente padre puede decidir a qué fase volver
    this.backToEdit.emit('phase3');
  }

  getBrandName(brandId: string): string {
    const brand = this.brands.find((b) => b.id === brandId);
    return brand ? brand.name : 'Desconocida';
  }

  getCategoryName(categoryId: string): string {
    const category = this.categories.find((c) => c.id === categoryId);
    return category ? category.name : 'Desconocida';
  }

  getDiscountName(discountId: string): string {
    const discount = this.discounts.find((d) => d.id === discountId);
    return discount ? discount.name : 'Desconocido';
  }
}
