// src/app/order-detail/page.tsx
"use client";

import React, { useEffect, useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Types
type ServiceType = '' | 'male' | 'female';

interface FormData {
  serviceType: ServiceType;
  date: string;
  time: string;
  address: string;
  cleaningTools: boolean;
  premiumScent: boolean;
  specialNotes: string;
}

interface Order extends FormData {
  id: string;
  createdAt: string;
}

const OrderDetailPage: React.FC = () => {
  const router = useRouter();
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // Ambil data order dari localStorage
  useEffect(() => {
    const orderData = localStorage.getItem("currentOrder");
    if (orderData) {
      setCurrentOrder(JSON.parse(orderData));
    } else {
      router.push("/order/order-form");
    }
  }, [router]);

  // Hitung total tambahan
  const calculateTotal = (order: FormData): number => {
    let total = 0;
    if (order.cleaningTools) total += 20000;
    if (order.premiumScent) total += 15000;
    return total;
  };

  if (!currentOrder) {
    return <div className="p-4">Loading...</div>;
  }

  const total = calculateTotal(currentOrder);

  return (
    <>
      <Head>
        <title>Rincian Pesanan - Sairaklin.id</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {/* Back Button */}
            <button
              onClick={() => router.push('/user/user-dashboard')}
              className="btn btn-link p-0 mb-3 text-decoration-none d-flex align-items-center"
              style={{ color: '#ec4899' }}
            >
              <ArrowLeft size={20} className="me-2" />
              Kembali ke Dashboard
            </button>

            <div className="card shadow border-0">

              {/* Header */}
              <div className="card-header text-white p-4"
                style={{
                  background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)'
                }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h2 className="h3 mb-2 fw-bold">Rincian Pesanan</h2>
                    <p className="mb-0 opacity-75">ID Pesanan: {currentOrder.id}</p>
                  </div>

                  <div className="rounded-circle p-3" style={{ backgroundColor: 'rgba(255,255,255,0.2)' }}>
                    <CheckCircle size={48} />
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="card-body p-4">

                {/* Status */}
                <div className="alert d-flex align-items-center mb-4"
                  style={{
                    backgroundColor: '#fce7f3',
                    borderColor: '#fbcfe8',
                    border: '1px solid'
                  }}>
                  <div className="spinner-grow spinner-grow-sm me-3" role="status" style={{ color: '#ec4899' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <div>
                    <p className="fw-bold mb-1" style={{ color: '#831843' }}>Status: Menunggu Konfirmasi</p>
                    <p className="mb-0 small" style={{ color: '#be185d' }}>
                      Dibuat pada: {currentOrder.createdAt}
                    </p>
                  </div>
                </div>

                {/* Detail Layanan */}
                <h5 className="fw-bold mb-3">Detail Layanan</h5>
                <div className="mb-4">

                  {/* Jenis Petugas */}
                  <div className="card mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                      border: 'none'
                    }}>
                    <div className="card-body d-flex align-items-center">

                      {/* ICON M/F */}
                      <div className="me-3">
                        {currentOrder.serviceType === "male" ? (
                          <svg width="28" height="28" fill="#3b82f6" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                          </svg>
                        ) : (
                          <svg width="28" height="28" fill="#ec4899" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z" />
                          </svg>
                        )}
                      </div>

                      <div>
                        <small className="text-muted d-block mb-1">Jenis Petugas</small>
                        <span className="fw-semibold">
                          {currentOrder.serviceType === "male"
                            ? "Petugas Laki-laki"
                            : "Petugas Perempuan"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tanggal */}
                  <div className="card mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                      border: 'none'
                    }}>
                    <div className="card-body d-flex align-items-center">
                      <Calendar size={28} className="me-3" style={{ color: '#ec4899' }} />
                      <div>
                        <small className="text-muted d-block mb-1">Tanggal Pelaksanaan</small>
                        <span className="fw-semibold">{currentOrder.date}</span>
                      </div>
                    </div>
                  </div>

                  {/* Jam */}
                  <div className="card mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                      border: 'none'
                    }}>
                    <div className="card-body d-flex align-items-center">
                      <Clock size={28} className="me-3" style={{ color: '#3b82f6' }} />
                      <div>
                        <small className="text-muted d-block mb-1">Jam Pelaksanaan</small>
                        <span className="fw-semibold">{currentOrder.time}</span>
                      </div>
                    </div>
                  </div>

                  {/* Alamat */}
                  <div className="card mb-3"
                    style={{
                      background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                      border: 'none'
                    }}>
                    <div className="card-body d-flex align-items-start">
                      <MapPin size={28} className="me-3 mt-1" style={{ color: '#ec4899' }} />
                      <div className="flex-grow-1">
                        <small className="text-muted d-block mb-1">Alamat Lengkap</small>
                        <span className="fw-semibold" style={{ whiteSpace: 'pre-line' }}>
                          {currentOrder.address}
                        </span>
                      </div>
                    </div>
                  </div>

                </div>

                {/* Layanan Tambahan */}
                {(currentOrder.cleaningTools || currentOrder.premiumScent) && (
                  <div className="mb-4">
                    <h5 className="fw-bold mb-3">Layanan Tambahan</h5>

                    {currentOrder.cleaningTools && (
                      <div className="card mb-2"
                        style={{
                          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                          border: 'none'
                        }}>
                        <div className="card-body d-flex justify-content-between align-items-center py-3">
                          <span>Sertakan Alat Kebersihan</span>
                          <span className="fw-bold" style={{ color: '#ec4899' }}>Rp 20.000</span>
                        </div>
                      </div>
                    )}

                    {currentOrder.premiumScent && (
                      <div className="card"
                        style={{
                          background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)',
                          border: 'none'
                        }}>
                        <div className="card-body d-flex justify-content-between align-items-center py-3">
                          <span>Gunakan Pewangi Premium</span>
                          <span className="fw-bold" style={{ color: '#3b82f6' }}>Rp 15.000</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Catatan */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Catatan Khusus (Opsional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    value={currentOrder.specialNotes}
                    readOnly
                  />
                </div>

                {/* Total */}
                {total > 0 && (
                  <div className="border-top pt-4 mb-4">
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold fs-5">Total Biaya Tambahan</span>
                      <span className="fw-bold fs-4" style={{ color: '#ec4899' }}>
                        Rp {total.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                )}

                {/* Informasi */}
                <div className="alert"
                  style={{
                    backgroundColor: '#fce7f3',
                    borderColor: '#fbcfe8',
                    border: '1px solid'
                  }}>
                  <div className="d-flex align-items-start">
                    <Sparkles size={20} className="me-2 mt-1" style={{ color: '#ec4899' }} />
                    <div>
                      <strong className="d-block mb-1">Informasi Penting:</strong>
                      <small>
                        Tim kami akan menghubungi Anda melalui WhatsApp dalam waktu maksimal 1 jam
                        untuk konfirmasi lebih lanjut.
                      </small>
                    </div>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Background */}
      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #dbeafe 100%);
          min-height: 100vh;
          margin: 0;
        }
      `}</style>
    </>
  );
};

export default OrderDetailPage;