"use client";

import React, { useState, useEffect } from "react";
import styles from "./style.module.css";
import Image from "next/image";
import logo from "./logo.png";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

type OrderStatus = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";

type Order = {
  id: string;
  nama: string;
  layanan: string;
  tanggal: string;
  waktu: string;
  alamat: string;
  petugas: string;
  nomorWaUser: string;
  nomorWaPetugas: string;
  status: OrderStatus;

  // ✅ tambahan untuk tampilkan rating di admin
  rating?: number | null;
  review?: string | null;
  reviewed_at?: string | null;
};

type AdminProfile = {
  username: string;
  namaLengkap: string;
  phone: string;
  email?: string;
};

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Popup notifikasi sukses profil
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Popup konfirmasi hapus
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const [profile, setProfile] = useState<AdminProfile>({
    username: "admin",
    namaLengkap: "Admin Sairaklin",
    phone: "+62 851-2345-6789",
    email: "admin@sairaklin.id",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AdminProfile>(profile);
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/admin-login?error=login_required");
        return;
      }
      setIsAuthChecking(false);
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!isAuthChecking) loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthChecking]);

  const loadOrders = async () => {
    setIsLoadingData(true);
    try {
      const data = await fetchApi("/orders");

      const mappedOrders: Order[] = (data || []).map((o: any) => {
        // ✅ mapping rating/review aman (SAMA kaya di user page)
        const mappedRating =
          o.rating ?? o.review_rating ?? o.review?.rating ?? o.review?.stars ?? null;
        const mappedReview =
          o.review ?? o.review_text ?? o.review?.comment ?? o.review?.review ?? null;
        const mappedReviewedAt =
          o.reviewed_at ?? o.review?.created_at ?? o.review?.reviewed_at ?? null;

        return {
          id: o.id,
          nama: o.user ? o.user.name : "Guest",
          layanan:
            o.service_type === "room"
              ? "Paket Kamar"
              : o.service_type === "bathroom"
              ? "Paket Kamar Mandi"
              : "Paket Lengkap",
          tanggal: o.date,
          waktu: o.time,
          alamat: o.address,
          petugas:
            o.worker_gender === "male"
              ? "Laki-laki"
              : o.worker_gender === "female"
              ? "Perempuan"
              : "Acak",
          nomorWaUser: o.user ? o.user.phone : "Tidak Tersedia",
          nomorWaPetugas: o.worker_phone,
          status: o.status,

          rating: mappedRating,
          review: mappedReview,
          reviewed_at: mappedReviewedAt,
        };
      });

      setOrders(mappedOrders);
    } catch (error) {
      console.error("Gagal memuat pesanan", error);
    } finally {
      setIsLoadingData(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (timeStr: string) => {
    const [hours, minutes] = (timeStr || "").split(":");
    const date = new Date();
    date.setHours(Number(hours || 0), Number(minutes || 0));
    return date.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });
  };

  const formatReviewedAt = (iso?: string | null) => {
    if (!iso) return "";
    const d = new Date(iso);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Summary
  const totalSelesai = orders.filter((o) => o.status === "Selesai").length;
  const totalPending = orders.filter((o) => o.status === "Menunggu" || o.status === "Diproses").length;
  const totalBatal = orders.filter((o) => o.status === "Dibatalkan").length;
  const totalHariIni = 0;

  // ✅ summary rating
  const ratedOrders = orders.filter((o) => typeof o.rating === "number" && (o.rating as number) > 0);
  const avgRating =
    ratedOrders.length > 0
      ? ratedOrders.reduce((acc, o) => acc + (Number(o.rating) || 0), 0) / ratedOrders.length
      : 0;

  const handleStatusChange = async (id: string, newStatus: Order["status"]) => {
    try {
      await fetchApi(`/orders/${id}`, {
        method: "PUT",
        body: JSON.stringify({ status: newStatus }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
    } catch (error) {
      alert("Gagal mengupdate status");
    }
  };

  // Hapus
  const handleDeleteClick = (id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!deleteTargetId) return;
    try {
      await fetchApi(`/orders/${deleteTargetId}`, { method: "DELETE" });
      setOrders((prev) => prev.filter((o) => o.id !== deleteTargetId));
    } catch (error) {
      alert("Gagal menghapus pesanan");
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTargetId(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  };

  const saveProfile = () => {
    setProfile(form);
    setEditing(false);
    setShowSuccessPopup(true);
    setTimeout(() => setShowSuccessPopup(false), 2800);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("admin");
    router.push("/auth/login");
  };

  // ✅ komponen bintang (admin)
  const StarsInline: React.FC<{ value: number }> = ({ value }) => {
    const v = Math.max(0, Math.min(5, Number(value) || 0));
    const full = Math.floor(v);
    return (
      <span className="d-inline-flex align-items-center gap-1" aria-label={`${v} dari 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span key={i} style={{ fontSize: 16, lineHeight: 1, color: i < full ? "#f59e0b" : "#cbd5e1" }}>
            ★
          </span>
        ))}
        <span style={{ marginLeft: 6, fontSize: 12, color: "#64748b", fontWeight: 700 }}>
          {v.toFixed(1)}
        </span>
      </span>
    );
  };

  if (isAuthChecking) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: "#f0f4f8" }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {/* Popup Notifikasi Profil */}
      {showSuccessPopup && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 150,
            backgroundColor: "rgba(0,0,0,0.1)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            userSelect: "none",
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "1rem 2rem",
              borderRadius: "16px",
              border: "1px solid #d7c8d7",
              minWidth: "280px",
              maxWidth: "90vw",
              boxShadow: "0 4px 8px rgba(215, 192, 215, 0.7)",
              color: "#475569",
              fontWeight: "400",
              fontSize: "1rem",
              textAlign: "center",
              fontFamily: "'Inter', sans-serif",
            }}
          >
            Profil Anda telah diperbarui
          </div>
        </div>
      )}

      {/* Popup konfirmasi hapus */}
      {showDeleteConfirm && (
        <div className={styles.successPopup}>
          <div className={styles.popupContent} style={{ maxWidth: "340px", padding: "1.5rem", textAlign: "center" }}>
            <h4 style={{ marginBottom: "1rem", color: "#ec4899", fontWeight: "700" }}>Konfirmasi Hapus</h4>
            <p style={{ marginBottom: "1.5rem" }}>Apakah Anda yakin ingin menghapus pesanan ini?</p>
            <div style={{ display: "flex", justifyContent: "center", gap: "1rem" }}>
              <button
                onClick={confirmDelete}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "12px",
                  border: "none",
                  backgroundColor: "#ec4899",
                  color: "#fff",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Hapus
              </button>
              <button
                onClick={cancelDelete}
                style={{
                  padding: "0.6rem 1.2rem",
                  borderRadius: "12px",
                  border: "1px solid #ccc",
                  backgroundColor: "#fff",
                  color: "#475569",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image src={logo} alt="Sairaklin" width={60} height={60} style={{ borderRadius: "12px", marginBottom: "10px" }} />
          <span>Sairaklin.id</span>
        </div>

        <nav className={styles.nav}>
          <button className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`} onClick={() => setActiveTab("dashboard")}>
            <div className={styles.navIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect x="3" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="3" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
                <rect x="14" y="14" width="7" height="7" rx="1" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Dashboard</span>
          </button>

          <button className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`} onClick={() => setActiveTab("profile")}>
            <div className={styles.navIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
              </svg>
            </div>
            <span>Profil</span>
          </button>
        </nav>

        <button className={styles.logout} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Keluar</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerText}>
                  <h2>Dashboard Admin</h2>
                  <p className={styles.welcomeText}>Kelola semua pesanan layanan kebersihan</p>
                  <div className={styles.adminGreeting}>
                    <div className={styles.adminAvatar}>A</div>
                    <div className={styles.adminInfo}>
                      <p className={styles.adminName}>{profile.namaLengkap}</p>
                      <p className={styles.adminRole}>Administrator</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Status Summary */}
            <section className={styles.statusSummary}>
              <div className={`${styles.statusCard} ${styles.today}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                    <path d="M16 2V6M8 2V6M3 10H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p>Pesanan Hari Ini</p>
                  {isLoadingData ? <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50px", height: "30px" }} /> : <h3>{totalHariIni}</h3>}
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.done}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p>Total Selesai</p>
                  {isLoadingData ? <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50px", height: "30px" }} /> : <h3>{totalSelesai}</h3>}
                </div>
              </div>

              {/* ✅ kartu rating summary */}
              <div className={`${styles.statusCard} ${styles.processing}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2l3 7h7l-5.5 4 2 7L12 16l-6.5 4 2-7L2 9h7l3-7z" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </span>
                <div>
                  <p>Rating Rata-rata</p>
                  {isLoadingData ? (
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "80px", height: "30px" }} />
                  ) : (
                    <>
                      <h3 style={{ lineHeight: 1.1 }}>{avgRating ? avgRating.toFixed(1) : "0.0"}</h3>
                      <div style={{ fontSize: 12, color: "#64748b", fontWeight: 700 }}>{ratedOrders.length} review</div>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* Orders List */}
            <section className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3>Daftar Pesanan</h3>
              </div>

              <div className={styles.ordersList}>
                {isLoadingData ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className={`${styles.orderCard} ${styles.skeletonCard}`}>
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "40%", marginBottom: "10px" }} />
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "30%", marginBottom: "20px" }} />
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                    </div>
                  ))
                ) : (
                  orders.map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <h4>{order.nama}</h4>
                          <p>{order.layanan}</p>
                        </div>

                        <select
                          className={`${styles.statusSelect} ${styles[order.status.toLowerCase()]}`}
                          value={order.status}
                          onChange={(e) => handleStatusChange(order.id, e.target.value as Order["status"])}
                        >
                          <option value="Menunggu">Menunggu</option>
                          <option value="Diproses">Diproses</option>
                          <option value="Selesai">Selesai</option>
                          <option value="Dibatalkan">Dibatalkan</option>
                        </select>
                      </div>

                      <div className={styles.orderDetails}>
                        <div>
                          <p>
                            <strong>Tanggal & Waktu:</strong> {formatDate(order.tanggal)} • {formatTime(order.waktu)}
                          </p>
                          <p>
                            <strong>Pilihan Petugas:</strong> {order.petugas}
                          </p>
                          <p>
                            <strong>Nomor WA Pengguna:</strong> {order.nomorWaUser}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Alamat:</strong> {order.alamat}
                          </p>
                        </div>
                      </div>

                      {/* ✅ HASIL RATING USER */}
                      <div style={{ marginTop: 10 }}>
                        <div
                          style={{
                            padding: "10px 12px",
                            borderRadius: 14,
                            border: "1px solid rgba(148,163,184,.35)",
                            background: "rgba(248,250,252,.9)",
                          }}
                        >
                          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
                            <div style={{ fontWeight: 800, color: "#0f172a" }}>Rating & Ulasan</div>

                            {order.rating ? (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  background: "rgba(34,197,94,.12)",
                                  color: "#16a34a",
                                  border: "1px solid rgba(34,197,94,.25)",
                                }}
                              >
                                Reviewed
                              </span>
                            ) : (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  padding: "6px 10px",
                                  borderRadius: 999,
                                  background: "rgba(100,116,139,.10)",
                                  color: "#64748b",
                                  border: "1px solid rgba(100,116,139,.20)",
                                }}
                              >
                                Belum ada rating
                              </span>
                            )}
                          </div>

                          <div style={{ marginTop: 8 }}>
                            {order.rating ? (
                              <>
                                <StarsInline value={Number(order.rating)} />
                                {order.reviewed_at && (
                                  <div style={{ marginTop: 6, fontSize: 12, color: "#64748b" }}>
                                    Diulas: <strong>{formatReviewedAt(order.reviewed_at)}</strong>
                                  </div>
                                )}
                                {order.review && (
                                  <div style={{ marginTop: 8, fontSize: 13, color: "#334155", lineHeight: 1.5 }}>
                                    “{order.review}”
                                  </div>
                                )}
                              </>
                            ) : (
                              <div style={{ fontSize: 13, color: "#64748b", marginTop: 6 }}>
                                User belum memberikan rating untuk pesanan ini.
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className={styles.orderActions}>
                        <button className={styles.deleteBtn} onClick={() => handleDeleteClick(order.id)}>
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 6H5H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path
                              d="M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M19 6V20C19 20.5304 18.7893 21.0391 18.4142 21.4142C18.0391 21.7893 17.5304 22 17 22H7C6.46957 22 5.96086 21.7893 5.58579 21.4142C5.21071 21.0391 5 20.5304 5 20V6H19Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Hapus
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            <h3>Profil Admin</h3>
            <p className="text-muted mb-4">Kelola informasi akun administrator</p>

            <div className={styles.profileGrid}>
              <div className={styles.profileCard}>
                <div className={styles.profileHeader}>
                  <div className={styles.profileAvatarLarge}>{profile.namaLengkap.charAt(0).toUpperCase()}</div>
                  <div className={styles.profileBadge}>Admin</div>
                </div>
                <h5>{profile.namaLengkap}</h5>
                <p>@{profile.username}</p>
                <p>{profile.phone}</p>
                {profile.email && <p>{profile.email}</p>}

                <button
                  className={styles.editBtn}
                  onClick={() => {
                    setEditing(true);
                    setForm(profile);
                  }}
                >
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M11 4H4C3.46957 4 2.96086 4.21071 2.58579 4.58579C2.21071 4.96086 2 5.46957 2 6V20C2 20.5304 2.21071 21.0391 2.58579 21.4142C2.96086 21.7893 3.46957 22 4 22H18C18.5304 22 19.0391 21.7893 19.4142 21.4142C19.7893 21.0391 20 20.5304 20 20V13"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M18.5 2.50023C18.8978 2.1024 19.4374 1.87891 20 1.87891C20.5626 1.87891 21.1022 2.1024 21.5 2.50023C21.8978 2.89805 22.1213 3.43762 22.1213 4.00023C22.1213 4.56284 21.8978 5.1024 21.5 5.50023L12 15.0002L8 16.0002L9 12.0002L18.5 2.50023Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Edit Profil
                </button>
              </div>

              <div className={styles.profileCard}>
                {editing ? (
                  <>
                    <h6>Edit Profil Admin</h6>
                    <div className="mb-3">
                      <label className="form-label small">Nama Lengkap</label>
                      <input className="form-control" value={form.namaLengkap} onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Username</label>
                      <input className="form-control" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Nomor Telepon</label>
                      <input className="form-control" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Email</label>
                      <input className="form-control" type="email" value={form.email || ""} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={saveProfile}>
                        Simpan
                      </button>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() => {
                          setForm(profile);
                          setEditing(false);
                        }}
                      >
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted mt-5" style={{ fontStyle: "normal" }}>
                    <svg className={styles.emptyIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 15V17M12 7V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    </svg>
                    <p>Klik "Edit Profil" untuk mengubah informasi administrator</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
