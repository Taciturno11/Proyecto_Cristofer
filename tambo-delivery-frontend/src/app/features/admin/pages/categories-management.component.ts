import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService } from '../../products/services/product.service';
import { Category, CategoryType } from '../../../models/category.model';
import { ButtonComponent } from '../../../shared/components/button.component';
import { CategoryModalComponent } from '../components/category-modal.component';
import { CategoryTypeModalComponent } from '../components/category-type-modal.component';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';
import { ToastComponent } from '../../../shared/components/toast.component';
import { ToastService } from '../../../shared/services/toast.service';

@Component({
  selector: 'app-categories-management',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonComponent,
    CategoryModalComponent,
    CategoryTypeModalComponent,
    ConfirmModalComponent,
    ToastComponent,
  ],
  template: `
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-2xl font-bold text-gray-800">
            Gestión de Categorías
          </h1>
          <p class="text-gray-600">
            Administra las categorías de Tambo Delivery
          </p>
        </div>
        <div class="flex gap-3">
          <app-button
            [config]="{
              text: 'Crear Categoría',
              type: 'primary',
              size: 'md'
            }"
            (buttonClick)="openCreateCategoryModal()"
          />
        </div>
      </div>

      <!-- Filters and Search -->
      <div class="bg-white p-4 rounded-lg shadow-md mb-6">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="flex-1 min-w-64">
            <input
              type="text"
              [(ngModel)]="searchTerm"
              (input)="applyFilters()"
              placeholder="Buscar categoría..."
              class="w-full px-3 py-2 text-sm placeholder-gray-400 border border-gray-300 rounded-lg focus:outline-none focus:ring-0.5 focus:ring-[#a81b8d] focus:border-[#a81b8d]"
            />
          </div>
        </div>
      </div>

      <!-- Loading -->
      @if (isLoading) {
      <div class="flex justify-center items-center py-12">
        <div
          class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#a81b8d]"
        ></div>
      </div>
      } @else {
      <!-- Categories Table -->
      <div class="bg-white rounded-lg shadow-md overflow-hidden">
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Nombre
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Tipos
                </th>
                <th
                  class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @if (filteredCategories.length === 0) {
              <tr>
                <td colspan="6" class="px-6 py-12 text-center text-gray-500">
                  @if (searchTerm) { No se encontraron categorías que coincidan
                  con los filtros } @else { No hay categorías disponibles }
                </td>
              </tr>
              } @else { @for (category of filteredCategories; track category.id)
              {
              <tr class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <img
                      [src]="
                        category.imageUrl ||
                        '/assets/categories/category-default.jpg'
                      "
                      [alt]="category.name"
                      class="h-10 w-10 rounded-lg object-cover mr-4"
                    />
                    <div>
                      <div class="text-sm font-medium text-gray-900">
                        {{ category.name }}
                      </div>
                      <div class="text-sm text-gray-500">
                        {{ category.description }}
                      </div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <div
                      class="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
                    >
                      @if (category.categoryTypes?.length == 1) {
                      {{ category.categoryTypes?.length }} tipo } @else if
                      (category.categoryTypes?.length == 0) { Ninguno } @else{
                      {{ category.categoryTypes?.length }} tipos}
                    </div>
                  </div>
                </td>
                <td
                  class="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2"
                >
                  <button
                    (click)="editCategory(category)"
                    type="button"
                    class="p-1.5 text-blue-600 hover:bg-blue-50 rounded transition-colors cursor-pointer"
                    title="Editar tipo"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                  </button>
                  <button
                    (click)="onDeleteCategory(category.id)"
                    type="button"
                    class="p-1.5 text-red-600 hover:bg-red-50 rounded transition-colors cursor-pointer"
                    title="Eliminar tipo"
                  >
                    <svg
                      class="w-5 h-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                  </button>
                </td>
              </tr>
              } }
            </tbody>
          </table>
        </div>
      </div>
      }
    </div>

    <!-- Category Modal -->
    <app-category-modal
      [isOpen]="isModalOpen"
      [mode]="modalMode"
      [category]="selectedCategory"
      [categoryTypes]="selectedCategoryTypes"
      (closeModal)="closeModal()"
      (saveCategory)="onSaveCategory($event)"
      (addType)="openTypeModal()"
      (editTypeEvent)="openEditTypeModal($event)"
      (removeTypeEvent)="removeType($event)"
    />

    <!-- Category Type Modal -->
    <app-category-type-modal
      [isOpen]="isTypeModalOpen"
      [mode]="typeModalMode"
      [categoryType]="selectedType"
      (closeModal)="closeTypeModal()"
      (saveType)="onSaveType($event)"
    />

    <!-- Delete Confirmation Modal -->
    <app-confirm-modal
      [isOpen]="isDeleteModalOpen"
      type="danger"
      [title]="getDeleteTitle()"
      [message]="getDeleteMessage()"
      confirmText="Sí, eliminar"
      cancelText="Cancelar"
      (confirm)="confirmDelete()"
      (cancel)="cancelDelete()"
    />

    <!-- Toast Notifications -->
    <app-toast />
  `,
})
export class CategoriesManagementComponent implements OnInit, OnDestroy {
  categories: Category[] = [];
  filteredCategories: Category[] = [];
  isLoading = false;

  // Filters
  searchTerm = '';
  selectedStatus = '';

  // Modal
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedCategory: Category | null = null;
  selectedCategoryTypes: CategoryType[] = [];

  // Type Modal
  isTypeModalOpen = false;
  typeModalMode: 'create' | 'edit' = 'create';
  selectedType: CategoryType | null = null;

  // Delete Modal
  isDeleteModalOpen = false;
  categoryToDelete: Category | null = null;

  private subscriptions: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private router: Router,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  /**
   * Carga todas las categorías
   */
  private loadCategories(): void {
    this.isLoading = true;
    this.subscriptions.push(
      this.productService.getAllCategories().subscribe({
        next: (categories) => {
          this.categories = categories || [];
          this.applyFilters();
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Error loading categories:', error);
          this.isLoading = false;
        },
      })
    );
  }

  /**
   * Aplica los filtros a la lista de categorías
   */
  applyFilters(): void {
    let filtered = [...this.categories];

    // Filtro por búsqueda
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      filtered = filtered.filter(
        (category) =>
          category.name.toLowerCase().includes(term) ||
          category.description?.toLowerCase().includes(term)
      );
    }

    this.filteredCategories = filtered;
  }

  /**
   * Abre el modal para crear una nueva categoría
   */
  openCreateCategoryModal(): void {
    this.modalMode = 'create';
    this.selectedCategory = null;
    this.selectedCategoryTypes = [];
    this.isModalOpen = true;
  }

  /**
   * Edita una categoría existente
   */
  editCategory(category: Category): void {
    this.modalMode = 'edit';
    this.selectedCategory = { ...category };
    // ✅ Cargar los tipos asociados desde la categoría
    this.selectedCategoryTypes = category.categoryTypes
      ? [...category.categoryTypes]
      : [];
    this.isModalOpen = true;
  }

  /**
   * Cierra el modal
   */
  closeModal(): void {
    this.isModalOpen = false;
    this.selectedCategory = null;
    this.selectedCategoryTypes = [];
  }

  /**
   * Guarda o actualiza una categoría
   */
  onSaveCategory(data: { category: Category; types: CategoryType[] }): void {
    const { category, types } = data;
    if (this.modalMode === 'create') {
      this.createCategory(category, types);
    } else {
      this.updateCategory(category, types);
    }
  }

  /**
   * Crea una nueva categoría
   */
  private createCategory(category: Category, types: CategoryType[]): void {
    // ✅ Incluir los tipos en el objeto de categoría
    const categoryWithTypes: Category = {
      ...category,
      categoryTypes: types,
    };

    this.subscriptions.push(
      this.productService.createCategory(categoryWithTypes).subscribe({
        next: (newCategory) => {
          this.closeModal();
          this.toastService.success(
            `Categoría "${category.name}" creada exitosamente con ${types.length} tipo(s)`
          );
          this.loadCategories();
        },
        error: (error) => {
          console.error('Error al crear categoría:', error);
          this.toastService.error(
            'Error al crear la categoría. Por favor, intenta nuevamente.'
          );
          // ✅ Cerrar y reabrir el modal para resetear isSubmitting
          this.closeModal();
          setTimeout(() => {
            this.modalMode = 'create';
            this.selectedCategory = category;
            this.selectedCategoryTypes = types;
            this.isModalOpen = true;
          }, 100);
        },
      })
    );
  }

  /**
   * Actualiza una categoría existente
   */
  private updateCategory(category: Category, types: CategoryType[]): void {
    // ✅ Incluir los tipos actualizados en el objeto de categoría
    const categoryWithTypes: Category = {
      ...category,
      categoryTypes: types,
    };

    this.subscriptions.push(
      this.productService
        .updateCategory(category.id, categoryWithTypes)
        .subscribe({
          next: (updatedCategory) => {
            this.closeModal();
            this.toastService.success(
              `Categoría "${category.name}" actualizada exitosamente con ${types.length} tipo(s)`
            );
            this.loadCategories();
          },
          error: (error) => {
            console.error('Error al actualizar categoría:', error);
            this.toastService.error(
              'Error al actualizar la categoría. Por favor, intenta nuevamente.'
            );
            // ✅ Cerrar y reabrir el modal para resetear isSubmitting
            this.closeModal();
            setTimeout(() => {
              this.modalMode = 'edit';
              this.selectedCategory = category;
              this.selectedCategoryTypes = types;
              this.isModalOpen = true;
            }, 100);
          },
        })
    );
  }

  /**
   * Abre el modal de confirmación de eliminación
   */
  onDeleteCategory(categoryId: string): void {
    const category = this.categories.find((b) => b.id === categoryId);
    if (category) {
      this.categoryToDelete = category;
      this.isDeleteModalOpen = true;
    }
  }

  /**
   * Confirma la eliminación de la categoría
   */
  confirmDelete(): void {
    if (!this.categoryToDelete) return;

    const categoryId = this.categoryToDelete.id;
    const categoryName = this.categoryToDelete.name;

    this.subscriptions.push(
      this.productService.deleteCategory(categoryId).subscribe({
        next: () => {
          this.categories = this.categories.filter((c) => c.id !== categoryId);
          this.applyFilters();
          this.cancelDelete();
          this.toastService.success(
            `Categoría "${categoryName}" eliminada exitosamente`
          );
        },
        error: (error) => {
          console.error('Error al eliminar categoría:', error);
          this.toastService.error(
            'Error al eliminar la categoría. Por favor, intenta nuevamente.'
          );
          this.cancelDelete();
        },
      })
    );
  }

  /**
   * Cancela la eliminación y cierra el modal
   */
  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.categoryToDelete = null;
  }

  /**
   * Abre el modal para agregar un nuevo tipo
   */
  openTypeModal(): void {
    this.typeModalMode = 'create';
    this.selectedType = null;
    this.isTypeModalOpen = true;
  }

  /**
   * Abre el modal para editar un tipo existente
   */
  openEditTypeModal(type: CategoryType): void {
    this.typeModalMode = 'edit';
    this.selectedType = { ...type };
    this.isTypeModalOpen = true;
  }

  /**
   * Cierra el modal de tipo
   */
  closeTypeModal(): void {
    this.isTypeModalOpen = false;
    this.selectedType = null;
  }

  /**
   * Guarda un tipo de categoría (agregar o editar)
   */
  onSaveType(type: CategoryType): void {
    if (this.typeModalMode === 'create') {
      // Agregar el nuevo tipo a la lista
      this.selectedCategoryTypes = [...this.selectedCategoryTypes, type];
      this.toastService.success(`Tipo "${type.name}" agregado exitosamente`);
    } else {
      // Actualizar el tipo existente
      this.selectedCategoryTypes = this.selectedCategoryTypes.map((t) =>
        t.id === type.id ? type : t
      );
      this.toastService.success(`Tipo "${type.name}" actualizado exitosamente`);
    }
    this.closeTypeModal();
  }

  /**
   * Elimina un tipo de la lista
   */
  removeType(typeId: string): void {
    const type = this.selectedCategoryTypes.find((t) => t.id === typeId);
    if (type) {
      this.selectedCategoryTypes = this.selectedCategoryTypes.filter(
        (t) => t.id !== typeId
      );
      this.toastService.success(`Tipo "${type.name}" eliminado`);
    }
  }

  /**
   * Obtiene el título del modal de eliminación
   */
  getDeleteTitle(): string {
    return '¿Eliminar categoría?';
  }

  /**
   * Obtiene el mensaje del modal de eliminación
   */
  getDeleteMessage(): string {
    if (this.categoryToDelete) {
      return `¿Estás seguro de que deseas eliminar la categoría "${this.categoryToDelete.name}"? Esta acción no se puede deshacer.`;
    }
    return 'Esta acción no se puede deshacer.';
  }

  /**
   * Vuelve al dashboard
   */
  goBack(): void {
    this.router.navigate(['/admin']);
  }
}
