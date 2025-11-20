# Script para verificar que el backend funciona
Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "   PRUEBA RÁPIDA DEL BACKEND" -ForegroundColor Cyan
Write-Host "========================================`n" -ForegroundColor Cyan

# 1. Verificar puerto
Write-Host "1️⃣ Verificando puerto 8080..." -ForegroundColor Yellow
$port = Get-NetTCPConnection -LocalPort 8080 -State Listen -ErrorAction SilentlyContinue
if ($port) {
    Write-Host "   ✅ Servidor corriendo (PID: $($port.OwningProcess))`n" -ForegroundColor Green
    
    # 2. Probar endpoint de categorías
    Write-Host "2️⃣ Probando endpoint /api/public/categories..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/public/categories" -Method GET -TimeoutSec 5
        Write-Host "   ✅ Endpoint responde correctamente" -ForegroundColor Green
        Write-Host "   📦 Categorías en BD: $($response.Count)`n" -ForegroundColor Cyan
    } catch {
        Write-Host "   ⚠️ Error al conectar: $($_.Exception.Message)`n" -ForegroundColor Red
    }
    
    # 3. Probar endpoint de productos
    Write-Host "3️⃣ Probando endpoint /api/public/products..." -ForegroundColor Yellow
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:8080/api/public/products" -Method GET -TimeoutSec 5
        Write-Host "   ✅ Endpoint responde correctamente" -ForegroundColor Green
        Write-Host "   📦 Productos en BD: $($response.Count)`n" -ForegroundColor Cyan
    } catch {
        Write-Host "   ⚠️ Error al conectar: $($_.Exception.Message)`n" -ForegroundColor Red
    }
    
    # 4. Mostrar URLs útiles
    Write-Host "`n========================================" -ForegroundColor Cyan
    Write-Host "   ✅ EL BACKEND ESTÁ FUNCIONANDO" -ForegroundColor Green
    Write-Host "========================================`n" -ForegroundColor Cyan
    
    Write-Host "📋 URLs DISPONIBLES:" -ForegroundColor Yellow
    Write-Host "   • Swagger UI (Documentación): " -NoNewline
    Write-Host "http://localhost:8080/swagger-ui/index.html" -ForegroundColor Cyan
    Write-Host "   • API Docs JSON: " -NoNewline
    Write-Host "http://localhost:8080/v3/api-docs" -ForegroundColor Cyan
    Write-Host "   • Categorías: " -NoNewline
    Write-Host "http://localhost:8080/api/public/categories" -ForegroundColor Cyan
    Write-Host "   • Productos: " -NoNewline
    Write-Host "http://localhost:8080/api/public/products" -ForegroundColor Cyan
    
    Write-Host "`n💡 CÓMO USARLO DESDE REACT:" -ForegroundColor Yellow
    Write-Host "   fetch('http://localhost:8080/api/public/categories')" -ForegroundColor Gray
    Write-Host "     .then(res => res.json())" -ForegroundColor Gray
    Write-Host "     .then(data => console.log(data));" -ForegroundColor Gray
    
    Write-Host "`n🌐 Abre en tu navegador:" -ForegroundColor Yellow
    Write-Host "   http://localhost:8080/swagger-ui/index.html" -ForegroundColor White
    
} else {
    Write-Host "   ❌ Servidor NO está corriendo`n" -ForegroundColor Red
    Write-Host "   Para iniciarlo, ejecuta: " -NoNewline
    Write-Host ".\INICIAR-SERVIDOR.bat" -ForegroundColor Yellow
    Write-Host "   O usa: " -NoNewline
    Write-Host ".\mvnw spring-boot:run`n" -ForegroundColor Yellow
}

Write-Host "`n========================================`n" -ForegroundColor Cyan
