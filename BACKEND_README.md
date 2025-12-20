# 📘 Dokumentasi Teknis Backend - Sairaklin.id

Dokumen ini disusun sebagai laporan teknis mendalam mengenai implementasi backend sistem Sairaklin, mencakup arsitektur kode, keamanan, efisiensi database, dan dokumentasi API sesuai dengan kriteria penilaian tugas besar.

---

## 1. Implementasi Fungsionalitas Utama

### ✅ Fitur Utama Berfungsi dengan Baik
Backend telah berhasil mengimplementasikan seluruh alur bisnis utama aplikasi layanan kebersihan:
*   **Manajemen Akun**: Pengguna dapat mendaftar (Register), masuk (Login), dan mengelola profil mereka.
*   **Pemesanan Layanan**: Pengguna dapat membuat pesanan baru dengan memilih jenis layanan (Kamar/Kamar Mandi) dan waktu.
*   **Manajemen Pesanan (Admin)**: Admin memiliki akses khusus untuk melihat semua pesanan masuk, mengubah status pesanan (Menunggu -> Diproses -> Selesai), dan menghapus pesanan yang tidak valid.
*   **Riwayat Pesanan**: Pengguna dapat melihat riwayat pesanan mereka sendiri secara real-time.

### 🧩 Kode Modular & Clean Code (OOP)
Aplikasi dibangun di atas framework **Laravel 10** dengan menerapkan prinsip **Object-Oriented Programming (OOP)** dan **MVC (Model-View-Controller)** yang ketat untuk memastikan kode bersih, **modular**, dan mudah dipelihara (maintainable).

*   **Pemisahan Tanggung Jawab (Separation of Concerns)**:
    *   **Model** (`app/Models/Order.php`, `User.php`): Hanya bertanggung jawab atas struktur data dan hubungan antar tabel database.
    *   **Controller** (`app/Http/Controllers/`): Bertanggung jawab menangani logika permintaan HTTP. Logika autentikasi dipisahkan secara rapi di `AuthController.php`, sementara manajemen pesanan berada di `OrderController.php`.
    *   **Routes** (`routes/api.php`): Bertanggung jawab mendefinisikan endpoint API tanpa mencampuradukkan logika bisnis di dalamnya.

---

## 2. Penggunaan Teknologi Backend

### 🛠️ Framework & Teknologi
Backend ini memanfaatkan **Laravel 10**, framework PHP modern yang dipilih karena ekosistemnya yang kuat, keamanan bawaan, dan struktur kode yang elegan.

*   **Laravel Sanctum**: Digunakan untuk sistem autentikasi API berbasis token (SPAs & Mobile Apps). Sanctum memberikan solusi autentikasi yang *lightweight* namun sangat aman dibandingkan sesi tradisional.
*   **Eloquent ORM**: Digunakan untuk berinteraksi dengan database menggunakan sintaks PHP yang ekspresif, mengurangi kebutuhan menulis query SQL mentah yang rentan kesalahan.

### 🚀 Optimasi Performa
Untuk memastikan performa backend tetap optimal saat menangani permintaan API:
*   **Eager Loading**: Pada `OrderController.php`, teknik *Eager Loading* diimplementasikan menggunakan method `with('user')`.
    ```php
    // Optimasi: Mengambil data order BESERTA user-nya dalam 1 query efisien
    // Mencegah masalah 'N+1 Query Problem' yang memperlambat aplikasi
    Order::with('user')->orderBy('created_at', 'desc')->get();
    ```
*   **Stateless API**: Arsitektur REST API bersifat *stateless*, artinya server tidak membebani memori dengan menyimpan sesi user, membuat respons lebih cepat dan skalabilitas lebih mudah.

---

## 3. Integrasi dengan Database

### 💾 Operasi CRUD Berfungsi Benar
Operasi **Create, Read, Update, Delete (CRUD)** diimplementasikan secara penuh pada `OrderController.php`:
1.  **Create**: Method `store()` menyisipkan data pesanan baru ke database.
2.  **Read**: Method `index()` menampilkan daftar pesanan (difilter berdasarkan role User/Admin) dan `show()` menampilkan detail spesifik.
3.  **Update**: Method `update()` memungkinkan Admin mengubah status pesanan.
4.  **Delete**: Method `destroy()` memungkinkan Admin menghapus data pesanan.

### 🔒 Query Aman & Efisien (SQL Injection Protection)
Keamanan database menjadi prioritas utama:
*   **Prepared Statements**: Seluruh interaksi database menggunakan fitur binding parameter bawaan Laravel (PDO). Ini secara otomatis membersihkan input pengguna, membuat aplikasi **kebal terhadap serangan SQL Injection**.
    ```php
    // Input 'id' dari user dibersihkan otomatis, SQL Injection tidak mungkin terjadi
    Order::where('id', $id)->firstOrFail();
    ```
*   **Database Transaction**: Operasi update profil menggunakan metode standar Eloquent yang, jika dikembangkan lebih lanjut ke sistem multi-table, dapat dengan mudah dibungkus dalam DB Transaction untuk menjaga integritas data.

---

## 4. Handling Error dan Keamanan

### 🛡️ Aspek Keamanan (Security)
Penerapan standar keamanan industri:
1.  **Authentication**: Endpoint sensitif dilindungi middleware `auth:sanctum`. Hanya request dengan Token Bearer valid yang diizinkan masuk.
2.  **Authorization (Role-Based)**: Sistem membedakan hak akses antara 'user' dan 'admin' secara eksplisit di level kode backend.
    ```php
    if ($request->user()->role !== 'admin') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }
    ```
3.  **Hashing Password**: Password pengguna **tidak pernah** disimpan dalam bentuk teks biasa. Semua password di-hash menggunakan algoritma **Bcrypt** (`Hash::make()`) yang aman.

### ⚠️ Error Handling & Logging
Sistem memberikan feedback yang jelas saat terjadi kesalahan, tanpa membocorkan detail sistem:
*   **Validasi Input**: Validasi ketat dilakukan di awal setiap controller method menggunakan `$request->validate()`. Jika input tidak sesuai (misal: email tidak valid, field kosong), sistem otomatis mengembalikan status `422 Unprocessable Entity` dengan pesan error spesifik dalam format JSON.
*   **Handling 404**: Penggunaan method `findOrFail()` memastikan bahwa jika data yang diminta tidak ada, sistem mengembalikan respon 404 standar secara otomatis, bukan error sistem yang berantakan.
*   **Logging**: Kesalahan pada sisi server (Server Error 500) dicatat secara otomatis oleh Laravel ke dalam file log (`storage/logs`), memudahkan proses debugging oleh developer.

---

## 5. Kualitas Dokumentasi

### 🏗️ Arsitektur Backend
Backend beroperasi sebagai penyedia layanan data (API Provider) untuk Frontend Next.js.
1.  **Client Request**: Frontend mengirim HTTP Request (GET/POST/PUT/DELETE) membawa JSON.
2.  **Route**: `api.php` menerima request dan mengarahkannya ke Controller yang tepat.
3.  **Controller**: Memvalidasi input, menjalankan logika bisnis (misal: cek role admin), dan memanggil Model.
4.  **Model**: Berinteraksi dengan tabel Database (Users, Orders).
5.  **Response**: Controller mengembalikan HTTP Response berupa format **JSON** yang konsisten ke Frontend.

### 📡 Dokumentasi API (Endpoints)

Berikut adalah daftar endpoint API yang tersedia dan telah diuji fungsionalitasnya:

| Method | Endpoint | Fungsi | Auth (Token) | Akses Role |
| :--- | :--- | :--- | :--- | :--- |
| **AUTH** | | | | |
| `POST` | `/api/register` | Mendaftarkan akun baru | ❌ | Publik |
| `POST` | `/api/login` | Login user & generate token | ❌ | Publik |
| `POST` | `/api/logout` | Menghapus token (Logout) | ✅ | User/Admin |
| **USER** | | | | |
| `GET` | `/api/user` | Melihat data profil sendiri | ✅ | User/Admin |
| `PUT` | `/api/user` | Mengupdate profil sendiri | ✅ | User/Admin |
| **ORDERS** | | | | |
| `GET` | `/api/orders` | User: Lihat pesanan sendiri<br>Admin: Lihat SEMUA pesanan | ✅ | User/Admin |
| `POST` | `/api/orders` | Membuat pesanan baru | ✅ | User |
| `GET` | `/api/orders/{id}` | Melihat detail satu pesanan | ✅ | User/Admin |
| `PUT` | `/api/orders/{id}` | Mengubah status pesanan | ✅ | **Admin Only** |
| `DELETE`| `/api/orders/{id}` | Menghapus pesanan | ✅ | **Admin Only** |

Semua endpoint mengembalikan respon dalam format JSON (`application/json`) dengan dukungan kode status HTTP standar (200 OK, 201 Created, 401 Unauthorized, 404 Not Found, 422 Validasi Error).
