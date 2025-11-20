# Backend Controller Reference - Product CRUD

Referencia de endpoints que deben implementarse en el backend Spring Boot para el sistema CRUD de productos en 3 fases.

## 📋 ProductAdminController.java

```java
package com.tambodelivery.backend.controller.admin;

import com.tambodelivery.backend.dto.*;
import com.tambodelivery.backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/admin/products")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class ProductAdminController {

    private final ProductService productService;

    // ==================== FASE 1: CREAR PRODUCTO BÁSICO ====================

    /**
     * FASE 1: Crear producto con información básica
     * POST /api/admin/products
     */
    @PostMapping
    public ResponseEntity<ProductDTO> createProduct(
            @Valid @RequestBody CreateProductDtoAdmin createDto
    ) {
        ProductDTO product = productService.createProductBasic(createDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(product);
    }

    // ==================== FASE 2: AGREGAR RECURSOS ====================

    /**
     * FASE 2: Agregar recursos/imágenes al producto
     * POST /api/admin/products/{productId}/resources
     */
    @PostMapping("/{productId}/resources")
    public ResponseEntity<ProductDTO> addProductResources(
            @PathVariable UUID productId,
            @Valid @RequestBody AddResourcesDTO resourcesDto
    ) {
        ProductDTO product = productService.addProductResources(productId, resourcesDto);
        return ResponseEntity.ok(product);
    }

    /**
     * Eliminar un recurso específico del producto
     * DELETE /api/admin/products/{productId}/resources/{resourceId}
     */
    @DeleteMapping("/{productId}/resources/{resourceId}")
    public ResponseEntity<Void> deleteProductResource(
            @PathVariable UUID productId,
            @PathVariable UUID resourceId
    ) {
        productService.deleteProductResource(productId, resourceId);
        return ResponseEntity.noContent().build();
    }

    // ==================== FASE 3: ASIGNAR DESCUENTOS ====================

    /**
     * FASE 3: Asignar descuentos al producto
     * POST /api/admin/products/{productId}/discounts
     */
    @PostMapping("/{productId}/discounts")
    public ResponseEntity<ProductDTO> assignDiscounts(
            @PathVariable UUID productId,
            @Valid @RequestBody AssignDiscountsDTO discountsDto
    ) {
        ProductDTO product = productService.assignProductDiscounts(productId, discountsDto);
        return ResponseEntity.ok(product);
    }

    /**
     * Remover un descuento específico del producto
     * DELETE /api/admin/products/{productId}/discounts/{discountId}
     */
    @DeleteMapping("/{productId}/discounts/{discountId}")
    public ResponseEntity<Void> removeProductDiscount(
            @PathVariable UUID productId,
            @PathVariable UUID discountId
    ) {
        productService.removeProductDiscount(productId, discountId);
        return ResponseEntity.noContent().build();
    }

    // ==================== CRUD TRADICIONAL ====================

    /**
     * Obtener todos los productos (Admin)
     * GET /api/admin/products
     */
    @GetMapping
    public ResponseEntity<List<ProductDTO>> getAllProducts() {
        List<ProductDTO> products = productService.getAllProductsAdmin();
        return ResponseEntity.ok(products);
    }

    /**
     * Obtener producto por ID
     * GET /api/admin/products/{productId}
     */
    @GetMapping("/{productId}")
    public ResponseEntity<ProductDTO> getProductById(@PathVariable UUID productId) {
        ProductDTO product = productService.getProductById(productId);
        return ResponseEntity.ok(product);
    }

    /**
     * Actualizar producto
     * PUT /api/admin/products/{productId}
     */
    @PutMapping("/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(
            @PathVariable UUID productId,
            @Valid @RequestBody UpdateProductDtoAdmin updateDto
    ) {
        ProductDTO product = productService.updateProduct(productId, updateDto);
        return ResponseEntity.ok(product);
    }

    /**
     * Eliminar producto
     * DELETE /api/admin/products/{productId}
     */
    @DeleteMapping("/{productId}")
    public ResponseEntity<Void> deleteProduct(@PathVariable UUID productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.noContent().build();
    }

    /**
     * Cambiar estado del producto (Activar/Desactivar)
     * PATCH /api/admin/products/{productId}/status
     */
    @PatchMapping("/{productId}/status")
    public ResponseEntity<ProductDTO> toggleProductStatus(@PathVariable UUID productId) {
        ProductDTO product = productService.toggleProductStatus(productId);
        return ResponseEntity.ok(product);
    }
}
```

## 📦 DTOs Requeridos

### CreateProductDtoAdmin.java
```java
package com.tambodelivery.backend.dto;

import lombok.Data;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class CreateProductDtoAdmin {
    
    @NotBlank(message = "El slug es requerido")
    @Size(max = 255, message = "El slug no puede exceder 255 caracteres")
    private String slug;
    
    @NotBlank(message = "El nombre es requerido")
    @Size(max = 255, message = "El nombre no puede exceder 255 caracteres")
    private String name;
    
    @NotBlank(message = "La descripción es requerida")
    private String description;
    
    @NotNull(message = "El precio es requerido")
    @DecimalMin(value = "0.0", inclusive = false, message = "El precio debe ser mayor a 0")
    private BigDecimal price;
    
    @NotNull(message = "El stock es requerido")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    @NotNull(message = "El ID de la marca es requerido")
    private UUID brandId;
    
    @NotNull(message = "El estado isNewArrival es requerido")
    private Boolean isNewArrival;
    
    @NotNull(message = "El estado isActive es requerido")
    private Boolean isActive;
    
    @NotNull(message = "El ID de la categoría es requerido")
    private UUID categoryId;
    
    private UUID categoryTypeId; // Opcional
}
```

### AddResourcesDTO.java
```java
package com.tambodelivery.backend.dto;

import lombok.Data;
import javax.validation.Valid;
import javax.validation.constraints.NotEmpty;
import java.util.List;

@Data
public class AddResourcesDTO {
    
    @NotEmpty(message = "Debe proporcionar al menos un recurso")
    @Valid
    private List<ResourceRequestDTO> resources;
}
```

### ResourceRequestDTO.java
```java
package com.tambodelivery.backend.dto;

import lombok.Data;
import javax.validation.constraints.*;

@Data
public class ResourceRequestDTO {
    
    @NotBlank(message = "El nombre del recurso es requerido")
    private String name;
    
    @NotBlank(message = "La URL es requerida")
    @Pattern(
        regexp = "^https?://.*",
        message = "La URL debe comenzar con http:// o https://"
    )
    private String url;
    
    @NotNull(message = "Debe especificar si es recurso principal")
    private Boolean isPrimary;
    
    @NotBlank(message = "El tipo de recurso es requerido")
    @Pattern(
        regexp = "IMAGE|VIDEO",
        message = "El tipo debe ser IMAGE o VIDEO"
    )
    private String type;
}
```

### AssignDiscountsDTO.java
```java
package com.tambodelivery.backend.dto;

import lombok.Data;
import javax.validation.constraints.NotEmpty;
import java.util.List;
import java.util.UUID;

@Data
public class AssignDiscountsDTO {
    
    @NotEmpty(message = "Debe proporcionar al menos un ID de descuento")
    private List<UUID> discountIds;
}
```

### UpdateProductDtoAdmin.java
```java
package com.tambodelivery.backend.dto;

import lombok.Data;
import javax.validation.constraints.*;
import java.math.BigDecimal;
import java.util.UUID;

@Data
public class UpdateProductDtoAdmin {
    
    @NotBlank(message = "El slug es requerido")
    private String slug;
    
    @NotBlank(message = "El nombre es requerido")
    private String name;
    
    @NotBlank(message = "La descripción es requerida")
    private String description;
    
    @NotNull(message = "El precio es requerido")
    @DecimalMin(value = "0.0", inclusive = false)
    private BigDecimal price;
    
    @NotNull(message = "El stock es requerido")
    @Min(value = 0)
    private Integer stock;
    
    @NotNull(message = "El ID de la marca es requerido")
    private UUID brandId;
    
    @NotNull
    private Boolean isNewArrival;
    
    @NotNull
    private Boolean isActive;
    
    @NotNull(message = "El ID de la categoría es requerido")
    private UUID categoryId;
    
    private UUID categoryTypeId;
}
```

## 🔧 ProductService.java (Interface)

```java
package com.tambodelivery.backend.service;

import com.tambodelivery.backend.dto.*;
import java.util.List;
import java.util.UUID;

public interface ProductService {
    
    // FASE 1
    ProductDTO createProductBasic(CreateProductDtoAdmin createDto);
    
    // FASE 2
    ProductDTO addProductResources(UUID productId, AddResourcesDTO resourcesDto);
    void deleteProductResource(UUID productId, UUID resourceId);
    
    // FASE 3
    ProductDTO assignProductDiscounts(UUID productId, AssignDiscountsDTO discountsDto);
    void removeProductDiscount(UUID productId, UUID discountId);
    
    // CRUD
    List<ProductDTO> getAllProductsAdmin();
    ProductDTO getProductById(UUID productId);
    ProductDTO updateProduct(UUID productId, UpdateProductDtoAdmin updateDto);
    void deleteProduct(UUID productId);
    ProductDTO toggleProductStatus(UUID productId);
}
```

## 🏗️ ProductServiceImpl.java (Ejemplo básico)

```java
package com.tambodelivery.backend.service.impl;

import com.tambodelivery.backend.dto.*;
import com.tambodelivery.backend.entity.*;
import com.tambodelivery.backend.repository.*;
import com.tambodelivery.backend.service.ProductService;
import com.tambodelivery.backend.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final CategoryTypeRepository categoryTypeRepository;
    private final ResourceRepository resourceRepository;
    private final DiscountRepository discountRepository;

    @Override
    public ProductDTO createProductBasic(CreateProductDtoAdmin createDto) {
        // Validar marca existe
        Brand brand = brandRepository.findById(createDto.getBrandId())
                .orElseThrow(() -> new ResourceNotFoundException("Marca no encontrada"));

        // Validar categoría existe
        Category category = categoryRepository.findById(createDto.getCategoryId())
                .orElseThrow(() -> new ResourceNotFoundException("Categoría no encontrada"));

        // Validar tipo de categoría si se proporciona
        CategoryType categoryType = null;
        if (createDto.getCategoryTypeId() != null) {
            categoryType = categoryTypeRepository.findById(createDto.getCategoryTypeId())
                    .orElseThrow(() -> new ResourceNotFoundException("Tipo de categoría no encontrado"));
        }

        // Crear producto
        Product product = Product.builder()
                .slug(createDto.getSlug())
                .name(createDto.getName())
                .description(createDto.getDescription())
                .price(createDto.getPrice())
                .stock(createDto.getStock())
                .brand(brand)
                .category(category)
                .categoryType(categoryType)
                .isNewArrival(createDto.getIsNewArrival())
                .isActive(createDto.getIsActive())
                .build();

        product = productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    public ProductDTO addProductResources(UUID productId, AddResourcesDTO resourcesDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Validar que solo haya una imagen principal
        long primaryCount = resourcesDto.getResources().stream()
                .filter(ResourceRequestDTO::getIsPrimary)
                .count();

        if (primaryCount != 1) {
            throw new IllegalArgumentException("Debe haber exactamente una imagen principal");
        }

        // Crear recursos
        List<Resources> resources = resourcesDto.getResources().stream()
                .map(dto -> Resources.builder()
                        .name(dto.getName())
                        .url(dto.getUrl())
                        .isPrimary(dto.getIsPrimary())
                        .type(dto.getType())
                        .product(product)
                        .build())
                .collect(Collectors.toList());

        resourceRepository.saveAll(resources);
        product.setResources(resources);

        return mapToDTO(product);
    }

    @Override
    public void deleteProductResource(UUID productId, UUID resourceId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        Resources resource = resourceRepository.findById(resourceId)
                .orElseThrow(() -> new ResourceNotFoundException("Recurso no encontrado"));

        if (!resource.getProduct().getId().equals(productId)) {
            throw new IllegalArgumentException("El recurso no pertenece a este producto");
        }

        resourceRepository.delete(resource);
    }

    @Override
    public ProductDTO assignProductDiscounts(UUID productId, AssignDiscountsDTO discountsDto) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        // Obtener descuentos
        List<Discount> discounts = discountRepository.findAllById(discountsDto.getDiscountIds());

        if (discounts.size() != discountsDto.getDiscountIds().size()) {
            throw new ResourceNotFoundException("Uno o más descuentos no fueron encontrados");
        }

        // Asignar descuentos al producto
        discounts.forEach(discount -> discount.getProducts().add(product));
        product.setDiscounts(discounts);

        productRepository.save(product);

        return mapToDTO(product);
    }

    @Override
    public void removeProductDiscount(UUID productId, UUID discountId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        Discount discount = discountRepository.findById(discountId)
                .orElseThrow(() -> new ResourceNotFoundException("Descuento no encontrado"));

        product.getDiscounts().remove(discount);
        discount.getProducts().remove(product);

        productRepository.save(product);
    }

    @Override
    public ProductDTO toggleProductStatus(UUID productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Producto no encontrado"));

        product.setActive(!product.isActive());
        product = productRepository.save(product);

        return mapToDTO(product);
    }

    // ... otros métodos CRUD ...

    private ProductDTO mapToDTO(Product product) {
        // Implementar mapeo de Product a ProductDTO
        // Incluir brand, category, resources, discounts, etc.
    }
}
```

## 🛡️ Exception Handling

```java
package com.tambodelivery.backend.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleResourceNotFound(ResourceNotFoundException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationExceptions(
            MethodArgumentNotValidException ex
    ) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error -> 
            errors.put(error.getField(), error.getDefaultMessage())
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(errors);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, String>> handleIllegalArgument(IllegalArgumentException ex) {
        Map<String, String> error = new HashMap<>();
        error.put("error", ex.getMessage());
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(error);
    }
}
```

## 🔒 Security Configuration

```java
// En SecurityConfig.java

@Override
protected void configure(HttpSecurity http) throws Exception {
    http
        .authorizeRequests()
            // Endpoints públicos
            .antMatchers("/api/public/**").permitAll()
            
            // Endpoints admin
            .antMatchers("/api/admin/**").hasRole("ADMIN")
            
        .and()
        .csrf().disable();
}
```

## ✅ Validaciones Importantes

1. **Fase 1**:
   - Slug único en la base de datos
   - Marca y categoría deben existir
   - Precio > 0
   - Stock >= 0

2. **Fase 2**:
   - Debe haber **exactamente 1** recurso con `isPrimary = true`
   - URLs deben ser válidas
   - Validar que el producto exista

3. **Fase 3**:
   - Descuentos deben existir y estar activos
   - Validar que el producto exista
   - Un producto puede tener múltiples descuentos

## 📊 Database Considerations

```sql
-- Asegurarse de que la tabla tiene las columnas necesarias
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_new_arrival BOOLEAN DEFAULT FALSE;
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT TRUE;

-- Índices recomendados
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_resources_product ON resources(product_id);
CREATE INDEX idx_resources_primary ON resources(is_primary);
```

## 🧪 Testing Recommendations

```java
@Test
public void testCreateProductBasic_Success() {
    // Given
    CreateProductDtoAdmin dto = new CreateProductDtoAdmin();
    dto.setName("Coca Cola");
    dto.setPrice(new BigDecimal("3.50"));
    // ... set other fields
    
    // When
    ProductDTO result = productService.createProductBasic(dto);
    
    // Then
    assertNotNull(result.getId());
    assertEquals("Coca Cola", result.getName());
}

@Test
public void testAddResources_MultiplePrimary_ThrowsException() {
    // Given
    AddResourcesDTO dto = new AddResourcesDTO();
    // Add 2 primary resources
    
    // When & Then
    assertThrows(IllegalArgumentException.class, () -> 
        productService.addProductResources(productId, dto)
    );
}
```

---

**Notas finales**:
- Todos los endpoints deben requerir autenticación JWT
- Implementar logging adecuado
- Considerar usar MapStruct para mapeo de DTOs
- Implementar tests unitarios y de integración
- Documentar con Swagger/OpenAPI
