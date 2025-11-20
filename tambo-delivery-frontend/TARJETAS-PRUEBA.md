# Tarjetas de Prueba para Pagos

## 🔐 Culqi - Pasarela de Pagos (Perú)

### Tarjetas de Crédito/Débito de Prueba

#### ✅ Transacciones Exitosas

**Visa**
- Número: `4111 1111 1111 1111`
- CVV: `123`
- Fecha: Cualquier fecha futura (ej: `12/25`)
- Nombre: Cualquier nombre

**Mastercard**
- Número: `5111 1111 1111 1118`
- CVV: `123`
- Fecha: Cualquier fecha futura
- Nombre: Cualquier nombre

**American Express**
- Número: `3782 822463 10005`
- CVV: `1234` (4 dígitos para Amex)
- Fecha: Cualquier fecha futura
- Nombre: Cualquier nombre

#### ❌ Transacciones Rechazadas (para testing)

**Visa - Fondos Insuficientes**
- Número: `4000 0000 0000 0002`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Mastercard - Tarjeta Robada**
- Número: `5105 1051 0510 5100`
- CVV: `123`
- Fecha: Cualquier fecha futura

**Visa - Tarjeta Expirada**
- Número: `4000 0000 0000 0069`
- CVV: `123`
- Fecha: Cualquier fecha futura

### Datos de Prueba Adicionales

**Email:** `test@culqi.com` o cualquier email válido

**Moneda:** PEN (Soles Peruanos)

**Montos:** Cualquier monto mayor a S/ 3.00

---

## 📱 Yape / Plin (Simulación)

En el entorno de prueba, estos métodos simplemente simularán el pago:

1. Selecciona Yape o Plin
2. Haz clic en "Confirmar pedido"
3. Serás redirigido a la confirmación (pago simulado como exitoso)

En producción, estos métodos:
- Generarían un código QR
- Redirigirían a la app móvil
- Esperarían confirmación de pago

---

## 🔑 Claves de API

### Culqi (Perú)

**Clave Pública de Prueba (Frontend):**
```
pk_test_e91aae7d3ffcf948
```

**Clave Secreta de Prueba (Backend - NO COMPARTIR):**
```
sk_test_5b638b657e1a3f3f
```

### Configuración en Producción

1. **Crear cuenta en Culqi:**
   - Visita: https://culqi.com
   - Regístrate como comercio
   - Obtén tus claves de producción

2. **Actualizar claves:**
   - Frontend: `payment-method.component.ts` línea con `Culqi.publicKey`
   - Backend: Variables de entorno del servidor

3. **Configurar Webhook (Backend):**
   - URL: `https://tu-dominio.com/api/payments/webhook`
   - Eventos: `charge.succeeded`, `charge.failed`

---

## 📊 Flujo de Pago Implementado

### Tarjetas de Crédito/Débito
1. Usuario ingresa datos de tarjeta
2. Frontend crea token con Culqi (sin enviar datos sensibles)
3. Token se envía al backend
4. Backend procesa el cargo con Culqi
5. Se confirma o rechaza el pago

### Pagos Digitales (Yape/Plin)
1. Usuario selecciona método
2. Sistema genera QR o link de pago
3. Usuario confirma en app móvil
4. Webhook notifica al backend
5. Backend actualiza estado del pedido

---

## ⚠️ Notas Importantes

- **NUNCA** guardes datos de tarjeta en tu base de datos
- **NUNCA** envíes datos de tarjeta sin encriptar
- **NUNCA** expongas tu clave secreta en el frontend
- Usa HTTPS en producción
- Implementa rate limiting para prevenir ataques
- Valida montos en backend antes de procesar

---

## 🧪 Testing

### Escenarios de Prueba

1. **Pago exitoso con Visa**
   - Tarjeta: `4111 1111 1111 1111`
   - Resultado esperado: Pedido confirmado

2. **Pago rechazado por fondos**
   - Tarjeta: `4000 0000 0000 0002`
   - Resultado esperado: Error mostrado al usuario

3. **Validación de formulario**
   - Dejar campos vacíos
   - Ingresar email inválido
   - Ingresar CVV de 2 dígitos
   - Resultado esperado: Mensajes de validación

4. **Pago con Yape/Plin**
   - Seleccionar método
   - Confirmar pedido
   - Resultado esperado: Redirección a confirmación

---

## 📚 Documentación Oficial

- **Culqi:** https://docs.culqi.com
- **Culqi Checkout:** https://docs.culqi.com/#culqi-checkout
- **Culqi.js:** https://docs.culqi.com/#culqi-js

---

## 🆘 Soporte

Si encuentras problemas:

1. Verifica que las claves de API sean correctas
2. Revisa la consola del navegador para errores
3. Consulta logs del backend
4. Revisa documentación de Culqi
5. Contacta soporte de Culqi: soporte@culqi.com
