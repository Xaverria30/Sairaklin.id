'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Lock, User, UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import { toast, Toaster } from 'sonner';
import logo from "./logo.png";
import { fetchApi } from '@/lib/api';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
  const router = useRouter();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');
  const [isLoading, setIsLoading] = useState(false);

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

  if (isChecking) return null;

  // Simulasi data username yang sudah terdaftar
  const existingUsernames = ['admin', 'user'];


  const validatePassword = (pass: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return regex.test(pass);
  };

  const handleUsernameCheck = () => {
    // Removed simulation, backend handles uniqueness
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validasi wajib isi
    if (!fullName) newErrors.fullName = 'Nama lengkap wajib diisi.';

    // Validasi email Gmail
    if (!email) {
      newErrors.email = 'Email wajib diisi.';
    } else if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/i.test(email)) {
      newErrors.email = 'Email harus menggunakan domain @gmail.com.';
    }

    if (!username) newErrors.username = 'Username wajib diisi.';
    if (!password) newErrors.password = 'Password wajib diisi.';
    if (!confirmPassword) newErrors.confirmPassword = 'Konfirmasi password wajib diisi.';

    // Validasi password & konfirmasi
    if (password && !validatePassword(password)) {
      newErrors.password = 'Password minimal 6 karakter dan harus berisi huruf dan simbol.';
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Password tidak cocok.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    setIsLoading(true);

    try {
      await fetchApi('/register', {
        method: 'POST',
        body: JSON.stringify({ fullName, username, email, password }),
        headers: { 'Content-Type': 'application/json' }
      });
      toast.success('Akun berhasil dibuat! Silakan login.');
      setTimeout(() => {
        window.location.href = '/auth/login';
      }, 1500);
    } catch (err: any) {
      toast.error(err.message || 'Gagal mendaftar');
      setIsLoading(false);
      if (err.message.includes('Username')) {
        setErrors({ ...newErrors, username: 'Username sudah digunakan' });
      }
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center min-vh-100 py-5"
      style={{
        background: 'linear-gradient(to bottom right, #b4c8ea, #ffdcdb)',
      }}
    >
      <Card
        className="border-0 p-4 shadow-lg"
        style={{
          borderRadius: '1.5rem',
          maxWidth: '420px',
          width: '100%',
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <Image src={logo} alt="Sairaklin.id Logo" width={64} height={64} className="mb-3" />
        </div>

        <h4 className="text-center fw-semibold mb-1">Daftar Akun Baru</h4>
        <p className="text-center text-muted small mb-4">
          Bergabung dan nikmati layanan kebersihan terbaik
        </p>

        <Form noValidate onSubmit={handleSubmit}>
          {/* Nama Lengkap */}
          <Form.Group className="mb-3">
            <Form.Label>Nama Lengkap</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <UserPlus size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Masukkan nama lengkap"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                isInvalid={!!errors.fullName}
                className="border-start-0 rounded-end-pill"
              />
              <Form.Control.Feedback type="invalid" className="ms-2 small">
                {errors.fullName}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Mail size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="Masukkan akun Gmail Anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                isInvalid={!!errors.email}
                className="border-start-0 rounded-end-pill"
              />
              <Form.Control.Feedback type="invalid" className="ms-2 small">
                {errors.email}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Username */}
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <User size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Buat username unik"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  setUsernameStatus('idle');
                }}
                onBlur={handleUsernameCheck}
                isInvalid={!!errors.username}
                className="border-start-0 rounded-end-pill"
              />
              <Form.Control.Feedback type="invalid" className="ms-2 small">
                {errors.username}
              </Form.Control.Feedback>
            </InputGroup>

            {/* Status Info */}
            {usernameStatus === 'checking' && !errors.username && (
              <div className="small text-info mt-1 ms-2">Memeriksa username...</div>
            )}
            {usernameStatus === 'available' && !errors.username && (
              <div className="small text-success mt-1 ms-2">Username tersedia ✓</div>
            )}
          </Form.Group>

          {/* Password */}
          <Form.Group className="mb-3">
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
                isInvalid={!!errors.password}
                className="py-2 border-start-0 rounded-end-pill"
              />
              <Button
                variant="light"
                onClick={() => setShowPassword(!showPassword)}
                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
              <Form.Control.Feedback type="invalid" className="ms-2 small">
                {errors.password}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Konfirmasi Password */}
          <Form.Group className="mb-3">
            <Form.Label>Konfirmasi Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Lock size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Ulangi password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                isInvalid={!!errors.confirmPassword}
                className="py-2 border-start-0 rounded-end-pill"
              />
              <Button
                variant="light"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="position-absolute end-0 top-50 translate-middle-y border-0 bg-transparent me-2"
              >
                {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </Button>
              <Form.Control.Feedback type="invalid" className="ms-2 small">
                {errors.confirmPassword}
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>

          {/* Submit */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-100 py-2 rounded-pill fw-semibold text-white d-flex align-items-center justify-content-center gap-2"
            style={{ backgroundColor: '#91a8d0', border: 'none' }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm" aria-hidden="true"></span>
                <span>Memproses...</span>
              </>
            ) : (
              'Daftar Sekarang'
            )}
          </Button>
        </Form>

        {/* Footer */}
        <p className="text-center mt-4 mb-0 small text-muted">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="text-decoration-none" style={{ color: '#91a8d0' }}>
            Masuk di sini
          </a>
        </p>

        <div className="text-center mt-2">
          <a href="/" className="small text-secondary text-decoration-none">
            ← Kembali ke Beranda
          </a>
        </div>
      </Card>

      <Toaster position="top-center" richColors />
    </div>
  );
}
