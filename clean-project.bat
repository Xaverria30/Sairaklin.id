@echo off
echo ========================================================
echo        SAIRAKLIN PROJECT CLEANER (FOR SHARING)
echo ========================================================
echo.
echo This script will DELETE 'node_modules', 'vendor', and build files.
echo This significantly reduces file size for sharing/zipping.
echo.
echo WARNING: You will need to run 'setup-project.bat' again to run the app.
echo.
set /p confirm="Are you sure you want to proceed? (y/n): "
if /i "%confirm%" neq "y" exit /b

echo.
echo [1/3] Cleaning Backend (Laravel)...
if exist Sairaklin\vendor (
    echo Removing Sairaklin\vendor...
    rmdir /s /q Sairaklin\vendor
) else (
    echo Sairaklin\vendor not found (already clean).
)

echo.
echo [2/3] Cleaning Frontend (Next.js)...
if exist Sairaklin\frontend\node_modules (
    echo Removing Sairaklin\frontend\node_modules...
    rmdir /s /q Sairaklin\frontend\node_modules
) else (
    echo Sairaklin\frontend\node_modules not found (already clean).
)

if exist Sairaklin\frontend\.next (
    echo Removing Sairaklin\frontend\.next...
    rmdir /s /q Sairaklin\frontend\.next
)

echo.
echo [3/3] Done! Project is ready to be zipped.
echo.
pause
