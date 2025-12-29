#!/bin/sh
set -e

# Install dependencies if vendor directory is missing
if [ ! -d "vendor" ]; then
    echo "Vendor directory not found, running composer install..."
    composer install --no-scripts --no-autoloader
    composer dump-autoload
fi

# Wait for the database to be ready
echo "Waiting for database connection..."
until php artisan db:monitor > /dev/null 2>&1; do
  echo "Database is not ready yet. Retrying in 5 seconds..."
  sleep 5
done

# Run migrations
echo "Running migrations..."
php artisan config:clear
# Check environment
if [ "$APP_ENV" = "production" ]; then
    echo "Running in PRODUCTION mode."
    echo "Running migrations (safe mode)..."
    php artisan migrate --force
else
    echo "Running in DEVELOPMENT mode."
    # WARNING: migrate:fresh will wipe data!
    php artisan migrate:fresh --seed --force
fi

# Fix permissions
echo "Fixing permissions..."
mkdir -p /var/www/storage/framework/views
mkdir -p /var/www/storage/framework/sessions
mkdir -p /var/www/storage/framework/cache
mkdir -p /var/www/bootstrap/cache

chown -R www-data:www-data /var/www/storage /var/www/bootstrap/cache || true
chmod -R 775 /var/www/storage /var/www/bootstrap/cache || true

echo "Linking storage directory..."
php artisan storage:link || true

echo "Starting PHP-FPM..."
exec php-fpm
