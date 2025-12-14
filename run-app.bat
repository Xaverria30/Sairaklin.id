@echo off
echo ========================================================
echo             STARTING SAIRAKLIN APP
echo ========================================================
echo.

echo Starting Backend Server (Laravel)...
start "Sairaklin Backend" cmd /k "cd Sairaklin && php artisan serve"

echo Starting Frontend Server (Next.js)...
start "Sairaklin Frontend" cmd /k "cd Sairaklin/frontend && npm run dev"

echo.
echo ========================================================
echo    Servers are running in separate windows.
echo    Backend: http://127.0.0.1:8000
echo    Frontend: http://localhost:3000
echo ========================================================
echo.
echo Press any key to close this launcher (servers will keep running)...
pause
exit
