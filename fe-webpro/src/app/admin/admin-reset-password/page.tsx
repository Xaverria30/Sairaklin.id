'use client';

import { useState } from 'react';
import { Form, Button, Card, InputGroup } from 'react-bootstrap';
import { Mail } from 'lucide-react';
import Image from 'next/image';
import { toast, Toaster } from 'sonner';

export default function AdminResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Alamat email wajib diisi.');
      return;
    }

    if (!email.endsWith('@sairaklin.id')) {
      setError('Gunakan email resmi admin dengan domain @sairaklin.id.');
      return;
    }

    // Simulasi pengiriman link reset password
    toast.success('Link reset password telah dikirim ke email admin.');
    setEmail('');
  };

  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center min-vh-100 p-4"
      style={{
        background: 'linear-gradient(to bottom right, #a9b8cf, #e6e8eb)',
      }}
    >
      <Card
        className="shadow border-0 p-4 rounded-4"
        style={{
          maxWidth: 420,
          width: '100%',
          background: 'rgba(255, 255, 255, 0.85)',
          backdropFilter: 'blur(10px)',
        }}
      >
        {/* Logo */}
        <div className="text-center mb-4">
          <Image
            src="/logo.png"
            alt="Logo Sairaklin"
            width={64}
            height={64}
            className="mb-2"
          />
        </div>

        <div className="text-center mb-4">
          <h5 className="fw-semibold text-dark mb-1">Reset Password Admin</h5>
          <p className="text-muted small mb-0">
            Masukkan email admin resmi Anda untuk menerima tautan reset
          </p>
        </div>

        <Form onSubmit={handleSubmit}>
          {/* Email */}
          <Form.Group className="mb-3">
            <Form.Label>Alamat Email Admin</Form.Label>
            <InputGroup>
              <InputGroup.Text className="bg-white border-end-0 rounded-start-pill">
                <Mail size={18} className="text-secondary" />
              </InputGroup.Text>
              <Form.Control
                type="email"
                placeholder="contoh@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border-start-0 rounded-end-pill"
              />
            </InputGroup>
            {error && <div className="text-danger small mt-2 ms-1">{error}</div>}
          </Form.Group>

          <Button
            type="submit"
            className="w-100 rounded-pill mt-2 fw-semibold text-white"
            style={{ backgroundColor: '#7489b6', border: 'none' }}
          >
            Kirim Link Reset
          </Button>
        </Form>

        {/* Footer */}
        <div className="text-center mt-4">
          <small className="text-muted">
            Kembali ke{' '}
            <a
              href="/admin/admin-login"
              className="text-decoration-none"
              style={{ color: '#7489b6' }}
            >
              portal admin
            </a>
          </small>
        </div>
      </Card>

      <Toaster position="top-center" richColors />
    </div>
  );
}
