# 🧪 Cómo Probar el Backend (Para Desarrolladores React/Node.js)

## 1️⃣ **Forma Más Fácil: Abrir en el Navegador**

### Opción A: Swagger UI (Documentación API Interactiva)
1. Asegúrate que el servidor esté corriendo (ver abajo)
2. Abre tu navegador en: **http://localhost:8080/swagger-ui/index.html**
3. Verás toda la documentación de tus endpoints como Postman pero integrado

### Opción B: API Docs JSON
- **http://localhost:8080/v3/api-docs** - Ver la documentación en formato JSON

---

## 2️⃣ **Verificar que el Servidor Está Corriendo**

### Desde PowerShell:
```powershell
# Ver si el puerto 8080 está en uso
netstat -ano | findstr :8080
```

Si ves algo como:
```
TCP    0.0.0.0:8080           0.0.0.0:0              LISTENING       12345
```
✅ **¡El servidor está corriendo!**

---

## 3️⃣ **Iniciar el Servidor**

Desde la raíz del proyecto:
```powershell
.\mvnw spring-boot:run
```

Espera a ver este mensaje:
```
Started TamboDeliveryBackendApplication in X.XXX seconds
```

**⚠️ NO cierres esta terminal mientras uses el backend**

---

## 4️⃣ **Probar Endpoints con cURL (Como fetch en Node.js)**

### Ejemplo: Ver todas las categorías
```powershell
curl http://localhost:8080/api/public/categories
```

### Ejemplo: Hacer login
```powershell
curl -X POST http://localhost:8080/auth/login `
  -H "Content-Type: application/json" `
  -d '{\"username\":\"tu_usuario\",\"password\":\"tu_password\"}'
```

---

## 5️⃣ **Usar Postman o Thunder Client (VS Code)**

Si usas VS Code, instala la extensión **Thunder Client** (es como Postman pero integrado).

### Endpoints comunes que puedes probar:

```
GET  http://localhost:8080/api/public/categories
GET  http://localhost:8080/api/public/products
POST http://localhost:8080/auth/login
POST http://localhost:8080/auth/register
```

---

## 6️⃣ **Conectar desde React (Similar a Node.js)**

En tu app React, simplemente usa `fetch` o `axios`:

```javascript
// Con fetch (nativo)
fetch('http://localhost:8080/api/public/categories')
  .then(res => res.json())
  .then(data => console.log(data));

// Con axios
import axios from 'axios';

axios.get('http://localhost:8080/api/public/categories')
  .then(response => console.log(response.data));
```

**⚠️ Importante:** Asegúrate que el backend tenga CORS configurado para localhost:3000 (tu React app)

---

## 🔧 **Solución de Problemas**

### El servidor no inicia:
1. Verifica que PostgreSQL esté corriendo
2. Revisa las credenciales en el archivo `.env`
3. Verifica que el puerto 8080 no esté ocupado

### Error de conexión a BD:
1. Abre pgAdmin o usa:
   ```powershell
   psql -U postgres -d tambo_bd
   ```
2. Verifica que la base de datos `tambo_bd` exista

### Puerto 8080 ocupado:
```powershell
# Encuentra el proceso
netstat -ano | findstr :8080

# Mata el proceso (reemplaza XXXXX con el PID)
taskkill /F /PID XXXXX
```

---

## 📝 **Resumen Rápido**

1. **Iniciar**: `.\mvnw spring-boot:run`
2. **Verificar**: Abrir http://localhost:8080/swagger-ui/index.html
3. **Probar**: Usar Swagger UI, cURL, Postman o conectar desde React
4. **Detener**: `Ctrl + C` en la terminal donde corre el servidor

---

## 🎯 **Endpoints Públicos (No requieren autenticación)**

- `GET /api/public/categories` - Ver categorías
- `GET /api/public/products` - Ver productos
- `GET /api/public/products/{id}` - Ver producto específico
- `POST /auth/register` - Registrar usuario
- `POST /auth/login` - Iniciar sesión

## 🔐 **Endpoints Protegidos (Requieren token JWT)**

Para estos necesitas:
1. Hacer login y obtener el token
2. Agregar el header: `Authorization: Bearer TU_TOKEN_JWT`
