# 📦 Sistema de Modales Reutilizables - Tambo Delivery

## 📋 Componentes Creados

### 1. **ModalComponent** (`shared/components/modal.component.ts`)
Componente base reutilizable para todos los modales de la aplicación.

#### Características:
- ✅ Backdrop con blur
- ✅ Múltiples tamaños (sm, md, lg, xl, 2xl)
- ✅ Header personalizable con gradiente
- ✅ Footer opcional
- ✅ Cierre con botón X o click en backdrop
- ✅ Animaciones suaves
- ✅ Diseño responsive

#### Uso Básico:
```typescript
<app-modal
  [isOpen]="isModalOpen"
  [title]="'Título del Modal'"
  [subtitle]="'Subtítulo opcional'"
  size="lg"
  (closeModal)="closeModal()"
>
  <!-- Contenido del modal -->
  <div>Tu contenido aquí</div>
  
  <!-- Footer personalizado (opcional) -->
  <div footer>
    <button>Cancelar</button>
    <button>Guardar</button>
  </div>
</app-modal>
```

### 2. **BrandModalComponent** (`admin/components/brand-modal.component.ts`)
Modal específico para crear/editar marcas.

#### Características:
- ✅ Formulario reactivo con validación
- ✅ Modos: crear y editar
- ✅ Preview de imagen
- ✅ Validación en tiempo real
- ✅ Botón de eliminar en modo edición
- ✅ Confirmación antes de eliminar

#### Uso:
```typescript
<app-brand-modal
  [isOpen]="isModalOpen"
  [mode]="'create' | 'edit'"
  [brand]="selectedBrand"
  (closeModal)="closeModal()"
  (saveBrand)="onSaveBrand($event)"
  (deleteBrand)="onDeleteBrand($event)"
/>
```

### 3. **ToastComponent** (`shared/components/toast.component.ts`)
Sistema de notificaciones toast.

#### Características:
- ✅ 4 tipos: success, error, warning, info
- ✅ Auto-cierre configurable
- ✅ Animaciones suaves
- ✅ Múltiples toasts simultáneos
- ✅ Posición fija en top-right
- ✅ Cierre manual

#### Uso:
```typescript
// En tu componente
constructor(private toastService: ToastService) {}

// Mostrar notificaciones
this.toastService.success('Operación exitosa');
this.toastService.error('Error al procesar');
this.toastService.warning('Advertencia importante');
this.toastService.info('Información relevante');
```

## 🎨 Estilos y Temas

### Colores Principales:
- **Primary**: `#a81b8d` (Rosa Tambo)
- **Primary Dark**: `#8b1573`
- **Success**: Verde (`green-500`)
- **Error**: Rojo (`red-500`)
- **Warning**: Amarillo (`yellow-500`)
- **Info**: Azul (`blue-500`)

## 🔄 Cómo Crear Nuevos Modales

### Paso 1: Crear el componente del modal
```bash
ng generate component features/admin/components/product-modal --standalone
```

### Paso 2: Estructura básica
```typescript
import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalComponent } from '../../../shared/components/modal.component';
import { ButtonComponent } from '../../../shared/components/button.component';
import { YourModel } from '../../../models/your-model.model';

@Component({
  selector: 'app-your-modal',
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
      <form [formGroup]="yourForm" (ngSubmit)="onSubmit()">
        <!-- Tu formulario aquí -->
        
        <!-- Botones de acción -->
        <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
          <app-button
            [config]="{ text: 'Cancelar', type: 'secondary', size: 'md' }"
            (buttonClick)="onClose()"
          />
          <app-button
            [config]="{ 
              text: mode === 'create' ? 'Crear' : 'Guardar', 
              type: 'primary', 
              size: 'md',
              disabled: yourForm.invalid 
            }"
            (buttonClick)="onSubmit()"
          />
        </div>
      </form>
    </app-modal>
  `
})
export class YourModalComponent implements OnInit, OnChanges {
  @Input() isOpen = false;
  @Input() mode: 'create' | 'edit' = 'create';
  @Input() item: YourModel | null = null;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() saveItem = new EventEmitter<YourModel>();
  @Output() deleteItem = new EventEmitter<string>();

  yourForm!: FormGroup;
  isSubmitting = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(): void {
    if (this.isOpen) {
      this.initForm();
    }
  }

  private initForm(): void {
    this.yourForm = this.fb.group({
      // Tus campos aquí
      name: [this.item?.name || '', [Validators.required]],
      // más campos...
    });
  }

  get modalTitle(): string {
    return this.mode === 'create' ? 'Crear Nuevo Item' : 'Editar Item';
  }

  get modalSubtitle(): string {
    return this.mode === 'create' 
      ? 'Completa la información' 
      : 'Actualiza la información';
  }

  onSubmit(): void {
    if (this.yourForm.invalid || this.isSubmitting) {
      this.yourForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const itemData: YourModel = {
      id: this.item?.id || '',
      ...this.yourForm.value
    };
    this.saveItem.emit(itemData);
  }

  onClose(): void {
    if (!this.isSubmitting) {
      this.yourForm.reset();
      this.isSubmitting = false;
      this.closeModal.emit();
    }
  }
}
```

### Paso 3: Integrar en el componente de gestión
```typescript
// En tu management component
export class YourManagementComponent {
  isModalOpen = false;
  modalMode: 'create' | 'edit' = 'create';
  selectedItem: YourModel | null = null;

  openCreateModal(): void {
    this.modalMode = 'create';
    this.selectedItem = null;
    this.isModalOpen = true;
  }

  editItem(item: YourModel): void {
    this.modalMode = 'edit';
    this.selectedItem = { ...item };
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
    this.selectedItem = null;
  }

  onSaveItem(item: YourModel): void {
    if (this.modalMode === 'create') {
      this.createItem(item);
    } else {
      this.updateItem(item);
    }
  }
}
```

## 📂 Estructura de Archivos

```
src/app/
├── shared/
│   ├── components/
│   │   ├── modal.component.ts          ← Componente base reutilizable
│   │   ├── toast.component.ts          ← Sistema de notificaciones
│   │   ├── button.component.ts         ← Botón reutilizable
│   │   └── index.ts                    ← Exports
│   └── services/
│       ├── toast.service.ts            ← Servicio de notificaciones
│       └── index.ts                    ← Exports
└── features/
    └── admin/
        └── components/
            ├── brand-modal.component.ts     ← Modal de marcas
            ├── product-modal.component.ts   ← (Próximo) Modal de productos
            ├── category-modal.component.ts  ← (Próximo) Modal de categorías
            └── user-modal.component.ts      ← (Próximo) Modal de usuarios
```

## 🎯 Próximos Modales a Crear

1. **ProductModalComponent** - Para gestionar productos
2. **CategoryModalComponent** - Para gestionar categorías
3. **UserModalComponent** - Para gestionar usuarios
4. **OrderModalComponent** - Para ver detalles de órdenes

## 💡 Best Practices

1. **Siempre usar FormGroup** para validación
2. **Implementar OnChanges** para resetear el form cuando se abre el modal
3. **Emitir eventos** en lugar de llamar servicios directamente
4. **Usar ToastService** para notificaciones consistentes
5. **Confirmar antes de eliminar** con un mensaje claro
6. **Deshabilitar botones** mientras se procesa
7. **Validar en tiempo real** con clases condicionales

## 🚀 Ventajas del Sistema

✅ **Reutilizable** - Un solo componente base para todos los modales
✅ **Consistente** - Mismo look & feel en toda la app
✅ **Escalable** - Fácil crear nuevos modales
✅ **Mantenible** - Cambios en un lugar afectan a todos
✅ **Profesional** - Diseño moderno con Tailwind
✅ **Accesible** - Soporte para teclado y screen readers
