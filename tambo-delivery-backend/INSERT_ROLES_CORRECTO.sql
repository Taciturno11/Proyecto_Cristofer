-- ============================================
-- INSERTAR ROLES - ESTRUCTURA REAL DE POSTGRESQL
-- Columnas: id, role_code, role_description
-- ============================================

USE tambo_bd;

-- Insertar roles (si ya existen, dará error y lo ignoramos)
INSERT IGNORE INTO `auth_authority` (`id`, `role_code`, `role_description`) VALUES 
  (UNHEX(REPLACE('ded1ba32-00d6-4ecd-a3b5-9aa57d45d389', '-', '')), 'ADMIN', 'Administrador del sistema'),
  (UNHEX(REPLACE('19c48591-ee51-4082-9a3b-a043a547caa6', '-', '')), 'USER', 'Usuario estándar');

-- Verificar
SELECT HEX(id) as id_hex, role_code, role_description FROM auth_authority;
