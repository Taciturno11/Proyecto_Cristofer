# 🎯 CRUD de Productos en 3 Fases - Guía Rápida

Sistema de gestión de productos dividido en 3 fases independientes para facilitar la creación y administración.

## 🚀 Inicio Rápido

```bash
# El sistema está listo para usar
# Solo necesitas implementar los endpoints en el backend
```

## 📦 Estructura de las Fases

```
┌─────────────────────────────────────────────────────────────┐
│                     CREAR PRODUCTO                          │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 1: Información Básica (OBLIGATORIO)                   │
├─────────────────────────────────────────────────────────────┤
│  ✓ Nombre del producto                                      │
│  ✓ Descripción                                              │
│  ✓ Precio y Stock                                           │
│  ✓ Marca                                                     │
│  ✓ Categoría y Tipo                                         │
│  ✓ Estado (Activo/Inactivo)                                │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 2: Imágenes y Recursos (OPCIONAL)                    │
├─────────────────────────────────────────────────────────────┤
│  ✓ Imagen principal (obligatoria si entra a esta fase)     │
│  ✓ Imágenes adicionales (ilimitadas)                       │
│  ✓ Vista previa en tiempo real                             │
│  ✓ Soporte para IMAGE/VIDEO                                │
│  [Omitir] [Continuar]                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────┐
│  FASE 3: Asignar Descuentos (OPCIONAL)                     │
├─────────────────────────────────────────────────────────────┤
│  ✓ Lista de descuentos activos                             │
│  ✓ Selección múltiple                                      │
│  ✓ Ver % de descuento y fechas                            │
│  ✓ Sistema aplicará el mejor descuento                     │
│  [Omitir] [Finalizar]                                       │
└─────────────────────────────────────────────────────────────┘
                              ↓
                    ✅ PRODUCTO CREADO
```

## 🎨 Componentes Creados

| Archivo | Descripción |
|---------|-------------|
| `product-create-phase1-modal.component.ts` | Modal para datos básicos |
| `product-create-phase2-modal.component.ts` | Modal para imágenes |
| `product-create-phase3-modal.component.ts` | Modal para descuentos |
| `products-management.component.ts` | Gestión principal (actualizado) |

## 🌐 Endpoints Backend Requeridos

### Fase 1: Crear Producto Básico
```http
POST /api/admin/products
Content-Type: application/json

{
  "slug": "coca-cola-500ml",
  "name": "Coca Cola 500ml",
  "description": "Bebida gaseosa refrescante",
  "price": 3.50,
  "stock": 100,
  "brandId": "uuid-marca",
  "categoryId": "uuid-categoria",
  "categoryTypeId": "uuid-tipo",
  "isNewArrival": true,
  "isActive": true
}

Response: Product con ID generado
```

### Fase 2: Agregar Recursos
```http
POST /api/admin/products/{productId}/resources
Content-Type: application/json

{
  "resources": [
    {
      "name": "Imagen principal",
      "url": "https://...",
      "isPrimary": true,
      "type": "IMAGE"
    },
    {
      "name": "Vista lateral",
      "url": "https://...",
      "isPrimary": false,
      "type": "IMAGE"
    }
  ]
}

Response: Product actualizado con recursos
```

### Fase 3: Asignar Descuentos
```http
POST /api/admin/products/{productId}/discounts
Content-Type: application/json

{
  "discountIds": [
    "uuid-descuento-1",
    "uuid-descuento-2"
  ]
}

Response: Product actualizado con descuentos
```

### Endpoints Adicionales
```http
# Eliminar recurso
DELETE /api/admin/products/{productId}/resources/{resourceId}

# Remover descuento
DELETE /api/admin/products/{productId}/discounts/{discountId}

# Actualizar producto
PUT /api/admin/products/{productId}

# Eliminar producto
DELETE /api/admin/products/{productId}
```

## 📋 DTOs Backend (Java)

### CreateProductDtoAdmin
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

### ResourceRequestDTO
```java
@Data
public class ResourceRequestDTO {
    private String name;
    private String url;
    private Boolean isPrimary;
    private String type; // "IMAGE" | "VIDEO"
}
```

### AddResourcesDTO
```java
@Data
public class AddResourcesDTO {
    private List<ResourceRequestDTO> resources;
}
```

### AssignDiscountsDTO
```java
@Data
public class AssignDiscountsDTO {
    private List<UUID> discountIds;
}
```

## 🎯 Uso en el Frontend

```typescript
// 1. Abrir modal de creación
openCreateProductModal(): void {
  this.isPhase1ModalOpen = true;
}

// 2. Completar Fase 1 → Abre Fase 2
onPhase1Completed(productId: string): void {
  this.newProductId = productId;
  this.isPhase1ModalOpen = false;
  this.isPhase2ModalOpen = true;
}

// 3. Completar Fase 2 → Abre Fase 3
onPhase2Completed(): void {
  this.isPhase2ModalOpen = false;
  this.isPhase3ModalOpen = true;
}

// 4. Completar Fase 3 → Finaliza
onPhase3Completed(): void {
  this.isPhase3ModalOpen = false;
  alert('✅ Producto creado exitosamente');
  this.loadProducts();
}
```

## ✨ Características Destacadas

- ✅ **Proceso Guiado**: El usuario es guiado paso a paso
- ✅ **Fases Opcionales**: Fase 2 y 3 pueden omitirse
- ✅ **Validaciones**: Validación en cada fase
- ✅ **Vista Previa**: Las imágenes se muestran antes de guardar
- ✅ **Feedback Visual**: Mensajes claros de éxito/error
- ✅ **Auto-generación**: El slug se genera automáticamente
- ✅ **Responsive**: Funciona en desktop y móvil
- ✅ **Reutilizable**: Los modales son independientes

## 📱 Capturas de Pantalla del Flujo

### Fase 1: Información Básica
```
┌────────────────────────────────────────────┐
│ Crear Producto - Fase 1                   │
│ Ingresa los datos principales             │
├────────────────────────────────────────────┤
│ Nombre: [________________]                 │
│ Slug: [________________]                   │
│ Descripción: [________________]            │
│ Precio: [____] Stock: [____]              │
│ Marca: [▼ Seleccionar]                    │
│ Categoría: [▼ Seleccionar]                │
│ □ Nuevo Ingreso  ☑ Activo                │
├────────────────────────────────────────────┤
│           [Cancelar] [Continuar →]        │
└────────────────────────────────────────────┘
```

### Fase 2: Imágenes
```
┌────────────────────────────────────────────┐
│ Crear Producto - Fase 2                   │
│ Agrega las imágenes del producto          │
├────────────────────────────────────────────┤
│ IMAGEN PRINCIPAL                           │
│ Nombre: [________________]                 │
│ URL: [________________]                    │
│ [Vista previa de imagen]                   │
│                                            │
│ IMÁGENES ADICIONALES    [+ Agregar]       │
│ ┌─ Imagen 1 ─────────────── [Eliminar]   │
│ │ URL: [________________]                 │
│ │ [Vista previa]                          │
│ └────────────────────────────────────────  │
├────────────────────────────────────────────┤
│           [Omitir] [Continuar →]          │
└────────────────────────────────────────────┘
```

### Fase 3: Descuentos
```
┌────────────────────────────────────────────┐
│ Crear Producto - Fase 3                   │
│ Selecciona descuentos aplicables          │
├────────────────────────────────────────────┤
│ Descuentos disponibles (2 seleccionados)  │
│                                            │
│ ☑ Descuento Verano          -15%         │
│   📅 01 Dic - 31 Mar  ● Activo          │
│                                            │
│ □ Black Friday              -30%         │
│   📅 24 Nov - 27 Nov  ● Activo          │
│                                            │
│ ☑ Promo 2x1                 -50%         │
│   📅 Todo el año  ● Activo               │
├────────────────────────────────────────────┤
│           [Omitir] [Finalizar]            │
└────────────────────────────────────────────┘
```

## 🔄 Flujo de Estados

```typescript
// Estado inicial
isPhase1ModalOpen = false;
isPhase2ModalOpen = false;
isPhase3ModalOpen = false;
newProductId = '';

// Ciclo de vida
[Click "Crear"] → Phase1Open = true
[Submit Fase 1] → productId guardado → Phase2Open = true
[Submit Fase 2] → Phase3Open = true
[Submit Fase 3] → Completado, recargar lista
```

## 🛠️ Métodos del Servicio

```typescript
// ProductService

createProductBasic(data: CreateProductBasicDto): Observable<Product>
addProductResources(id: string, data: AddProductResourcesDto): Observable<Product>
assignProductDiscounts(id: string, data: AssignProductDiscountsDto): Observable<Product>
deleteProductResource(productId: string, resourceId: string): Observable<any>
removeProductDiscount(productId: string, discountId: string): Observable<any>
```

## 📚 Documentación Completa

Ver `PRODUCT-CRUD-3-PHASES.md` para:
- Arquitectura detallada
- Diagramas de secuencia
- Ejemplos de uso
- Validaciones
- Manejo de errores
- Tests recomendados

## ⚠️ Notas Importantes

1. **Backend**: Los endpoints deben implementarse en el backend según los DTOs definidos
2. **Seguridad**: Todos los endpoints deben requerir autenticación admin
3. **Validaciones**: Validar en backend también (nunca confiar solo en frontend)
4. **Transacciones**: Considerar usar transacciones en el backend para rollback en caso de error
5. **Imágenes**: Las URLs deben ser validadas y las imágenes deben existir

## 🎓 Ejemplo Completo

```typescript
// 1. Usuario crea producto
openCreateProductModal();

// 2. Llena datos básicos
{
  name: "Coca Cola 500ml",
  price: 3.50,
  stock: 100,
  brandId: "...",
  categoryId: "..."
}
// Backend crea producto y retorna ID

// 3. Agrega imágenes
{
  resources: [
    { name: "Principal", url: "...", isPrimary: true },
    { name: "Lateral", url: "...", isPrimary: false }
  ]
}
// Backend asocia recursos al producto

// 4. Asigna descuentos
{
  discountIds: ["desc-1", "desc-2"]
}
// Backend asocia descuentos

// 5. ✅ Producto completo creado
```

## 🚀 Testing

```typescript
// Test Fase 1
it('should create product with basic data', () => {
  component.openCreateProductModal();
  expect(component.isPhase1ModalOpen).toBe(true);
});

// Test Fase 2
it('should add resources to product', () => {
  component.onPhase1Completed('product-id');
  expect(component.isPhase2ModalOpen).toBe(true);
  expect(component.newProductId).toBe('product-id');
});

// Test Fase 3
it('should assign discounts to product', () => {
  component.onPhase2Completed();
  expect(component.isPhase3ModalOpen).toBe(true);
});

// Test Complete
it('should complete product creation', () => {
  spyOn(component, 'loadProducts');
  component.onPhase3Completed();
  expect(component.loadProducts).toHaveBeenCalled();
});
```

## 📞 Soporte

Si encuentras problemas:
1. Verifica que el backend esté corriendo
2. Revisa la consola del navegador (F12)
3. Verifica el Network tab para ver requests/responses
4. Asegúrate de que los endpoints están implementados
5. Verifica la autenticación JWT

---

**¡Listo para usar!** 🎉

Solo implementa los endpoints en el backend y tendrás un sistema CRUD completo y profesional.
