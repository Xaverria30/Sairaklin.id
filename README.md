# Sairaklin Project Setup & User Guide

This guide will help you set up and run the Sairaklin application (Backend & Frontend) on your local machine.

## Prerequisites

Ensure you have the following installed:
- **PHP** (v8.1 or higher)
- **Composer** (Dependency Manager for PHP)
- **Node.js** (v18 or higher) & **NPM**
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