-- ============================================
-- INSERTAR SOLO LOS ROLES (AUTHORITIES)
-- Necesarios para el registro de usuarios
-- ============================================

USE tambo_bd;

-- Insertar roles USER y ADMIN
INSERT INTO `auth_authority` (`id`, `authority_name`, `description`) VALUES 
  (UNHEX('a5e8e7a1254221270400000000000000'), 'USER', 'Usuario estándar'),
  (UNHEX('d151a4a1af4ba88b5c00000000000000'), 'ADMIN', 'Administrador del sistema');

-- Verificar que se insertaron correctamente
SELECT HEX(id) as id_hex, authority_name, description FROM auth_authority;
