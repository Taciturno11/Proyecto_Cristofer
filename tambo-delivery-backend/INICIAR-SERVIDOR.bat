@echo off
echo ========================================
echo   TAMBO DELIVERY - INICIAR SERVIDOR
echo ========================================
echo.
echo Iniciando servidor Spring Boot...
echo Espera a ver: "Started TamboDeliveryBackendApplication"
echo.
echo IMPORTANTE:
echo - NO cierres esta ventana mientras uses el backend
echo - Para detener: presiona Ctrl + C
echo.
echo ========================================
echo.

.\mvnw spring-boot:run

pause
