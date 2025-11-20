# 📦 Sistema de Creación de Productos - API Única

## 🎯 Descripción General

Sistema de creación de productos en **3 fases** con interfaz de usuario separada pero **una sola petición API** al backend. Los datos se acumulan localmente y se envían de forma completa al finalizar el proceso.

---

## 🏗️ Arquitectura

```
┌─────────────────────────────────────────────────────────────┐
│                   PRODUCTS MANAGEMENT                        │
│                   (Componente Principal)                     │
└───────────────────┬─────────────────────────────────────────┘
                    │
                    │ productDraft: Partial<CreateProductCompleteDto>
                    │ (Acumulador local de datos)
                    │
        ┌───────────┴───────────┬───────────────┬──────────────┐
        │                       │               │              │
        ▼                       ▼               ▼              ▼
┌────────────────┐    ┌────────────────┐ ┌──────────────┐ ┌───────────────┐
│   FASE 1       │    │   FASE 2       │ │   FASE 3     │ │   RESUMEN     │
│ Datos Básicos  │───▶│   Imágenes     │─│  Descuentos  │─│   & Envío     │
│                │    │                │ │              │ │               │
│ Emite: Phase1  │    │ Emite: Array   │ │ Emite: IDs   │ │ POST /create  │
│ Data           │    │ ProductResource│ │ descuentos   │ │               │
└────────────────┘    └────────────────┘ └──────────────┘ └───────────────┘
```

---

## 📊 Flujo de Datos

### 1️⃣ **Fase 1: Información Básica**
```typescript
// Usuario completa formulario
{
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

// Evento emitido: phase1Completed
// productDraft = { ...datosBasicos }
```

### 2️⃣ **Fase 2: Imágenes y Recursos**
```typescript
// Usuario agrega imágenes
ProductResource[] = [
  {
    name: string;
    url: string;
    isPrimary: boolean;
    type: 'IMAGE' | 'VIDEO';
  }
]

// Evento emitido: phase2Completed
// productDraft.resources = [...recursos]
```

### 3️⃣ **Fase 3: Descuentos**
```typescript
// Usuario selecciona descuentos
discountIds: string[] = [
  'uuid-descuento-1',
  'uuid-descuento-2'
]

// Evento emitido: phase3Completed
// productDraft.discountIds = [...ids]
```

### 4️⃣ **Resumen y Confirmación**
```typescript
// Se muestra resumen completo de productDraft
// Usuario puede:
// - Volver a editar cualquier fase
// - Confirmar y enviar

// AL CONFIRMAR:
POST /api/admin/product/create
Body: {
  slug, name, description, price, stock,
  brandId, categoryId, categoryTypeId,
  resources: [...],
  discountIds: [...],
  isNewArrival, isActive
}
```

---

## 🔧 Componentes Clave

### 📄 `ProductsManagementComponent`
**Ubicación:** `src/app/features/admin/pages/products-management.component.ts`

**Responsabilidades:**
- Gestionar estado de modales
- Acumular datos en `productDraft`
- Enviar petición final API

**Propiedades Importantes:**
```typescript
productDraft: Partial<CreateProductCompleteDto> = {};
isPhase1ModalOpen = false;
isPhase2ModalOpen = false;
isPhase3ModalOpen = false;
isSummaryModalOpen = false;
isSubmitting = false;
```

**Métodos de Flujo:**
```typescript
openCreateProductModal()           // Inicia proceso
onPhase1Completed(data)            // Guarda datos fase 1
onPhase2Completed(resources)       // Guarda recursos
onPhase2Skipped()                  // Omite fase 2
onPhase3Completed(discountIds)     // Guarda descuentos
onPhase3Skipped()                  // Omite fase 3
onConfirmCreation()                // Envía POST API
onBackToEdit(phase)                // Vuelve a editar fase
```

---

### 📄 `ProductCreatePhase1ModalComponent`
**Ubicación:** `src/app/features/admin/components/product-create-phase1-modal.component.ts`

**Inputs:**
- `isOpen: boolean`
- `initialData?: ProductPhase1Data` (para edición)

**Outputs:**
- `closeModal: void`
- `phase1Completed: ProductPhase1Data`

**Funcionalidades:**
- Formulario datos básicos
- Auto-generación de slug
- Validaciones de campos requeridos
- Carga dinámica de brands, categories, categoryTypes

---

### 📄 `ProductCreatePhase2ModalComponent`
**Ubicación:** `src/app/features/admin/components/product-create-phase2-modal.component.ts`

**Inputs:**
- `isOpen: boolean`
- `initialResources?: ProductResource[]` (para edición)

**Outputs:**
- `closeModal: void`
- `phase2Completed: ProductResource[]`
- `skipPhase: void`

**Funcionalidades:**
- Gestión de imagen principal (obligatoria)
- Gestión de imágenes adicionales (opcional)
- Vista previa de imágenes
- Validación de URLs

---

### 📄 `ProductCreatePhase3ModalComponent`
**Ubicación:** `src/app/features/admin/components/product-create-phase3-modal.component.ts`

**Inputs:**
- `isOpen: boolean`
- `initialDiscountIds?: string[]` (para edición)

**Outputs:**
- `closeModal: void`
- `phase3Completed: string[]`
- `skipPhase: void`

**Funcionalidades:**
- Lista de descuentos activos
- Selección múltiple con checkboxes
- Visualización de porcentajes y fechas
- Puede omitirse completamente

---

### 📄 `ProductCreateSummaryModalComponent`
**Ubicación:** `src/app/features/products/components/product-create-summary-modal/product-create-summary-modal.component.ts`

**Inputs:**
- `isOpen: boolean`
- `productData: CreateProductCompleteDto`
- `brands: Brand[]`
- `categories: Category[]`
- `discounts: Discount[]`
- `isSubmitting: boolean`

**Outputs:**
- `closeModal: void`
- `confirmCreation: void`
- `backToEdit: 'phase1' | 'phase2' | 'phase3'`

**Secciones de Resumen:**
1. **Información Básica**: Todos los datos del producto
2. **Imágenes**: Grid con indicador de imagen principal
3. **Descuentos**: Tags con nombres de descuentos

**Acciones:**
- **Volver a Editar**: Reabre última fase visitada
- **Cancelar**: Cierra sin guardar
- **Crear Producto**: Envía petición API

---

## 🔌 ProductService

### Método Principal: `createProductComplete()`

```typescript
createProductComplete(productData: CreateProductCompleteDto): Observable<Product> {
  return this.http.post<Product>(
    `${API_ENDPOINTS.BASE_URL}${API_ENDPOINTS.ADMIN.PRODUCTS}`,
    productData
  ).pipe(
    catchError(this.handleError)
  );
}
```

**Endpoint Backend:** `POST /api/admin/product/create`

**Request Body:**
```json
{
  "slug": "coca-cola-500ml",
  "name": "Coca Cola 500ml",
  "description": "Bebida gaseosa sabor cola",
  "price": 3.50,
  "stock": 100,
  "brandId": "uuid-brand",
  "categoryId": "uuid-category",
  "categoryTypeId": "uuid-category-type",
  "resources": [
    {
      "name": "Imagen principal",
      "url": "https://example.com/coca.jpg",
      "isPrimary": true,
      "type": "IMAGE"
    }
  ],
  "discountIds": ["uuid-discount-1"],
  "isNewArrival": true,
  "isActive": true
}
```

---

## 🎨 Experiencia de Usuario

### Navegación Normal
1. Usuario hace clic en "Crear Producto"
2. Se abre **Fase 1** → Completa datos básicos → Click "Continuar"
3. Se abre **Fase 2** → Agrega imágenes → Click "Continuar" (o "Omitir")
4. Se abre **Fase 3** → Selecciona descuentos → Click "Finalizar" (o "Omitir")
5. Se abre **Resumen** → Revisa información → Click "Crear Producto"
6. ✅ Producto creado exitosamente

### Navegación con Edición
1-4. Igual que navegación normal
5. Usuario ve resumen y nota un error en el precio
6. Click "Volver a Editar" → Se reabre **Fase 3**
7. Usuario puede navegar hacia atrás a **Fase 1**
8. Corrige el precio → "Continuar" → "Continuar" → "Finalizar"
9. Ve resumen actualizado → "Crear Producto"
10. ✅ Producto creado exitosamente

---

## 🧪 Casos de Prueba

### ✅ Happy Path
```typescript
// 1. Completar las 3 fases con datos válidos
// 2. Confirmar en resumen
// RESULTADO: Producto creado con todos los datos
```

### ⏭️ Omitir Fases Opcionales
```typescript
// 1. Completar Fase 1
// 2. Omitir Fase 2 (sin imágenes)
// 3. Omitir Fase 3 (sin descuentos)
// 4. Confirmar en resumen
// RESULTADO: Producto creado solo con datos básicos
```

### 🔙 Edición en Resumen
```typescript
// 1. Completar las 3 fases
// 2. En resumen, click "Volver a Editar"
// 3. Modificar datos en Fase 1
// 4. Volver a avanzar hasta resumen
// RESULTADO: Datos actualizados en resumen
```

### ❌ Cancelación en Cualquier Fase
```typescript
// 1. Abrir cualquier fase
// 2. Click en X o "Cancelar"
// RESULTADO: Modal se cierra, datos no se guardan
```

### ⚠️ Error en Creación
```typescript
// 1. Completar todas las fases
// 2. Confirmar creación
// 3. Backend retorna error
// RESULTADO: Mensaje de error, usuario puede reintentar
```

---

## 📝 Modelos TypeScript

### `CreateProductCompleteDto`
```typescript
export interface CreateProductCompleteDto {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  categoryTypeId?: string;
  resources?: ProductResource[];
  discountIds?: string[];
  isNewArrival?: boolean;
  isActive?: boolean;
}
```

### `ProductPhase1Data`
```typescript
export interface ProductPhase1Data {
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  brandId: string;
  categoryId: string;
  categoryTypeId?: string;
  isNewArrival?: boolean;
  isActive?: boolean;
}
```

### `ProductResource`
```typescript
export interface ProductResource {
  id?: string;
  name: string;
  url: string;
  isPrimary: boolean;
  type: string; // 'IMAGE', 'VIDEO', etc.
}
```

---

## 🔐 Validaciones

### Fase 1 (Requeridas)
- ✅ Nombre del producto
- ✅ Descripción
- ✅ Precio > 0
- ✅ Stock >= 0
- ✅ Marca seleccionada
- ✅ Categoría seleccionada

### Fase 2 (Opcional, pero si se completa)
- ✅ Imagen principal con URL válida
- ✅ Nombre de imagen principal

### Fase 3 (Completamente opcional)
- No tiene validaciones obligatorias

---

## 🚀 Ventajas de Este Diseño

### ✅ **Para el Frontend**
- Menor complejidad de estado
- No hay IDs temporales
- Transacción atómica (todo o nada)
- Mejor UX con resumen final

### ✅ **Para el Backend**
- Un solo endpoint CRUD estándar
- No necesita endpoints especializados
- Transacción de base de datos única
- Más fácil de mantener y testear

### ✅ **Para el Usuario**
- Proceso guiado paso a paso
- Puede revisar todo antes de guardar
- Puede editar cualquier parte fácilmente
- No hay productos "a medias" en la BD

---

## 📞 Soporte

Si encuentras problemas o tienes preguntas:
1. Revisa el archivo `TROUBLESHOOTING-PRODUCT-CRUD.md`
2. Verifica que el backend tenga el endpoint `POST /api/admin/product/create`
3. Confirma que el DTO del backend acepte `resources` y `discountIds` como arrays

---

**Última actualización:** 28 de Octubre, 2025  
**Versión:** 2.0 (API Única)
