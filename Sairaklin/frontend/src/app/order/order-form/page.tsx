"use client";
import React, { useState } from "react";
import { Calendar, Clock, MapPin, CheckCircle, Sparkles, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { fetchApi } from '@/lib/api';


// Types
type ServiceType = "" | "room" | "bathroom" | "both";

interface FormData {
  serviceType: ServiceType;
  date: string;
  time: string;
  address: string;
  cleaningTools: boolean;
  premiumScent: boolean;
  specialNotes: string;
  workerGender: "" | "male" | "female";
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
    address: false,
  });

  const [formData, setFormData] = useState<FormData>({
    serviceType: "",
    date: "",
    time: "",
    address: "",
    cleaningTools: false,
    premiumScent: false,
    specialNotes: "",
    workerGender: "",
  });

  const [showToast, setShowToast] = useState(false);

  const handleInputChange = (field: keyof FormData, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value as any }));
    // only clear an error if it's one of the validated fields
    if (field in errors) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {
      serviceType: !formData.serviceType,
      date: !formData.date,
      time: !formData.time,
      address: !formData.address.trim(),
    };

    setErrors(newErrors);
    return !Object.values(newErrors).some((err) => err);
  };


  const handleSubmit = async () => {
    if (!validateForm()) return;

    const orderId = "ORD-" + Date.now();
    const orderData = {
      id: orderId,
      ...formData,
    };

    try {
      await fetchApi('/orders', {
        method: 'POST',
        body: JSON.stringify(orderData),
        headers: { 'Content-Type': 'application/json' }
      });

      console.log("Order created:", orderData);
      setShowToast(true);

      setTimeout(() => {
        setShowToast(false);
        router.push("/user/user-dashboard");
      }, 1500);

    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Gagal membuat pesanan');
    }
  };

  return (
    <div style={{
      background: "linear-gradient(135deg, #fce7f3 0%, #ffffff 50%, #dbeafe 100%)",
      minHeight: "100vh",
      padding: "2rem 1rem"
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>
        {/* Back Button */}
        <button
          onClick={() => window.history.back()}
          style={{
            background: "none",
            border: "none",
            color: "#ec4899",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            marginBottom: "1.5rem",
            padding: "0.5rem",
            fontSize: "15px",
            fontWeight: "500"
          }}
        >
          <ArrowLeft size={20} />
          Kembali ke Dashboard
        </button>

        <div style={{
          background: "white",
          borderRadius: "20px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          padding: "2.5rem"
        }}>
          {/* Header */}
          <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
            <div style={{
              background: "linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)",
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto 1.5rem"
            }}>
              <Sparkles size={48} style={{ color: "#ec4899" }} />
            </div>
            <h2 style={{ fontWeight: "700", marginBottom: "0.5rem", fontSize: "28px" }}>
              Buat Pesanan Baru
            </h2>
            <p style={{ color: "#6b7280", fontSize: "15px" }}>
              Isi formulir di bawah ini untuk memesan layanan kebersihan
            </p>
          </div>

          {/* Service Type */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", fontSize: "15px" }}>
              Jenis Layanan <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <select
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                borderRadius: "10px",
                border: errors.serviceType ? "2px solid #ef4444" : "2px solid #e5e7eb",
                outline: "none"
              }}
              value={formData.serviceType}
              onChange={(e) => handleInputChange("serviceType", e.target.value)}
            >
              <option value="">-- Pilih Jenis Layanan --</option>
              <option value="room">Bersihkan Kamar (Rp 35.000)</option>
              <option value="bathroom">Bersihkan Kamar Mandi (Rp 45.000)</option>
              <option value="both">Bersihkan Kamar + Kamar Mandi (Rp 75.000)</option>
            </select>
            {errors.serviceType && (
              <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "0.5rem" }}>
                Jenis layanan wajib dipilih
              </div>
            )}
          </div>

          {/* Worker Gender */}
          <div style={{ marginBottom: "2rem" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "1rem", fontSize: "15px" }}>
              Pilih Jenis Petugas (Opsional)
            </label>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
              {/* Male */}
              <div
                onClick={() => handleInputChange("workerGender", "male")}
                style={{
                  cursor: "pointer",
                  border: formData.workerGender === "male" ? "3px solid #3b82f6" : "2px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  backgroundColor: formData.workerGender === "male" ? "#eff6ff" : "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  position: "relative"
                }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" fill="white" />
                    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="white" />
                  </svg>
                </div>
                <strong style={{ fontSize: "16px", display: "block" }}>Petugas Laki-Laki</strong>
              </div>

              {/* Female */}
              <div
                onClick={() => handleInputChange("workerGender", "female")}
                style={{
                  cursor: "pointer",
                  border: formData.workerGender === "female" ? "3px solid #ec4899" : "2px solid #e5e7eb",
                  borderRadius: "16px",
                  padding: "2rem 1.5rem",
                  textAlign: "center",
                  transition: "all 0.3s ease",
                  backgroundColor: formData.workerGender === "female" ? "#fdf2f8" : "#ffffff",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.06)"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-5px)";
                  e.currentTarget.style.boxShadow = "0 8px 20px rgba(0,0,0,0.12)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)";
                }}
              >
                <div style={{
                  width: "90px",
                  height: "90px",
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto 1.5rem",
                  position: "relative"
                }}>
                  <svg width="50" height="50" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="8" r="4" fill="white" />
                    <path d="M4 20C4 16.6863 6.68629 14 10 14H14C17.3137 14 20 16.6863 20 20V21H4V20Z" fill="white" />
                  </svg>
                </div>
                <strong style={{ fontSize: "16px", display: "block" }}>Petugas Perempuan</strong>
              </div>
            </div>

            <small style={{ color: "#6b7280", display: "block", marginTop: "1rem", fontSize: "13px" }}>
              💡 Jika tidak memilih, sistem otomatis memilihkan petugas yang tersedia.
            </small>
          </div>

          {/* Date and Time */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem", marginBottom: "1.5rem" }}>
            <div>
              <label style={{ display: "flex", alignItems: "center", fontWeight: "600", marginBottom: "0.5rem", fontSize: "15px" }}>
                <Calendar size={18} style={{ marginRight: "0.5rem" }} />
                Tanggal Pelaksanaan <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="date"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "15px",
                  borderRadius: "10px",
                  border: errors.date ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  outline: "none"
                }}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
              />
              {errors.date && (
                <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "0.5rem" }}>
                  Tanggal pelaksanaan wajib diisi
                </div>
              )}
            </div>

            <div>
              <label style={{ display: "flex", alignItems: "center", fontWeight: "600", marginBottom: "0.5rem", fontSize: "15px" }}>
                <Clock size={18} style={{ marginRight: "0.5rem" }} />
                Jam Pelaksanaan <span style={{ color: "#ef4444" }}>*</span>
              </label>
              <input
                type="time"
                style={{
                  width: "100%",
                  padding: "12px 16px",
                  fontSize: "15px",
                  borderRadius: "10px",
                  border: errors.time ? "2px solid #ef4444" : "2px solid #e5e7eb",
                  outline: "none"
                }}
                value={formData.time}
                onChange={(e) => handleInputChange("time", e.target.value)}
              />
              {errors.time && (
                <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "0.5rem" }}>
                  Jam pelaksanaan wajib diisi
                </div>
              )}
              {!errors.time && (
                <small style={{ color: "#6b7280", fontSize: "13px" }}>Jam operasional: 08:00 - 18:00</small>
              )}
            </div>
          </div>

          {/* Address */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "flex", alignItems: "center", fontWeight: "600", marginBottom: "0.5rem", fontSize: "15px" }}>
              <MapPin size={18} style={{ marginRight: "0.5rem" }} />
              Alamat Lengkap <span style={{ color: "#ef4444" }}>*</span>
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                borderRadius: "10px",
                border: errors.address ? "2px solid #ef4444" : "2px solid #e5e7eb",
                outline: "none",
                minHeight: "80px",
                lineHeight: "1.5",
                resize: "vertical",
                fontFamily: "inherit"
              }}
              placeholder="Contoh: Jl. Sudirman No. 123, Kos Melati, Kamar 5A, Lantai 2..."
              value={formData.address}
              onChange={(e) => handleInputChange("address", e.target.value)}
              rows={3}
            />
            {errors.address && (
              <div style={{ color: "#ef4444", fontSize: "13px", marginTop: "0.5rem" }}>
                Alamat lengkap wajib diisi
              </div>
            )}
          </div>

          {/* Additional Services */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "1rem", fontSize: "15px" }}>
              Layanan Tambahan (Opsional)
            </label>

            <div style={{
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1rem",
              marginBottom: "1rem"
            }}>
              <label style={{ display: "flex", alignItems: "start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.cleaningTools}
                  onChange={(e) => handleInputChange("cleaningTools", e.target.checked)}
                  style={{ marginTop: "4px", marginRight: "0.75rem" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Sertakan Alat Kebersihan</div>
                      <small style={{ color: "#6b7280" }}>Petugas membawa alat kebersihan lengkap</small>
                    </div>
                    <span style={{
                      backgroundColor: "#fce7f3",
                      color: "#be185d",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}>
                      +Rp 15.000
                    </span>
                  </div>
                </div>
              </label>
            </div>

            <div style={{
              border: "2px solid #e5e7eb",
              borderRadius: "10px",
              padding: "1rem"
            }}>
              <label style={{ display: "flex", alignItems: "start", cursor: "pointer" }}>
                <input
                  type="checkbox"
                  checked={formData.premiumScent}
                  onChange={(e) => handleInputChange("premiumScent", e.target.checked)}
                  style={{ marginTop: "4px", marginRight: "0.75rem" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
                    <div>
                      <div style={{ fontWeight: "600", marginBottom: "0.25rem" }}>Gunakan Pewangi Premium</div>
                      <small style={{ color: "#6b7280" }}>Aromaterapi premium</small>
                    </div>
                    <span style={{
                      backgroundColor: "#dbeafe",
                      color: "#1e40af",
                      padding: "0.25rem 0.75rem",
                      borderRadius: "6px",
                      fontSize: "13px",
                      fontWeight: "600"
                    }}>
                      +Rp 5.000
                    </span>
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Special Notes */}
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={{ display: "block", fontWeight: "600", marginBottom: "0.5rem", fontSize: "15px" }}>
              Catatan Khusus (Opsional)
            </label>
            <textarea
              style={{
                width: "100%",
                padding: "12px 16px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "2px solid #e5e7eb",
                outline: "none",
                minHeight: "100px",
                lineHeight: "1.5",
                resize: "vertical",
                fontFamily: "inherit"
              }}
              placeholder="Contoh: Mohon fokus pada jendela dan kamar mandi..."
              value={formData.specialNotes}
              onChange={(e) => handleInputChange("specialNotes", e.target.value)}
              rows={4}
            />
          </div>

          {/* Info Box */}
          <div style={{
            backgroundColor: "#fce7f3",
            border: "1px solid #fbcfe8",
            borderRadius: "10px",
            padding: "1rem",
            marginBottom: "1.5rem"
          }}>
            <div style={{ display: "flex", alignItems: "start" }}>
              <Sparkles size={20} style={{ color: "#ec4899", marginRight: "0.75rem", marginTop: "2px", flexShrink: 0 }} />
              <div>
                <strong style={{ display: "block", marginBottom: "0.5rem" }}>Informasi:</strong>
                <small>
                  Pesanan diproses maksimal 1 jam. Kami akan menghubungi via WhatsApp untuk konfirmasi.
                </small>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            style={{
              width: "100%",
              padding: "1rem",
              background: "linear-gradient(135deg, #ec4899 0%, #3b82f6 100%)",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "0.5rem",
              transition: "transform 0.2s ease"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-2px)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
          >
            <CheckCircle size={20} />
            Kirim Pesanan
          </button>
        </div>
      </div>

      {/* Toast */}
      {showToast && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0,0,0,0.4)",
          backdropFilter: "blur(4px)",
          zIndex: 9999,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          animation: "fadeIn 0.3s ease-out"
        }}>
          <div style={{
            background: "linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)",
            color: "white",
            padding: "2rem 3rem",
            borderRadius: "20px",
            boxShadow: "0 8px 25px rgba(0,0,0,0.35)",
            fontWeight: "700",
            fontSize: "1.5rem",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
            animation: "scaleIn 0.5s ease-out"
          }}>
            <CheckCircle size={32} />
            <span>Pesanan berhasil dibuat!</span>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.8); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        input:focus, select:focus, textarea:focus {
          border-color: #ec4899 !important;
          box-shadow: 0 0 0 3px rgba(236, 72, 153, 0.1);
        }
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default BookingFormPage;