# CRUD de Productos en 3 Fases

Este documento explica el sistema de creación de productos implementado en **3 fases independientes**, diseñado para facilitar la gestión de productos en Tambo Delivery.

## 📋 Índice

1. [Descripción General](#descripción-general)
2. [Arquitectura](#arquitectura)
3. [Fase 1: Información Básica](#fase-1-información-básica)
4. [Fase 2: Imágenes y Recursos](#fase-2-imágenes-y-recursos)
5. [Fase 3: Asignar Descuentos](#fase-3-asignar-descuentos)
6. [Flujo Completo](#flujo-completo)
7. [Endpoints del Backend](#endpoints-del-backend)
8. [Modelos de Datos](#modelos-de-datos)
9. [Uso y Ejemplos](#uso-y-ejemplos)

---

## 🎯 Descripción General

El sistema CRUD de productos está dividido en **3 fases consecutivas**:

- **Fase 1**: Crear el producto con información básica (obligatorio)
- **Fase 2**: Agregar imágenes y recursos multimedia (opcional)
- **Fase 3**: Asignar descuentos existentes al producto (opcional)

Cada fase es **independiente** y puede ser omitida (excepto la Fase 1), permitiendo flexibilidad en el proceso de creación.

---

## 🏗️ Arquitectura

### Componentes Creados

```
src/app/features/admin/components/
├── product-create-phase1-modal.component.ts  # Modal Fase 1
├── product-create-phase2-modal.component.ts  # Modal Fase 2
└── product-create-phase3-modal.component.ts  # Modal Fase 3

src/app/features/admin/pages/
└── products-management.component.ts          # Gestión principal

src/app/models/
└── product.model.ts                          # Modelos actualizados

src/app/features/products/services/
└── product.service.ts                        # Servicio con nuevos endpoints
```

### Flujo de Estados

```
[Botón Crear] → [Fase 1] → [Fase 2] → [Fase 3] → [✓ Completado]
                    ↓           ↓           ↓
                  Guarda    Omitir      Omitir
                             ↓           ↓
                          [Fase 3] → [✓ Completado]
```

---

## 📝 Fase 1: Información Básica

### Componente: `ProductCreatePhase1ModalComponent`

**Archivo**: `product-create-phase1-modal.component.ts`

### Campos del Formulario

| Campo | Tipo | Requerido | Descripción |
|-------|------|-----------|-------------|
| `name` | `string` | ✅ Sí | Nombre del producto |
| `slug` | `string` | ✅ Sí | URL amigable (auto-generada) |
| `description` | `textarea` | ✅ Sí | Descripción detallada |
| `price` | `number` | ✅ Sí | Precio en soles (S/) |
| `stock` | `number` | ✅ Sí | Cantidad disponible |
| `brandId` | `UUID` | ✅ Sí | ID de la marca |
| `categoryId` | `UUID` | ✅ Sí | ID de la categoría |
| `categoryTypeId` | `UUID` | ❌ No | ID del tipo de categoría |
| `isNewArrival` | `boolean` | ❌ No | ¿Es nuevo ingreso? |
| `isActive` | `boolean` | ❌ No | Estado activo/inactivo |

### Validaciones

- ✅ Nombre no puede estar vacío
- ✅ Descripción es requerida
- ✅ Precio debe ser mayor a 0
- ✅ Stock no puede ser negativo
- ✅ Marca y categoría son obligatorias
- ✅ Slug se auto-genera del nombre

### Funcionalidad

```typescript
// Al completar Fase 1
onPhase1Completed(productId: string) {
  this.newProductId = productId;
  this.isPhase1ModalOpen = false;
  this.isPhase2ModalOpen = true;  // Abre automáticamente Fase 2
}
```

### Endpoint Backend

```http
POST /api/admin/products
Content-Type: application/json

{
  "slug": "coca-cola-500ml",
  "name": "Coca Cola 500ml",
  "description": "Bebida gaseosa...",
  "price": 3.50,
  "stock": 100,
  "brandId": "uuid-marca",
  "categoryId": "uuid-categoria",
  "categoryTypeId": "uuid-tipo-categoria",
  "isNewArrival": true,
  "isActive": true
}
```

---

## 🖼️ Fase 2: Imágenes y Recursos

### Componente: `ProductCreatePhase2ModalComponent`

**Archivo**: `product-create-phase2-modal.component.ts`

### Características

- ✅ **Imagen Principal**: Obligatoria si se ingresa a esta fase
- ✅ **Imágenes Adicionales**: Ilimitadas (opcional)
- ✅ **Vista Previa**: Muestra las imágenes antes de guardar
- ✅ **Tipos Soportados**: IMAGE, VIDEO
- ✅ **Opción "Omitir"**: Saltar esta fase

### Estructura de un Recurso

```typescript
interface ProductResource {
  name: string;        // Nombre del recurso
  url: string;         // URL de la imagen/video
  isPrimary: boolean;  // ¿Es la imagen principal?
  type: string;        // "IMAGE" | "VIDEO"
}
```

### Funcionalidad

```typescript
// Agregar recurso adicional
addAdditionalResource() {
  this.additionalResources.push({
    name: '',
    url: '',
    isPrimary: false,
    type: 'IMAGE'
  });
}

// Eliminar recurso
removeAdditionalResource(index: number) {
  this.additionalResources.splice(index, 1);
}

// Al completar Fase 2
onPhase2Completed() {
  this.isPhase2ModalOpen = false;
  this.isPhase3ModalOpen = true;  // Abre Fase 3
}
```

### Endpoint Backend

```http
POST /api/admin/products/{productId}/resources
Content-Type: application/json

{
  "resources": [
    {
      "name": "Imagen principal",
      "url": "https://example.com/coca-cola.jpg",
      "isPrimary": true,
      "type": "IMAGE"
    },
    {
      "name": "Vista lateral",
      "url": "https://example.com/coca-cola-side.jpg",
      "isPrimary": false,
      "type": "IMAGE"
    }
  ]
}
```

---

## 💰 Fase 3: Asignar Descuentos

### Componente: `ProductCreatePhase3ModalComponent`

**Archivo**: `product-create-phase3-modal.component.ts`

### Características

- ✅ Lista todos los descuentos **activos**
- ✅ Selección múltiple con checkboxes
- ✅ Muestra información del descuento (porcentaje, fechas, estado)
- ✅ Opción "Omitir": Finalizar sin asignar descuentos

### Información Mostrada

| Campo | Descripción |
|-------|-------------|
| Nombre | Nombre del descuento |
| Porcentaje | % de descuento (-15%, -20%, etc.) |
| Fechas | Fecha inicio - Fecha fin |
| Estado | Activo / Inactivo |

### Funcionalidad

```typescript
// Alternar selección de descuento
toggleDiscount(discountId: string) {
  const index = this.selectedDiscountIds.indexOf(discountId);
  if (index > -1) {
    this.selectedDiscountIds.splice(index, 1);
  } else {
    this.selectedDiscountIds.push(discountId);
  }
}

// Al completar Fase 3
onPhase3Completed() {
  alert('✅ Producto creado exitosamente');
  this.loadProducts();  // Recargar lista
}
```

### Endpoint Backend

```http
POST /api/admin/products/{productId}/discounts
Content-Type: application/json

{
  "discountIds": [
    "uuid-descuento-1",
    "uuid-descuento-2"
  ]
}
```

---

## 🔄 Flujo Completo

### Diagrama de Secuencia

```
Usuario                Modal Fase 1         Backend          Modal Fase 2         Modal Fase 3
   |                        |                  |                   |                    |
   |--[Crear Producto]----->|                  |                   |                    |
   |                        |                  |                   |                    |
   |   [Llenar Formulario]  |                  |                   |                    |
   |                        |                  |                   |                    |
   |<----[Validar]----------|                  |                   |                    |
   |                        |                  |                   |                    |
   |                        |--[POST /products]->                  |                    |
   |                        |<---[productId]---|                   |                    |
   |                        |                  |                   |                    |
   |                        |--[Abrir Fase 2]--------------------->|                    |
   |                        |                  |                   |                    |
   |   [Agregar Imágenes]   |                  |                   |                    |
   |                        |                  |                   |                    |
   |                        |                  |<-[POST /resources]-|                   |
   |                        |                  |                   |                    |
   |                        |                  |                   |--[Abrir Fase 3]--->|
   |                        |                  |                   |                    |
   |   [Seleccionar Desc.]  |                  |                   |                    |
   |                        |                  |                   |                    |
   |                        |                  |<-[POST /discounts]---------------------|
   |                        |                  |                   |                    |
   |<---[✅ Completado]------------------------------------------------------|
```

### Código de Integración

```typescript
// En products-management.component.ts

export class ProductsManagementComponent {
  isPhase1ModalOpen = false;
  isPhase2ModalOpen = false;
  isPhase3ModalOpen = false;
  newProductId = '';

  // Iniciar creación
  openCreateProductModal() {
    this.isPhase1ModalOpen = true;
  }

  // Fase 1 → Fase 2
  onPhase1Completed(productId: string) {
    this.newProductId = productId;
    this.isPhase1ModalOpen = false;
    this.isPhase2ModalOpen = true;
  }

  // Fase 2 → Fase 3
  onPhase2Completed() {
    this.isPhase2ModalOpen = false;
    this.isPhase3ModalOpen = true;
  }

  // Fase 3 → Finalizar
  onPhase3Completed() {
    this.isPhase3ModalOpen = false;
    this.newProductId = '';
    alert('✅ Producto creado exitosamente');
    this.loadProducts();
  }
}
```

---

## 🌐 Endpoints del Backend

### Resumen de Endpoints

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/api/admin/products` | Crear producto básico (Fase 1) |
| `POST` | `/api/admin/products/{id}/resources` | Agregar recursos (Fase 2) |
| `POST` | `/api/admin/products/{id}/discounts` | Asignar descuentos (Fase 3) |
| `DELETE` | `/api/admin/products/{id}/resources/{resourceId}` | Eliminar recurso |
| `DELETE` | `/api/admin/products/{id}/discounts/{discountId}` | Remover descuento |
| `PUT` | `/api/admin/products/{id}` | Actualizar producto |
| `DELETE` | `/api/admin/products/{id}` | Eliminar producto |
| `GET` | `/api/public/products` | Obtener productos (público) |
| `GET` | `/api/admin/products` | Obtener todos (admin) |

### Detalles de los DTOs Backend

#### CreateProductDtoAdmin (Fase 1)
```java
@Data
public class CreateProductDtoAdmin {
    private String slug;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private UUID brandId;
    private Boolean isNewArrival;
    private Boolean isActive;
    private UUID categoryId;
    private UUID categoryTypeId;
}
```

#### ResourceRequestDTO (Fase 2)
```java
@Data
public class ResourceRequestDTO {
    private String name;
    private String url;
    private Boolean isPrimary;
    private String type;  // "IMAGE" | "VIDEO"
}
```

#### AssignDiscountsDTO (Fase 3)
```java
@Data
public class AssignDiscountsDTO {
    private List<UUID> discountIds;
}
```

---

## 📊 Modelos de Datos

### Frontend Models

```typescript
// product.model.ts

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  thumbnail?: string;
  brand: Brand;
  category: Category;
  categoryType?: CategoryType;
  resources?: ProductResource[];
  discounts?: Discount[];
  isNewArrival?: boolean;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductResource {
  id?: string;
  name: string;
  url: string;
  isPrimary: boolean;
  type: string;
}

export interface CreateProductBasicDto {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  categoryTypeId?: string;
  isNewArrival: boolean;
  isActive: boolean;
}

export interface AddProductResourcesDto {
  resources: ProductResource[];
}

export interface AssignProductDiscountsDto {
  discountIds: string[];
}
```

---

## 🎨 Uso y Ejemplos

### Ejemplo 1: Crear producto completo

```typescript
// 1. Usuario hace clic en "Crear Producto"
openCreateProductModal();

// 2. Llena el formulario de Fase 1
{
  name: "Coca Cola 500ml",
  description: "Bebida gaseosa refrescante",
  price: 3.50,
  stock: 100,
  brandId: "uuid-coca-cola",
  categoryId: "uuid-bebidas",
  isNewArrival: true,
  isActive: true
}

// 3. Se crea el producto y se abre Fase 2
// productId: "uuid-nuevo-producto"

// 4. Agrega imágenes
{
  resources: [
    { name: "Principal", url: "...", isPrimary: true, type: "IMAGE" },
    { name: "Lateral", url: "...", isPrimary: false, type: "IMAGE" }
  ]
}

// 5. Asigna descuentos en Fase 3
{
  discountIds: ["uuid-descuento-verano"]
}

// 6. ✅ Producto creado exitosamente
```

### Ejemplo 2: Omitir fases opcionales

```typescript
// 1. Crea producto básico (Fase 1)
createProductBasic(data);

// 2. Omite imágenes (Fase 2)
onSkip(); // → Abre Fase 3

// 3. Omite descuentos (Fase 3)
onSkip(); // → Finaliza

// Resultado: Producto sin imágenes ni descuentos
```

---

## 🔧 Servicios

### ProductService - Nuevos Métodos

```typescript
export class ProductService {
  
  // FASE 1
  createProductBasic(data: CreateProductBasicDto): Observable<Product> {
    return this.http.post<Product>(`${API}/admin/products`, data);
  }

  // FASE 2
  addProductResources(
    productId: string, 
    data: AddProductResourcesDto
  ): Observable<Product> {
    return this.http.post<Product>(
      `${API}/admin/products/${productId}/resources`,
      data
    );
  }

  // FASE 3
  assignProductDiscounts(
    productId: string,
    data: AssignProductDiscountsDto
  ): Observable<Product> {
    return this.http.post<Product>(
      `${API}/admin/products/${productId}/discounts`,
      data
    );
  }

  // Eliminar recurso
  deleteProductResource(
    productId: string,
    resourceId: string
  ): Observable<any> {
    return this.http.delete(
      `${API}/admin/products/${productId}/resources/${resourceId}`
    );
  }

  // Remover descuento
  removeProductDiscount(
    productId: string,
    discountId: string
  ): Observable<any> {
    return this.http.delete(
      `${API}/admin/products/${productId}/discounts/${discountId}`
    );
  }
}
```

---

## ✅ Checklist de Implementación

### Frontend
- [x] Actualizar modelos en `product.model.ts`
- [x] Crear `ProductCreatePhase1ModalComponent`
- [x] Crear `ProductCreatePhase2ModalComponent`
- [x] Crear `ProductCreatePhase3ModalComponent`
- [x] Actualizar `ProductService` con nuevos endpoints
- [x] Integrar modales en `ProductsManagementComponent`

### Backend (Requerido)
- [ ] Endpoint `POST /api/admin/products` (Fase 1)
- [ ] Endpoint `POST /api/admin/products/{id}/resources` (Fase 2)
- [ ] Endpoint `POST /api/admin/products/{id}/discounts` (Fase 3)
- [ ] Endpoint `DELETE /api/admin/products/{id}/resources/{resourceId}`
- [ ] Endpoint `DELETE /api/admin/products/{id}/discounts/{discountId}`
- [ ] Validaciones y seguridad
- [ ] Tests unitarios

---

## 🚀 Próximos Pasos

1. **Backend**: Implementar los endpoints según los DTOs definidos
2. **Validaciones**: Agregar validaciones más robustas
3. **Subida de Archivos**: Implementar subida directa de imágenes
4. **Edición por Fases**: Permitir editar cada fase independientemente
5. **Preview**: Vista previa del producto antes de publicar
6. **Drag & Drop**: Ordenar imágenes arrastrando

---

## 📞 Soporte

Para dudas o problemas con la implementación, revisar:
- Logs del navegador (F12 → Console)
- Network tab para ver requests/responses
- Documentación de Angular y RxJS

---

**Fecha de creación**: Octubre 2025  
**Versión**: 1.0.0  
**Desarrollador**: Copilot AI Assistant
