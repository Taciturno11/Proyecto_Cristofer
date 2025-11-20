-- =====================================================
-- Script de inicialización PostgreSQL para Tambo Delivery
-- Convertido desde MySQL a PostgreSQL
-- =====================================================

-- Conectarse a la base de datos (ejecutar primero si no existe)
-- CREATE DATABASE tambo_bd;
-- \c tambo_bd;

-- =====================================================
-- LIMPIAR DATOS EXISTENTES (en orden correcto por FK)
-- =====================================================
TRUNCATE TABLE product_discounts CASCADE;
TRUNCATE TABLE product_resources CASCADE;
TRUNCATE TABLE products CASCADE;
TRUNCATE TABLE discount CASCADE;
TRUNCATE TABLE product_sections CASCADE;
TRUNCATE TABLE category_type CASCADE;
TRUNCATE TABLE categories CASCADE;
TRUNCATE TABLE brands CASCADE;
TRUNCATE TABLE auth_user_authority CASCADE;
TRUNCATE TABLE auth_user_details CASCADE;
TRUNCATE TABLE auth_authority CASCADE;

-- =====================================================
-- INSERTAR DATOS - ROLES/AUTHORITIES
-- =====================================================
INSERT INTO auth_authority (id, name, description) VALUES 
('a5e8e7e1-2542-2127-8dcd-000000000001'::uuid, 'ADMIN', 'Administrador del sistema'),
('a5e8e7e1-2542-2127-8dcd-000000000002'::uuid, 'USER', 'Usuario estándar');

-- =====================================================
-- INSERTAR DATOS - USUARIOS
-- =====================================================
INSERT INTO auth_user_details (id, created_date, email, is_enabled, full_name, user_name, provider_user_id, password, phone, profile_picture_url, provider, reset_password_token, reset_token_expiry, updated_date, verification_code) 
VALUES (
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
-- INSERTAR DATOS - RELACIÓN USUARIO-ROL
-- =====================================================
INSERT INTO auth_user_authority (user_id, authority_id) VALUES 
('5d13ce79-2f40-205b-5965-540000000001'::uuid, 'a5e8e7e1-2542-2127-8dcd-000000000001'::uuid);

-- =====================================================
-- INSERTAR DATOS - MARCAS
-- =====================================================
INSERT INTO brands (id, description, image_url, name) VALUES 
('92e1bf49-d3b2-384b-6d14-000000000001'::uuid, '', 'https://www.svgrepo.com/show/489282/brand.svg', 'Marca Prueba');

-- =====================================================
-- INSERTAR DATOS - CATEGORÍAS
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
-- INSERTAR DATOS - DESCUENTOS
-- =====================================================
INSERT INTO discount (id, end_date, is_active, name, percentage, start_date) VALUES 
('792c790d-c01a-47d7-a488-68bd779465a7'::uuid, '2025-07-05 15:30:00', true, '22', 22.00, '2025-06-01 15:30:00'),
('7be3a39f-b3c6-4f94-936c-6c9c22b0f46e'::uuid, '2025-07-05 15:33:00', true, '14', 14.00, '2025-06-01 15:33:00'),
('1cf2fdc5-c442-a4b4-6344-449adb7692a0'::uuid, '2025-07-10 15:32:00', true, '11', 11.00, '2025-06-01 15:32:00'),
('85fc24ef-ee4c-7c00-0000-000000000001'::uuid, '2025-07-05 02:16:00', true, 'Descuento 16%', 16.00, '2025-06-01 02:16:00');

-- =====================================================
-- INSERTAR DATOS - SECCIONES DE PRODUCTOS
-- =====================================================
INSERT INTO product_sections (id, max_products, position, category_id) VALUES 
('29a1c4ab-c847-c8d6-0000-000000000001'::uuid, 8, 2, 'f5db846a-4aa8-0000-0000-000000000001'::uuid),
('420fecf6-56c3-4584-bfe4-41005f8e3b2e'::uuid, 8, 3, '9fb154d8-5d48-6985-6892-480471033a00'::uuid),
('4831a32a-a44a-3a00-0000-000000000001'::uuid, 8, 5, 'e668460f-86ce-4e4d-0000-000000000001'::uuid),
('5c25f0e3-5272-4c68-eedd-000000000001'::uuid, 8, 4, 'cd9b1262-a7d3-4043-0000-000000000001'::uuid),
('63fc7474-63b1-4dd9-8d5c-b9a53e41a9f9'::uuid, 8, 1, '7e8695d0-cc63-4191-9649-4965deea51dd'::uuid),
('9e5ce833-7e67-4e86-b9f2-8f3a03faccc5'::uuid, 8, 3, '096cbbf7-415c-4cb3-95c6-415c59e4e9aa'::uuid),
('f2cc6e71-7cc0-42a8-0000-000000000001'::uuid, 8, 6, '7edd93a0-4d93-8fd0-0000-000000000001'::uuid),
('82730fe9-75004-40ec-9f8f-41316c3c7700'::uuid, 8, 3, '92ba49cd-7242-4299-9ef4-4399c3a1eded'::uuid);

-- =====================================================
-- NOTA: Los productos e imágenes requieren UUIDs válidos
-- El script MySQL original tiene datos binarios corruptos
-- Se recomienda insertar productos manualmente o desde CSV
-- =====================================================

-- Para verificar que se insertaron los datos correctamente:
SELECT 'Authorities: ' || COUNT(*) FROM auth_authority;
SELECT 'Users: ' || COUNT(*) FROM auth_user_details;
SELECT 'Brands: ' || COUNT(*) FROM brands;
SELECT 'Categories: ' || COUNT(*) FROM categories;
SELECT 'Discounts: ' || COUNT(*) FROM discount;
SELECT 'Product Sections: ' || COUNT(*) FROM product_sections;
