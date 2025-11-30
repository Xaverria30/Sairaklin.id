# Sairaklin.id Backend API

This is the Laravel backend for the Sairaklin.id application. It uses Supabase (PostgreSQL) as the database and Laravel Sanctum for authentication.

## Setup

1.  **Install Dependencies**
    ```bash
    composer install
    ```

2.  **Environment Setup**
    Ensure your `.env` file is configured with your Supabase credentials (already done).

3.  **Run Migrations**
    ```bash
    php artisan migrate
    ```

4.  **Start Server**
    Since you are using Windows and might need to enable PostgreSQL drivers explicitly:
    ```bash
    ./serve.bat
    ```
    Or manually:
    ```bash
    php -d extension=pdo_pgsql -d extension=pgsql -S 127.0.0.1:8000 -t public
    ```
    The API will be available at `http://localhost:8000`.

## API Endpoints

### Authentication
-   **Register**: `POST /api/register`
    -   Body: `name`, `email`, `username`, `password`, `phone` (opt), `bio` (opt)
-   **Login**: `POST /api/login`
    -   Body: `email`, `password`
-   **Logout**: `POST /api/logout` (Requires Auth)
-   **Get Profile**: `GET /api/user` (Requires Auth)
-   **Update Profile**: `PUT /api/user` (Requires Auth)
    -   Body: `name`, `phone`, `bio`, `password` (opt)

### Orders (User)
-   **List Orders**: `GET /api/orders` (Requires Auth)
-   **Create Order**: `POST /api/orders` (Requires Auth)
    -   Body: `service_type`, `service_price`, `date`, `time`, `address`, `cleaning_tools` (bool), `premium_scent` (bool), `special_notes`, `total_price`
-   **Show Order**: `GET /api/orders/{id}` (Requires Auth)

### Admin
-   **List All Orders**: `GET /api/admin/orders` (Requires Auth, currently open to any auth user, middleware recommended for production)
-   **Update Status**: `PUT /api/admin/orders/{id}/status`
    -   Body: `status` ('Menunggu', 'Diproses', 'Selesai', 'Dibatalkan')
-   **Delete Order**: `DELETE /api/admin/orders/{id}`
-   **List Users**: `GET /api/admin/users`

## Notes
-   The API returns a Bearer token upon login/register. Include this token in the `Authorization` header for protected routes: `Authorization: Bearer <your-token>`.
