# 🗄️ GUÍA DE CONFIGURACIÓN DE BASE DE DATOS POSTGRESQL

## 📋 Pasos para Ejecutar el Script SQL

### 1️⃣ **Crear el archivo .env**

Copia el archivo `.env.example` y renómbralo a `.env`:

```powershell
Copy-Item .env.example .env
```

Luego edita el archivo `.env` y configura tus credenciales de PostgreSQL:

```env
DB_USERNAME=postgres
DB_PASSWORD=tu_password_real
```

---

### 2️⃣ **Conectarse a PostgreSQL**

Abre PowerShell y conéctate a PostgreSQL:

```powershell
# Opción 1: Usando psql desde línea de comandos
psql -U postgres

# Opción 2: Si psql no está en PATH
& "C:\Program Files\PostgreSQL\16\bin\psql.exe" -U postgres
```

---

### 3️⃣ **Crear la Base de Datos (si no existe)**

```sql
CREATE DATABASE tambo_bd;
\c tambo_bd
```

---

### 4️⃣ **Ejecutar el Script SQL**

**Opción A: Desde psql**

```sql
\i 'C:/Users/marti/OneDrive/Escritorio/cristofer/tambo-delivery-backend/tambo_bd_postgresql.sql'
```

**Opción B: Desde PowerShell**

```powershell
psql -U postgres -d tambo_bd -f "C:\Users\marti\OneDrive\Escritorio\cristofer\tambo-delivery-backend\tambo_bd_postgresql.sql"
```

---

### 5️⃣ **Verificar que se insertaron los datos**

```sql
SELECT COUNT(*) FROM auth_authority;
SELECT COUNT(*) FROM auth_user_details;
SELECT COUNT(*) FROM brands;
SELECT COUNT(*) FROM categories;
SELECT COUNT(*) FROM discount;
SELECT COUNT(*) FROM product_sections;
```

---

## ⚠️ IMPORTANTE: Datos de Productos

El script MySQL original contiene **datos binarios corruptos** para los productos. 
Las tablas `products` y `product_resources` **NO** fueron migradas automáticamente.

### Opciones:

1. **Dejar que JPA cree las tablas vacías** (recomendado para desarrollo)
   - Spring Boot con `spring.jpa.hibernate.ddl-auto=update` creará las estructuras
   - Puedes agregar productos desde el panel de administración

2. **Exportar productos desde MySQL manualmente**
   - Si tienes acceso a la BD MySQL original, exporta como CSV
   - Importa en PostgreSQL

---

## 🔐 Usuario Administrador Predeterminado

- **Email:** admin@gmail.com
- **Contraseña:** (usa el hash bcrypt del script)
- **Código de verificación:** 874585

---

## 🚀 Iniciar el Backend

Una vez configurado:

```powershell
cd tambo-delivery-backend
./mvnw.cmd spring-boot:run
```

El backend estará disponible en: `http://localhost:8080`

---

## 🔍 Verificar Conectividad

Para probar que el backend está funcionando:

```powershell
curl http://localhost:8080/api/public/category/get-all
```

