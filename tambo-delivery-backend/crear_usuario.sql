-- ============================================
-- CREAR USUARIO DIRECTAMENTE EN MYSQL
-- ============================================

USE tambo_bd;

-- 1. Insertar usuario
-- Password: 123456 (hash bcrypt)
INSERT INTO `auth_user_details` (
    `id`,
    `created_at`,
    `email`,
    `email_verified`,
    `full_name`,
    `password`,
    `phone_number`,
    `provider`,
    `updated_at`,
    `username`,
    `verification_code`
) VALUES (
    UUID_TO_BIN(UUID()),
    NOW(),
    'usuario@test.com',
    b'1',
    'Usuario de Prueba',
    '{bcrypt}$2a$10$N9qo8uLOickgx2ZMRZoMye3OgnG.q9vDO9bUYfXAYz/8fZLwOJv9i',
    '999888777',
    'manual',
    NOW(),
    'usuario1',
    NULL
);

-- 2. Asignar rol USER al usuario creado
INSERT INTO `auth_user_authority` (`user_id`, `authority_id`)
SELECT 
    u.id,
    a.id
FROM 
    auth_user_details u,
    auth_authority a
WHERE 
    u.username = 'usuario1'
    AND a.authority_name = 'USER';

-- 3. Verificar que se creó correctamente
SELECT 
    u.username,
    u.email,
    u.full_name,
    a.authority_name
FROM 
    auth_user_details u
    JOIN auth_user_authority ua ON u.id = ua.user_id
    JOIN auth_authority a ON ua.authority_id = a.id
WHERE 
    u.username = 'usuario1';

-- ============================================
-- CREDENCIALES DEL USUARIO CREADO:
-- Email: usuario@test.com
-- Username: usuario1
-- Password: 123456
-- ============================================
