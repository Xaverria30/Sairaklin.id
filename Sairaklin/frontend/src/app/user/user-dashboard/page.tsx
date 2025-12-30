"use client";

import React, { useEffect, useState } from "react";
import styles from "./user.module.css";
import logo from "./logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { fetchApi } from "@/lib/api";

// Jika Bootstrap CSS belum di-load global, aktifkan baris ini:
// import "bootstrap/dist/css/bootstrap.min.css";

type OrderStatus = "Menunggu" | "Diproses" | "Selesai";

interface Profile {
  namaLengkap: string;
  username: string;
  phone: string;
  password: string;
  email?: string;
  bio?: string;
}

type OrderUI = {
  id: string;
  jenis: string;
  tipe: string;
  tanggal: string;
  petugas: string;
  alamat: string;
  status: OrderStatus;
  catatan?: string;

  rating?: number | null;
  review?: string | null;
  reviewed_at?: string | null;
};

const DashboardUser: React.FC = () => {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<"dashboard" | "profile" | "history">("dashboard");
  const [editing, setEditing] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const [profile, setProfile] = useState<Profile>({
    namaLengkap: "",
    username: "",
    phone: "",
    password: "",
    email: "",
    bio: "",
  });

  const [form, setForm] = useState(profile);
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");

  const [orders, setOrders] = useState<OrderUI[]>([]);

  // Auth checking state
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Loading data state
  const [isLoadingData, setIsLoadingData] = useState(false);

  // ===== Rating & Review Modal (Bootstrap) =====
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewOrderId, setReviewOrderId] = useState<string | null>(null);
  const [rating, setRating] = useState<number>(0);
  const [hoverRating, setHoverRating] = useState<number>(0); // ✅ FIX: state hover (dipakai di modal)
  const [reviewText, setReviewText] = useState<string>("");
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState<string | null>(null);
  const [isReadOnly, setIsReadOnly] = useState(false);

  const getServiceName = (type: string) => {
    if (type === "room") return "Paket Kamar";
    if (type === "bathroom") return "Paket Kamar Mandi";
    if (type === "both") return "Paket Lengkap";
    return type;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  // ✅ FIX: helper untuk label & emoji (dipakai di modal)
  const ratingLabel = (v: number) => {
    if (v <= 0) return "Pilih bintang";
    if (v === 1) return "Kurang memuaskan";
    if (v === 2) return "Cukup";
    if (v === 3) return "Baik";
    if (v === 4) return "Sangat baik";
    return "Luar biasa";
  };

  const ratingEmoji = (v: number) => {
    if (v <= 0) return "🙂";
    if (v === 1) return "😞";
    if (v === 2) return "😐";
    if (v === 3) return "🙂";
    if (v === 4) return "😍";
    return "🤩";
  };

  // ✅ FIX: style objects yang dipakai modal (chipBtn, starBtnBase, starBtnActive)
  const chipBtn: React.CSSProperties = {
    borderRadius: 999,
    border: "1px solid rgba(59,130,246,0.25)",
    background: "rgba(59,130,246,0.10)",
    color: "#1d4ed8",
    fontWeight: 700,
  };

  const starBtnBase: React.CSSProperties = {
    width: 52,
    height: 52,
    borderRadius: 14,
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(245,158,11,0.35)", // Use longhand to avoid conflict
    background: "rgba(245,158,11,0.12)",
    color: "rgba(15,23,42,0.35)",
    fontSize: 28,
    lineHeight: 1,
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    transition:
      "transform 0.12s ease, box-shadow 0.12s ease, background 0.12s ease, color 0.12s ease",
  };

  const starBtnActive: React.CSSProperties = {
    background: "linear-gradient(135deg,#f59e0b 0%, #f97316 100%)",
    color: "#fff",
    borderColor: "rgba(249,115,22,0.35)",
    boxShadow: "0 12px 24px rgba(245,158,11,0.22)",
  };

  // ===== auth check =====
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth/login?error=login_required");
        return;
      }
      setIsAuthChecking(false);
    };
    checkAuth();
  }, [router]);

  // ===== load data =====
  useEffect(() => {
    if (isAuthChecking) return;

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const userData = await fetchApi("/user");

        const newProfile: Profile = {
          namaLengkap: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || "",
          bio: userData.bio || "",
          password: "",
        };

        setProfile(newProfile);
        setForm(newProfile);

        const orderData = await fetchApi("/orders");

        const mappedOrders: OrderUI[] = (orderData || []).map((o: any) => {
          // mapping rating/review aman (tanpa ubah BE)
          const mappedRating =
            o.rating ?? o.review_rating ?? o.review?.rating ?? o.review?.stars ?? null;
          const mappedReview =
            o.review?.comment ?? o.review?.review ?? (typeof o.review === "string" ? o.review : null) ?? o.review_text ?? null;
          const mappedReviewedAt =
            o.reviewed_at ?? o.review?.created_at ?? o.review?.reviewed_at ?? null;

          return {
            id: o.id,
            jenis: getServiceName(o.service_type),
            tipe: "Layanan Kebersihan",
            tanggal: `${formatDate(o.date)} • ${o.time}`,
            petugas:
              o.worker_gender === "male"
                ? "Laki-Laki"
                : o.worker_gender === "female"
                  ? "Perempuan"
                  : "Acak",
            alamat: o.address,
            status: o.status,
            catatan: o.special_notes,

            rating: mappedRating,
            review: mappedReview,
            reviewed_at: mappedReviewedAt,
          };
        });

        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Failed to load data", err);
        if (err?.message === "Unauthenticated.") {
          router.push("/auth/login?error=session_expired");
        }
      } finally {
        setIsLoadingData(false);
      }
    };

    loadData();
  }, [isAuthChecking, router]);

  // ===== derived data (tanpa useMemo untuk menghindari hook-order issue) =====
  const completedOrders = orders.filter((o) => o.status === "Selesai");

  // ===== handlers =====
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  };

  const handleViewDetail = (orderId: string) => {
    router.push(`/order/detail/order/${orderId}`);
  };

  const handleWhatsApp = (orderId: string) => {
    const message = encodeURIComponent(`Halo, saya ingin menanyakan pesanan dengan ID: ${orderId}`);
    window.open(`https://wa.me/6289699021374?text=${message}`, "_blank");
  };

  const saveProfile = async () => {
    try {
      const payload: any = {
        name: form.namaLengkap,
        username: form.username,
        email: form.email,
        phone: form.phone,
        bio: form.bio,
      };

      if (newPassword) {
        if (!oldPassword) {
          alert("Masukkan password lama untuk mengganti password!");
          return;
        }

        if (newPassword === oldPassword) {
          alert("Password baru tidak boleh sama dengan password lama!");
          return;
        }

        const confirmChange = window.confirm("Apakah Anda yakin ingin mengubah password?");
        if (!confirmChange) return;

        payload.current_password = oldPassword;
        payload.new_password = newPassword;
        payload.new_password_confirmation = newPassword;
      }

      const updatedUser = await fetchApi("/user", {
        method: "PUT",
        body: JSON.stringify(payload),
        headers: { "Content-Type": "application/json" },
      });

      setProfile({
        ...profile,
        namaLengkap: updatedUser.user.name,
        username: updatedUser.user.username,
        email: updatedUser.user.email,
        phone: updatedUser.user.phone || "",
        bio: updatedUser.user.bio || "",
        password: "",
      });

      setEditing(false);
      setOldPassword("");
      setNewPassword("");
      setShowSuccessPopup(true);

      setTimeout(() => setShowSuccessPopup(false), 3000);
    } catch (err: any) {
      console.error(err);
      alert(err?.message || "Gagal memperbarui profil");
    }
  };

  const openReviewModal = (order: OrderUI) => {
    setReviewOrderId(order.id);
    setRating(order.rating ?? 0);
    setHoverRating(0); // ✅ FIX: reset hover
    setReviewText(order.review ?? "");
    setIsReadOnly(!!order.rating); // Set read-only if rating exists
    setReviewError(null);
    setReviewSuccess(null);
    setIsReviewModalOpen(true);
  };

  const closeReviewModal = () => {
    setIsReviewModalOpen(false);
    setReviewOrderId(null);
    setRating(0);
    setHoverRating(0); // ✅ FIX
    setReviewText("");
    setReviewError(null);
    setReviewSuccess(null);
  };

  const submitReview = async () => {
    if (!reviewOrderId) return;

    if (rating < 1 || rating > 5) {
      setReviewError("Pilih rating 1–5 bintang.");
      return;
    }

    if (reviewText.length > 500) {
      setReviewError("Ulasan maksimal 500 karakter.");
      return;
    }

    setIsSubmittingReview(true);
    setReviewError(null);
    setReviewSuccess(null);

    const bodyPayload = { rating, review: reviewText };

    try {
      // tanpa ubah BE: coba endpoint A, kalau gagal coba endpoint B
      try {
        await fetchApi(`/orders/${reviewOrderId}/review`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(bodyPayload),
        });
      } catch (_e: any) {
        await fetchApi(`/reviews`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ order_id: reviewOrderId, ...bodyPayload }),
        });
      }

      // update state lokal
      setOrders((prev) =>
        prev.map((o) =>
          o.id === reviewOrderId
            ? { ...o, rating, review: reviewText, reviewed_at: new Date().toISOString() }
            : o
        )
      );

      setReviewSuccess("Review berhasil dikirim.");
      setTimeout(() => closeReviewModal(), 700);
    } catch (err: any) {
      console.error(err);
      setReviewError(err?.message || "Gagal mengirim rating & review.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const StarsInline: React.FC<{ value: number }> = ({ value }) => {
    const v = Math.max(0, Math.min(5, value || 0));
    return (
      <span className="d-inline-flex align-items-center gap-1" aria-label={`${v} dari 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <span
            key={i}
            style={{ fontSize: 16, lineHeight: 1, color: i < v ? "#f59e0b" : "#cbd5e1" }}
          >
            ★
          </span>
        ))}
      </span>
    );
  };

  // ===== early return spinner (setelah semua hooks & derived var dibuat) =====
  if (isAuthChecking) {
    return (
      <div
        className="d-flex align-items-center justify-content-center min-vh-100"
        style={{ background: "#f0f4f8" }}
      >
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      {showSuccessPopup && (
        <div className={styles.successPopup}>
          <div className={styles.popupContent}>
            <div className={styles.checkmarkCircle}>
              <svg className={styles.checkmark} viewBox="0 0 52 52">
                <circle className={styles.checkmarkCirclePath} cx="26" cy="26" r="25" fill="none" />
                <path className={styles.checkmarkCheck} fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8" />
              </svg>
            </div>
            <h4>Berhasil! ✨</h4>
            <p>Profil Anda telah diperbarui</p>
          </div>
        </div>
      )}

      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            src={logo}
            alt="Logo Sairaklin"
            width={60}
            height={60}
            style={{ borderRadius: "12px", marginBottom: "10px" }}
          />
          <span>Sairaklin.id</span>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`}
            onClick={() => setActiveTab("dashboard")}
          >
            <div className={styles.navIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M9 22V12H15V22"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>Dashboard</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "history" ? styles.active : ""}`}
            onClick={() => setActiveTab("history")}
          >
            <div className={styles.navIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M12 8V12L15 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3.05 11C3.5 6.5 7.36 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C8.64 21 5.68 19.23 4 16.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M3 16L4 16.5L4.5 15.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span>Riwayat</span>
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <div className={styles.navIconWrapper}>
              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 15.9217 4 17.9391 4 19V21"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle
                  cx="12"
                  cy="7"
                  r="4"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
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
            <path
              d="M16 17L21 12L16 7"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M21 12H9"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>Keluar</span>
        </button>
      </aside>

      <main className={styles.main}>
        {/* ======================= DASHBOARD ======================= */}
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerText}>
                  <h2>Dashboard</h2>
                  <p className={styles.welcomeText}>Selamat datang kembali!</p>
                  <div className={styles.userGreeting}>
                    <div className={styles.userAvatar}>
                      {profile.namaLengkap ? profile.namaLengkap.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{isLoadingData ? "Memuat..." : profile.namaLengkap}</p>
                      <p className={styles.userRole}>Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            <section className={styles.statusSummary}>
              <div className={`${styles.statusCard} ${styles.waiting}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p>Menunggu</p>
                  {isLoadingData ? (
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50px", height: "30px" }} />
                  ) : (
                    <h3>{orders.filter((o) => o.status === "Menunggu").length}</h3>
                  )}
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.processing}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <p>Diproses</p>
                  {isLoadingData ? (
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50px", height: "30px" }} />
                  ) : (
                    <h3>{orders.filter((o) => o.status === "Diproses").length}</h3>
                  )}
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.done}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <div>
                  <p>Selesai</p>
                  {isLoadingData ? (
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "50px", height: "30px" }} />
                  ) : (
                    <h3>{orders.filter((o) => o.status === "Selesai").length}</h3>
                  )}
                </div>
              </div>
            </section>

            <section className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3>Pesanan Saya</h3>
                <button className={styles.newOrderBtn} onClick={() => router.push("/order/order-form")}>
                  + Buat Pesanan Baru
                </button>
              </div>

              <div className={styles.ordersList}>
                {isLoadingData ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className={`${styles.orderCard} ${styles.skeletonCard}`}>
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: "60%", marginBottom: "10px" }} />
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} />
                    </div>
                  ))
                ) : (
                  orders.slice(0, 3).map((order) => (
                    <div key={order.id} className={styles.orderCard}>
                      <div className={styles.orderTop}>
                        <div>
                          <h4>{order.jenis}</h4>
                          <p>{order.tipe}</p>
                        </div>
                        <span
                          className={`${styles.statusTag} ${order.status === "Selesai"
                            ? styles.doneTag
                            : order.status === "Diproses"
                              ? styles.processingTag
                              : styles.waitingTag
                            }`}
                        >
                          {order.status}
                        </span>
                      </div>

                      <div className={styles.orderDetails}>
                        <div>
                          <p>
                            <strong>Tanggal & Waktu:</strong> {order.tanggal}
                          </p>
                          <p>
                            <strong>Pilihan Petugas:</strong> {order.petugas}
                          </p>
                        </div>
                        <div>
                          <p>
                            <strong>Alamat:</strong> {order.alamat}
                          </p>
                          {order.catatan && (
                            <p>
                              <strong>Catatan:</strong> {order.catatan}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className={styles.orderActions}>
                        <button className={styles.detailBtn} onClick={() => handleViewDetail(order.id)}>
                          Lihat Detail
                        </button>
                        <button className={styles.waBtn} onClick={() => handleWhatsApp(order.id)}>
                          Chat via WhatsApp
                        </button>

                        {/* Tombol review jika pesanan selesai dan belum ada rating */}
                        {order.status === "Selesai" && !order.rating && (
                          <button
                            type="button"
                            className="btn btn-sm px-3 py-2 text-white border-0 shadow-sm d-inline-flex align-items-center gap-2"
                            style={{
                              background: "linear-gradient(135deg, #ffb703 0%, #fb8500 100%)",
                              borderRadius: 999,
                              transition: "transform .15s ease, box-shadow .15s ease, filter .15s ease",
                            }}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.transform = "translateY(-1px)";
                              e.currentTarget.style.filter = "brightness(1.03)";
                              e.currentTarget.style.boxShadow = "0 10px 18px rgba(251,133,0,.25)";
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.transform = "translateY(0)";
                              e.currentTarget.style.filter = "none";
                              e.currentTarget.style.boxShadow = "0 .125rem .25rem rgba(0,0,0,.075)";
                            }}
                            onClick={() => openReviewModal(order)}
                          >
                            <span style={{ fontSize: 14 }}>⭐</span>
                            <span className="fw-semibold">Beri Rating</span>
                          </button>

                        )}
                      </div>

                      {/* Ringkasan review */}
                      {order.status === "Selesai" && order.rating && (
                        <div className="mt-2 p-2 border rounded bg-light">
                          <div className="d-flex align-items-center justify-content-between">
                            <StarsInline value={order.rating || 0} />
                            <span className="badge text-bg-success">Reviewed</span>
                          </div>
                          {order.review && (
                            <div className="mt-1 text-muted" style={{ fontSize: 13 }}>
                              {order.review}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {orders.length > 3 && !isLoadingData && (
                <div className="text-center mt-3">
                  <button className={styles.viewAllBtn} onClick={() => setActiveTab("history")}>
                    Lihat Riwayat Pesanan Selesai ({completedOrders.length}) →
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {/* ======================= HISTORY ======================= */}
        {activeTab === "history" && (
          <div className={styles.historySection}>
            <header className={styles.header}>
              <div className={styles.historyHeaderContent}>
                <div>
                  <h2>Riwayat Pesanan</h2>
                  <p>Lihat semua pesanan yang telah selesai</p>
                </div>
              </div>
            </header>

            <div className={styles.historyStats}>
              <div className={styles.historyStatCard}>
                <div className={styles.historyStatIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M22 4L12 14.01L9 11.01"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
                <div>
                  <p>Total Pesanan Selesai</p>
                  <h3>{completedOrders.length}</h3>
                </div>
              </div>
            </div>

            <div className={styles.ordersList}>
              {completedOrders.length === 0 ? (
                <div className={styles.emptyState}>
                  <div className={styles.emptyStateIcon}>
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path
                        d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                  <h4>Belum Ada Riwayat</h4>
                  <p>Belum ada pesanan yang selesai</p>
                  <button className={styles.emptyStateBtn} onClick={() => router.push("/order/order-form")}>
                    Buat Pesanan Baru
                  </button>
                </div>
              ) : (
                completedOrders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div>
                        <h4>{order.jenis}</h4>
                        <p>{order.tipe}</p>
                      </div>
                      <span className={`${styles.statusTag} ${styles.doneTag}`}>{order.status}</span>
                    </div>

                    <div className={styles.orderDetails}>
                      <div>
                        <p>
                          <strong>Tanggal & Waktu:</strong> {order.tanggal}
                        </p>
                        <p>
                          <strong>Pilihan Petugas:</strong> {order.petugas}
                        </p>
                      </div>
                      <div>
                        <p>
                          <strong>Alamat:</strong> {order.alamat}
                        </p>
                        {order.catatan && (
                          <p>
                            <strong>Catatan:</strong> {order.catatan}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className={styles.orderActions}>
                      <button className={styles.detailBtn} onClick={() => handleViewDetail(order.id)}>
                        Lihat Detail
                      </button>
                      <button className={styles.waBtn} onClick={() => handleWhatsApp(order.id)}>
                        Chat via WhatsApp
                      </button>

                      {!order.rating ? (
                        <button
                          type="button"
                          className="btn btn-sm px-3 py-2 fw-semibold d-inline-flex align-items-center gap-2"
                          style={{
                            borderRadius: 999,
                            border: "1.5px solid rgba(90,169,255,.6)",
                            color: "#2F80ED",
                            background: "rgba(90,169,255,.08)",
                            transition: "all .15s ease",
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = "translateY(-1px)";
                            e.currentTarget.style.boxShadow = "0 10px 18px rgba(47,128,237,.15)";
                            e.currentTarget.style.background = "rgba(90,169,255,.12)";
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = "translateY(0)";
                            e.currentTarget.style.boxShadow = "none";
                            e.currentTarget.style.background = "rgba(90,169,255,.08)";
                          }}
                          onClick={() => openReviewModal(order)}
                        >
                          ⭐ <span>Tambah Rating &amp; Review</span>
                        </button>

                      ) : (
                        <button className="btn btn-outline-secondary btn-sm" onClick={() => openReviewModal(order)}>
                          Lihat Review
                        </button>
                      )}
                    </div>

                    {order.rating && (
                      <div className="mt-2 p-2 border rounded bg-light">
                        <div className="d-flex align-items-center justify-content-between">
                          <StarsInline value={order.rating || 0} />
                          <span className="badge text-bg-success">Reviewed</span>
                        </div>
                        {order.review && (
                          <div className="mt-1 text-muted" style={{ fontSize: 13 }}>
                            {order.review}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ======================= PROFILE ======================= */}
        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            <h3>Profil Saya</h3>
            <p className="text-muted mb-4">
              Kelola informasi akun dan password Anda dengan tampilan yang lebih menarik dan interaktif!
            </p>

            <div className={styles.profileGrid}>
              <div className={styles.profileDisplayCard}>
                <div className={styles.profileDisplayContent}>
                  <div className={styles.profileAvatarWrapper}>
                    <div className={styles.profileAvatarLarge}>
                      {profile.namaLengkap ? profile.namaLengkap.charAt(0).toUpperCase() : "U"}
                    </div>
                    <div className={styles.profileBadge}>Member</div>
                  </div>

                  <h5 className={styles.profileName}>{profile.namaLengkap}</h5>
                  <p className={styles.profileUsername}>@{profile.username}</p>
                  <p className={styles.profileContact}>{profile.phone}</p>
                  {profile.email && <p className={styles.profileContact}>{profile.email}</p>}
                  {profile.bio && <p className={styles.profileBio}>{profile.bio}</p>}

                  <button
                    className={styles.profileEditBtn}
                    onClick={() => {
                      setEditing(true);
                      setForm(profile);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M17.5 2.5C17.8978 2.10217 18.4374 1.87868 19 1.87868C19.5626 1.87868 20.1022 2.10217 20.5 2.5C20.8978 2.89782 21.1213 3.43739 21.1213 4C21.1213 4.56261 20.8978 5.10217 20.5 5.5L11 15H8V12L17.5 2.5Z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit Profil
                  </button>
                </div>
              </div>

              <div className={styles.profileFormCard}>
                {editing ? (
                  <>
                    <h6 className={styles.profileFormTitle}>Edit Profil</h6>
                    <div className={styles.profileFormContent}>
                      <div className={styles.formGroup}>
                        <label>Nama Lengkap</label>
                        <input
                          type="text"
                          value={form.namaLengkap}
                          onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Username</label>
                        <input
                          type="text"
                          value={form.username}
                          onChange={(e) => setForm({ ...form, username: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Nomor Telepon</label>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={form.email || ""}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>

                      {/* textarea */}
                      {/* Bio */}
                      <div className={styles.formGroup}>
                        <label>Bio</label>
                        <textarea
                          value={form.bio || ""}
                          onChange={(e) => setForm({ ...form, bio: e.target.value })}
                          placeholder="Tulis sedikit tentang diri Anda..."
                          rows={3}
                          style={{
                            width: "100%",
                            padding: "10px 14px",
                            borderRadius: "8px",
                            border: "1px solid #e2e8f0",
                            fontSize: "14px",
                            resize: "vertical",
                          }}
                        />
                      </div>


                      <div className={styles.formGroup}>
                        <label>Password Lama</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={(e) => setOldPassword(e.target.value)}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label>Password Baru</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                        />
                      </div>

                      <div className={styles.formActions}>
                        <button className={styles.btnSave} onClick={saveProfile}>
                          Simpan
                        </button>
                        <button className={styles.btnCancel} onClick={() => setEditing(false)}>
                          Batal
                        </button>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className={styles.profileEmptyState}>
                    <div className={styles.profileEmptyIcon}>
                      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                          d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </div>
                    <p className={styles.profileEmptyText}>Klik "Edit Profil" untuk mengubah informasi administrator</p>
                    <span className={styles.profileEmptyEmoji}>✨</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ===================== Bootstrap Modal Review (Premium) ===================== */}
      {isReviewModalOpen && (
        <>
          <div className="modal-backdrop fade show" onClick={closeReviewModal} />

          <div
            className="modal fade show"
            tabIndex={-1}
            role="dialog"
            aria-modal="true"
            style={{ display: "block" }}
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content border-0 shadow" style={{ overflow: "hidden", borderRadius: 18 }}>
                {/* header */}
                <div
                  className="modal-header border-0 d-flex align-items-start justify-content-between"
                  style={{
                    // Soft, tidak tabrakan: base putih + hint pink/blue yang sangat halus
                    background:
                      "radial-gradient(900px circle at 0% 0%, rgba(244,114,182,.22), transparent 45%)," +
                      "radial-gradient(900px circle at 100% 20%, rgba(96,165,250,.22), transparent 45%)," +
                      "linear-gradient(135deg, #ffffff 0%, #f8fafc 55%, #ffffff 100%)",
                    padding: "18px 20px",
                    borderTopLeftRadius: 14,
                    borderTopRightRadius: 14,
                    borderBottom: "1px solid rgba(15,23,42,.08)",
                  }}
                >
                  <div className="pe-3">
                    <div className="d-inline-flex align-items-center gap-2 mb-2">
                      <span
                        className="badge rounded-pill"
                        style={{
                          background: "rgba(15,23,42,.06)",
                          color: "rgba(15,23,42,.75)",
                          border: "1px solid rgba(15,23,42,.10)",
                          fontWeight: 600,
                          letterSpacing: ".2px",
                          padding: "6px 10px",
                        }}
                      >
                        Feedback
                      </span>
                      <span style={{ color: "rgba(15,23,42,.55)", fontSize: 12 }}>
                        1 menit
                      </span>
                    </div>

                    <h5
                      className="modal-title mb-1"
                      style={{
                        color: "#0f172a",
                        fontWeight: 800,
                        letterSpacing: ".2px",
                      }}
                    >
                      Bagaimana layanan kami?
                    </h5>

                    <div style={{ color: "rgba(15,23,42,.62)", fontSize: 13, lineHeight: 1.45 }}>
                      Beri rating dan ulasan untuk membantu meningkatkan kualitas petugas dan layanan kami.
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label="Close"
                    onClick={closeReviewModal}
                    className="btn d-inline-flex align-items-center justify-content-center"
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 999,
                      border: "1px solid rgba(15,23,42,.12)",
                      background: "rgba(255,255,255,.75)",
                      boxShadow: "0 10px 22px rgba(15,23,42,.08)",
                      color: "rgba(15,23,42,.70)",
                      transition: "all .2s ease",
                      backdropFilter: "blur(6px)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-1px)";
                      e.currentTarget.style.boxShadow = "0 14px 26px rgba(15,23,42,.10)";
                      e.currentTarget.style.borderColor = "rgba(15,23,42,.18)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "0 10px 22px rgba(15,23,42,.08)";
                      e.currentTarget.style.borderColor = "rgba(15,23,42,.12)";
                    }}
                  >
                    <span className="visually-hidden">Close</span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                      />
                    </svg>
                  </button>
                </div>

                <div className="modal-body">
                  {/* score card */}
                  <div
                    className="p-3 p-md-4 mb-3"
                    style={{
                      borderRadius: 16,
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.90) 0%, rgba(255,255,255,0.97) 100%)",
                      border: "1px solid rgba(15,23,42,0.08)",
                    }}
                  >
                    <div className="d-flex align-items-center justify-content-between flex-wrap gap-3">
                      <div>
                        <div className="text-muted" style={{ fontSize: 12 }}>
                          Rating Anda
                        </div>
                        <div className="d-flex align-items-end gap-2">
                          <div
                            style={{
                              fontSize: 44,
                              fontWeight: 900,
                              lineHeight: 1,
                              color: "#0f172a",
                            }}
                          >
                            {(hoverRating || rating) ? (hoverRating || rating).toFixed(1) : "0.0"}
                          </div>
                          <div className="text-muted pb-1" style={{ fontSize: 12 }}>
                            / 5.0
                          </div>
                        </div>
                      </div>

                      <div className="text-end">
                        <div style={{ fontWeight: 800, color: "#0f172a" }}>
                          {ratingEmoji(hoverRating || rating)} {ratingLabel(hoverRating || rating)}
                        </div>
                        <div className="progress mt-2" style={{ height: 8, width: 160 }}>
                          <div
                            className="progress-bar"
                            role="progressbar"
                            style={{
                              width: `${((hoverRating || rating) / 5) * 100}%`,
                              background: "linear-gradient(90deg,#f59e0b,#f97316)",
                            }}
                            aria-valuenow={hoverRating || rating}
                            aria-valuemin={0}
                            aria-valuemax={5}
                          />
                        </div>
                      </div>
                    </div>

                    {/* stars */}
                    <div className="mt-3">
                      <div className="d-flex gap-2 flex-wrap">
                        {Array.from({ length: 5 }).map((_, idx) => {
                          const v = idx + 1;
                          const active = v <= (hoverRating || rating);
                          return (
                            <button
                              key={v}
                              type="button"
                              disabled={isSubmittingReview || isReadOnly}
                              onMouseEnter={() => !isReadOnly && setHoverRating(v)}
                              onMouseLeave={() => !isReadOnly && setHoverRating(0)}
                              onClick={() => !isReadOnly && setRating(v)}
                              style={{ ...starBtnBase, ...(active ? starBtnActive : {}) }}
                              aria-label={`Beri rating ${v} bintang`}
                            >
                              ★
                            </button>
                          );
                        })}
                      </div>
                      <div className="text-muted mt-2" style={{ fontSize: 13 }}>
                        Arahkan cursor untuk preview, klik untuk memilih.
                      </div>
                    </div>
                  </div>

                  {/* quick chips (Hide if read only) */}
                  {!isReadOnly && (
                    <div className="mb-3">
                      <div className="text-muted mb-2" style={{ fontSize: 12 }}>
                        Tambah cepat (opsional)
                      </div>
                      <div className="d-flex gap-2 flex-wrap">
                        {["Tepat waktu", "Ramah", "Bersih maksimal", "Rapi", "Sangat membantu"].map((chip) => (
                          <button
                            key={chip}
                            type="button"
                            className="btn btn-sm"
                            style={chipBtn}
                            disabled={isSubmittingReview}
                            onClick={() => {
                              setReviewText((prev) => {
                                const t = (prev || "").trim();
                                if (!t) return chip;
                                if (t.includes(chip)) return prev;
                                return `${t}. ${chip}`;
                              });
                            }}
                          >
                            + {chip}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* textarea */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold mb-2">Ulasan</label>

                    <textarea
                      className={`form-control shadow-none ${styles.reviewTextarea}`}
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value.slice(0, 500))}
                      placeholder="Contoh: Petugas ramah, hasil bersih, dan sesuai jadwal."
                      disabled={isSubmittingReview || isReadOnly}
                      rows={6}
                      style={{
                        resize: "none",
                        minHeight: 200,
                        maxHeight: 280,
                        overflowY: "auto",
                        padding: "12px 14px",
                        lineHeight: 1.6,
                      }}
                    />

                    <div className="d-flex justify-content-between mt-2">
                      <small className="text-muted">Maksimal 500 karakter</small>
                      <small className="text-muted">{reviewText.length}/500</small>
                    </div>
                  </div>


                  {reviewError && <div className="alert alert-danger mt-3 mb-0">{reviewError}</div>}
                  {reviewSuccess && <div className="alert alert-success mt-3 mb-0">{reviewSuccess}</div>}
                </div>

                <div className="modal-footer border-0">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={closeReviewModal}
                    disabled={isSubmittingReview}
                  >
                    {isReadOnly ? "Tutup" : "Nanti dulu"}
                  </button>

                  {!isReadOnly && (
                    <button
                      type="button"
                      className="btn"
                      onClick={submitReview}
                      disabled={isSubmittingReview || rating < 1} // ✅ UX: disable kalau belum pilih rating
                      style={{
                        borderRadius: 12,
                        fontWeight: 800,
                        color: "#fff",
                        border: 0,
                        background: "linear-gradient(135deg,#2563eb 0%, #1d4ed8 100%)",
                        boxShadow: "0 14px 30px rgba(37,99,235,0.25)",
                        padding: "10px 16px",
                        opacity: isSubmittingReview || rating < 1 ? 0.7 : 1,
                      }}
                    >
                      {isSubmittingReview ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status" />
                          Mengirim...
                        </>
                      ) : (
                        "Kirim Rating"
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
      {/* ===================================================================== */}
    </div>
  );
};

export default DashboardUser;