-- ============================================
-- SCRIPT COMPLETO PARA MYSQL WORKBENCH
-- Base de datos: tambo_bd
-- ============================================

-- Crear la base de datos
DROP DATABASE IF EXISTS `tambo_bd`;
CREATE DATABASE `tambo_bd` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tambo_bd`;

-- ============================================
-- CREAR TODAS LAS TABLAS
-- ============================================

-- Tabla: auth_authority
CREATE TABLE `auth_authority` (
  `id` BINARY(16) NOT NULL,
  `authority_name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_authority_name` (`authority_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: auth_user_details
CREATE TABLE `auth_user_details` (
  `id` BINARY(16) NOT NULL,
  `created_at` DATETIME(6) DEFAULT NULL,
  `email` VARCHAR(255) NOT NULL,
  `email_verified` BIT(1) DEFAULT b'0',
  `full_name` VARCHAR(255) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `password_reset_token` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(20) DEFAULT NULL,
  `provider` VARCHAR(50) DEFAULT 'manual',
  `provider_id` VARCHAR(255) DEFAULT NULL,
  `updated_at` DATETIME(6) DEFAULT NULL,
  `username` VARCHAR(50) NOT NULL,
  `verification_code` VARCHAR(6) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_email` (`email`),
  UNIQUE KEY `UK_username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: auth_user_authority
CREATE TABLE `auth_user_authority` (
  `user_id` BINARY(16) NOT NULL,
  `authority_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_id`, `authority_id`),
  KEY `FK_authority` (`authority_id`),
  CONSTRAINT `FK_user_authority_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_authority_authority` FOREIGN KEY (`authority_id`) REFERENCES `auth_authority` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: brands
CREATE TABLE `brands` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: categories
CREATE TABLE `categories` (
  `id` BINARY(16) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: category_type
CREATE TABLE `category_type` (
  `id` BINARY(16) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  `category_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_type_category` (`category_id`),
  CONSTRAINT `FK_category_type_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: discount
CREATE TABLE `discount` (
  `id` BINARY(16) NOT NULL,
  `end_date` DATETIME(6) DEFAULT NULL,
  `is_active` BIT(1) DEFAULT b'1',
  `name` VARCHAR(100) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `start_date` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: products
CREATE TABLE `products` (
  `id` BINARY(16) NOT NULL,
  `created_at` DATETIME(6) DEFAULT NULL,
  `description` TEXT,
  `is_popular` BIT(1) DEFAULT b'0',
  `is_visible` BIT(1) DEFAULT b'1',
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `product_section_id` BINARY(16) DEFAULT NULL,
  `sku` VARCHAR(50) NOT NULL,
  `stock` INT NOT NULL DEFAULT 0,
  `updated_at` DATETIME(6) DEFAULT NULL,
  `brand_id` BINARY(16) DEFAULT NULL,
  `category_id` BINARY(16) DEFAULT NULL,
  `category_type_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_sku` (`sku`),
  KEY `FK_product_brand` (`brand_id`),
  KEY `FK_product_category` (`category_id`),
  KEY `FK_product_category_type` (`category_type_id`),
  CONSTRAINT `FK_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_product_category_type` FOREIGN KEY (`category_type_id`) REFERENCES `category_type` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: product_sections
CREATE TABLE `product_sections` (
  `id` BINARY(16) NOT NULL,
  `product_limit` INT DEFAULT 8,
  `section_order` INT DEFAULT 1,
  `category_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_product_section_category` (`category_id`),
  CONSTRAINT `FK_product_section_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: product_discounts (relación muchos a muchos)
CREATE TABLE `product_discounts` (
  `discount_id` BINARY(16) NOT NULL,
  `product_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`discount_id`, `product_id`),
  KEY `FK_product_discount_product` (`product_id`),
  CONSTRAINT `FK_product_discount_discount` FOREIGN KEY (`discount_id`) REFERENCES `discount` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_product_discount_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: product_resources
CREATE TABLE `product_resources` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `file_name` VARCHAR(255) DEFAULT NULL,
  `file_type` VARCHAR(50) DEFAULT NULL,
  `resource_url` VARCHAR(500) NOT NULL,
  `product_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_resource_product` (`product_id`),
  CONSTRAINT `FK_resource_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: orders
CREATE TABLE `orders` (
  `id` BINARY(16) NOT NULL,
  `created_at` DATETIME(6) DEFAULT CURRENT_TIMESTAMP(6),
  `delivery_address` VARCHAR(500) DEFAULT NULL,
  `delivery_cost` DECIMAL(10,2) DEFAULT 0.00,
  `delivery_latitude` DOUBLE DEFAULT NULL,
  `delivery_longitude` DOUBLE DEFAULT NULL,
  `discount_amount` DECIMAL(10,2) DEFAULT 0.00,
  `order_date` DATETIME(6) DEFAULT NULL,
  `order_status` VARCHAR(50) DEFAULT 'PENDING',
  `payment_method` VARCHAR(50) DEFAULT NULL,
  `shipment_number` VARCHAR(100) DEFAULT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL,
  `total` DECIMAL(10,2) NOT NULL,
  `updated_at` DATETIME(6) DEFAULT NULL,
  `user_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_order_user` (`user_id`),
  CONSTRAINT `FK_order_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Tabla: order_items
CREATE TABLE `order_items` (
  `id` BINARY(16) NOT NULL,
  `item_price` DOUBLE DEFAULT NULL,
  `quantity` INT NOT NULL,
  `order_id` BINARY(16) DEFAULT NULL,
  `product_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_order_item_order` (`order_id`),
  KEY `FK_order_item_product` (`product_id`),
  CONSTRAINT `FK_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTAR DATOS INICIALES
-- ============================================

-- Insertar autoridades (roles)
INSERT INTO `auth_authority` VALUES 
  (UNHEX(REPLACE('a5e8e7a12542212704', '-', '')), 'USER', 'Usuario estándar'),
  (UNHEX(REPLACE('d151a4a1af4ba88b5c', '-', '')), 'ADMIN', 'Administrador del sistema');

-- Insertar usuario administrador
-- Password: admin123 (bcrypt hash)
INSERT INTO `auth_user_details` VALUES 
  (UNHEX(REPLACE('5dce792f40205b5965541f', '-', '')),
   '2025-07-07 17:48:21.289000',
   'admin@gmail.com',
   b'1',
   'Administrador',
   '{bcrypt}$2a$10$y6NyXMmvdlLb4JDEx5yZLO8pHzwd4t.WBVNcgEJD8tNVubGjh4Jf6',
   NULL,
   '987654321',
   'manual',
   NULL,
   '2025-07-07 17:50:16.892000',
   'admin',
   '874585');

-- Asignar rol ADMIN al usuario admin
INSERT INTO `auth_user_authority` VALUES 
  (UNHEX(REPLACE('5dce792f40205b5965541f', '-', '')),
   UNHEX(REPLACE('d151a4a1af4ba88b5c', '-', '')));

-- Insertar marca de prueba
INSERT INTO `brands` VALUES 
  (UNHEX(REPLACE('f1ef49d2f738496d', '-', '')), '', 'https://www.svgrepo.com/show/489282/brand.svg', 'Marca Prueba');

-- Insertar categorías
INSERT INTO `categories` VALUES 
  (UNHEX(REPLACE('096c95e341b1f24c8ca5415c9659dbd5', '-', '')), 'Satisface deseos repentinos y específicos de alimentos, tanto dulces como salados', 'https://tofuu.getjusto.com/orioneat-local/resized2/6k43obvgrNS4RaP7j-300-x.webp', 'Antojos'),
  (UNHEX(REPLACE('a1a654f85d4869e168a5489371093a', '-', '')), 'Postres congelados, hechos generalmente a base de leche o agua, endulzados y saborizados con ingredientes como frutas, chocolate o vainilla', 'https://tofuu.getjusto.com/orioneat-local/resized2/62N55QNnPgEu45g6z-300-x.webp', 'Helados'),
  (UNHEX(REPLACE('7eb5f7f86341a8ec49658efb51e3', '-', '')), 'Todos los líquidos consumibles que pueden ser naturales o artificiales, como agua, refrescos y jugos', 'https://tofuu.getjusto.com/orioneat-local/resized2/8coyEW7LbBscZofe3-300-x.webp', 'Bebidas'),
  (UNHEX(REPLACE('7edd93db4df8b8a5', '-', '')), 'Bebida alcohólica, no destilada, de sabor amargo, que se fabrica con granos de cebada germinados u otros cereales', 'https://tofuu.getjusto.com/orioneat-local/resized2/BtyHGt48sAwsmuqno-300-x.webp', 'Cervezas'),
  (UNHEX(REPLACE('c8af49a87242bcc2e643f8f1fc', '-', '')), 'Productos para la despensa o reservas del hogar', 'https://tofuu.getjusto.com/orioneat-local/resized2/ZLMEGkLj3oYEwNDqQ-300-x.webp', 'Despensa'),
  (UNHEX(REPLACE('cd9bb762a7a940084318', '-', '')), 'Cualquier bebida, con o sin alcohol, que viene premezclada y está lista para consumir directamente de su envase', 'https://tofuu.getjusto.com/orioneat-local/resized2/9XuXRYFA8NPj2gj55-300-x.webp', 'RTDs'),
  (UNHEX(REPLACE('feda844f694aa8f0', '-', '')), 'Alimentos preparados para consumir al instante', 'https://tofuu.getjusto.com/orioneat-local/resized2/KRjPLJhsYR9cFfAQF-300-x.webp', 'Comidas'),
  (UNHEX(REPLACE('f36846f2f94e4db6', '-', '')), 'Productos ideales para personas fumadoras', 'https://tofuu.getjusto.com/orioneat-local/resized2/BbkePtKQWcEHsf5oz-300-x.webp', 'Cigarros y Vapes');

-- Insertar secciones de productos
INSERT INTO `product_sections` VALUES 
  (UNHEX(REPLACE('29affcef47c7a5', '-', '')), 8, 2, UNHEX(REPLACE('feda844f694aa8f0', '-', ''))),
  (UNHEX(REPLACE('42fcf956e54589bbc1415f913b2e', '-', '')), 8, 3, UNHEX(REPLACE('a1a654f85d4869e168a5489371093a', '-', ''))),
  (UNHEX(REPLACE('48312aa94a3abeb8', '-', '')), 8, 5, UNHEX(REPLACE('f36846f2f94e4db6', '-', ''))),
  (UNHEX(REPLACE('5c25a0ed52724c6892f2', '-', '')), 8, 4, UNHEX(REPLACE('cd9bb762a7a940084318', '-', ''))),
  (UNHEX(REPLACE('63e07474638d4dd98d5c85933e41a5bf', '-', '')), 8, 1, UNHEX(REPLACE('7eb5f7f86341a8ec49658efb51e3', '-', ''))),
  (UNHEX(REPLACE('a15c337e674e9cfde33aec', '-', '')), 8, 3, UNHEX(REPLACE('096c95e341b1f24c8ca5415c9659dbd5', '-', ''))),
  (UNHEX(REPLACE('b29e6e717c8b42b9', '-', '')), 8, 6, UNHEX(REPLACE('7edd93db4df8b8a5', '-', ''))),
  (UNHEX(REPLACE('b37398f49375754d4083e241316337770', '-', '')), 8, 3, UNHEX(REPLACE('c8af49a87242bcc2e643f8f1fc', '-', '')));

-- Insertar descuentos
INSERT INTO `discount` VALUES 
  (UNHEX(REPLACE('792c790dfc1a478bb1936897778e6557', '-', '')), '2025-07-05 15:30:00.000000', b'1', '22', 22.00, '2025-06-01 15:30:00.000000'),
  (UNHEX(REPLACE('7be3a9b3f0e14fb3bb6ce222b58c6d6e', '-', '')), '2025-07-05 15:33:00.000000', b'1', '14', 14.00, '2025-06-01 15:33:00.000000'),
  (UNHEX(REPLACE('90fcd3ee42f3f163448acd769f', '-', '')), '2025-07-10 15:32:00.000000', b'1', '11', 11.00, '2025-06-01 15:32:00.000000'),
  (UNHEX(REPLACE('85fa24f9f84c7c', '-', '')), '2025-07-05 02:16:00.000000', b'1', 'Descuento 16%', 16.00, '2025-06-01 02:16:00.000000');

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
-- Para importar los productos completos, ejecuta el archivo tambo_bd.sql después de este script
