# 📡 Dokumentasi API Lengkap - Sairaklin.id

Dokumen ini berisi spesifikasi teknis lengkap untuk setiap endpoint API, mencakup URL, method HTTP, format Request, format Response, dan lokasi kode implementasi di backend.

---

## 🔐 Auth Endpoints

Lokasi Kontroller: `app/Http/Controllers/AuthController.php`

### 1. Register (Daftar Akun)
Mendaftarkan pengguna baru ke dalam sistem.

*   **URL**: `/api/register`
*   **Method**: `POST`
*   **Implementasi**: Method `register()` di `AuthController.php`

**Request Body (JSON):**
```json
{
    "fullName": "Budi Santoso",
    "username": "budis",
    "email": "budi@example.com",
    "password": "password123"
}
```

**Response Sukses (201 Created):**
```json
{
    "message": "User registered successfully",
    "access_token": "1|AbCdEfRhIjKlMn...",
    "token_type": "Bearer",
    "user": {
        "id": 1,
        "name": "Budi Santoso",
        "username": "budis",
        "email": "budi@example.com",
        "role": "user",
        "created_at": "2024-01-01T10:00:00.000000Z"
    }
}
```

---

### 2. Login
Masuk ke sistem untuk mendapatkan akses token.

*   **URL**: `/api/login`
*   **Method**: `POST`
*   **Implementasi**: Method `login()` di `AuthController.php`

**Request Body (JSON):**
```json
{
    "username": "budis",
    "password": "password123"
}
```

**Response Sukses (200 OK):**
```json
{
    "message": "Login successful",
    "access_token": "2|XyZ123...",
    "token_type": "Bearer",
    "user": { ... } // Data user lengkap
}
```

**Response Error (422 Unprocessable Entity):**
```json
{
    "message": "The given data was invalid.",
    "errors": {
        "username": ["Username atau password salah."]
    }
}
```

---

### 3. User Profile
Mendapatkan data profil pengguna yang sedang login.

*   **URL**: `/api/user`
*   **Method**: `GET`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `me()` di `AuthController.php`

**Response Sukses (200 OK):**
```json
{
    "id": 1,
    "name": "Budi Santoso",
    "username": "budis",
    "email": "budi@example.com",
    "phone": "08123456789",
    "bio": "Saya suka kebersihan",
    "role": "user"
}
```

---

### 4. Update Profile
Memperbarui data profil pengguna.

*   **URL**: `/api/user`
*   **Method**: `PUT`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `updateProfile()` di `AuthController.php`

**Request Body (JSON):**
```json
{
    "name": "Budi Update",
    "username": "budi_baru",
    "email": "budi.baru@example.com",
    "phone": "08987654321",
    "bio": "Bio baru",
    "current_password": "password123", // Opsional, wajib jika ganti password
    "new_password": "passwordBaru",      // Opsional
    "new_password_confirmation": "passwordBaru" // Opsional
}
```

**Response Sukses (200 OK):**
```json
{
    "message": "Profile updated successfully",
    "user": { ... } // Data user terbaru
}
```

---

### 5. Logout
Menghapus token autentikasi pengguna saat ini.

*   **URL**: `/api/logout`
*   **Method**: `POST`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `logout()` di `AuthController.php`

**Response Sukses (200 OK):**
```json
{
    "message": "Logged out successfully"
}
```

---

## 📦 Order Endpoints (Manajemen Pesanan)

Lokasi Kontroller: `app/Http/Controllers/OrderController.php`

### 1. Get All Orders (List Pesanan)
*   **User**: Mengembalikan daftar pesanan milik user tersebut.
*   **Admin**: Mengembalikan daftar pesanan seluruh user.

*   **URL**: `/api/orders`
*   **Method**: `GET`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `index()` di `OrderController.php`

**Response Sukses (200 OK):**
```json
[
    {
        "id": "ORD-12345",
        "user_id": 1,
        "service_type": "room",
        "status": "Menunggu",
        "date": "2024-12-25",
        "time": "10:00",
        "address": "Jl. Telekomunikasi No. 1",
        "total_price": 25000,
        "user": { // Admin only: Data user pemesan
            "id": 1,
            "name": "Budi Santoso"
        }
    },
    { ... }
]
```

---

### 2. Create Order (Buat Pesanan Baru)
Membuat pesanan layanan baru.

*   **URL**: `/api/orders`
*   **Method**: `POST`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `store()` di `OrderController.php`

**Request Body (JSON):**
```json
{
    "id": "ORD-20241220-ABCD",
    "serviceType": "room", // room, bathroom, both
    "date": "2024-12-30",
    "time": "14:00",
    "address": "Gedung TULT Lantai 5",
    "cleaningTools": true,
    "premiumScent": false,
    "specialNotes": "Kunci ada di satpam",
    "workerGender": "male"
}
```

**Response Sukses (201 Created):**
```json
{
    "id": "ORD-20241220-ABCD",
    "status": "Menunggu",
    "service_type": "room",
    "date": "2024-12-30",
    ...
}
```

---

### 3. Get Order Detail
Mendapatkan detail lengkap satu pesanan.

*   **URL**: `/api/orders/{id}`
*   **Method**: `GET`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `show()` di `OrderController.php`

**Response Sukses (200 OK):**
```json
{
    "id": "ORD-12345",
    "status": "Diproses",
    "address": "...",
    "created_at": "...",
    ...
}
```

---

### 4. Update Order Status (Admin Only)
Mengubah status pesanan (misal: dari 'Menunggu' ke 'Selesai').

*   **URL**: `/api/orders/{id}`
*   **Method**: `PUT`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `update()` di `OrderController.php`

**Request Body (JSON):**
```json
{
    "status": "Selesai" // Pilihan: Menunggu, Diproses, Selesai, Dibatalkan
}
```

**Response Sukses (200 OK):**
```json
{
    "id": "ORD-12345",
    "status": "Selesai",
    ...
}
```

**Response Error (403 Forbidden):**
Jika user bukan admin mencoba endpoint ini.
```json
{
    "message": "Unauthorized"
}
```

---

### 5. Delete Order (Admin Only)
Menghapus data pesanan dari sistem.

*   **URL**: `/api/orders/{id}`
*   **Method**: `DELETE`
*   **Header**: `Authorization: Bearer <token>`
*   **Implementasi**: Method `destroy()` di `OrderController.php`

**Response Sukses (200 OK):**
```json
{
    "message": "Order deleted"
}
```

**Response Error (404 Not Found):**
Jika ID pesanan tidak ditemukan.
