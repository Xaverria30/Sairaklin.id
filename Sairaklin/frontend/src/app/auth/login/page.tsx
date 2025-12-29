'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation'; // added
import logo from "./logo.png";
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Lock, User, Eye, EyeOff } from 'lucide-react';
import Image from 'next/image';
import { fetchApi } from '@/lib/api';

function LoginContent() {
  const router = useRouter();
  // added
  const searchParams = useSearchParams();
  const loginRequired = searchParams.get('error') === 'login_required';

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Move hook definitions UP
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Guest Guard
  const [isChecking, setIsChecking] = useState(true);
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      const user = JSON.parse(userStr);
      if (user.role === 'admin') {
        router.push('/admin/admin-dashboard');
      } else {
        router.push('/user/user-dashboard');
      }
    } else {
      setIsChecking(false);
    }
  }, [router]);

  // Ensure this check is AFTER hooks
  if (isChecking) {
    return null; // or simple spinner
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username || !password) {
      setError('Username dan password harus diisi');
      return;
    }

    setIsLoading(true);

    try {
      const data = await fetchApi('/login', {
        method: 'POST',
        body: JSON.stringify({ username, password }),
        headers: { 'Content-Type': 'application/json' }
      });

      if (data.user.role === 'admin') {
        setError('Akun admin harus login melalui halaman Login Admin.');
        setIsLoading(false);
        return; // Stop execution
      }

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      router.push('/user/user-dashboard');

    } catch (err: any) {
      setError(err.message || 'Username atau password salah');
      setIsLoading(false);
    }
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

        {/* added */}
        {loginRequired && (
          <div
            className="text-center py-2 px-3 mb-3 rounded-3"
            style={{
              backgroundColor: '#eef3fb',
              color: '#4a5d85',
              border: '1px solid #91a8d0',
            }}
          >
            Harap melakukan login terlebih dahulu untuk mengakses Dashboard User.
          </div>
        )}

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
            <Form.Label>Password (Min. 6 Karakter)</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Lock size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Harus berisi huruf, angka & simbol"
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

          {error && (
            <div className="alert alert-danger text-center py-2" role="alert">
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-100 rounded-pill mt-4 fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: '#91a8d0', border: 'none' }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span>Memproses...</span>
              </>
            ) : (
              'Masuk'
            )}
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

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="text-center p-5">Loading...</div>}>
      <LoginContent />
    </Suspense>
  );
}
