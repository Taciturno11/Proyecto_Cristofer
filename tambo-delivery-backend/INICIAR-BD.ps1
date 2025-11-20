# =====================================================
# Script de Inicialización de Base de Datos PostgreSQL
# Tambo Delivery Backend
# =====================================================

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Inicialización de Base de Datos PostgreSQL" -ForegroundColor Cyan
Write-Host "  Tambo Delivery Backend" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Variables
$PSQL_PATH = "C:\Program Files\PostgreSQL\17\bin\psql.exe"
$DB_NAME = "tambo_bd"
$SQL_SCRIPT = "$PSScriptRoot\tambo_bd_postgresql.sql"

# Verificar que el script SQL existe
if (-not (Test-Path $SQL_SCRIPT)) {
    Write-Host "❌ ERROR: No se encontró el archivo $SQL_SCRIPT" -ForegroundColor Red
    exit 1
}

# Solicitar usuario PostgreSQL
$DB_USER = Read-Host "Ingresa el usuario de PostgreSQL (por defecto: postgres)"
if ([string]::IsNullOrWhiteSpace($DB_USER)) {
    $DB_USER = "postgres"
}

Write-Host ""
Write-Host "📋 Configuración:" -ForegroundColor Yellow
Write-Host "   Usuario: $DB_USER" -ForegroundColor White
Write-Host "   Base de datos: $DB_NAME" -ForegroundColor White
Write-Host "   Script: tambo_bd_postgresql.sql" -ForegroundColor White
Write-Host ""

# Confirmar acción
$confirmDrop = Read-Host "⚠️  ¿Deseas BORRAR todos los datos existentes y reiniciar la BD? (S/N)"
if ($confirmDrop -ne "S" -and $confirmDrop -ne "s") {
    Write-Host "❌ Operación cancelada por el usuario" -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "🔄 Ejecutando script SQL..." -ForegroundColor Cyan

# Ejecutar script SQL
try {
    # Convertir ruta Windows a formato PostgreSQL (C:/...)
    $SQL_SCRIPT_PSQL = $SQL_SCRIPT -replace '\\', '/'
    
    # Ejecutar el script
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -f $SQL_SCRIPT
    
    Write-Host ""
    Write-Host "✅ Script ejecutado" -ForegroundColor Green
    Write-Host ""
    
    # Verificar datos insertados
    Write-Host "📊 Verificando datos insertados..." -ForegroundColor Cyan
    
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as authorities FROM auth_authority;"
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as users FROM auth_user_details;"
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as brands FROM brands;"
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as categories FROM categories;"
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as discounts FROM discount;"
    & $PSQL_PATH -U $DB_USER -d $DB_NAME -c "SELECT COUNT(*) as sections FROM product_sections;"
    
    Write-Host ""
    Write-Host "🎉 Base de datos inicializada correctamente!" -ForegroundColor Green
    Write-Host ""
    Write-Host "👤 Usuario Administrador:" -ForegroundColor Yellow
    Write-Host "   Email: admin@gmail.com" -ForegroundColor White
    Write-Host "   Código de verificación: 874585" -ForegroundColor White
    Write-Host ""
    Write-Host "⚠️  IMPORTANTE: Configura el archivo .env con tus credenciales" -ForegroundColor Yellow
    Write-Host ""
    
} catch {
    Write-Host ""
    Write-Host "❌ Error inesperado: $_" -ForegroundColor Red
}

Write-Host "Presiona cualquier tecla para continuar..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
