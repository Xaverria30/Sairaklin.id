@echo off
title Sairaklin.id Launcher
echo ==========================================
echo   Sairaklin.id - Application Launcher
echo ==========================================
echo.

echo [1/2] Starting Backend Server (Laravel)...
:: Membuka terminal baru untuk Backend
start "Sairaklin Backend" /D "backend" cmd /k "call serve.bat"

echo [2/2] Starting Frontend Server (Next.js)...
:: Membuka terminal baru untuk Frontend
start "Sairaklin Frontend" cmd /k "npm run dev"

echo.
echo ==========================================
echo   Application is running!
echo ==========================================
echo.
echo Backend URL: http://127.0.0.1:8000
echo Frontend URL: http://localhost:3000
echo.
echo JANGAN TUTUP terminal Backend dan Frontend yang baru terbuka.
echo Anda bisa menutup jendela ini sekarang.
echo.
pause
