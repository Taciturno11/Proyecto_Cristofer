# 🔍 Troubleshooting - Tipos de Categoría no se Guardan

## 📋 Checklist de Verificación

### ✅ Frontend (Ya implementado)

1. **Modelo Category incluye categoryTypes** ✅
   ```typescript
   export interface Category {
     id: string;
     name: string;
     description?: string;
     imageUrl?: string;
     categoryTypes?: CategoryType[]; // ✅
   }
   ```

2. **Se está enviando categoryTypes al backend** ✅
   ```typescript
   const categoryWithTypes: Category = {
     ...category,
     categoryTypes: types // ✅
   };
   ```

3. **Los logs de debugging están activos** ✅
   - Abre DevTools (F12) → Consola
   - Crea una categoría con tipos
   - Busca: `📤 Enviando al backend:`
   - Verifica que `categoryTypes` esté en el JSON

---

## 🔍 Pasos de Diagnóstico

### 1. Verificar qué envía el Frontend

**Abre la consola del navegador (F12) y crea una categoría:**

```
📤 Enviando al backend: {
  "id": "",
  "name": "Bebidas",
  "description": "Bebidas y refrescos",
  "imageUrl": "https://...",
  "categoryTypes": [                    ← ⚠️ Verifica que esto aparezca
    {
      "id": "temp-1234567890",
      "name": "Gaseosas",
      "description": "Coca-Cola..."
    }
  ]
}
```

**¿Ves `categoryTypes` en el log?**
- ✅ **SÍ** → El problema está en el backend
- ❌ **NO** → El problema está en el frontend (los tipos no se están agregando correctamente)

---

### 2. Verificar Network Request (DevTools)

**En DevTools → Network:**

1. Crea una categoría con tipos
2. Busca la petición: `POST /api/admin/categories`
3. Click en la petición → **Payload** / **Request**
4. Verifica el JSON enviado:

```json
{
  "name": "Bebidas",
  "description": "...",
  "imageUrl": "...",
  "categoryTypes": [           ← ⚠️ Debe estar aquí
    {
      "id": "temp-...",
      "name": "Gaseosas",
      "description": "..."
    }
  ]
}
```

**¿Aparece `categoryTypes` en el payload?**
- ✅ **SÍ** → Backend recibe los datos correctamente, problema en procesamiento
- ❌ **NO** → Problema en serialización del frontend

---

### 3. Verificar Response del Backend

**En la misma petición → Response:**

```json
{
  "id": "uuid-generado",
  "name": "Bebidas",
  "categoryTypes": [           ← ⚠️ El backend debe devolver esto
    {
      "id": "uuid-real",       ← ⚠️ Ya no debe ser "temp-..."
      "name": "Gaseosas"
    }
  ]
}
```

**Análisis:**
- ✅ Backend devuelve `categoryTypes` con IDs reales → **Todo funciona**
- ⚠️ Backend devuelve `categoryTypes: []` vacío → **Backend no está guardando**
- ⚠️ Backend NO devuelve `categoryTypes` → **DTO incorrecto**
- ❌ Error 400/500 → **Problema de validación/procesamiento**

---

## 🐛 Problemas Comunes en el Backend

### Problema 1: DTO no incluye categoryTypes

**❌ Incorrecto:**
```java
public class CategoryRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    // ❌ Falta categoryTypes
}
```

**✅ Correcto:**
```java
public class CategoryRequestDTO {
    private String name;
    private String description;
    private String imageUrl;
    private List<CategoryTypeDTO> categoryTypes; // ✅ Agregado

    // Getters y Setters
}

public class CategoryTypeDTO {
    private UUID id;  // Puede ser null
    private String name;
    private String description;
    
    // Getters y Setters
}
```

---

### Problema 2: Backend ignora categoryTypes

**Verifica que el servicio procese los tipos:**

```java
@Transactional
public CategoryDTO createCategoryWithTypes(CategoryRequestDTO request) {
    // 1. Crear categoría
    Category category = new Category();
    category.setName(request.getName());
    category.setDescription(request.getDescription());
    category.setImageUrl(request.getImageUrl());
    
    Category savedCategory = categoryRepository.save(category);

    // ⚠️ 2. PROCESAR LOS TIPOS - Asegúrate de que esto esté implementado
    if (request.getCategoryTypes() != null && !request.getCategoryTypes().isEmpty()) {
        List<CategoryType> types = new ArrayList<>();
        
        for (CategoryTypeDTO typeDTO : request.getCategoryTypes()) {
            CategoryType type = new CategoryType();
            type.setName(typeDTO.getName());
            type.setDescription(typeDTO.getDescription());
            type.setCategory(savedCategory); // ⚠️ Importante: Asociar con la categoría
            types.add(type);
        }
        
        categoryTypeRepository.saveAll(types); // ⚠️ Guardar los tipos
        savedCategory.setCategoryTypes(types);
    }

    return convertToDTO(savedCategory);
}
```

---

### Problema 3: Falta @JsonProperty en entidades

Si usas Jackson para serialización:

```java
public class Category {
    // ...
    
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference  // ⚠️ Importante para evitar recursión infinita
    private List<CategoryType> categoryTypes;
}

public class CategoryType {
    // ...
    
    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    @JsonBackReference  // ⚠️ Evita ciclo al serializar
    private Category category;
}
```

---

### Problema 4: CascadeType no configurado

**❌ Sin cascade:**
```java
@OneToMany(mappedBy = "category")
private List<CategoryType> categoryTypes;
```

**✅ Con cascade:**
```java
@OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
private List<CategoryType> categoryTypes;
```

Esto permite que al guardar la categoría, los tipos se guarden automáticamente.

---

### Problema 5: Validación falla silenciosamente

**Agregar logs en el backend:**

```java
@PostMapping
public ResponseEntity<CategoryDTO> createCategory(@RequestBody CategoryRequestDTO request) {
    log.info("📥 Recibiendo petición: {}", request);
    log.info("📋 Tipos recibidos: {}", request.getCategoryTypes());
    
    CategoryDTO created = categoryService.createCategoryWithTypes(request);
    
    log.info("✅ Categoría creada: {}", created);
    log.info("✅ Tipos guardados: {}", created.getCategoryTypes());
    
    return ResponseEntity.ok(created);
}
```

---

## 🧪 Test Rápido en Backend

**Usa Postman/Thunder Client:**

```bash
POST http://localhost:8080/api/admin/categories
Content-Type: application/json

{
  "name": "Test Bebidas",
  "description": "Categoría de prueba",
  "imageUrl": "https://example.com/test.jpg",
  "categoryTypes": [
    {
      "name": "Tipo 1",
      "description": "Primer tipo"
    },
    {
      "name": "Tipo 2",
      "description": "Segundo tipo"
    }
  ]
}
```

**Respuesta esperada:**
```json
{
  "id": "uuid-generado",
  "name": "Test Bebidas",
  "categoryTypes": [
    {
      "id": "uuid-tipo-1",    ← ⚠️ IDs reales generados
      "name": "Tipo 1"
    },
    {
      "id": "uuid-tipo-2",
      "name": "Tipo 2"
    }
  ]
}
```

**Verifica en la base de datos:**
```sql
-- Debe haber 1 categoría
SELECT * FROM categories WHERE name = 'Test Bebidas';

-- Debe haber 2 tipos asociados
SELECT ct.*, c.name as category_name 
FROM category_types ct
JOIN categories c ON ct.category_id = c.id
WHERE c.name = 'Test Bebidas';
```

---

## 📊 Resultado Esperado

### Base de Datos

**Tabla `categories`:**
| id | name | description | image_url |
|----|------|-------------|-----------|
| uuid-1 | Bebidas | ... | https://... |

**Tabla `category_types`:**
| id | name | description | category_id |
|----|------|-------------|-------------|
| uuid-t1 | Gaseosas | ... | uuid-1 |
| uuid-t2 | Jugos | ... | uuid-1 |

---

## ✅ Solución Paso a Paso

1. **Abre la consola del navegador (F12)**
2. **Crea una categoría con 2 tipos**
3. **Revisa los logs:**
   ```
   📤 Enviando al backend: {...}
   📋 Tipos a enviar: [...]
   ✅ Respuesta del backend: {...}
   ```

4. **Comparte conmigo:**
   - ¿Qué aparece en `📤 Enviando al backend`?
   - ¿Qué aparece en `✅ Respuesta del backend`?
   - ¿Hay algún error en la consola?

5. **Verifica en Network (DevTools):**
   - Request payload contiene `categoryTypes`?
   - Response contiene `categoryTypes` con IDs reales?
   - Status code (200, 400, 500)?

Con esta información podré identificar exactamente dónde está el problema.

---

## 🔧 Quick Fix Backend

Si confirmas que el frontend envía correctamente, pero el backend no guarda, usa este código:

```java
@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryTypeRepository categoryTypeRepository;

    @Transactional
    public CategoryDTO createCategoryWithTypes(CategoryRequestDTO request) {
        // 1. Crear y guardar categoría
        Category category = new Category();
        category.setName(request.getName());
        category.setDescription(request.getDescription());
        category.setImageUrl(request.getImageUrl());
        
        Category savedCategory = categoryRepository.save(category);
        System.out.println("✅ Categoría guardada con ID: " + savedCategory.getId());

        // 2. Crear y guardar tipos
        List<CategoryType> savedTypes = new ArrayList<>();
        
        if (request.getCategoryTypes() != null) {
            for (CategoryTypeDTO dto : request.getCategoryTypes()) {
                CategoryType type = new CategoryType();
                type.setName(dto.getName());
                type.setDescription(dto.getDescription());
                type.setCategory(savedCategory);
                
                CategoryType savedType = categoryTypeRepository.save(type);
                savedTypes.add(savedType);
                System.out.println("✅ Tipo guardado: " + savedType.getName() + " con ID: " + savedType.getId());
            }
        }
        
        savedCategory.setCategoryTypes(savedTypes);
        
        return convertToDTO(savedCategory);
    }
}
```

---

**Siguiente paso**: Ejecuta la aplicación, crea una categoría con tipos, y compárteme los logs de la consola del navegador.
