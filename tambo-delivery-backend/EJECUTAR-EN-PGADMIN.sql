-- =====================================================
-- SCRIPT PARA EJECUTAR EN pgAdmin4
-- Tambo Delivery - PostgreSQL
-- =====================================================
-- INSTRUCCIONES:
-- 1. Abre pgAdmin4
-- 2. Conéctate a tu servidor PostgreSQL
-- 3. Selecciona la base de datos "tambo_bd"
-- 4. Abre Query Tool (botón "Query Tool" o click derecho > Query Tool)
-- 5. Copia y pega TODO este script
-- 6. Presiona F5 o el botón "Execute/Refresh" (▶)
-- =====================================================

-- =====================================================
-- PASO 1: LIMPIAR DATOS EXISTENTES
-- =====================================================
TRUNCATE TABLE IF EXISTS product_discounts CASCADE;
TRUNCATE TABLE IF EXISTS product_resources CASCADE;
TRUNCATE TABLE IF EXISTS products CASCADE;
TRUNCATE TABLE IF EXISTS discount CASCADE;
TRUNCATE TABLE IF EXISTS product_sections CASCADE;
TRUNCATE TABLE IF EXISTS category_type CASCADE;
TRUNCATE TABLE IF EXISTS categories CASCADE;
TRUNCATE TABLE IF EXISTS brands CASCADE;
TRUNCATE TABLE IF EXISTS auth_user_authority CASCADE;
TRUNCATE TABLE IF EXISTS auth_user_details CASCADE;
TRUNCATE TABLE IF EXISTS auth_authority CASCADE;

-- =====================================================
-- PASO 2: INSERTAR ROLES (ADMIN y USER)
-- =====================================================
INSERT INTO auth_authority (id, name, description) VALUES 
('a5e8e7e1-2542-2127-8dcd-000000000001'::uuid, 'ADMIN', 'Administrador del sistema'),
('a5e8e7e1-2542-2127-8dcd-000000000002'::uuid, 'USER', 'Usuario estándar');

-- =====================================================
-- PASO 3: INSERTAR USUARIO ADMINISTRADOR
-- =====================================================
-- Email: admin@gmail.com
-- Contraseña: admin123 (hash bcrypt)
-- Código de verificación: 874585
INSERT INTO auth_user_details (
    id, 
    created_date, 
    email, 
    is_enabled, 
    full_name, 
    user_name, 
    provider_user_id, 
    password, 
    phone, 
    profile_picture_url, 
    provider, 
    reset_password_token, 
    reset_token_expiry, 
    updated_date, 
    verification_code
) VALUES (
    '5d13ce79-2f40-205b-5965-540000000001'::uuid,
    '2025-07-07 17:48:21.289',
    'admin@gmail.com',
    true,
    'Administrador',
    'admin',
    NULL,
    '{bcrypt}$2a$10$y6NyXMmvdlLb4JDEx5yZLO8pHzwd4t.WBVNcgEJD8tNVubGjh4Jf6',
    '987654321',
    NULL,
    'manual',
    NULL,
    NULL,
    '2025-07-07 17:50:16.892',
    '874585'
);

-- =====================================================
-- PASO 4: ASIGNAR ROL ADMIN AL USUARIO
-- =====================================================
INSERT INTO auth_user_authority (user_id, authority_id) VALUES 
('5d13ce79-2f40-205b-5965-540000000001'::uuid, 'a5e8e7e1-2542-2127-8dcd-000000000001'::uuid);

-- =====================================================
-- PASO 5: INSERTAR MARCA DE EJEMPLO
-- =====================================================
INSERT INTO brands (id, description, image_url, name) VALUES 
('92e1bf49-d3b2-384b-6d14-000000000001'::uuid, '', 'https://www.svgrepo.com/show/489282/brand.svg', 'Marca Prueba');

-- =====================================================
-- PASO 6: INSERTAR CATEGORÍAS
-- =====================================================
INSERT INTO categories (id, description, image_url, name) VALUES 
('096cbbf7-415c-4cb3-95c6-415c59e4e9aa'::uuid, 'Satisface deseos repentinos y específicos de alimentos, tanto dulces como salados', 'https://tofuu.getjusto.com/orioneat-local/resized2/6k43obvgrNS4RaP7j-300-x.webp', 'Antojos'),
('9fb154d8-5d48-6985-6892-480471033a00'::uuid, 'Postres congelados, hechos generalmente a base de leche o agua, endulzados y saborizados con ingredientes como frutas, chocolate o vainilla', 'https://tofuu.getjusto.com/orioneat-local/resized2/62N55QNnPgEu45g6z-300-x.webp', 'Helados'),
('7e8695d0-cc63-4191-9649-4965deea51dd'::uuid, 'Todos los líquidos consumibles que pueden ser naturales o artificiales, como agua, refrescos y jugos', 'https://tofuu.getjusto.com/orioneat-local/resized2/8coyEW7LbBscZofe3-300-x.webp', 'Bebidas'),
('7edd93a0-4d93-8fd0-0000-000000000001'::uuid, 'Bebida alcohólica, no destilada, de sabor amargo, que se fabrica con granos de cebada germinados u otros cereales', 'https://tofuu.getjusto.com/orioneat-local/resized2/BtyHGt48sAwsmuqno-300-x.webp', 'Cervezas'),
('92ba49cd-7242-4299-9ef4-4399c3a1eded'::uuid, 'Productos para la despensa o reservas del hogar', 'https://tofuu.getjusto.com/orioneat-local/resized2/ZLMEGkLj3oYEwNDqQ-300-x.webp', 'Despensa'),
('cd9b1262-a7d3-4043-0000-000000000001'::uuid, 'Cualquier bebida, con o sin alcohol, que viene premezclada y está lista para consumir directamente de su envase', 'https://tofuu.getjusto.com/orioneat-local/resized2/9XuXRYFA8NPj2gj55-300-x.webp', 'RTDs'),
('f5db846a-4aa8-0000-0000-000000000001'::uuid, 'Alimentos preparados para consumir al instante', 'https://tofuu.getjusto.com/orioneat-local/resized2/KRjPLJhsYR9cFfAQF-300-x.webp', 'Comidas'),
('e668460f-86ce-4e4d-0000-000000000001'::uuid, 'Productos ideales para personas fumadoras', 'https://tofuu.getjusto.com/orioneat-local/resized2/BbkePtKQWcEHsf5oz-300-x.webp', 'Cigarros y Vapes');

-- =====================================================
-- PASO 7: INSERTAR DESCUENTOS
-- =====================================================
INSERT INTO discount (id, end_date, is_active, name, percentage, start_date) VALUES 
('792c790d-c01a-47d7-a488-68bd779465a7'::uuid, '2025-12-31 23:59:59', true, 'Descuento 22%', 22.00, '2025-06-01 00:00:00'),
('7be3a39f-b3c6-4f94-936c-6c9c22b0f46e'::uuid, '2025-12-31 23:59:59', true, 'Descuento 14%', 14.00, '2025-06-01 00:00:00'),
('1cf2fdc5-c442-a4b4-6344-449adb7692a0'::uuid, '2025-12-31 23:59:59', true, 'Descuento 11%', 11.00, '2025-06-01 00:00:00'),
('85fc24ef-ee4c-7c00-0000-000000000001'::uuid, '2025-12-31 23:59:59', true, 'Descuento 16%', 16.00, '2025-06-01 00:00:00');

-- =====================================================
-- PASO 8: INSERTAR SECCIONES DE PRODUCTOS
-- =====================================================
INSERT INTO product_sections (id, max_products, position, category_id) VALUES 
('29a1c4ab-c847-c8d6-0000-000000000001'::uuid, 8, 2, 'f5db846a-4aa8-0000-0000-000000000001'::uuid),
('420fecf6-56c3-4584-bfe4-41005f8e3b2e'::uuid, 8, 3, '9fb154d8-5d48-6985-6892-480471033a00'::uuid),
('4831a32a-a44a-3a00-0000-000000000001'::uuid, 8, 5, 'e668460f-86ce-4e4d-0000-000000000001'::uuid),
('5c25f0e3-5272-4c68-eedd-000000000001'::uuid, 8, 4, 'cd9b1262-a7d3-4043-0000-000000000001'::uuid),
('63fc7474-63b1-4dd9-8d5c-b9a53e41a9f9'::uuid, 8, 1, '7e8695d0-cc63-4191-9649-4965deea51dd'::uuid),
('9e5ce833-7e67-4e86-b9f2-8f3a03faccc5'::uuid, 8, 3, '096cbbf7-415c-4cb3-95c6-415c59e4e9aa'::uuid),
('f2cc6e71-7cc0-42a8-0000-000000000001'::uuid, 8, 6, '7edd93a0-4d93-8fd0-0000-000000000001'::uuid),
('82730fe9-7500-40ec-9f8f-41316c3c7700'::uuid, 8, 7, '92ba49cd-7242-4299-9ef4-4399c3a1eded'::uuid);

-- =====================================================
-- PASO 9: VERIFICAR DATOS INSERTADOS
-- =====================================================
SELECT '✅ Roles insertados:' as info, COUNT(*) as total FROM auth_authority
UNION ALL
SELECT '✅ Usuarios insertados:', COUNT(*) FROM auth_user_details
UNION ALL
SELECT '✅ Marcas insertadas:', COUNT(*) FROM brands
UNION ALL
SELECT '✅ Categorías insertadas:', COUNT(*) FROM categories
UNION ALL
SELECT '✅ Descuentos insertados:', COUNT(*) FROM discount
UNION ALL
SELECT '✅ Secciones de productos:', COUNT(*) FROM product_sections;

-- =====================================================
-- ✅ SCRIPT COMPLETADO
-- =====================================================
-- Datos iniciales insertados correctamente
-- 
-- 👤 USUARIO ADMINISTRADOR:
--    Email: admin@gmail.com
--    Contraseña: admin123
--    Código verificación: 874585
--
-- 📝 PRÓXIMOS PASOS:
--    1. Configurar archivo .env con tus credenciales
--    2. Iniciar el backend con: ./mvnw.cmd spring-boot:run
--    3. Los productos se pueden agregar desde el panel admin
-- =====================================================
