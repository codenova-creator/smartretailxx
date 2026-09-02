@echo off
title SmartRetailX - Viva Demonstration Server
color 0B
cls
echo =====================================================================
echo           SMARTRETAILX - CLOUD MICROSERVICES PLATFORM
echo                VIVA PRESENTATION DEMO SERVER
echo =====================================================================
echo.
echo  [*] Initializing local web server on port 5050...
echo  [*] Serving frontend build with simulated Cloud Mesh & EventBridge
echo.

where php >nul 2>nul
if %ERRORLEVEL% equ 0 (
    echo  [+] PHP runtime detected. Launching PHP built-in web server...
    start http://localhost:5050
    php -S localhost:5050 -t frontend/dist
) else (
    echo  [!] PHP command not found in PATH.
    echo  [*] Opening standalone static application directly in your browser...
    start frontend\dist\index.html
    pause
)
