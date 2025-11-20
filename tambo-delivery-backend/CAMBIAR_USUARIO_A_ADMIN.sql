-- ============================================
-- CAMBIAR USUARIO EXISTENTE A ADMIN
-- ============================================

-- 1. Ver usuarios actuales
SELECT email, first_name, last_name FROM auth_user_details;

-- 2. Eliminar roles actuales del usuario (si tiene)
DELETE FROM auth_user_authority 
WHERE user_id = (SELECT id FROM auth_user_details LIMIT 1);

-- 3. Asignar rol ADMIN al usuario
INSERT INTO auth_user_authority (user_id, authorities_id)
SELECT 
    u.id,
    a.id
FROM auth_user_details u
CROSS JOIN auth_authority a
WHERE a.role_code = 'ADMIN'
LIMIT 1;

-- 4. Verificar el cambio
SELECT 
    u.email,
    u.first_name,
    u.enabled,
    a.role_code
FROM auth_user_details u
LEFT JOIN auth_user_authority ua ON u.id = ua.user_id
LEFT JOIN auth_authority a ON ua.authorities_id = a.id;
