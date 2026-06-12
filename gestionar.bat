@echo off
:: Configuración de codificación para aceptar caracteres en español, tildes y emojis
chcp 65001 > nul
title Orquestador de Despliegue - AutoFit v2

:MENU
cls
echo =================================================================
echo        🛸 AUTOFIT V2 - PANEL DE CONTROL DE DESPLIEGUE 🛸
echo =================================================================
echo   [1] Levantar Núcleo Completo (Backend + Base de Datos NoSQL en Docker)
echo   [2] Arrancar Aplicación Móvil Nativa (React Native / Expo Go)
echo   [3] Arrancar Panel Web Administrativo (React + Tailwind CSS)
echo   [4] APAGAR Y LIMPIAR contenedores de Docker
echo   [5] Sincronizar y actualizar cambios con GitHub (Git Pull)
echo   [6] Salir
echo =================================================================
set /p opcion="Selecciona una opción informática (1-6): "

if "%opcion%"=="1" goto DOCKER
if "%opcion%"=="2" goto MOBILE
if "%opcion%"=="3" goto WEB
if "%opcion%"=="4" goto CLEAN
if "%opcion%"=="5" goto PULL
if "%opcion%"=="6" goto EXIT
goto MENU

:DOCKER
cls
echo -----------------------------------------------------------------
echo [DOCKER] Iniciando contenedores del Backend y MongoDB...
echo -----------------------------------------------------------------
echo NOTA: Esta ventana mantendrá el servidor en ejecución. 
echo Minimízala pero no la cierres durante tus pruebas de defensa.
echo -----------------------------------------------------------------
:: Levanta Docker Compose abriendo una ventana nueva para que no bloquee este menú
start "AutoFit Backend [Docker]" cmd /k "cd /d C:\Users\Asus\OneDrive\Escritorio\Autofit\AutoFit && docker-compose up --build"
pause
goto MENU

:MOBILE
cls
echo -----------------------------------------------------------------
echo [MOBILE] Inicializando entorno de hardware React Native Expo...
echo -----------------------------------------------------------------
:: Abre una nueva terminal, instala dependencias faltantes y levanta el código QR
start "AutoFit Cliente Móvil [Expo]" cmd /k "cd /d C:\Users\Asus\OneDrive\Escritorio\Autofit\AutoFit\mobile && npm install && npx expo start"
echo Servidor de desarrollo móvil solicitado correctamente. Escanea el código QR resultante con la app Expo Go.
pause
goto MENU

:WEB
cls
echo -----------------------------------------------------------------
echo [WEB] Levantando Panel de Administración React + Tailwind...
echo -----------------------------------------------------------------
:: Abre una nueva terminal, instala dependencias y enciende el cliente web
start "AutoFit Frontend Web [Vite/React]" cmd /k "cd /d C:\Users\Asus\OneDrive\Escritorio\Autofit\AutoFit\frontend-web && npm install && npm run dev"
echo El cliente web se está ejecutando. Revisa la dirección URL provista en la nueva consola (ej. http://localhost:5173).
pause
goto MENU

:CLEAN
cls
echo -----------------------------------------------------------------
echo [CLEAN] Deteniendo y eliminando contenedores locales...
echo -----------------------------------------------------------------
cd /d C:\Users\Asus\OneDrive\Escritorio\Autofit\AutoFit
docker-compose down
echo Ecosistema Docker apagado y liberando puertos del sistema de forma exitosa.
pause
goto MENU

:PULL
cls
echo -----------------------------------------------------------------
echo [GIT] Descargando últimas actualizaciones desde GitHub...
echo -----------------------------------------------------------------
cd /d C:\Users\Asus\OneDrive\Escritorio\Autofit\AutoFit
git pull origin main
echo Sincronización finalizada. Tu ordenador local está actualizado.
pause
goto MENU

:EXIT
cls
echo =================================================================
echo ¡Éxito en la defensa de tu proyecto DAM, Santiago! Saliendo...
echo =================================================================
timeout /t 3 > nul
exit