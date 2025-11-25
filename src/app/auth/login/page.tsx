'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import logo from "./logo.png"; 
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    // Cek kalau yang login adalah admin
    if (username === 'admin' && password === 'admin12!') {
      router.push('/admin/admin-login');
      return;
    }

    // Jika bukan admin, maka login user
    if (username !== 'user' || password !== 'user34#') {
      setError('Username atau password salah');
      return;
    }
    router.push('/user/user-dashboard');
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4"
      style={{
        background: 'linear-gradient(to bottom right, #b4c8ea, #ffdcdb)',
      }}
    >
      <Card
        className="shadow border-0 p-4 rounded-4"
        style={{
          maxWidth: 420,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <Image
            src={logo}
            alt="Logo Sairaklin"
            width={64}
            height={64}
            className="mb-2"
          />
        </div>

        <div className="text-center mb-4">
          <h5 className="fw-semibold text-dark mb-1">Selamat Datang!</h5>
          <p className="text-muted mb-0">Masuk ke akun pengguna Anda</p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <User size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Masukkan username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border-start-0 rounded-end-pill"
              />
            </InputGroup>
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-1 position-relative">
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Lock size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Masukkan password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="border-start-0 rounded-end-pill"
              />
              <Button
                variant="light"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
            </InputGroup>
          </Form.Group>

          {/* 🔗 Lupa Password */}
          <div className="text-end mb-3">
            <a
              href="/auth/reset-password"
              className="small text-decoration-none"
              style={{ color: '#91a8d0' }}
            >
              Lupa password?
            </a>
          </div>

          {error && (
            <div className="alert alert-danger text-center py-2" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-100 rounded-pill mt-2 fw-semibold text-white"
            style={{ backgroundColor: '#91a8d0', border: 'none' }}
          >
            Masuk
          </Button>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">
            Belum punya akun?{' '}
            <a
              href="/auth/register"
              className="text-decoration-none"
              style={{ color: '#91a8d0' }}
            >
              Daftar di sini
            </a>
          </small>
        </div>

         {/* Tambahan: Login sebagai admin */}
         <div className="text-center mt-4">
          <small className="text-muted">
            Ingin masuk sebagai admin?{' '}
            <a
              href="/admin/admin-login"
              className="text-decoration-none"
              style={{ color: '#91a8d0' }}
            >
              Login sebagai Admin
            </a>
          </small>
        </div>
      </Card>

      <div className="mt-4">
        <a href="/" className="text-secondary text-decoration-none">
          ← Kembali ke Beranda
        </a>
      </div>
    </div>
  );
}
