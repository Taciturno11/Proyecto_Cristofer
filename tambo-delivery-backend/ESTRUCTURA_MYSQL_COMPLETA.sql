-- ============================================
-- ESTRUCTURA COMPLETA DESDE POSTGRESQL
-- Convertida para MySQL
-- ============================================

DROP DATABASE IF EXISTS `tambo_bd`;
CREATE DATABASE `tambo_bd` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `tambo_bd`;

-- ============================================
-- TABLAS DE AUTENTICACIÓN
-- ============================================

CREATE TABLE `auth_authority` (
  `id` BINARY(16) NOT NULL,
  `role_code` VARCHAR(20) NOT NULL,
  `role_description` VARCHAR(100) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_role_code` (`role_code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `auth_user_details` (
  `id` BINARY(16) NOT NULL,
  `created_on` DATETIME(6) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `enabled` BIT(1) NOT NULL,
  `first_name` VARCHAR(255) DEFAULT NULL,
  `last_name` VARCHAR(255) DEFAULT NULL,
  `last_password_reset_request` DATETIME(6) DEFAULT NULL,
  `password` VARCHAR(255) DEFAULT NULL,
  `phone_number` VARCHAR(255) DEFAULT NULL,
  `profile_image_url` VARCHAR(255) DEFAULT NULL,
  `provider` VARCHAR(255) DEFAULT NULL,
  `reset_token` VARCHAR(255) DEFAULT NULL,
  `reset_token_expiry` DATETIME(6) DEFAULT NULL,
  `updated_on` DATETIME(6) NOT NULL,
  `verification_code` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `auth_user_authority` (
  `user_id` BINARY(16) NOT NULL,
  `authorities_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`user_id`, `authorities_id`),
  KEY `FK_authorities` (`authorities_id`),
  CONSTRAINT `FK_user_authority_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_user_authority_authority` FOREIGN KEY (`authorities_id`) REFERENCES `auth_authority` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE DIRECCIONES
-- ============================================

CREATE TABLE `addresses` (
  `id` BINARY(16) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `alias` VARCHAR(255) NOT NULL,
  `apartment` VARCHAR(255) DEFAULT NULL,
  `city` VARCHAR(255) NOT NULL,
  `country` VARCHAR(255) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `district` VARCHAR(255) NOT NULL,
  `floor` VARCHAR(255) DEFAULT NULL,
  `is_primary` BIT(1) NOT NULL,
  `latitude` DOUBLE NOT NULL,
  `longitude` DOUBLE NOT NULL,
  `office` VARCHAR(255) DEFAULT NULL,
  `reference` VARCHAR(255) DEFAULT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_address_user` (`user_id`),
  CONSTRAINT `FK_address_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE PRODUCTOS
-- ============================================

CREATE TABLE `brands` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(500) DEFAULT NULL,
  `image_url` VARCHAR(500) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `categories` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `image_url` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `category_type` (
  `id` BINARY(16) NOT NULL,
  `description` VARCHAR(255) DEFAULT NULL,
  `name` VARCHAR(255) NOT NULL,
  `category_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_type_category` (`category_id`),
  CONSTRAINT `FK_category_type_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `category_buttons` (
  `id` BINARY(16) NOT NULL,
  `position` INT NOT NULL,
  `category_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_category_button_category` (`category_id`),
  CONSTRAINT `FK_category_button_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_sections` (
  `id` BINARY(16) NOT NULL,
  `max_products` INT NOT NULL,
  `position` INT NOT NULL,
  `category_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_product_section_category` (`category_id`),
  CONSTRAINT `FK_product_section_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `products` (
  `id` BINARY(16) NOT NULL,
  `created_at` DATETIME(6) NOT NULL,
  `description` TEXT NOT NULL,
  `is_active` BIT(1) NOT NULL,
  `is_new_arrival` BIT(1) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `price` DECIMAL(10,2) NOT NULL,
  `rating` FLOAT DEFAULT NULL,
  `slug` VARCHAR(255) NOT NULL,
  `stock` INT NOT NULL,
  `updated_at` DATETIME(6) NOT NULL,
  `brand_id` BINARY(16) NOT NULL,
  `category_id` BINARY(16) NOT NULL,
  `category_type_id` BINARY(16) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `UK_slug` (`slug`),
  KEY `FK_product_brand` (`brand_id`),
  KEY `FK_product_category` (`category_id`),
  KEY `FK_product_category_type` (`category_type_id`),
  CONSTRAINT `FK_product_brand` FOREIGN KEY (`brand_id`) REFERENCES `brands` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_product_category` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`) ON DELETE RESTRICT,
  CONSTRAINT `FK_product_category_type` FOREIGN KEY (`category_type_id`) REFERENCES `category_type` (`id`) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_resources` (
  `id` BINARY(16) NOT NULL,
  `is_primary` BIT(1) NOT NULL,
  `name` VARCHAR(255) NOT NULL,
  `type` VARCHAR(255) NOT NULL,
  `url` VARCHAR(255) NOT NULL,
  `product_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_resource_product` (`product_id`),
  CONSTRAINT `FK_resource_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `discount` (
  `id` BINARY(16) NOT NULL,
  `end_date` DATE DEFAULT NULL,
  `is_active` BIT(1) DEFAULT b'1',
  `name` VARCHAR(255) DEFAULT NULL,
  `percentage` DECIMAL(5,2) DEFAULT NULL,
  `start_date` DATE DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `product_discounts` (
  `discount_id` BINARY(16) NOT NULL,
  `product_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`discount_id`, `product_id`),
  KEY `FK_product_discount_product` (`product_id`),
  CONSTRAINT `FK_product_discount_discount` FOREIGN KEY (`discount_id`) REFERENCES `discount` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_product_discount_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE ÓRDENES
-- ============================================

CREATE TABLE `orders` (
  `id` BINARY(16) NOT NULL,
  `delivery_method` VARCHAR(255) NOT NULL,
  `discount` DOUBLE DEFAULT NULL,
  `doc_number` BIGINT NOT NULL,
  `doc_type` VARCHAR(255) NOT NULL,
  `expected_delivery_date` DATETIME(6) DEFAULT NULL,
  `latitude` DOUBLE DEFAULT NULL,
  `longitude` DOUBLE DEFAULT NULL,
  `order_date` DATETIME(6) DEFAULT NULL,
  `order_status` VARCHAR(255) NOT NULL,
  `payment_method` VARCHAR(255) NOT NULL,
  `razon_social` VARCHAR(255) DEFAULT NULL,
  `receipt_type` VARCHAR(255) NOT NULL,
  `ruc` VARCHAR(255) DEFAULT NULL,
  `shipment_tracking_number` VARCHAR(255) DEFAULT NULL,
  `total_amount` DOUBLE NOT NULL,
  `user_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_order_user` (`user_id`),
  CONSTRAINT `FK_order_user` FOREIGN KEY (`user_id`) REFERENCES `auth_user_details` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `order_items` (
  `id` BINARY(16) NOT NULL,
  `item_price` DOUBLE DEFAULT NULL,
  `quantity` INT NOT NULL,
  `order_id` BINARY(16) NOT NULL,
  `product_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_order_item_order` (`order_id`),
  KEY `FK_order_item_product` (`product_id`),
  CONSTRAINT `FK_order_item_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE CASCADE,
  CONSTRAINT `FK_order_item_product` FOREIGN KEY (`product_id`) REFERENCES `products` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `payment` (
  `id` BINARY(16) NOT NULL,
  `amount` DOUBLE NOT NULL,
  `payment_date` DATETIME(6) NOT NULL,
  `payment_method` VARCHAR(255) NOT NULL,
  `payment_status` VARCHAR(255) NOT NULL,
  `transaction_id` VARCHAR(255) DEFAULT NULL,
  `order_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_payment_order` (`order_id`),
  CONSTRAINT `FK_payment_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLAS DE DELIVERY
-- ============================================

CREATE TABLE `delivery_persons` (
  `id` BINARY(16) NOT NULL,
  `is_available` BIT(1) DEFAULT b'1',
  `name` VARCHAR(255) DEFAULT NULL,
  `phone` VARCHAR(255) DEFAULT NULL,
  `plate_number` VARCHAR(255) DEFAULT NULL,
  `vehicle_type` VARCHAR(255) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE `deliveries` (
  `id` BINARY(16) NOT NULL,
  `assigned_at` DATETIME(6) DEFAULT NULL,
  `delivered_at` DATETIME(6) DEFAULT NULL,
  `delivery_notes` VARCHAR(255) DEFAULT NULL,
  `status` VARCHAR(255) NOT NULL,
  `tracking_link` VARCHAR(255) DEFAULT NULL,
  `delivery_person_id` BINARY(16) DEFAULT NULL,
  `order_id` BINARY(16) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `FK_delivery_person` (`delivery_person_id`),
  KEY `FK_delivery_order` (`order_id`),
  CONSTRAINT `FK_delivery_person` FOREIGN KEY (`delivery_person_id`) REFERENCES `delivery_persons` (`id`) ON DELETE SET NULL,
  CONSTRAINT `FK_delivery_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`id`) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- TABLA DE SLIDER
-- ============================================

CREATE TABLE `slider_images` (
  `id` BINARY(16) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  `position` INT NOT NULL,
  `redirect_url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERTAR ROLES BÁSICOS
-- ============================================

INSERT INTO `auth_authority` (`id`, `role_code`, `role_description`) VALUES 
  (UNHEX(REPLACE('ded1ba32-00d6-4ecd-a3b5-9aa57d45d389', '-', '')), 'ADMIN', 'Administrador del sistema'),
  (UNHEX(REPLACE('19c48591-ee51-4082-9a3b-a043a547caa6', '-', '')), 'USER', 'Usuario estándar');

-- Verificar
SELECT HEX(id) as id_hex, role_code, role_description FROM auth_authority;

-- ============================================
-- BASE DE DATOS LISTA
-- ============================================
