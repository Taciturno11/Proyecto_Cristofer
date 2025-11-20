# 🎯 GUÍA RÁPIDA - EJECUTAR SQL EN pgAdmin4

## 📋 Pasos Simples

### 1️⃣ Abrir pgAdmin4
- Inicia pgAdmin4 desde el menú de Windows
- Espera a que cargue la interfaz

### 2️⃣ Conectarte al Servidor
- En el panel izquierdo, expande "Servers"
- Click en "PostgreSQL 17"
- Ingresa tu contraseña si te la pide

### 3️⃣ Seleccionar la Base de Datos
- Expande "PostgreSQL 17" → "Databases"
- Click derecho en **"tambo_bd"**
- Selecciona **"Query Tool"** (o presiona Alt+Shift+Q)

### 4️⃣ Ejecutar el Script
- Se abrirá una nueva pestaña con un editor SQL
- Abre el archivo: **`EJECUTAR-EN-PGADMIN.sql`** (está en la carpeta backend)
- Copia **TODO** el contenido
- Pégalo en el Query Tool de pgAdmin
- Presiona **F5** o el botón **▶ Execute/Refresh**

### 5️⃣ Verificar Resultados
Deberías ver en la sección "Data Output":
```
✅ Roles insertados: 2
✅ Usuarios insertados: 1
✅ Marcas insertadas: 1
✅ Categorías insertadas: 8
✅ Descuentos insertados: 4
✅ Secciones de productos: 8
```

---

## ✅ ¡Listo!

Tu base de datos ahora tiene:
- ✅ 2 Roles (ADMIN y USER)
- ✅ 1 Usuario administrador
- ✅ 8 Categorías de productos
- ✅ 4 Descuentos configurados
- ✅ 8 Secciones de productos

---

## 🔐 Credenciales del Usuario Admin

Para probar el login:
- **Email:** `admin@gmail.com`
- **Contraseña:** `admin123`
- **Código de verificación:** `874585`

---

## 🚀 Siguiente Paso

**Configurar el archivo .env:**

1. Abre la carpeta: `tambo-delivery-backend`
2. Copia el archivo: `.env.example`
3. Renómbralo a: `.env`
4. Edita el archivo y configura:

```env
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_real_aqui
EMAIL_USERNAME=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password_aqui
```

**Luego inicia el backend:**
```powershell
cd tambo-delivery-backend
./mvnw.cmd spring-boot:run
```

---

## ❓ Si hay errores

**Error: "relation does not exist"**
- Las tablas no existen todavía
- Solución: Inicia el backend primero con `./mvnw.cmd spring-boot:run`
- Spring Boot creará las tablas automáticamente
- Luego ejecuta el script SQL

**Error: "duplicate key value"**
- Ya existen datos en la BD
- Solución: El script usa `TRUNCATE` para limpiar todo primero
- Ejecuta el script completo de nuevo

---

## 📞 Contacto

Si tienes problemas, revisa:
- **ANALISIS-COMPLETO.md** - Análisis detallado del proyecto
- **GUIA-POSTGRESQL.md** - Guía completa de PostgreSQL
