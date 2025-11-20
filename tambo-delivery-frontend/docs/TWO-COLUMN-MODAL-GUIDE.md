# 🎨 Modal de Dos Columnas - Categorías con Tipos

## 📋 Descripción

Modal diseñado con **dos columnas** para gestionar categorías y sus tipos asociados de manera visual e intuitiva.

---

## 🎯 Estructura del Modal

### **Columna Izquierda: Información General**
- ✅ Nombre de la categoría
- ✅ Descripción
- ✅ URL de imagen
- ✅ Vista previa de imagen

### **Columna Derecha: Tipos Asociados**
- ✅ Lista de tipos con tarjetas visuales
- ✅ Botón para agregar nuevos tipos
- ✅ Editar/Eliminar tipos inline
- ✅ Contador de tipos asociados
- ✅ Estado vacío con ilustración

---

## 🚀 Uso en el Componente de Gestión

### **1. Template del Component de Gestión**

\`\`\`typescript
<app-category-modal
  [isOpen]="isCategoryModalOpen"
  [mode]="categoryModalMode"
  [category]="selectedCategory"
  [categoryTypes]="selectedCategoryTypes"
  (closeModal)="closeCategoryModal()"
  (saveCategory)="onSaveCategory($event)"
  (addType)="openTypeModal()"
  (editTypeEvent)="openEditTypeModal($event)"
  (removeTypeEvent)="removeType($event)"
/>

<app-category-type-modal
  [isOpen]="isTypeModalOpen"
  [mode]="typeModalMode"
  [categoryType]="selectedType"
  (closeModal)="closeTypeModal()"
  (saveType)="onSaveType($event)"
/>
\`\`\`

### **2. Lógica del Component de Gestión**

\`\`\`typescript
export class CategoriesManagementComponent {
  // Modal de Categoría
  isCategoryModalOpen = false;
  categoryModalMode: 'create' | 'edit' = 'create';
  selectedCategory: Category | null = null;
  selectedCategoryTypes: CategoryType[] = [];

  // Modal de Tipo
  isTypeModalOpen = false;
  typeModalMode: 'create' | 'edit' = 'create';
  selectedType: CategoryType | null = null;

  /**
   * Abrir modal para crear categoría
   */
  openCreateCategoryModal(): void {
    this.categoryModalMode = 'create';
    this.selectedCategory = null;
    this.selectedCategoryTypes = [];
    this.isCategoryModalOpen = true;
  }

  /**
   * Abrir modal para editar categoría
   */
  editCategory(category: Category): void {
    this.categoryModalMode = 'edit';
    this.selectedCategory = { ...category };
    // Cargar tipos asociados desde el servicio
    this.loadCategoryTypes(category.id);
    this.isCategoryModalOpen = true;
  }

  /**
   * Cerrar modal de categoría
   */
  closeCategoryModal(): void {
    this.isCategoryModalOpen = false;
    this.selectedCategory = null;
    this.selectedCategoryTypes = [];
  }

  /**
   * Guardar categoría con sus tipos
   */
  onSaveCategory(data: { category: Category; types: CategoryType[] }): void {
    if (this.categoryModalMode === 'create') {
      this.createCategory(data);
    } else {
      this.updateCategory(data);
    }
  }

  /**
   * Abrir modal para agregar tipo
   */
  openTypeModal(): void {
    this.typeModalMode = 'create';
    this.selectedType = null;
    this.isTypeModalOpen = true;
  }

  /**
   * Abrir modal para editar tipo
   */
  openEditTypeModal(type: CategoryType): void {
    this.typeModalMode = 'edit';
    this.selectedType = { ...type };
    this.isTypeModalOpen = true;
  }

  /**
   * Cerrar modal de tipo
   */
  closeTypeModal(): void {
    this.isTypeModalOpen = false;
    this.selectedType = null;
  }

  /**
   * Guardar tipo (agregar o actualizar)
   */
  onSaveType(type: CategoryType): void {
    if (this.typeModalMode === 'create') {
      // Agregar a la lista temporal
      this.selectedCategoryTypes = [...this.selectedCategoryTypes, type];
    } else {
      // Actualizar en la lista temporal
      this.selectedCategoryTypes = this.selectedCategoryTypes.map(t =>
        t.id === type.id ? type : t
      );
    }
    this.closeTypeModal();
    this.toastService.success(
      this.typeModalMode === 'create' ? 'Tipo agregado' : 'Tipo actualizado'
    );
  }

  /**
   * Eliminar tipo de la lista temporal
   */
  removeType(typeId: string): void {
    this.selectedCategoryTypes = this.selectedCategoryTypes.filter(
      t => t.id !== typeId
    );
    this.toastService.success('Tipo eliminado de la lista');
  }

  /**
   * Cargar tipos de una categoría
   */
  private loadCategoryTypes(categoryId: string): void {
    this.productService.getCategoryTypes(categoryId).subscribe({
      next: (types) => {
        this.selectedCategoryTypes = types;
      },
      error: (error) => {
        console.error('Error loading types:', error);
        this.selectedCategoryTypes = [];
      }
    });
  }

  /**
   * Crear categoría con tipos
   */
  private createCategory(data: { category: Category; types: CategoryType[] }): void {
    this.productService.createCategory(data.category).subscribe({
      next: (newCategory) => {
        // Guardar tipos asociados
        if (data.types.length > 0) {
          this.saveCategoryTypes(newCategory.id, data.types);
        }
        this.closeCategoryModal();
        this.toastService.success('Categoría creada exitosamente');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error creating category:', error);
        this.toastService.error('Error al crear la categoría');
      }
    });
  }

  /**
   * Actualizar categoría con tipos
   */
  private updateCategory(data: { category: Category; types: CategoryType[] }): void {
    this.productService.updateCategory(data.category.id, data.category).subscribe({
      next: (updatedCategory) => {
        // Actualizar tipos asociados
        this.saveCategoryTypes(updatedCategory.id, data.types);
        this.closeCategoryModal();
        this.toastService.success('Categoría actualizada exitosamente');
        this.loadCategories();
      },
      error: (error) => {
        console.error('Error updating category:', error);
        this.toastService.error('Error al actualizar la categoría');
      }
    });
  }

  /**
   * Guardar tipos de categoría
   */
  private saveCategoryTypes(categoryId: string, types: CategoryType[]): void {
    // Aquí implementarías la lógica para guardar los tipos
    // Puede ser una petición al backend que asocie los tipos a la categoría
    this.productService.updateCategoryTypes(categoryId, types).subscribe({
      next: () => {
        console.log('Types saved successfully');
      },
      error: (error) => {
        console.error('Error saving types:', error);
      }
    });
  }
}
\`\`\`

---

## 🎨 Características de Diseño

### **Responsive Layout**
\`\`\`html
<div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
  <!-- Columna izquierda: Se muestra arriba en móvil -->
  <!-- Columna derecha: Se muestra abajo en móvil -->
</div>
\`\`\`

### **Tarjetas de Tipos**
- 📸 Imagen o avatar con inicial
- 📝 Nombre y descripción
- ✏️ Botones de editar/eliminar
- 🎨 Hover effects
- 📱 Responsive

### **Estado Vacío**
- 🎨 Ilustración con icono
- 💬 Mensaje descriptivo
- 🔗 Call-to-action

---

## 💡 Flujo de Trabajo

### **Crear Categoría con Tipos:**

1. Usuario abre modal "Crear Categoría"
2. Llena información general (izquierda)
3. Click "Agregar Tipo" (derecha)
4. Modal secundario se abre
5. Llena información del tipo
6. Click "Agregar Tipo"
7. Tipo aparece en la lista (derecha)
8. Repite pasos 3-7 para más tipos
9. Click "Crear Categoría"
10. Backend guarda categoría + tipos

### **Editar Categoría:**

1. Usuario abre modal "Editar Categoría"
2. Información precargada (izquierda)
3. Tipos existentes mostrados (derecha)
4. Puede agregar más tipos
5. Puede editar tipos existentes
6. Puede eliminar tipos
7. Click "Guardar Cambios"
8. Backend actualiza todo

---

## 🔧 Personalización

### **Cambiar Tamaño del Modal**

\`\`\`typescript
<app-modal
  size="2xl"  // sm, md, lg, xl, 2xl
  ...
>
\`\`\`

### **Cambiar Colores**

\`\`\`typescript
// Cambiar gradiente del avatar
class="bg-gradient-to-br from-[#a81b8d] to-[#8b1573]"

// Cambiar color de hover
class="hover:border-[#a81b8d] hover:text-[#a81b8d]"
\`\`\`

### **Agregar Validaciones**

\`\`\`typescript
// En category-modal.component.ts
onSubmit(): void {
  // Validar que tenga al menos 1 tipo
  if (this.categoryTypes.length === 0) {
    this.toastService.warning('Debe agregar al menos un tipo');
    return;
  }
  
  // Continuar con el guardado...
}
\`\`\`

---

## 📦 Componentes Creados

1. **\`category-modal.component.ts\`** - Modal principal con dos columnas
2. **\`category-type-modal.component.ts\`** - Modal secundario para tipos
3. Ambos usan **\`ModalComponent\`** base
4. Ambos usan **\`ButtonComponent\`** compartido

---

## ✅ Ventajas del Diseño

✅ **UX Intuitiva** - Todo en un solo lugar
✅ **Visual** - Tarjetas con imágenes
✅ **Responsive** - Funciona en móvil
✅ **Escalable** - Fácil agregar más tipos
✅ **Mantenible** - Código modular
✅ **Profesional** - Diseño moderno con Tailwind

---

**¡Modal de dos columnas listo para usar! 🎉**
