'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Lock, User, UserPlus, Eye, EyeOff, Mail } from 'lucide-react';
import { toast, Toaster } from 'sonner';

export default function RegisterPage() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [usernameStatus, setUsernameStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle');

  // Simulasi data username yang sudah terdaftar
  const existingUsernames = ['admin', 'user'];


  const validatePassword = (pass: string): boolean => {
    const regex = /^(?=.*[A-Za-z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/;
    return regex.test(pass);
  };

  const handleUsernameCheck = () => {
    // Kalau belum diisi, jangan lanjut
    if (!username.trim()) return;

    // Ubah status jadi "checking" sementara
    setUsernameStatus('checking');

    // Simulasikan pengecekan ke "database"
    setTimeout(() => {
      const isTaken = existingUsernames.some(
        (u) => u.toLowerCase() === username.toLowerCase()
      );

      if (isTaken) {
        setUsernameStatus('taken'); // username sudah digunakan
      } else {
        setUsernameStatus('available'); // username tersedia
      }
    }, 800); // sedikit lebih cepat biar responsif
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { [key: string]: string } = {};

    // Validasi wajib isi
    if (!fullName) newErrors.fullName = 'Nama lengkap wajib diisi.';

    // ✅ Validasi email Gmail
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

    // Validasi username sudah ada
    if (usernameStatus === 'taken') {
      newErrors.username = 'Username sudah digunakan, silakan pilih yang lain.';
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) return;

    // Jika semua valid
    toast.success('Akun berhasil dibuat! Silakan login.');
    setTimeout(() => {
      window.location.href = '/user/user-dashboard';
    }, 1500);
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
          <Image src="/logo.png" alt="Sairaklin.id Logo" width={64} height={64} className="mb-3" />
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
                placeholder="Masukkan email Gmail Anda"
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
                placeholder="Pilih username unik"
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
            <Form.Label>Password</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Lock size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Minimal 6 karakter, huruf & simbol"
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
            className="w-100 py-2 rounded-pill fw-semibold text-white"
            style={{ backgroundColor: '#91a8d0', border: 'none' }}
          >
            Daftar Sekarang
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
