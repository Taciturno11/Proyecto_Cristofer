# 🚀 GUÍA DE INICIO FÁCIL - Para Desarrolladores Nuevos en Angular/Spring

## 📌 TU SITUACIÓN ACTUAL

Acabas de clonar el repositorio y quieres empezar a trabajar, pero:
- ❌ No necesitas ejecutar scripts SQL complejos
- ❌ No necesitas preocuparte por UUIDs
- ✅ Spring Boot creará las tablas automáticamente
- ✅ Solo necesitas configuración básica

---

## 🎯 PASOS SÚPER SIMPLES

### 1️⃣ Configurar Base de Datos (2 minutos)

**Abre pgAdmin4:**
1. Conéctate a PostgreSQL
2. Click derecho en "Databases"
3. Create → Database
4. Nombre: `tambo_bd`
5. Save

**¡Eso es todo!** Deja la base de datos **VACÍA**. Spring Boot creará las tablas.

---

### 2️⃣ Configurar Variables de Entorno (3 minutos)

**En la carpeta `tambo-delivery-backend`:**

1. Copia el archivo `.env.example` y renómbralo a `.env`
2. Edita el `.env` con tus datos reales:

```env
# Base de datos (CAMBIA ESTO)
DB_USERNAME=postgres
DB_PASSWORD=tu_contraseña_real_de_postgres

# Email (OPCIONAL - puedes dejarlo así por ahora)
EMAIL_USERNAME=tu_email@gmail.com
EMAIL_PASSWORD=tu_app_password

# JWT (DÉJALO ASÍ - ya tiene un valor por defecto)
JWT_SECRET_KEY=EstaEsMiClaveSecretaSuperSeguraConMasDe32Caracteres!!

# OAuth Google (OPCIONAL - déjalo vacío si no lo usarás)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

# PayPal (OPCIONAL - déjalo vacío si no lo usarás)
PAYPAL_CLIENT_ID=
PAYPAL_CLIENT_SECRET=
PAYPAL_MODE=sandbox
```

**Lo ÚNICO obligatorio es configurar:**
- `DB_USERNAME` (por defecto: `postgres`)
- `DB_PASSWORD` (tu contraseña de PostgreSQL)

---

### 3️⃣ Iniciar el Backend (1 minuto)

```powershell
cd tambo-delivery-backend
./mvnw.cmd spring-boot:run
```

**¿Qué pasará?**
1. Spring Boot se conectará a PostgreSQL
2. **Creará TODAS las tablas automáticamente** (por el `ddl-auto=update`)
3. El servidor estará en: `http://localhost:8080`

**Verás algo como:**
```
Hibernate: create table auth_authority ...
Hibernate: create table auth_user_details ...
Hibernate: create table brands ...
Hibernate: create table categories ...
...
Started TamboDeliveryBackendApplication in 8.234 seconds
```

---

### 4️⃣ Crear Usuario Administrador (2 minutos)

**Opción A: Desde el Backend (Recomendado)**

Una vez que el backend esté corriendo, usa este endpoint para registrar un admin:

```powershell
# Registrar usuario admin
curl -X POST http://localhost:8080/api/auth/register `
  -H "Content-Type: application/json" `
  -d '{
    "userName": "admin",
    "email": "admin@gmail.com",
    "password": "admin123",
    "fullName": "Administrador",
    "phone": "987654321"
  }'
```

**Opción B: Desde pgAdmin (Solo si quieres)**

Si prefieres crear el usuario directamente en la BD:

```sql
-- 1. Insertar roles
INSERT INTO auth_authority (id, name, description) VALUES 
(gen_random_uuid(), 'ADMIN', 'Administrador del sistema'),
(gen_random_uuid(), 'USER', 'Usuario estándar');

-- 2. Insertar usuario admin
INSERT INTO auth_user_details (
    id, email, is_enabled, full_name, user_name, 
    password, phone, provider, created_date
) VALUES (
    gen_random_uuid(),
    'admin@gmail.com',
    true,
    'Administrador',
    'admin',
    '{bcrypt}$2a$10$y6NyXMmvdlLb4JDEx5yZLO8pHzwd4t.WBVNcgEJD8tNVubGjh4Jf6',
    '987654321',
    'manual',
    NOW()
);

-- 3. Asignar rol ADMIN
INSERT INTO auth_user_authority (user_id, authority_id)
SELECT u.id, a.id 
FROM auth_user_details u, auth_authority a
WHERE u.email = 'admin@gmail.com' AND a.name = 'ADMIN';
```

**Credenciales:**
- Email: `admin@gmail.com`
- Password: `admin123`

---

### 5️⃣ Iniciar el Frontend (2 minutos)

```powershell
cd tambo-delivery-frontend
npm install
npm start
```

Abre: `http://localhost:4200`

---

## ✅ VERIFICAR QUE TODO FUNCIONA

### Test 1: Backend está corriendo
```powershell
curl http://localhost:8080/api/public/category/get-all
```

**Respuesta esperada:** `[]` (array vacío - es normal, no hay categorías todavía)

### Test 2: Login funciona
Desde el frontend (`http://localhost:4200`):
1. Ve a Login
2. Email: `admin@gmail.com`
3. Password: `admin123`
4. ✅ Deberías entrar al dashboard

---

## 📊 AGREGAR DATOS DE EJEMPLO

Una vez dentro del panel de administración, puedes:

1. **Crear Categorías** (Bebidas, Comidas, etc.)
2. **Crear Marcas**
3. **Crear Productos**
4. **Crear Descuentos**

Todo desde la interfaz web, sin SQL.

---

## 🔧 SI ALGO FALLA

### Error: "Cannot connect to database"
```
Causa: Contraseña incorrecta en .env
Solución: Verifica DB_PASSWORD en el archivo .env
```

### Error: "Port 8080 already in use"
```
Causa: Otro proceso usando el puerto
Solución: 
# Ver qué usa el puerto 8080
netstat -ano | findstr :8080
# Matar el proceso
taskkill /PID [número_del_proceso] /F
```

### Error: "relation does not exist"
```
Causa: Las tablas no se crearon
Solución: Verifica en application.properties:
spring.jpa.hibernate.ddl-auto=update
```

---

## 🎓 PARA APRENDER ANGULAR

Como eres nuevo en Angular, te recomiendo:

1. **Primero trabaja en el Backend** (Spring Boot es más familiar si vienes de Java)
2. **Usa el frontend como está** - solo para probar
3. **Aprende Angular gradualmente:**
   - `src/app/features/` - Aquí están las pantallas
   - `src/app/services/` - Aquí están las llamadas HTTP
   - `src/app/models/` - Aquí están los tipos de datos

---

## 📝 RESUMEN DE LO QUE REALMENTE NECESITAS

| Paso | ¿Es necesario? | ¿Por qué? |
|------|---------------|-----------|
| Crear BD `tambo_bd` | ✅ SÍ | PostgreSQL necesita la base de datos |
| Configurar `.env` | ✅ SÍ | Spring necesita credenciales |
| Ejecutar scripts SQL | ❌ NO | Spring Boot crea las tablas |
| Instalar Node.js | ✅ SÍ | Angular lo requiere |
| Configurar CORS | ✅ YA ESTÁ | Ya está en el código |

---

## 🚀 SIGUIENTE PASO DESPUÉS DE ESTO

1. **Juega con el panel admin** - Crea productos, categorías
2. **Prueba el carrito de compras** - Como usuario normal
3. **Revisa el código:**
   - Backend: `src/main/java/com/tambo/tambo_delivery_backend/controllers/`
   - Frontend: `src/app/features/`

---

**¿Necesitas ayuda con algo específico?** 
Pregunta sin miedo. Es normal estar perdido al principio con Angular.
