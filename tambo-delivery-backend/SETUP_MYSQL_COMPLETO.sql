-- ============================================
-- SCRIPT COMPLETO MYSQL - TODO EN UNO
-- ============================================

DROP DATABASE IF EXISTS `tambo_bd`;
CREATE DATABASE `tambo_bd` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tambo_bd`;

-- ============================================
-- CREAR TABLAS
-- ============================================

CREATE TABLE `auth_authority` (
  `id` BINARY(16) NOT NULL,
  `authority_name` VARCHAR(50) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_authority_name` (`authority_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `auth_user_authority` (
  `user_id` BINARY(16) NOT NULL,
  `authority_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_id`, `authority_id`),
  KEY `FK_authority` (`authority_id`),
  CONSTRAINT `FK_user_authority_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_authority_authority` FOREIGN KEY (`authority_id`) REFERENCES `auth_authority` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `brands` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` BINARY(16) NOT NULL,
  `description` TEXT,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `discount` (
  `id` BINARY(16) NOT NULL,
  `end_date` DATETIME(6) DEFAULT NULL,
  `is_active` BIT(1) DEFAULT b'1',
  `name` VARCHAR(100) NOT NULL,
  `percentage` DECIMAL(5,2) NOT NULL,
  `start_date` DATETIME(6) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_sections` (
  `id` BINARY(16) NOT NULL,
  `product_limit` INT DEFAULT 8,
  `section_order` INT DEFAULT 1,
  `category_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_product_section_category` (`category_id`),
  CONSTRAINT `FK_product_section_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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

CREATE TABLE `product_discounts` (
  `discount_id` BINARY(16) NOT NULL,
  `product_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`discount_id`, `product_id`),
  KEY `FK_product_discount_product` (`product_id`),
  CONSTRAINT `FK_product_discount_discount` FOREIGN KEY (`discount_id`) REFERENCES `discount` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_product_discount_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
-- INSERTAR DATOS NECESARIOS
-- ============================================

-- Roles (CRÍTICO para registro)
INSERT INTO `auth_authority` VALUES 
  (UUID_TO_BIN(UUID()), 'USER', 'Usuario estándar'),
  (UUID_TO_BIN(UUID()), 'ADMIN', 'Administrador del sistema');

-- Verificar
SELECT authority_name, description FROM auth_authority;

-- ============================================
-- LISTO - Base de datos funcional
-- ============================================
