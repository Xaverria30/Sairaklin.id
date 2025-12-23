# Sairaklin.id Project Setup & User Guide

This guide will help you set up and run the Sairaklin application (Backend & Frontend) on your local machine.

## Prerequisites

Ensure you have the following installed:
- **PHP** (v8.1 or higher)
- **Composer** (Dependency Manager for PHP)
- **Node.js** (v18-v21) & **NPM**
- **Git**

---

## 🚀 Quick Start (Automated)

We have provided batch scripts to make your life easier.

### 1. First Time Setup
If this is your first time running the project after cloning, double-click:
👉 **`setup-project.bat`**

This script will:
- Install Backend dependencies (Composer).
- Set up the environment file (`.env`) for the backend.
- Generate the application key.
- Create the SQLite database and run migrations.
- Install Frontend dependencies (NPM).

### 2. Run the Application
To start both the Backend and Frontend servers simultaneously, double-click:
👉 **`run-app.bat`**

- **Backend** will run at: `http://127.0.0.1:8000`
- **Frontend** will run at: `http://localhost:3000`

---

## 🛠 Manual Setup (If scripts fail)

If you prefer to run things manually via the terminal:

### Backend (Laravel)
1. Navigate to the backend folder:
   ```bash
   cd Sairaklin
   ```
2. Install dependencies:
   ```bash
   composer install
   ```
3. Create the configuration file:
   - Copy `.env.example` to `.env` (or create one manually).
   - Ensure `DB_CONNECTION=sqlite` is set if using SQLite.
4. Generate App Key:
   ```bash
   php artisan key:generate
   ```
5. Run Migrations:
   ```bash
   php artisan migrate
   ```
6. Start Server:
   ```bash
   php artisan serve
   ```

### Frontend (Next.js)
1. Open a new terminal and navigate to the frontend folder:
   ```bash
   cd Sairaklin/frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start Development Server:
   ```bash
   npm run dev
   ```

---

## 📂 Project Structure
- **Root Directory**: Contains these setup scripts and docs.
- **Sairaklin/**: The core Laravel Backend application.
- **Sairaklin/frontend/**: The Next.js Frontend application.

---

## 🔑 Default Credentials (Development)
If seeded, or after registering manually:
- **User Login**: Use the register page on the frontend to create an account.
- **Admin Access**: (If applicable, check database seeder or register a user and manually promote via database).

---

## 🧹 Cleaning Project (For Sharing/Zip)

If you need to share this project (e.g., zip and send to friend/lecturer), run:
👉 **`clean-project.bat`**

This will delete:
- `node_modules` (Frontend dependencies)
- `.next` (Frontend build files)
- `vendor` (Backend dependencies)

**Result:** The folder size will drop significantly (e.g., from 500MB+ to <50MB), making it safe and easy to zip.
**Note:** The recipient will need to run `setup-project.bat` again to reinstall dependencies.

Happy Coding! 🚀

---

## 📘 Dokumentasi Sistem & Arsitektur Backend

Berikut adalah penjelasan teknis detail mengenai arsitektur sistem, keamanan, handling error, dan panduan API untuk pengembang.

### 1. 🏗️ Arsitektur Backend & Clean Code
Sistem ini dibangun menggunakan **Laravel 10** dengan pendekatan **MVC (Model-View-Controller)** yang modular dan terstruktur. Prinsip **OOP** diterapkan secara ketat untuk memastikan kode mudah dipelihara (maintainable) dan dikembangkan (scalable).

*   **Modular**: Logika bisnis dipisahkan ke dalam Controller (`OrderController`, `AuthController`) dan Model (`User`, `Order`), menjaga kode tetap bersih.
*   **Separation of Concerns**: Routing (`api.php`) hanya menangani path, Controller menangani logika permintaan, dan Model menangani interaksi database.

### 2. 🛡️ Aspek Keamanan (Security)
Keamanan adalah prioritas utama dalam aplikasi ini. Implementasi mencakup:

*   **Authentication**: Menggunakan **Laravel Sanctum** untuk sistem autentikasi berbasis Token (Bearer Token). Ini memastikan stateless authentication yang aman untuk API.
*   **Password Hashing**: Semua password pengguna di-hash menggunakan **Bcrypt** melalui `Hash::make()` sebelum disimpan ke database. Password mentah tidak pernah disimpan.
*   **Authorization**: Pemeriksaan role (`admin` vs `user`) dilakukan secara eksplisit di level controller (contoh: `OrderController@index`) untuk menjaga integritas data.
*   **SQL Injection Protection**: Aplikasi menggunakan **Eloquent ORM** yang secara otomatis menggunakan *prepared statements* (PDO binding) untuk semua query database, melindunginya dari serangan SQL Injection.
*   **Mass Assignment Protection**: Model dilindungi menggunakan properti `$fillable` untuk mencegah input data berbahaya.

### 3. ⚠️ Error Handling & Logging
Sistem memiliki mekanisme penanganan error yang robust untuk memberikan feedback yang jelas namun aman:

*   **Validation**: Semua input pengguna (Register, Login, Order) divalidasi menggunakan `$request->validate()`. Jika gagal, sistem mengembalikan respon JSON standar dengan kode `422 Unprocessable Entity`.
*   **Exception Handling**: Menggunakan fitur bawaan Laravel dan `try-catch` blok (jika diperlukan) serta `findOrFail` untuk menangani data yang tidak ditemukan (mengembalikan 404 otomatis).
*   **Logging**: Error server dicatat dalam `storage/logs/laravel.log` untuk keperluan debugging tanpa mengekspos detail sensitif ke pengguna akhir.

### 4. 🚀 Optimasi Performa & Teknologi
*   **ORM Efisien**: Penggunaan Eloquent dengan Eager Loading (`with('user')`) pada `OrderController` mencegah masalah *N+1 Query Problem*.
*   **JSON Response**: API dirancang untuk mengembalikan JSON lightweight, mempercepat transfer data antara Backend dan Frontend Next.js.

### 5. 📡 Dokumentasi API (Endpoints)

Berikut adalah daftar endpoint utama yang tersedia:

| Method | Endpoint | Deskripsi | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/register` | Mendaftarkan pengguna baru | ❌ |
| `POST` | `/api/login` | Login dan mendapatkan Token | ❌ |
| `GET` | `/api/user` | Mendapatkan profil user login | ✅ |
| `PUT` | `/api/user` | Update data profil user | ✅ |
| `GET` | `/api/orders` | List pesanan (User: milik sendiri, Admin: semua) | ✅ |
| `POST` | `/api/orders` | Membuat pesanan baru | ✅ |
| `GET` | `/api/orders/{id}` | Detail pesanan spesifik | ✅ |
| `PUT` | `/api/orders/{id}` | Update status pesanan (Admin) | ✅ (Admin) |
| `DELETE`| `/api/orders/{id}` | Menghapus pesanan (Admin) | ✅ (Admin) |
| `POST` | `/api/logout` | Logout dan hapus token | ✅ |

### 6. ✅ Konfirmasi Fitur CRUD & Query
*   **Create**: User dapat membuat pesanan (`store`).
*   **Read**: User/Admin dapat melihat list dan detail (`index`, `show`).
*   **Update**: Admin dapat mengubah status pesanan (`update`), User dapat mengubah profil.
*   **Delete**: Admin dapat menghapus pesanan (`destroy`).

Semua query database telah dioptimalkan untuk keamanan dan efisiensi, ini juga dapat memastikan aplikasi berjalan lancar bahkan dengan data yang bertambah.
