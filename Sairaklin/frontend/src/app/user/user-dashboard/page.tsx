"use client";

import React, { useState } from "react";
import styles from "./user.module.css";
import logo from "./logo.png";
import Image from "next/image";
import { useRouter } from "next/navigation";

type OrderStatus = "Menunggu" | "Diproses" | "Selesai";

import { fetchApi } from '@/lib/api';
import { useEffect } from "react";

interface Order {
  id: string;
  service_type: string;
  status: OrderStatus;
  date: string;
  time: string;
  address: string;
  worker_gender?: string;
  special_notes?: string;
}

interface Profile {
  namaLengkap: string;
  username: string;
  phone: string;
  password: string;
  email?: string;
  bio?: string;
}

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
  const [orders, setOrders] = useState<any[]>([]);

  // Add Auth Checking state
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        alert("Anda belum login, silakan login terlebih dahulu.");
        router.push('/auth/login');
        return;
      }
      setIsAuthChecking(false);
    };
    checkAuth();
  }, [router]);

  // Add Loading Data State
  const [isLoadingData, setIsLoadingData] = useState(false);

  useEffect(() => {
    if (isAuthChecking) return; // Wait until auth check is done

    const loadData = async () => {
      setIsLoadingData(true);
      try {
        const userData = await fetchApi('/user');
        setProfile({
          namaLengkap: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || "",
          bio: userData.bio || "",
          password: "",
        });
        setForm({
          namaLengkap: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || "",
          bio: userData.bio || "",
          password: "",
        });

        const orderData = await fetchApi('/orders');
        const mappedOrders = orderData.map((o: any) => ({
          id: o.id,
          jenis: getServiceName(o.service_type),
          tipe: "Layanan Kebersihan",
          tanggal: `${formatDate(o.date)} • ${o.time}`,
          petugas: o.worker_gender === 'male' ? 'Laki-Laki' : (o.worker_gender === 'female' ? 'Perempuan' : 'Acak'),
          alamat: o.address,
          status: o.status,
          catatan: o.special_notes
        }));
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Failed to load data", err);
        if (err.message === 'Unauthenticated.') {
          alert("Sesi Anda telah berakhir, silakan login kembali.");
          router.push('/auth/login');
        }
      } finally {
        setIsLoadingData(false);
      }
    };
    loadData();
  }, [isAuthChecking]); // Depend on isAuthChecking

  // Show loading spinner while checking auth
  if (isAuthChecking) {
    return (
      <div className="d-flex align-items-center justify-content-center min-vh-100" style={{ background: '#f0f4f8' }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  const getServiceName = (type: string) => {
    if (type === 'room') return 'Paket Kamar';
    if (type === 'bathroom') return 'Paket Kamar Mandi';
    if (type === 'both') return 'Paket Lengkap';
    return type;
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/auth/login');
  };

  const handleViewDetail = (orderId: string) => {
    router.push(`/order/detail/order/${orderId}`);
  };

  const handleWhatsApp = (orderId: string) => {
    const message = encodeURIComponent(
      `Halo, saya ingin menanyakan pesanan dengan ID: ${orderId}`
    );
    window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
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
        payload.current_password = oldPassword;
        payload.new_password = newPassword;
        payload.new_password_confirmation = newPassword;
      }

      const updatedUser = await fetchApi('/user', {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' }
      });

      setProfile({
        ...profile,
        namaLengkap: updatedUser.user.name,
        username: updatedUser.user.username,
        email: updatedUser.user.email,
        phone: updatedUser.user.phone || "",
        bio: updatedUser.user.bio || "",
      });

      setEditing(false);
      setOldPassword("");
      setNewPassword("");
      setShowSuccessPopup(true);

      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 3000);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal memperbarui profil");
    }
  };

  const completedOrders = orders.filter(o => o.status === "Selesai");

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
                <path d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 22V12H15V22" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3.05 11C3.5 6.5 7.36 3 12 3C16.97 3 21 7.03 21 12C21 16.97 16.97 21 12 21C8.64 21 5.68 19.23 4 16.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M3 16L4 16.5L4.5 15.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <span>Profil</span>
          </button>
        </nav>
        <button className={styles.logout} onClick={handleLogout}>
          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M16 17L21 12L16 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>Keluar</span>
        </button>
      </aside>

      <main className={styles.main}>
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <div className={styles.headerContent}>
                <div className={styles.headerText}>
                  <h2>Dashboard</h2>
                  <p className={styles.welcomeText}>Selamat datang kembali!</p>
                  <div className={styles.userGreeting}>
                    <div className={styles.userAvatar}>{profile.namaLengkap ? profile.namaLengkap.charAt(0).toUpperCase() : 'U'}</div>
                    <div className={styles.userInfo}>
                      <p className={styles.userName}>{isLoadingData ? 'Memuat...' : profile.namaLengkap}</p>
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
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50px', height: '30px' }}></div>
                  ) : (
                    <h3>{orders.filter(o => o.status === "Menunggu").length}</h3>
                  )}
                </div>
              </div>
              <div className={`${styles.statusCard} ${styles.processing}`}>
                <span className={styles.statusIcon}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 2V6M12 18V22M4.93 4.93L7.76 7.76M16.24 16.24L19.07 19.07M2 12H6M18 12H22M4.93 19.07L7.76 16.24M16.24 7.76L19.07 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                </span>
                <div>
                  <p>Diproses</p>
                  {isLoadingData ? (
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50px', height: '30px' }}></div>
                  ) : (
                    <h3>{orders.filter(o => o.status === "Diproses").length}</h3>
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
                    <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '50px', height: '30px' }}></div>
                  ) : (
                    <h3>{orders.filter(o => o.status === "Selesai").length}</h3>
                  )}
                </div>
              </div>
            </section>

            <section className={styles.packagesSection}>
              <h3 className={styles.sectionTitle}>Pilihan Paket Bersih-Bersih</h3>

              <div className={styles.packagesGrid}>
                {[
                  {
                    id: 1,
                    name: "Paket Kamar",
                    price: 25000,
                    details: [
                      "Menyapu dan mengepel lantai kamar",
                      "Merapikan tempat tidur",
                      "Membersihkan debu pada meja & rak"
                    ],
                    icon: "room"
                  },
                  {
                    id: 2,
                    name: "Paket Kamar + Kamar Mandi",
                    price: 40000,
                    details: [
                      "Pembersihan kamar menyeluruh",
                      "Menyikat lantai dan kloset kamar mandi",
                      "Membersihkan cermin & wastafel"
                    ],
                    icon: "bathroom"
                  },
                  {
                    id: 3,
                    name: "Paket Lengkap",
                    price: 60000,
                    details: [
                      "Kamar dan kamar mandi bersih total",
                      "Area depan kamar disapu & dipel",
                      "Jendela & ventilasi bebas debu"
                    ],
                    icon: "complete"
                  },
                ].map((pkg) => (
                  <div
                    key={pkg.id}
                    className={styles.packageCard}
                    onClick={() => router.push(`/order/order-form?paket=${encodeURIComponent(pkg.name)}&harga=${pkg.price}`)}
                  >
                    <div className={styles.packageHeader}>
                      <div className={styles.packageIcon}>
                        {pkg.icon === "room" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 21H21M5 21V7L13 3V21M19 21V11L13 7M9 9H11M9 13H11M9 17H11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                        {pkg.icon === "bathroom" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M7 7H6C4.89543 7 4 7.89543 4 9V20M7 7V4C7 3.44772 7.44772 3 8 3H9C9.55228 3 10 3.44772 10 4V7M7 7H17M17 7V4C17 3.44772 17.4477 3 18 3H19C19.5523 3 20 3.44772 20 4V7M17 7H20M20 7C20.5523 7 21 7.44772 21 8V20M4 20H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        )}
                        {pkg.icon === "complete" && (
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M9 11L12 14L22 4M21 12V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V5C3 3.89543 3.89543 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <h5>{pkg.name}</h5>
                      <p className={styles.packageSubtitle}>Paket hemat untuk kebersihan maksimal</p>
                    </div>

                    <ul className={styles.packageDetails}>
                      {pkg.details.map((d, i) => (
                        <li key={i}>
                          <svg viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {d}
                        </li>
                      ))}
                    </ul>

                    <div className={styles.packageFooter}>
                      <div className={styles.packagePrice}>
                        <span className={styles.priceLabel}>Mulai dari</span>
                        <span className={styles.priceAmount}>Rp {pkg.price.toLocaleString("id-ID")}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3>Pesanan Saya</h3>
                <button
                  className={styles.newOrderBtn}
                  onClick={() => router.push('/order/order-form')}
                >
                  + Buat Pesanan Baru
                </button>
              </div>
              <div className={styles.ordersList}>
                {isLoadingData ? (
                  Array.from({ length: 2 }).map((_, i) => (
                    <div key={i} className={`${styles.orderCard} ${styles.skeletonCard}`}>
                      <div className={`${styles.skeleton} ${styles.skeletonText}`} style={{ width: '60%', marginBottom: '10px' }}></div>
                      <div className={`${styles.skeleton} ${styles.skeletonText}`}></div>
                    </div>
                  ))
                ) : (
                  orders.slice(0, 3).map(order => (
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
                          <p><strong>Tanggal & Waktu:</strong> {order.tanggal}</p>
                          <p><strong>Pilihan Petugas:</strong> {order.petugas}</p>
                        </div>
                        <div>
                          <p><strong>Alamat:</strong> {order.alamat}</p>
                          {order.catatan && <p><strong>Catatan:</strong> {order.catatan}</p>}
                        </div>
                      </div>
                      <div className={styles.orderActions}>
                        <button
                          className={styles.detailBtn}
                          onClick={() => handleViewDetail(order.id)}
                        >
                          Lihat Detail
                        </button>
                        <button
                          className={styles.waBtn}
                          onClick={() => handleWhatsApp(order.id)}
                        >
                          Chat via WhatsApp
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
              {orders.length > 3 && !isLoadingData && (
                <div className="text-center mt-3">
                  <button
                    className={styles.viewAllBtn}
                    onClick={() => setActiveTab("history")}
                  >
                    Lihat Riwayat Pesanan Selesai ({completedOrders.length}) →
                  </button>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === "history" && (
          <div className={styles.historySection}>
            <header className={styles.header}>
              <div className={styles.historyHeaderContent}>
                <div className={styles.historyIconLarge}>
                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 11L12 14L22 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
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
                    <path d="M22 11.08V12C21.9988 14.1564 21.3005 16.2547 20.0093 17.9818C18.7182 19.709 16.9033 20.9725 14.8354 21.5839C12.7674 22.1953 10.5573 22.1219 8.53447 21.3746C6.51168 20.6273 4.78465 19.2461 3.61096 17.4371C2.43727 15.628 1.87979 13.4881 2.02168 11.3363C2.16356 9.18455 2.99721 7.13631 4.39828 5.49706C5.79935 3.85781 7.69279 2.71537 9.79619 2.24013C11.8996 1.7649 14.1003 1.98232 16.07 2.85999" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M22 4L12 14.01L9 11.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
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
                      <path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V5C3 4.46957 3.21071 3.96086 3.58579 3.58579C3.96086 3.21071 4.46957 3 5 3H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <h4>Belum Ada Riwayat</h4>
                  <p>Belum ada pesanan yang selesai</p>
                  <button
                    className={styles.emptyStateBtn}
                    onClick={() => router.push('/order/order-form')}
                  >
                    Buat Pesanan Baru
                  </button>
                </div>
              ) : (
                completedOrders.map(order => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div>
                        <h4>{order.jenis}</h4>
                        <p>{order.tipe}</p>
                      </div>
                      <span className={`${styles.statusTag} ${styles.doneTag}`}>
                        {order.status}
                      </span>
                    </div>
                    <div className={styles.orderDetails}>
                      <div>
                        <p><strong>Tanggal & Waktu:</strong> {order.tanggal}</p>
                        <p><strong>Pilihan Petugas:</strong> {order.petugas}</p>
                      </div>
                      <div>
                        <p><strong>Alamat:</strong> {order.alamat}</p>
                        {order.catatan && <p><strong>Catatan:</strong> {order.catatan}</p>}
                      </div>
                    </div>
                    <div className={styles.orderActions}>
                      <button
                        className={styles.detailBtn}
                        onClick={() => handleViewDetail(order.id)}
                      >
                        Lihat Detail
                      </button>
                      <button
                        className={styles.waBtn}
                        onClick={() => handleWhatsApp(order.id)}
                      >
                        Chat via WhatsApp
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            <h3>Profil Saya</h3>
            <p className="text-muted mb-4">
              Kelola informasi akun dan password Anda dengan tampilan yang lebih menarik dan interaktif!
            </p>

            <div className={styles.profileGrid}>
              {/* Left Card - Profile Display */}
              <div className={styles.profileDisplayCard}>
                <div className={styles.profileDisplayContent}>
                  {/* Avatar with Badge */}
                  <div className={styles.profileAvatarWrapper}>
                    <div className={styles.profileAvatarLarge}>
                      {profile.namaLengkap ? profile.namaLengkap.charAt(0).toUpperCase() : 'U'}
                    </div>
                    <div className={styles.profileBadge}>Member</div>
                  </div>

                  {/* Profile Info */}
                  <h5 className={styles.profileName}>{profile.namaLengkap}</h5>
                  <p className={styles.profileUsername}>@{profile.username}</p>
                  <p className={styles.profileContact}>{profile.phone}</p>
                  {profile.email && <p className={styles.profileContact}>{profile.email}</p>}
                  {profile.bio && <p className={styles.profileBio}>{profile.bio}</p>}

                  {/* Edit Button */}
                  <button
                    className={styles.profileEditBtn}
                    onClick={() => {
                      setEditing(true);
                      setForm(profile);
                    }}
                  >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 5H6C4.89543 5 4 5.89543 4 7V18C4 19.1046 4.89543 20 6 20H17C18.1046 20 19 19.1046 19 18V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M17.5 2.5C17.8978 2.10217 18.4374 1.87868 19 1.87868C19.5626 1.87868 20.1022 2.10217 20.5 2.5C20.8978 2.89782 21.1213 3.43739 21.1213 4C21.1213 4.56261 20.8978 5.10217 20.5 5.5L11 15H8V12L17.5 2.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Edit Profil
                  </button>
                </div>
              </div>

              {/* Right Card - Edit Form or Empty State */}
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
                          onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Username</label>
                        <input
                          type="text"
                          value={form.username}
                          onChange={e => setForm({ ...form, username: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Nomor Telepon</label>
                        <input
                          type="text"
                          value={form.phone}
                          onChange={e => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Email</label>
                        <input
                          type="email"
                          value={form.email || ""}
                          onChange={e => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Bio</label>
                        <textarea
                          rows={3}
                          value={form.bio || ""}
                          onChange={e => setForm({ ...form, bio: e.target.value })}
                          placeholder="Ceritakan sedikit tentang diri Anda..."
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Password Lama</label>
                        <input
                          type="password"
                          value={oldPassword}
                          onChange={e => setOldPassword(e.target.value)}
                          placeholder="Kosongkan jika tidak ingin mengubah password"
                        />
                      </div>
                      <div className={styles.formGroup}>
                        <label>Password Baru</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={e => setNewPassword(e.target.value)}
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
                        <path d="M13 16H12V12H11M12 8H12.01M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                    <p className={styles.profileEmptyText}>
                      Klik "Edit Profil" untuk mengubah informasi administrator
                    </p>
                    <span className={styles.profileEmptyEmoji}>✨</span>
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

export default DashboardUser;