"use client";
import React, { useState } from 'react';
import { Calendar, Clock, MapPin, CheckCircle, Sparkles, ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';
import Head from 'next/head';

// Types
type ServiceType = '' | 'room' | 'bathroom' | 'both';

interface FormData {
  serviceType: ServiceType;
  date: string;
  time: string;
  address: string;
  cleaningTools: boolean;
  premiumScent: boolean;
  specialNotes: string;
}

interface FormErrors {
  serviceType: boolean;
  date: boolean;
  time: boolean;
  address: boolean;
}

const BookingFormPage: React.FC = () => {
  const router = useRouter();
  const [errors, setErrors] = useState<FormErrors>({
    serviceType: false,
    date: false,
    time: false,
    address: false
  });
  const [formData, setFormData] = useState<FormData>({
    serviceType: '',
    date: '',
    time: '',
    address: '',
    cleaningTools: false,
    premiumScent: false,
    specialNotes: ''
  });

  
  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: false }));
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      serviceType: !formData.serviceType,
      date: !formData.date,
      time: !formData.time,
      address: !formData.address.trim()
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(error => error);
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const orderId = 'ORD-' + Date.now();
    const orderData = {
      ...formData,
      id: orderId,
      createdAt: new Date().toLocaleString('id-ID')
    };

    localStorage.setItem('currentOrder', JSON.stringify(orderData));

    // Tampilkan toast
    setShowToast(true);

    // Redirect setelah 1,5 detik
    setTimeout(() => {
      setShowToast(false);
      router.push('/order/order-detail');
    }, 1500);
  };

  return (
    <>
      <Head>
        <title>Buat Pesanan Baru - Sairaklin.id</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
      </Head>

      <div className="container py-4">
        <div className="row justify-content-center">
          <div className="col-lg-8">

            {/* Back Button */}
            <button 
              onClick={() => router.push('/user/user-dashboard')}
              className="btn btn-link p-0 mb-3 text-decoration-none d-flex align-items-center"
              style={{color: '#ec4899'}}
            >
              <ArrowLeft size={20} className="me-2" />
              Kembali ke Dashboard
            </button>

            <div className="card shadow border-0">
              <div className="card-body p-4">
                <div className="text-center mb-4">
                  <div className="d-inline-flex align-items-center justify-content-center rounded-circle p-3 mb-3" style={{
                    background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)'
                  }}>
                    <Sparkles size={48} style={{color: '#ec4899'}} />
                  </div>
                  <h2 className="fw-bold mb-2">Buat Pesanan Baru</h2>
                  <p className="text-muted">Isi formulir di bawah ini untuk memesan layanan kebersihan</p>
                </div>

                {/* Service Type */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Jenis Layanan <span className="text-danger">*</span>
                  </label>
                  <select 
                    className={`form-select ${errors.serviceType ? 'is-invalid' : ''}`}
                    value={formData.serviceType}
                    onChange={(e) => handleInputChange('serviceType', e.target.value)}
                  >
                    <option value="">-- Pilih Jenis Layanan --</option>
                    <option value="room">Bersihkan Kamar (Rp 35.000)</option>
                    <option value="bathroom">Bersihkan Kamar Mandi (Rp 45.000)</option>
                    <option value="both">Bersihkan Kamar + Kamar Mandi (Rp 75.000)</option>
                  </select>
                  {errors.serviceType && (
                    <div className="invalid-feedback d-block">Jenis layanan wajib dipilih</div>
                  )}
                </div>

                {/* Date and Time */}
                <div className="row mb-3">
                  <div className="col-md-6 mb-3 mb-md-0">
                    <label className="form-label fw-semibold">
                      <Calendar size={18} className="me-2" />
                      Tanggal Pelaksanaan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="date"
                      className={`form-control ${errors.date ? 'is-invalid' : ''}`}
                      value={formData.date}
                      onChange={(e) => handleInputChange('date', e.target.value)}
                    />
                    {errors.date && (
                      <div className="invalid-feedback d-block">Tanggal pelaksanaan wajib diisi</div>
                    )}
                  </div>
                  <div className="col-md-6">
                    <label className="form-label fw-semibold">
                      <Clock size={18} className="me-2" />
                      Jam Pelaksanaan <span className="text-danger">*</span>
                    </label>
                    <input
                      type="time"
                      className={`form-control ${errors.time ? 'is-invalid' : ''}`}
                      value={formData.time}
                      onChange={(e) => handleInputChange('time', e.target.value)}
                    />
                    {errors.time && (
                      <div className="invalid-feedback d-block">Jam pelaksanaan wajib diisi</div>
                    )}
                    {!errors.time && (
                      <small className="text-muted">Jam operasional: 08:00 - 18:00</small>
                    )}
                  </div>
                </div>

                {/* Address */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    <MapPin size={18} className="me-2" />
                    Alamat Lengkap / Detail Lokasi <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.address ? 'is-invalid' : ''}`}
                    placeholder="Contoh: Jl. Sudirman No. 123, Kos Melati, Kamar 5A, Lantai 2&#10;Patokan: Dekat minimarket Alfamart"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    onInput={(e) => {
                      const target = e.target as HTMLTextAreaElement;
                      target.style.height = 'auto';
                      target.style.height = `${target.scrollHeight}px`;
                    }}
                    style={{ overflow: 'hidden', minHeight: '60px' }}
                    rows={1}
                    autoFocus
                  />
                  {errors.address && (
                    <div className="invalid-feedback d-block">Alamat lengkap wajib diisi</div>
                  )}
                </div>

                {/* Additional Services */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Layanan Tambahan (Opsional)</label>
                  <div className="card mb-2 border">
                    <div className="card-body">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="cleaningTools"
                          checked={formData.cleaningTools}
                          onChange={(e) => handleInputChange('cleaningTools', e.target.checked)}
                        />
                        <label className="form-check-label w-100" htmlFor="cleaningTools">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-semibold">Sertakan Alat Kebersihan</div>
                              <small className="text-muted">Petugas membawa alat kebersihan lengkap</small>
                            </div>
                            <span className="badge" style={{backgroundColor: '#fce7f3', color: '#be185d'}}>+Rp 15.000</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="card border">
                    <div className="card-body">
                      <div className="form-check">
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id="premiumScent"
                          checked={formData.premiumScent}
                          onChange={(e) => handleInputChange('premiumScent', e.target.checked)}
                        />
                        <label className="form-check-label w-100" htmlFor="premiumScent">
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <div className="fw-semibold">Gunakan Pewangi Premium</div>
                              <small className="text-muted">Pewangi ruangan aromaterapi</small>
                            </div>
                            <span className="badge" style={{backgroundColor: '#dbeafe', color: '#1e40af'}}>+Rp 5.000</span>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Special Notes */}
                <div className="mb-3">
                  <label className="form-label fw-semibold">Catatan Khusus (Opsional)</label>
                  <textarea
                    className="form-control"
                    rows={3}
                    placeholder="Tambahkan catatan jika ada area yang perlu perhatian khusus, misalnya: 'Mohon fokus pada jendela dan kamar mandi'"
                    value={formData.specialNotes}
                    onChange={(e) => handleInputChange('specialNotes', e.target.value)}
                  />
                </div>

                {/* Info Box */}
                <div className="alert mb-3" style={{
                  backgroundColor: '#fce7f3',
                  borderColor: '#fbcfe8',
                  border: '1px solid'
                }}>
                  <div className="d-flex align-items-start">
                    <Sparkles size={20} className="me-2 mt-1 flex-shrink-0" style={{color: '#ec4899'}} />
                    <div>
                      <strong className="d-block mb-1">Informasi:</strong>
                      <small>Pesanan Anda akan diproses maksimal 1 jam. Kami akan menghubungi Anda via WhatsApp untuk konfirmasi.</small>
                    </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  onClick={handleSubmit}
                  className="btn w-100 d-flex align-items-center justify-content-center text-white"
                  style={{
                    background: 'linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)'
                  }}
                >
                  <CheckCircle size={20} className="me-2" />
                  Kirim Pesanan
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Full-Screen Toast Overlay */}
        {showToast && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            backgroundColor: 'rgba(0,0,0,0.4)',
            backdropFilter: 'blur(4px)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)',
              color: 'white',
              padding: '2rem 3rem',
              borderRadius: '20px',
              boxShadow: '0 8px 25px rgba(0,0,0,0.35)',
              fontWeight: 700,
              fontSize: '1.5rem',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
              animation: 'toastIn 0.5s ease-out, toastOut 0.5s ease-in 1.2s forwards'
            }}>
              <CheckCircle size={32} style={{animation: 'bounce 0.7s ease', color: 'white'}} />
              <span>Pesanan berhasil dibuat!</span>
            </div>
          </div>
        )}

      </div>

      <style jsx global>{`
        body {
          background: linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #dbeafe 100%);
          min-height: 100vh;
          margin: 0;
        }

        @keyframes toastIn {
          0% { opacity: 0; transform: scale(0.8); }
          100% { opacity: 1; transform: scale(1); }
        }
        @keyframes toastOut {
          0% { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(0.8); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </>
  );
};

export default BookingFormPage;
