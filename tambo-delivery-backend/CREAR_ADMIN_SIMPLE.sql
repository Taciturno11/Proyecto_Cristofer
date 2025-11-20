-- ========================================
-- CREAR USUARIO ADMIN DE FORMA SIMPLE
-- ========================================
-- Este script crea un usuario admin directamente con UUIDs generados automáticamente

-- 1. Eliminar usuario admin si existe
DELETE FROM auth_user_authority 
WHERE user_id = (SELECT id FROM auth_user_details WHERE email = 'admin@tambo.com');

DELETE FROM auth_user_details WHERE email = 'admin@tambo.com';

-- 2. Insertar usuario admin con UUID generado
-- Password: admin123 (hash bcrypt con prefijo {bcrypt})
INSERT INTO auth_user_details (
    id,
    created_on,
    email,
    enabled,
    first_name,
    last_name,
    password,
    phone_number,
    profile_image_url,
    provider,
    updated_on
) VALUES (
    UNHEX(REPLACE(UUID(), '-', '')),  -- Genera UUID automáticamente
    NOW(),
    'admin@tambo.com',
    b'1',  -- enabled = true
    'Admin',
    'Tambo',
    '{bcrypt}$2a$10$y6NyXMmvdlLb4JDEx5yZLO8pHzwd4t.WBVNcgEJD8tNVubGjh4Jf6',  -- Password: admin123
    '999999999',
    NULL,
    'local',
    NOW()
);

-- 3. Asignar rol ADMIN
INSERT INTO auth_user_authority (user_id, authorities_id)
SELECT 
    u.id,
    a.id
FROM auth_user_details u
CROSS JOIN auth_authority a
WHERE u.email = 'admin@tambo.com' 
  AND a.role_code = 'ADMIN';

-- 4. Verificar que se creó correctamente
SELECT 
    u.email,
    u.first_name,
    u.enabled,
    LEFT(u.password, 10) as password_prefix,
    LENGTH(u.password) as password_length,
    a.role_code
FROM auth_user_details u
LEFT JOIN auth_user_authority ua ON u.id = ua.user_id
LEFT JOIN auth_authority a ON ua.authorities_id = a.id
WHERE u.email = 'admin@tambo.com';
