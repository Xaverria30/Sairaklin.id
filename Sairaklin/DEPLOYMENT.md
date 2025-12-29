# Panduan Deployment Sairaklin ke VPS

Panduan ini menjelaskan cara men-deploy aplikasi Sairaklin ke VPS menggunakan Docker dan SSL (HTTPS) dari Let's Encrypt.

## Prasyarat
1.  **VPS** (Ubuntu 20.04/22.04 recommended) dengan IP Public.
2.  **Domain** (`sairaklin.cyou`) yang sudah diarahkan (A Record) ke IP VPS.
3.  **Docker** & **Docker Compose** sudah terinstall di VPS.

## Langkah-langkah

### 1. Masuk ke VPS
SSH ke dalam server Anda:
```bash
ssh root@ip-vps-anda
```

### 2. Clone Repository
Clone repository project Anda dari GitHub:
```bash
git clone https://github.com/username-anda/repo-anda.git sairaklin
cd sairaklin
git checkout Rara-dev
```

### 3. Buat File Environment (.env.docker)
Karena file `.env` tidak di-upload ke git demi keamanan, Anda harus membuatnya manual di VPS:

```bash
nano .env.docker
```

Isi dengan konfigurasi berikut (sesuaikan password):

```ini
APP_NAME=Sairaklin
APP_ENV=production
APP_KEY=base64:Xxxxxxxxxx  # Generate/Copy dari local
APP_DEBUG=false
APP_URL=https://sairaklin.cyou

LOG_CHANNEL=stack
LOG_LEVEL=error

DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=sairaklin
DB_USERNAME=sairaklin_user
DB_PASSWORD=password_rahasia_anda_disini

BROADCAST_DRIVER=log
CACHE_DRIVER=file
FILESYSTEM_DISK=public
QUEUE_CONNECTION=sync
SESSION_DRIVER=file
SESSION_LIFETIME=120

VITE_HOST=sairaklin.cyou
VITE_PORT=3000
NEXT_PUBLIC_API_URL=https://sairaklin.cyou/api

MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=587
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=tls
MAIL_FROM_ADDRESS="no-reply@sairaklin.cyou"
```
*Simpan dengan `Ctrl+X`, lalu `Y`, lalu `Enter`.*

### 4. Update Password di docker-compose.prod.yml (Opsional)
Jika Anda mengganti password DB di `.env.docker`, pastikan `docker-compose.prod.yml` menggunakan variabel tersebut (sudah saya set agar membaca dari env).
Namun, jika Anda ingin memastikan, Anda bisa mengedit file compose:
```bash
nano docker-compose.prod.yml
```

### 5. Setup SSL (HTTPS)
Jalankan script inisialisasi SSL. Script ini akan meminta sertifikat dummy dulu, lalu merequest sertifikat asli.

```bash
chmod +x init-letsencrypt.sh
./init-letsencrypt.sh
```
*Tunggu prosesnya sampai selesai.*

### 6. Jalankan Aplikasi
Setelah SSL siap, jalankan aplikasi mode production:

```bash
docker-compose -f docker-compose.prod.yml up -d --build
```

### 7. Verifikasi
Buka browser dan akses:
- **Frontend**: https://sairaklin.cyou
- **API**: https://sairaklin.cyou/api

## Management

### Cek Logs
```bash
docker-compose -f docker-compose.prod.yml logs -f
```

### Update Aplikasi (Pull Terbaru)
Jika ada update di git:
```bash
git pull origin Rara-dev
docker-compose -f docker-compose.prod.yml up -d --build --no-deps app frontend
```

### Troubleshooting
- **502 Bad Gateway**: Biasanya container `app` atau `frontend` belum siap/crash. Cek logs.
- **Connection Refused**: Pastikan Firewall VPS membuka port 80 dan 443.
- **SSL Error**: Pastikan domain sudah benar-benar mengarah ke IP VPS sebelum menjalankan `./init-letsencrypt.sh`.
