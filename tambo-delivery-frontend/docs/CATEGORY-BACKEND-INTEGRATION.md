# 🔧 Integración Backend - Categorías con Tipos

## ✅ Problemas Corregidos

### 1. **Tipos no se guardaban al crear/editar categoría**
**Problema**: El frontend solo enviaba `{name, description, imageUrl}` sin los tipos asociados.

**Solución**: Ahora el frontend envía el objeto completo `Category` que incluye:
```typescript
{
  name: string,
  description?: string,
  imageUrl?: string,
  categoryTypes: CategoryType[] // ✅ Tipos asociados
}
```

### 2. **Tipos no se cargaban al editar**
**Problema**: Al editar, `selectedCategoryTypes` se inicializaba vacío.

**Solución**: Ahora carga los tipos desde `category.categoryTypes`:
```typescript
editCategory(category: Category): void {
  this.modalMode = 'edit';
  this.selectedCategory = { ...category };
  this.selectedCategoryTypes = category.categoryTypes ? [...category.categoryTypes] : [];
  this.isModalOpen = true;
}
```

### 3. **Formulario se reseteaba al abrir modal de tipos**
**Problema**: Cada vez que se abría el modal de tipos, se perdían los datos del formulario.

**Solución**: El modal de tipos ahora se maneja en el componente padre sin afectar el formulario principal. Los datos se mantienen en `selectedCategoryTypes`.

---

## 🎯 Configuración del Backend

### Endpoints Requeridos

#### 1. **POST** `/api/admin/categories` - Crear Categoría con Tipos

**Request Body**:
```json
{
  "name": "Bebidas",
  "description": "Bebidas y refrescos",
  "imageUrl": "https://example.com/bebidas.jpg",
  "categoryTypes": [
    {
      "name": "Gaseosas",
      "description": "Bebidas gaseosas"
    },
    {
      "name": "Jugos",
      "description": "Jugos naturales"
    }
  ]
}
```

**Response**:
```json
{
  "id": "uuid-generado",
  "name": "Bebidas",
  "description": "Bebidas y refrescos",
  "imageUrl": "https://example.com/bebidas.jpg",
  "categoryTypes": [
    {
      "id": "uuid-tipo-1",
      "name": "Gaseosas",
      "description": "Bebidas gaseosas"
    },
    {
      "id": "uuid-tipo-2",
      "name": "Jugos",
      "description": "Jugos naturales"
    }
  ]
}
```

#### 2. **PUT** `/api/admin/categories/{id}` - Actualizar Categoría con Tipos

**Request Body**:
```json
{
  "id": "uuid-categoria",
  "name": "Bebidas Actualizadas",
  "description": "Nueva descripción",
  "imageUrl": "https://example.com/nuevo.jpg",
  "categoryTypes": [
    {
      "id": "uuid-existente", // Si existe, se actualiza
      "name": "Gaseosas Modificadas",
      "description": "Nueva descripción"
    },
    {
      "name": "Energéticas", // Si no tiene ID, se crea
      "description": "Bebidas energéticas"
    }
  ]
}
```

**Lógica Backend**:
1. Actualizar datos de la categoría
2. Para cada tipo en `categoryTypes`:
   - Si tiene `id`: buscar y actualizar el tipo existente
   - Si NO tiene `id` (o tiene `id` con prefijo `temp-`): crear nuevo tipo
3. Eliminar tipos que estaban asociados pero ya no están en la lista

**Response**: Igual que POST

#### 3. **GET** `/api/categories` - Listar Categorías

**Response**:
```json
[
  {
    "id": "uuid-1",
    "name": "Bebidas",
    "description": "Bebidas y refrescos",
    "imageUrl": "https://example.com/bebidas.jpg",
    "categoryTypes": [
      {
        "id": "uuid-tipo-1",
        "name": "Gaseosas",
        "description": "Bebidas gaseosas"
      }
    ]
  }
]
```

---

## 💾 Implementación Backend Sugerida (Spring Boot)

### 1. CategoryController

```java
@RestController
@RequestMapping("/api/admin/categories")
public class CategoryController {

    @Autowired
    private CategoryService categoryService;

    @PostMapping
    public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryRequestDTO request) {
        CategoryDTO created = categoryService.createCategoryWithTypes(request);
        return ResponseEntity.ok(created);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(
            @PathVariable UUID id,
            @RequestBody CategoryRequestDTO request) {
        CategoryDTO updated = categoryService.updateCategoryWithTypes(id, request);
        return ResponseEntity.ok(updated);
    }

    @GetMapping
    public ResponseEntity<List<CategoryDTO>> getAllCategories() {
        List<CategoryDTO> categories = categoryService.getAllCategoriesWithTypes();
        return ResponseEntity.ok(categories);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable UUID id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }
}
```

### 2. CategoryService

```java
@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    @Transactional
    public CategoryDTO createCategoryWithTypes(CategoryRequestDTO request) {
        // 1. Crear la categoría
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        
        Category savedCategory = categoryRepository.save(category);

        // 2. Crear los tipos asociados si existen
        if (request.getCategoryTypes() != null && !request.getCategoryTypes().isEmpty()) {
            List<CategoryType> types = request.getCategoryTypes().stream()
                .map(typeDTO -> {
                    CategoryType type = new CategoryType();
                    type.setName(typeDTO.getName());
                    type.setDescription(typeDTO.getDescription());
                    type.setCategory(savedCategory);
                    return type;
                })
                .collect(Collectors.toList());
            
            categoryTypeRepository.saveAll(types);
            savedCategory.setCategoryTypes(types);
        }

        return convertToDTO(savedCategory);
    }

    @Transactional
    public CategoryDTO updateCategoryWithTypes(UUID categoryId, CategoryRequestDTO request) {
        // 1. Buscar la categoría
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        // 2. Actualizar datos básicos
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());

        // 3. Manejar tipos asociados
        if (request.getCategoryTypes() != null) {
            // Obtener IDs de tipos existentes
            List<UUID> existingTypeIds = category.getCategoryTypes().stream()
                .map(CategoryType::getId)
                .collect(Collectors.toList());

            // IDs de tipos en el request
            List<UUID> requestTypeIds = request.getCategoryTypes().stream()
                .map(CategoryTypeDTO::getId)
                .filter(Objects::nonNull)
                .collect(Collectors.toList());

            // Eliminar tipos que ya no están en el request
            List<CategoryType> typesToDelete = category.getCategoryTypes().stream()
                .filter(type -> !requestTypeIds.contains(type.getId()))
                .collect(Collectors.toList());
            categoryTypeRepository.deleteAll(typesToDelete);

            // Actualizar o crear tipos
            for (CategoryTypeDTO typeDTO : request.getCategoryTypes()) {
                if (typeDTO.getId() != null && !typeDTO.getId().toString().startsWith("temp-")) {
                    // Actualizar tipo existente
                    CategoryType existingType = categoryTypeRepository.findById(typeDTO.getId())
                        .orElseThrow(() -> new ResourceNotFoundException("Tipo no encontrado"));
                    existingType.setName(typeDTO.getName());
                    existingType.setDescription(typeDTO.getDescription());
                    categoryTypeRepository.save(existingType);
                } else {
                    // Crear nuevo tipo
                    CategoryType newType = new CategoryType();
                    newType.setName(typeDTO.getName());
                    newType.setDescription(typeDTO.getDescription());
                    newType.setCategory(category);
                    categoryTypeRepository.save(newType);
                }
            }
        }

        Category savedCategory = categoryRepository.save(category);
        return convertToDTO(savedCategory);
    }

    public List<CategoryDTO> getAllCategoriesWithTypes() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    @Transactional
    public void deleteCategory(UUID categoryId) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));
        
        // Los tipos se eliminarán automáticamente por CascadeType.ALL y orphanRemoval=true
        categoryRepository.delete(category);
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setId(category.getId());
        dto.setName(category.getName());
        dto.setDescription(category.getDescription());
        dto.setImageUrl(category.getImageUrl());
        
        if (category.getCategoryTypes() != null) {
            List<CategoryTypeDTO> typeDTOs = category.getCategoryTypes().stream()
                .map(type -> {
                    CategoryTypeDTO typeDTO = new CategoryTypeDTO();
                    typeDTO.setId(type.getId());
                    typeDTO.setName(type.getName());
                    typeDTO.setDescription(type.getDescription());
                    return typeDTO;
                })
                .collect(Collectors.toList());
            dto.setCategoryTypes(typeDTOs);
        }
        
        return dto;
    }
}
```

### 3. Actualizar DTOs

```java
public class CategoryRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private List<CategoryTypeDTO> categoryTypes; // ✅ Agregado

    // Getters y Setters
}

public class CategoryTypeDTO {
    private UUID id; // ✅ Puede ser null para tipos nuevos
    private String name;
    private String description;

    // Getters y Setters
}
```

---

## 🧪 Pruebas

### Crear Categoría con Tipos

```bash
curl -X POST http://localhost:8080/api/admin/categories \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bebidas",
    "description": "Bebidas y refrescos",
    "imageUrl": "https://example.com/bebidas.jpg",
    "categoryTypes": [
      {"name": "Gaseosas", "description": "Coca-Cola, Inca Kola, etc."},
      {"name": "Jugos", "description": "Jugos naturales"}
    ]
  }'
```

### Actualizar Categoría (Agregar tipo nuevo)

```bash
curl -X PUT http://localhost:8080/api/admin/categories/{uuid} \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Bebidas",
    "description": "Bebidas y refrescos",
    "imageUrl": "https://example.com/bebidas.jpg",
    "categoryTypes": [
      {"id": "uuid-existente", "name": "Gaseosas", "description": "Actualizado"},
      {"name": "Energéticas", "description": "Nuevo tipo"}
    ]
  }'
```

---

## 📋 Checklist de Implementación

### Frontend ✅
- [x] Modelo `Category` con `categoryTypes`
- [x] Modelo `CategoryType` actualizado
- [x] Modal de categoría con columna de tipos
- [x] Modal secundario para tipos
- [x] Gestión de estado de tipos (`selectedCategoryTypes`)
- [x] Envío de tipos al backend en create/update
- [x] Carga de tipos al editar categoría
- [x] ProductService actualizado

### Backend ⏳
- [ ] Actualizar `CategoryRequestDTO` para incluir `categoryTypes`
- [ ] Implementar `createCategoryWithTypes()` en el servicio
- [ ] Implementar `updateCategoryWithTypes()` en el servicio
- [ ] Lógica para crear tipos nuevos
- [ ] Lógica para actualizar tipos existentes
- [ ] Lógica para eliminar tipos removidos
- [ ] Endpoint GET devuelve categorías con sus tipos
- [ ] Validación de datos (nombres únicos, etc.)
- [ ] Manejo de errores

---

## 🎯 Comportamiento Esperado

### Crear Categoría
1. Usuario llena información general
2. Usuario agrega tipos (genera IDs temporales: `temp-1234567890`)
3. Usuario hace click en "Crear Categoría"
4. Frontend envía `{category, categoryTypes}` al backend
5. Backend crea la categoría y sus tipos asociados
6. Backend devuelve la categoría con IDs reales para los tipos

### Editar Categoría
1. Usuario abre modal de edición
2. Frontend carga categoría con `categoryTypes` existentes
3. Usuario modifica tipos:
   - Editar tipo → Mantiene el `id` original
   - Agregar tipo → `id` temporal
   - Eliminar tipo → Se remueve del array
4. Usuario guarda
5. Backend:
   - Actualiza tipos con `id` real
   - Crea tipos con `id` temporal
   - Elimina tipos que ya no están en el array

---

**Última actualización**: Hoy
**Estado Frontend**: ✅ Completado
**Estado Backend**: ⏳ Pendiente de implementación
