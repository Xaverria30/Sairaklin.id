@echo off
echo ========================================================
echo          SAIRAKLIN PROJECT SETUP WIZARD
echo ========================================================
echo.

echo [1/5] Installing Backend dependencies...
cd Sairaklin
call composer install
if %errorlevel% neq 0 (
    echo Error installing backend dependencies!
    pause
    exit /b %errorlevel%
)

echo.
echo [2/5] Setting up Environment File...
if not exist .env (
    echo Creating .env file...
    copy .env.example .env
    if not exist .env (
        echo creating default sqlite .env
        (
            echo APP_NAME=Sairaklin
            echo APP_ENV=local
            echo APP_KEY=
            echo APP_DEBUG=true
            echo APP_URL=http://localhost
            echo DB_CONNECTION=sqlite
            echo SESSION_DRIVER=file
        ) > .env
    )
)

echo.
echo [3/5] Generating Application Key...
call php artisan key:generate

echo.
echo [4/5] Setting up Database...
if not exist database\database.sqlite (
    echo Creating database.sqlite...
    type nul > database\database.sqlite
)
call php artisan migrate --force

echo.
echo [5/5] Installing Frontend dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo Error installing frontend dependencies!
    pause
    exit /b %errorlevel%
)

echo.
echo ========================================================
echo           SETUP COMPLETE! READY TO LAUNCH.
echo ========================================================
echo.
echo You can now run the application using 'run-app.bat'
pause
