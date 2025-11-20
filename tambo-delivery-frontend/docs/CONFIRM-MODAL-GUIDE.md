# 🗑️ Modal de Confirmación - Guía de Uso

## 📦 Componente: ConfirmModalComponent

### 📍 Ubicación
`src/app/shared/components/confirm-modal.component.ts`

---

## 🎯 Propósito

Modal genérico para confirmaciones de acciones importantes como:
- ❌ Eliminar registros
- ⚠️ Advertencias críticas
- ℹ️ Confirmaciones informativas

---

## 🎨 Diseño

### Tipos de Modal
1. **Danger (Peligro)** - Rojo 🔴
   - Para eliminaciones
   - Acciones destructivas

2. **Warning (Advertencia)** - Amarillo 🟡
   - Para advertencias
   - Acciones que requieren atención

3. **Info (Información)** - Azul 🔵
   - Para confirmaciones generales
   - Acciones reversibles

---

## 🚀 Uso Básico

### 1. Importar el componente
```typescript
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal.component';

@Component({
  imports: [ConfirmModalComponent, ...],
  ...
})
```

### 2. Agregar al template
```typescript
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
```

### 3. Agregar propiedades en el componente
```typescript
export class YourComponent {
  isDeleteModalOpen = false;
  itemToDelete: YourModel | null = null;

  openDeleteModal(item: YourModel): void {
    this.itemToDelete = item;
    this.isDeleteModalOpen = true;
  }

  confirmDelete(): void {
    if (!this.itemToDelete) return;
    
    // Lógica de eliminación
    this.service.delete(this.itemToDelete.id).subscribe({
      next: () => {
        this.toastService.success('Eliminado exitosamente');
        this.cancelDelete();
      },
      error: () => {
        this.toastService.error('Error al eliminar');
        this.cancelDelete();
      }
    });
  }

  cancelDelete(): void {
    this.isDeleteModalOpen = false;
    this.itemToDelete = null;
  }

  getDeleteTitle(): string {
    return '¿Eliminar item?';
  }

  getDeleteMessage(): string {
    return `¿Estás seguro de que deseas eliminar "${this.itemToDelete?.name}"?`;
  }
}
```

---

## 📋 Propiedades (Inputs)

| Propiedad | Tipo | Valor por defecto | Descripción |
|-----------|------|-------------------|-------------|
| `isOpen` | `boolean` | `false` | Controla si el modal está visible |
| `type` | `'danger' \| 'warning' \| 'info'` | `'danger'` | Tipo de modal (color del ícono) |
| `title` | `string` | `'¿Estás seguro?'` | Título del modal |
| `message` | `string` | `'Esta acción no se puede deshacer.'` | Mensaje descriptivo |
| `confirmText` | `string` | `'Confirmar'` | Texto del botón de confirmación |
| `cancelText` | `string` | `'Cancelar'` | Texto del botón de cancelar |
| `closeOnBackdropClick` | `boolean` | `false` | Permitir cerrar con click fuera |

---

## 🔄 Eventos (Outputs)

| Evento | Tipo | Descripción |
|--------|------|-------------|
| `confirm` | `void` | Emitido cuando se confirma la acción |
| `cancel` | `void` | Emitido cuando se cancela la acción |

---

## 💡 Ejemplos de Uso

### Ejemplo 1: Eliminar Marca (Actual)
```typescript
<!-- Template -->
<button (click)="onDeleteBrand(brand.id)">Eliminar</button>

<app-confirm-modal
  [isOpen]="isDeleteModalOpen"
  type="danger"
  [title]="'¿Eliminar marca?'"
  [message]="'¿Estás seguro de eliminar ' + brandToDelete?.name + '?'"
  confirmText="Sí, eliminar"
  cancelText="Cancelar"
  (confirm)="confirmDelete()"
  (cancel)="cancelDelete()"
/>

<!-- Component -->
onDeleteBrand(brandId: string): void {
  const brand = this.brands.find(b => b.id === brandId);
  if (brand) {
    this.brandToDelete = brand;
    this.isDeleteModalOpen = true;
  }
}

confirmDelete(): void {
  // Lógica de eliminación
  this.service.deleteBrand(this.brandToDelete!.id).subscribe(...);
}

cancelDelete(): void {
  this.isDeleteModalOpen = false;
  this.brandToDelete = null;
}
```

### Ejemplo 2: Advertencia de Stock Bajo
```typescript
<app-confirm-modal
  [isOpen]="showStockWarning"
  type="warning"
  title="Stock Bajo"
  message="Este producto tiene poco stock. ¿Deseas continuar con la venta?"
  confirmText="Sí, continuar"
  cancelText="Cancelar venta"
  (confirm)="proceedWithSale()"
  (cancel)="cancelSale()"
/>
```

### Ejemplo 3: Confirmar Acción
```typescript
<app-confirm-modal
  [isOpen]="showConfirmation"
  type="info"
  title="Confirmar Publicación"
  message="¿Deseas publicar este producto ahora?"
  confirmText="Publicar"
  cancelText="Cancelar"
  (confirm)="publishProduct()"
  (cancel)="closeConfirmation()"
/>
```

---

## 🎨 Características de Diseño

### ✨ Visual
- 🎭 **Backdrop con blur** - Efecto de desenfoque en el fondo
- 🎨 **Iconos contextuales** - Diferentes según el tipo
- 🎯 **Centrado responsivo** - Se adapta a todos los tamaños
- 📱 **Mobile-friendly** - Botones en columna en móviles
- 🌊 **Animaciones suaves** - Transiciones elegantes

### 🔒 Comportamiento
- ❌ **No cierra con backdrop** por defecto (seguridad)
- ⌨️ **Soporte de teclado** - ESC para cancelar
- 🎯 **Focus management** - Enfoque en botones
- 🚫 **Previene clicks accidentales** - Requiere confirmación explícita

---

## 🐛 Solución de Problemas

### El backdrop se ve negro sin blur
**Solución**: Usar `style="backdrop-filter: blur(4px);"` en lugar de clases de Tailwind

```typescript
// ✅ CORRECTO
<div 
  class="fixed inset-0 bg-black/50"
  style="backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);"
></div>

// ❌ INCORRECTO (puede no funcionar)
<div class="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
```

### El modal no se cierra
**Problema**: Los eventos `confirm` o `cancel` no están conectados correctamente

**Solución**: Asegúrate de implementar ambos métodos:
```typescript
confirmDelete(): void {
  // Tu lógica
  this.cancelDelete(); // Importante: cerrar el modal al final
}

cancelDelete(): void {
  this.isDeleteModalOpen = false;
  this.itemToDelete = null;
}
```

### Errores con comillas en el mensaje
**Problema**: Angular tiene problemas con comillas anidadas en templates

**Solución**: Usa métodos getter:
```typescript
// ❌ Puede causar errores
[message]="'Eliminar \"' + item.name + '\"?'"

// ✅ Mejor práctica
[message]="getDeleteMessage()"

getDeleteMessage(): string {
  return `¿Eliminar "${this.item?.name}"?`;
}
```

---

## 🔮 Próximas Mejoras

- [ ] Soporte para contenido personalizado (HTML)
- [ ] Animación de entrada/salida
- [ ] Diferentes tamaños (sm, md, lg)
- [ ] Loading state en botones
- [ ] Contador regresivo para confirmación
- [ ] Sonidos de confirmación (opcional)

---

## 📚 Componentes Relacionados

- **ModalComponent** - Modal base para formularios
- **ToastComponent** - Notificaciones después de acciones
- **ButtonComponent** - Botones utilizados en el modal

---

## ✅ Checklist de Implementación

Cuando implementes un nuevo modal de confirmación:

- [ ] Agregar propiedad `isModalOpen`
- [ ] Agregar propiedad `itemToDelete`
- [ ] Crear método `openDeleteModal()`
- [ ] Crear método `confirmDelete()`
- [ ] Crear método `cancelDelete()`
- [ ] Crear getters para `title` y `message` (opcional)
- [ ] Agregar `<app-confirm-modal>` al template
- [ ] Importar `ConfirmModalComponent`
- [ ] Mostrar Toast después de confirmar
- [ ] Cerrar modal en success y error

---

**¡Modal de confirmación listo para usar! 🎉**
