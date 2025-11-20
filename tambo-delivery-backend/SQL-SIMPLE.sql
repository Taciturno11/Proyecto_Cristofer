-- =====================================================
-- SCRIPT SQL SIMPLE - Solo lo Esencial
-- Para ejecutar en pgAdmin4
-- =====================================================
-- IMPORTANTE: Ejecuta esto DESPUÉS de iniciar el backend
-- (para que Spring Boot ya haya creado las tablas)
-- =====================================================

-- 1. Crear roles
INSERT INTO auth_authority (id, name, description) VALUES 
(gen_random_uuid(), 'ADMIN', 'Administrador del sistema'),
(gen_random_uuid(), 'USER', 'Usuario estándar');

-- 2. Crear usuario admin
-- Email: admin@gmail.com
-- Password: admin123
INSERT INTO auth_user_details (
    id, email, is_enabled, full_name, user_name, 
    password, phone, provider, created_date, updated_date
) VALUES (
    gen_random_uuid(),
    'admin@gmail.com',
    true,
    'Administrador',
    'admin',
    '{bcrypt}$2a$10$y6NyXMmvdlLb4JDEx5yZLO8pHzwd4t.WBVNcgEJD8tNVubGjh4Jf6',
    '987654321',
    'manual',
    NOW(),
    NOW()
);

-- 3. Asignar rol ADMIN al usuario
INSERT INTO auth_user_authority (user_id, authority_id)
SELECT u.id, a.id 
FROM auth_user_details u, auth_authority a
WHERE u.email = 'admin@gmail.com' AND a.name = 'ADMIN';

-- 4. Crear categorías de ejemplo
INSERT INTO categories (id, name, description, image_url) VALUES 
(gen_random_uuid(), 'Bebidas', 'Refrescos, jugos y más', 'https://tofuu.getjusto.com/orioneat-local/resized2/8coyEW7LbBscZofe3-300-x.webp'),
(gen_random_uuid(), 'Comidas', 'Alimentos listos para consumir', 'https://tofuu.getjusto.com/orioneat-local/resized2/KRjPLJhsYR9cFfAQF-300-x.webp'),
(gen_random_uuid(), 'Antojos', 'Snacks y dulces', 'https://tofuu.getjusto.com/orioneat-local/resized2/6k43obvgrNS4RaP7j-300-x.webp'),
(gen_random_uuid(), 'Helados', 'Postres congelados', 'https://tofuu.getjusto.com/orioneat-local/resized2/62N55QNnPgEu45g6z-300-x.webp');

-- 5. Crear marca de ejemplo
INSERT INTO brands (id, name, description, image_url) VALUES 
(gen_random_uuid(), 'Genérica', 'Marca por defecto', 'https://www.svgrepo.com/show/489282/brand.svg');

-- =====================================================
-- ✅ LISTO - Ya tienes:
-- - 2 Roles (ADMIN, USER)
-- - 1 Usuario admin (admin@gmail.com / admin123)
-- - 4 Categorías
-- - 1 Marca
-- =====================================================

-- Verificar:
SELECT 'Roles:' as tabla, COUNT(*) as total FROM auth_authority
UNION ALL
SELECT 'Usuarios:', COUNT(*) FROM auth_user_details
UNION ALL
SELECT 'Categorías:', COUNT(*) FROM categories
UNION ALL
SELECT 'Marcas:', COUNT(*) FROM brands;
