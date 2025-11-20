import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { ProductResource } from '../../../models/product.model';

@Component({
  selector: 'app-product-create-phase2-modal',
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
      <div class="space-y-4">
        <!-- Imagen Principal -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 class="font-semibold text-blue-900 mb-3">Imagen Principal</h3>
          <div class="space-y-3">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span class="text-red-500">*</span>
              </label>
              <input
                type="text"
                [(ngModel)]="primaryResource.name"
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                placeholder="Ej: Imagen principal"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                URL de la imagen <span class="text-red-500">*</span>
              </label>
              <input
                type="url"
                [(ngModel)]="primaryResource.url"
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                placeholder="https://ejemplo.com/imagen.jpg"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Tipo
              </label>
              <select
                [(ngModel)]="primaryResource.type"
                class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
              >
                <option value="IMAGE">Imagen</option>
                <option value="VIDEO">Video</option>
              </select>
            </div>
            @if (primaryResource.url) {
              <div class="mt-2">
                <img
                  [src]="primaryResource.url"
                  alt="Vista previa"
                  class="h-32 w-32 object-cover rounded-lg border border-gray-300"
                  (error)="onImageError($event)"
                />
              </div>
            }
          </div>
        </div>

        <!-- Imágenes Adicionales -->
        <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
          <div class="flex justify-between items-center mb-3">
            <h3 class="font-semibold text-gray-900">Imágenes Adicionales</h3>
            <app-button
              [config]="{
                text: '+ Agregar Imagen',
                type: 'secondary',
                size: 'sm'
              }"
              (buttonClick)="addAdditionalResource()"
            />
          </div>

          @if (additionalResources.length === 0) {
            <p class="text-sm text-gray-500 text-center py-4">
              No hay imágenes adicionales. Haz clic en "Agregar Imagen" para añadir más.
            </p>
          } @else {
            <div class="space-y-4">
              @for (resource of additionalResources; track $index) {
                <div class="bg-white border border-gray-300 rounded-lg p-3">
                  <div class="flex justify-between items-start mb-3">
                    <span class="text-sm font-medium text-gray-700">Imagen {{ $index + 1 }}</span>
                    <button
                      type="button"
                      (click)="removeAdditionalResource($index)"
                      class="text-red-600 hover:text-red-800 text-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                  <div class="space-y-2">
                    <input
                      type="text"
                      [(ngModel)]="resource.name"
                      class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                      placeholder="Nombre de la imagen"
                    />
                    <input
                      type="url"
                      [(ngModel)]="resource.url"
                      class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                      placeholder="URL de la imagen"
                    />
                    <select
                      [(ngModel)]="resource.type"
                      class="w-full px-3 py-2 placeholder-gray-400 border text-sm border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
                    >
                      <option value="IMAGE">Imagen</option>
                      <option value="VIDEO">Video</option>
                    </select>
                    @if (resource.url) {
                      <img
                        [src]="resource.url"
                        alt="Vista previa"
                        class="h-24 w-24 object-cover rounded-lg border border-gray-300"
                        (error)="onImageError($event)"
                      />
                    }
                  </div>
                </div>
              }
            </div>
          }
        </div>

        <!-- Información -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <p class="text-sm text-yellow-800">
            <strong>Nota:</strong> La imagen principal será la que se muestre en el catálogo. 
            Las imágenes adicionales aparecerán en la galería del producto.
          </p>
        </div>

        <!-- Error message -->
        @if (errorMessage) {
          <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
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
            text: isLoading ? 'Guardando...' : 'Continuar a Fase 3',
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
export class ProductCreatePhase2ModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() initialResources?: ProductResource[]; // Para editar
  @Output() closeModal = new EventEmitter<void>();
  @Output() phase2Completed = new EventEmitter<ProductResource[]>(); // Emite recursos
  @Output() skipPhase = new EventEmitter<void>(); // Para omitir esta fase

  primaryResource: ProductResource = {
    name: '',
    url: '',
    isPrimary: true,
    type: 'IMAGE',
  };

  additionalResources: ProductResource[] = [];

  isLoading = false;
  errorMessage = '';

  ngOnInit(): void {
    // Cargar datos iniciales si existen
    this.loadInitialData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // ✅ Detectar cuando se abre el modal
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      // Si hay datos iniciales (modo edición), cargarlos
      if (this.initialResources && this.initialResources.length > 0) {
        this.loadInitialData();
      } else {
        // Modo creación: resetear
        this.resetResources();
      }
    }
    
    // Detectar cuando cambian los recursos iniciales mientras el modal está abierto
    if (changes['initialResources'] && !changes['initialResources'].firstChange && this.isOpen) {
      this.loadInitialData();
    }
  }

  private loadInitialData(): void {
    // Si hay datos iniciales (modo edición), cargarlos
    if (this.initialResources && this.initialResources.length > 0) {
      const primary = this.initialResources.find(r => r.isPrimary);
      if (primary) {
        this.primaryResource = { ...primary };
      }
      this.additionalResources = this.initialResources
        .filter(r => !r.isPrimary)
        .map(r => ({ ...r }));
      
      // console.log('✅ [Phase2] Recursos cargados para edición:', {
      //   primary: this.primaryResource,
      //   additional: this.additionalResources
      // });
    }
  }

  private resetResources(): void {
    this.primaryResource = {
      name: '',
      url: '',
      isPrimary: true,
      type: 'IMAGE',
    };
    this.additionalResources = [];
  }

  get modalTitle(): string {
    return this.mode === 'create'
      ? 'Crear Producto - Fase 2: Imágenes y Recursos'
      : 'Editar Producto - Fase 2: Imágenes y Recursos';
  }

  get modalSubtitle(): string {
    return this.mode === 'create'
      ? 'Agrega las imágenes del producto (una principal y adicionales)'
      : 'Actualiza las imágenes del producto (una principal y adicionales)';
  }

  addAdditionalResource(): void {
    this.additionalResources.push({
      name: '',
      url: '',
      isPrimary: false,
      type: 'IMAGE',
    });
  }

  removeAdditionalResource(index: number): void {
    this.additionalResources.splice(index, 1);
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    const allResources: ProductResource[] = [
      this.primaryResource,
      ...this.additionalResources.filter(r => r.url.trim() !== '')
    ];

    // Emitir los recursos sin llamar API
    this.phase2Completed.emit(allResources);
    this.resetForm();
  }

  onSkip(): void {
    // Emitir fase omitida
    this.skipPhase.emit();
    this.resetForm();
  }

  private validateForm(): boolean {
    if (!this.primaryResource.name.trim()) {
      this.errorMessage = 'El nombre de la imagen principal es requerido';
      return false;
    }
    if (!this.primaryResource.url.trim()) {
      this.errorMessage = 'La URL de la imagen principal es requerida';
      return false;
    }
    if (!this.isValidUrl(this.primaryResource.url)) {
      this.errorMessage = 'La URL de la imagen principal no es válida';
      return false;
    }
    return true;
  }

  private isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.style.display = 'none';
  }

  private resetForm(): void {
    this.primaryResource = {
      name: '',
      url: '',
      isPrimary: true,
      type: 'IMAGE',
    };
    this.additionalResources = [];
  }

  onClose(): void {
    this.resetForm();
    this.errorMessage = '';
    this.closeModal.emit();
  }
}
