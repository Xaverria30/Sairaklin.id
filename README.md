# Sairaklin.id

Sairaklin.id adalah aplikasi web layanan kebersihan (cleaning service) yang dibangun dengan **Next.js** (Frontend) dan **Laravel** (Backend API).

## 📋 Prasyarat (Prerequisites)

Sebelum menjalankan aplikasi, pastikan komputer Anda telah terinstal:

1.  **Node.js** (v18 atau terbaru) & **npm**
2.  **PHP** (v8.2 atau terbaru)
3.  **Composer** (untuk dependensi PHP)
4.  **PostgreSQL** (Database)

## 🛠️ Instalasi

### 1. Clone Repository
Pastikan Anda sudah berada di dalam folder project `Sairaklin.id`.

### 2. Setup Backend (Laravel)
Buka terminal dan jalankan perintah berikut:

```bash
cd backend
composer install
cp .env.example .env
php artisan key:generate
```

**Konfigurasi Database:**
Buka file `backend/.env` dan sesuaikan konfigurasi database PostgreSQL Anda:
```env
DB_CONNECTION=pgsql
DB_HOST=127.0.0.1
DB_PORT=5432
DB_DATABASE=sairaklin
DB_USERNAME=postgres
DB_PASSWORD=password_anda
```

**Migrasi & Seeding:**
```bash
php artisan migrate --seed
```
*Ini akan membuat tabel dan mengisi data awal (user & admin).*

### 3. Setup Frontend (Next.js)
Kembali ke root folder dan install dependensi:

```bash
cd ..
npm install
```

## 🚀 Cara Menjalankan Aplikasi

Anda tidak perlu menjalankan backend dan frontend secara terpisah. Kami telah menyediakan script otomatis.

### Menggunakan Script Otomatis (Windows)

Cukup klik dua kali file **`start-app.bat`** di folder root, atau jalankan via terminal:

```bash
.\start-app.bat
```

Script ini akan membuka dua jendela terminal baru:
1.  **Backend Server**: Berjalan di `http://127.0.0.1:8000`
2.  **Frontend Server**: Berjalan di `http://localhost:3000`

Buka browser dan akses **[http://localhost:3000](http://localhost:3000)**.

---

### Cara Menjalankan Manual (Alternatif)

Jika script otomatis tidak berjalan, Anda bisa menjalankannya secara manual:

**Terminal 1 (Backend):**
```bash
cd backend
call serve.bat
# Atau: php artisan serve
```

**Terminal 2 (Frontend):**
```bash
npm run dev
```

## 👤 Akun Demo

Gunakan akun berikut untuk masuk ke aplikasi:

### 1. User (Pelanggan)
*   **Email:** `shania@example.com`
*   **Password:** `12345678`

### 2. Admin
*   **Email:** `admin@sairaklin.id`
*   **Password:** `admin123`

## 📂 Struktur Project

*   `src/` - Source code Frontend (Next.js)
*   `backend/` - Source code Backend (Laravel)
*   `start-app.bat` - Script launcher