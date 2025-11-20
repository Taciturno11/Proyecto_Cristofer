# 🎯 Sistema de Descuentos - Guía de Implementación

## 📋 Descripción General

Sistema completo de gestión de descuentos con modal de dos columnas que permite:
- ✅ Crear y editar descuentos con porcentajes personalizados
- ✅ Asociar productos específicos a cada descuento
- ✅ Establecer fechas de inicio y fin
- ✅ Desactivación automática de descuentos vencidos
- ✅ Búsqueda y filtrado de productos en tiempo real
- ✅ Selección múltiple de productos con checkboxes

---

## 🏗️ Arquitectura

### Backend DTOs

#### DiscountRequestDTO (Crear/Actualizar)
```java
public class DiscountRequestDTO {
    private String name;
    private BigDecimal percentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private List<UUID> productIds;  // ✅ IDs de productos asociados
}
```

#### DiscountResponseDTO (Respuesta)
```java
public class DiscountDTO {
    private UUID id;
    private String name;
    private BigDecimal percentage;
    private LocalDate startDate;
    private LocalDate endDate;
    private Boolean isActive;
    private List<ProductDiscountDTO> products; // ✅ Productos completos
}
```

### Frontend Models

```typescript
export interface Discount {
  id: string;
  name: string;
  percentage: number;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  products: Product[]; // Lista completa de productos
}
```

---

## 🎨 Modal de Dos Columnas

### Estructura del Modal

```
┌─────────────────────────────────────────────────────────┐
│  Crear Nuevo Descuento                                  │
├──────────────────────┬──────────────────────────────────┤
│ 📋 Información Gen.  │ 🛍️ Productos Asociados          │
│                      │                                  │
│ • Nombre             │ [Búsqueda de productos...]       │
│ • Porcentaje (%)     │                                  │
│ • Fecha Inicio       │ ☐ Producto 1  [img] S/ 10.00   │
│ • Fecha Fin          │ ☑ Producto 2  [img] S/ 15.00   │
│ • Estado             │ ☐ Producto 3  [img] S/ 20.00   │
│                      │                                  │
│                      │ [Seleccionar todos] [Limpiar]   │
└──────────────────────┴──────────────────────────────────┘
│           [Cancelar]  [Crear Descuento]                 │
└─────────────────────────────────────────────────────────┘
```

### Componentes Clave

#### 1. `discount-modal.component.ts`

**Inputs:**
- `isOpen`: Estado del modal
- `mode`: 'create' | 'edit'
- `discount`: Descuento a editar (null para crear)
- `products`: Array de productos disponibles

**Outputs:**
```typescript
@Output() saveDiscount = new EventEmitter<{
  discount: Discount;
  productIds: string[];
}>();
```

**Propiedades Principales:**
```typescript
selectedProductIds: string[] = [];  // IDs de productos seleccionados
productSearchTerm = '';              // Término de búsqueda
```

**Métodos Principales:**

```typescript
// Filtrar productos por búsqueda
filteredProducts(): Product[] {
  if (!this.productSearchTerm.trim()) return this.products;
  
  const search = this.productSearchTerm.toLowerCase();
  return this.products.filter(product =>
    product.name.toLowerCase().includes(search) ||
    product.brand?.name?.toLowerCase().includes(search)
  );
}

// Toggle selección de producto
toggleProductSelection(productId: string): void {
  const index = this.selectedProductIds.indexOf(productId);
  if (index > -1) {
    this.selectedProductIds.splice(index, 1);
  } else {
    this.selectedProductIds.push(productId);
  }
}

// Seleccionar todos los productos filtrados
selectAllProducts(): void {
  const filteredIds = this.filteredProducts().map(p => p.id);
  filteredIds.forEach(id => {
    if (!this.selectedProductIds.includes(id)) {
      this.selectedProductIds.push(id);
    }
  });
}

// Limpiar selección
clearAllProducts(): void {
  this.selectedProductIds = [];
}

// Enviar datos al componente padre
onSubmit(): void {
  const discountData: Discount = {
    id: this.discount?.id || '',
    name: this.discountForm.value.name.trim(),
    percentage: this.discountForm.value.percentage,
    startDate: this.discountForm.value.startDate,
    endDate: this.discountForm.value.endDate,
    isActive: this.discountForm.value.isActive,
    products: this.discount?.products || [],
  };

  // ✅ Emitir descuento + IDs de productos
  this.saveDiscount.emit({
    discount: discountData,
    productIds: this.selectedProductIds,
  });
}
```

---

## 🔄 Flujo de Datos

### Crear Descuento

```mermaid
Usuario → Modal (Llenar formulario + Seleccionar productos)
       → Component (onSaveDiscount)
       → Construir Payload {name, percentage, dates, productIds}
       → ProductService.createDiscount(payload)
       → Backend (DiscountRequestDTO)
       → Respuesta (DiscountResponseDTO con productos completos)
       → Actualizar lista
       → Toast de éxito
```

### Actualizar Descuento

```mermaid
Usuario → Click Editar
       → Cargar datos del descuento
       → Cargar productIds seleccionados (from discount.products)
       → Modificar datos
       → Component (onSaveDiscount)
       → Construir Payload con nuevos productIds
       → ProductService.updateDiscount(id, payload)
       → Backend
       → Actualizar lista
```

---

## ⏰ Desactivación Automática de Descuentos Vencidos

### Implementación en `discounts-management.component.ts`

```typescript
/**
 * ✅ Verifica y desactiva automáticamente los descuentos vencidos
 */
private checkAndDeactivateExpiredDiscounts(): void {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalizar a medianoche

  const expiredDiscounts = this.discounts.filter((discount) => {
    if (!discount.endDate || !discount.isActive) return false;

    const endDate = new Date(discount.endDate);
    endDate.setHours(0, 0, 0, 0);

    return endDate < today; // Si la fecha de fin ya pasó
  });

  if (expiredDiscounts.length > 0) {
    console.log(`⏰ Se encontraron ${expiredDiscounts.length} descuentos vencidos`);

    // Desactivar cada descuento vencido
    expiredDiscounts.forEach((discount) => {
      const updatedDiscount = { ...discount, isActive: false };

      this.productService.updateDiscount(discount.id, updatedDiscount)
        .subscribe({
          next: () => {
            console.log(`✅ Descuento "${discount.name}" desactivado`);
            // Actualizar en lista local
            const index = this.discounts.findIndex(d => d.id === discount.id);
            if (index > -1) this.discounts[index].isActive = false;
          },
          error: (error) => {
            console.error(`❌ Error al desactivar "${discount.name}":`, error);
          }
        });
    });
  }
}
```

### ¿Cuándo se ejecuta?

1. **Al cargar la página** (`ngOnInit` → `loadInitialData`)
2. **Después de crear un descuento** (`createDiscount` → `loadDiscounts`)
3. **Después de actualizar un descuento** (`updateDiscount` → `loadDiscounts`)

---

## 🎨 Características de UX

### 1. Búsqueda en Tiempo Real
- Input de búsqueda filtra productos por nombre o marca
- Actualización instantánea sin recargar

### 2. Checkboxes Interactivos
```typescript
<input
  type="checkbox"
  [checked]="isProductSelected(product.id)"
  (change)="toggleProductSelection(product.id)"
  class="w-4 h-4 text-[#a81b8d]"
/>
```

### 3. Acciones Rápidas
- **Seleccionar todos**: Selecciona todos los productos filtrados
- **Limpiar selección**: Deselecciona todos los productos

### 4. Contador Visual
```html
<span>{{ selectedProductIds.length }} seleccionados</span>
```

### 5. Scroll Independiente
```html
<div class="max-h-96 overflow-y-auto">
  <!-- Lista de productos -->
</div>
```

---

## 🔧 Configuración en Componente Padre

### discounts-management.component.ts

```typescript
export class DiscountsManagementComponent implements OnInit {
  availableProducts: Product[] = [];  // ✅ Productos disponibles
  
  ngOnInit(): void {
    this.loadInitialData();
  }

  // ✅ Cargar descuentos y productos con forkJoin
  private loadInitialData(): void {
    this.isLoading = true;
    forkJoin({
      discounts: this.productService.getAllDiscounts(),
      products: this.productService.getAllProductsAdmin(),
    }).subscribe({
      next: ({ discounts, products }) => {
        this.discounts = discounts || [];
        this.availableProducts = products || [];
        this.checkAndDeactivateExpiredDiscounts();
        this.applyFilters();
        this.isLoading = false;
      }
    });
  }

  // ✅ Recibir datos del modal
  onSaveDiscount(event: { discount: Discount; productIds: string[] }): void {
    if (this.modalMode === 'create') {
      this.createDiscount(event.discount, event.productIds);
    } else {
      this.updateDiscount(event.discount, event.productIds);
    }
  }

  // ✅ Crear con payload correcto
  private createDiscount(discount: Discount, productIds: string[]): void {
    const payload = {
      name: discount.name,
      percentage: discount.percentage,
      startDate: discount.startDate,
      endDate: discount.endDate,
      isActive: discount.isActive,
      productIds: productIds,  // ✅ Lista de UUIDs
    };

    this.productService.createDiscount(payload).subscribe({
      next: (newDiscount) => {
        this.toastService.success(`Descuento "${newDiscount.name}" creado`);
        this.loadDiscounts();
        this.closeModal();
      }
    });
  }
}
```

### Template

```html
<app-discount-modal
  [isOpen]="isModalOpen"
  [mode]="modalMode"
  [discount]="selectedDiscount"
  [products]="availableProducts"
  (closeModal)="closeModal()"
  (saveDiscount)="onSaveDiscount($event)"
/>
```

---

## 📝 Formato de Fechas

### Input Type="date"
Angular espera formato `YYYY-MM-DD` para inputs de tipo date:

```typescript
private formatDateForInput(date: Date): string {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
```

### Inicialización del Formulario
```typescript
startDate: [
  this.discount?.startDate 
    ? this.formatDateForInput(this.discount.startDate) 
    : null,
  [Validators.required]
]
```

---

## 🐛 Solución de Problemas Comunes

### 1. Productos no se cargan en el modal
**Causa**: `availableProducts` no se pasa como `@Input`
**Solución**: 
```html
<app-discount-modal [products]="availableProducts" />
```

### 2. Las fechas no se muestran correctamente al editar
**Causa**: Formato incorrecto para input type="date"
**Solución**: Usar `formatDateForInput()` en `initForm()`

### 3. Descuentos vencidos no se desactivan
**Causa**: No se llama `checkAndDeactivateExpiredDiscounts()`
**Solución**: Llamar en `loadInitialData()` y después de cada CRUD

### 4. Los productos seleccionados no se mantienen al editar
**Causa**: No se carga `selectedProductIds` en `ngOnChanges`
**Solución**: Implementar `loadSelectedProducts()`

```typescript
private loadSelectedProducts(): void {
  if (this.discount && this.discount.products) {
    this.selectedProductIds = this.discount.products.map(p => p.id);
  }
}
```

---

## ✅ Checklist de Implementación

- [x] Modal de dos columnas (Información | Productos)
- [x] Formulario reactivo con validaciones
- [x] Búsqueda en tiempo real de productos
- [x] Selección múltiple con checkboxes
- [x] Contador de productos seleccionados
- [x] Botones "Seleccionar todos" y "Limpiar"
- [x] Emitir evento con `{ discount, productIds }`
- [x] Construir payload según `DiscountRequestDTO`
- [x] Desactivación automática de descuentos vencidos
- [x] Formato correcto de fechas para input type="date"
- [x] Cargar productos seleccionados al editar
- [x] Locale español para fechas (opcional)

---

## 📊 Ejemplo de Payload

### Crear Descuento
```json
{
  "name": "Descuento de Verano 2025",
  "percentage": 25,
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "isActive": true,
  "productIds": [
    "123e4567-e89b-12d3-a456-426614174000",
    "223e4567-e89b-12d3-a456-426614174001"
  ]
}
```

### Respuesta del Backend
```json
{
  "id": "333e4567-e89b-12d3-a456-426614174002",
  "name": "Descuento de Verano 2025",
  "percentage": 25,
  "startDate": "2025-06-01",
  "endDate": "2025-08-31",
  "isActive": true,
  "products": [
    {
      "id": "123e4567-e89b-12d3-a456-426614174000",
      "name": "Coca Cola 1L",
      "price": 5.50
    },
    {
      "id": "223e4567-e89b-12d3-a456-426614174001",
      "name": "Pepsi 1L",
      "price": 5.00
    }
  ]
}
```

---

## 🎯 Próximos Pasos

1. **Backend**: Asegúrate de que el endpoint acepta `productIds` en el DTO
2. **Testing**: Prueba crear/editar descuentos con múltiples productos
3. **Validación**: Verifica que la desactivación automática funciona correctamente
4. **UI/UX**: Considera agregar preview de productos seleccionados antes de guardar

---

## 📞 Soporte

Si encuentras algún problema:
1. Revisa los logs del navegador (Console)
2. Verifica el payload enviado en la pestaña Network
3. Confirma que el backend espera el formato correcto
4. Revisa que `getAllProductsAdmin()` devuelve la lista completa

---

**Última actualización**: Octubre 2025
**Autor**: GitHub Copilot
**Versión**: 1.0
