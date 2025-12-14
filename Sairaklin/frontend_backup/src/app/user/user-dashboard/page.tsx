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
  service_type: string; // Mapped from serviceType
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
  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");
  const [editing, setEditing] = useState(false);
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
  const [orders, setOrders] = useState<any[]>([]); // Use any for loose verification or update Order interface fully

  // Initial load
  useEffect(() => {
    const loadData = async () => {
      try {
        const userData = await fetchApi('/user');
        setProfile({
          namaLengkap: userData.name,
          username: userData.username,
          email: userData.email,
          phone: userData.phone || "",
          bio: userData.bio || "",
          password: "", // Security: don't show or need hash
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
        // Map Order data to UI structure if needed
        const mappedOrders = orderData.map((o: any) => ({
          id: o.id,
          jenis: getServiceName(o.service_type),
          tipe: "Layanan Kebersihan", // Generic or derived
          tanggal: `${formatDate(o.date)} • ${o.time}`,
          petugas: o.worker_gender === 'male' ? 'Laki-Laki' : (o.worker_gender === 'female' ? 'Perempuan' : 'Acak'),
          alamat: o.address,
          status: o.status,
          catatan: o.special_notes
        }));
        setOrders(mappedOrders);
      } catch (err: any) {
        console.error("Failed to load data", err);
        // router.push('/auth/login');
      }
    };
    loadData();
  }, []);

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

  // Handler untuk navigasi ke detail pesanan
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
        if (oldPassword !== profile.password) {
          // Note: Frontend validation of old password against *loaded* password hash is impossible/insecure. 
          // We send to backend to verify.
        }
        payload.current_password = oldPassword;
        payload.new_password = newPassword;
        payload.new_password_confirmation = newPassword; // assuming UI doesn't have confirm box yet or reusing newPassword
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
      alert("Profil berhasil diperbarui!");
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Gagal memperbarui profil");
    }
  };




  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
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
            Dashboard
          </button>
          <button
            className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            Profil
          </button>
        </nav>
        <button className={styles.logout} onClick={handleLogout}>
          Keluar
        </button>
      </aside>


      {/* Main Content */}
      <main className={styles.main}>
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <h2>Dashboard</h2>
              <p>
                Selamat datang! <span role="img" aria-label="hand wave">👋</span>
              </p>
              <p>Hallo, {profile.namaLengkap}</p>
            </header>

            {/* Status Summary */}
            <section className={styles.statusSummary}>
              <div className={`${styles.statusCard} ${styles.waiting}`}>
                <span className={styles.statusIcon}>🕒</span>
                <div>
                  <p>Menunggu</p>
                  <h3>{orders.filter(o => o.status === "Menunggu").length}</h3>
                </div>
              </div>
              <div className={`${styles.statusCard} ${styles.processing}`}>
                <span className={styles.statusIcon}>ℹ</span>
                <div>
                  <p>Diproses</p>
                  <h3>{orders.filter(o => o.status === "Diproses").length}</h3>
                </div>
              </div>
              <div className={`${styles.statusCard} ${styles.done}`}>
                <span className={styles.statusIcon}>✅</span>
                <div>
                  <p>Selesai</p>
                  <h3>{orders.filter(o => o.status === "Selesai").length}</h3>
                </div>
              </div>
            </section>

            {/* Paket Bersih-Bersih */}
            {/* Paket Bersih-Bersih */}
            <section className="mt-5">
              <h3 className="fw-bold mb-4 text-dark">
                ✨ Pilihan Paket Bersih-Bersih
              </h3>

              <div className="row g-4">
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
                    color: "#e8f5e9"
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
                    color: "#e3f2fd"
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
                    color: "#fff8e1"
                  },
                ].map((pkg) => (
                  <div className="col-md-4" key={pkg.id}>
                    <div
                      className="card border-0 shadow-sm h-100 rounded-4"
                      style={{
                        backgroundColor: pkg.color,
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "translateY(-5px)";
                        e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.12)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "translateY(0)";
                        e.currentTarget.style.boxShadow = "0 3px 8px rgba(0,0,0,0.06)";
                      }}
                    >
                      <div className="card-body d-flex flex-column">
                        <div className="mb-3">
                          <h5 className="fw-bold text-dark mb-1">{pkg.name}</h5>
                          <small className="text-muted">
                            Paket hemat untuk kebersihan maksimal.
                          </small>
                        </div>

                        <ul className="text-secondary small mb-4 ps-3">
                          {pkg.details.map((d, i) => (
                            <li key={i}>{d}</li>
                          ))}
                        </ul>

                        <h5 className="fw-semibold text-success mb-4">
                          Rp {pkg.price.toLocaleString("id-ID")}
                        </h5>

                        <button
                          className="btn btn-success mt-auto py-2 fw-semibold text-white rounded-pill"
                          onClick={() =>
                            router.push(
                              `/order/order-form?paket=${encodeURIComponent(pkg.name)}&harga=${pkg.price}`
                            )
                          }
                        >
                          Pesan Sekarang
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>



            {/* Orders List */}
            <section className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3>Pesanan Saya</h3>
                <a href="/order/order-form" className={styles.newOrderBtn}>
                  + Buat Pesanan Baru
                </a>
              </div>
              <div className={styles.ordersList}>
                {orders.map(order => (
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
                ))}
              </div>
            </section>
          </>
        )}

        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            <h3>Profil Saya</h3>
            <p className="text-muted mb-4">
              Kelola informasi akun dan password Anda dengan tampilan yang lebih menarik dan interaktif!
            </p>

            <div className={styles.profileGrid}>
              {/* Kartu Profil */}
              <div className={styles.profileCard}>
                {/* <div className={styles.profileAvatar}>
                  <Image
                    src="/default-avatar.png"
                    alt="Avatar"
                    width={80}
                    height={80}
                    style={{ borderRadius: "50%" }}
                  />
                  <span className={styles.badge}>Premium</span>
                </div> */}
                <h5 className="fw-bold mt-2">{profile.namaLengkap}</h5>
                <p className="text-muted">@{profile.username}</p>
                <p className="text-muted">{profile.phone}</p>
                {profile.email && <p className="text-muted">{profile.email}</p>}
                {profile.bio && <p className="text-muted mt-2">{profile.bio}</p>}
                <button
                  className="btn btn-outline-primary mt-3 w-100"
                  onClick={() => {
                    setEditing(true);
                    setForm(profile);
                  }}
                >
                  Edit Profil
                </button>
              </div>

              {/* Edit Profil */}
              <div className={styles.profileCard}>
                {editing ? (
                  <>
                    <h6>Edit Profil</h6>
                    <div className="mb-3">
                      <label className="form-label small">Nama Lengkap</label>
                      <input
                        className="form-control"
                        value={form.namaLengkap}
                        onChange={e => setForm({ ...form, namaLengkap: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Username</label>
                      <input
                        className="form-control"
                        value={form.username}
                        onChange={e => setForm({ ...form, username: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Nomor Telepon</label>
                      <input
                        className="form-control"
                        value={form.phone}
                        onChange={e => setForm({ ...form, phone: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Email</label>
                      <input
                        className="form-control"
                        type="email"
                        value={form.email || ""}
                        onChange={e => setForm({ ...form, email: e.target.value })}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Bio</label>
                      <textarea
                        className="form-control"
                        rows={3}
                        value={form.bio || ""}
                        onChange={e => setForm({ ...form, bio: e.target.value })}
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Password Lama</label>
                      <input
                        className="form-control"
                        type="password"
                        value={oldPassword}
                        onChange={e => setOldPassword(e.target.value)}
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label small">Password Baru</label>
                      <input
                        className="form-control"
                        type="password"
                        value={newPassword}
                        onChange={e => setNewPassword(e.target.value)}
                      />
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-primary" onClick={saveProfile}>
                        Simpan
                      </button>
                      <button className="btn btn-outline-secondary" onClick={() => setEditing(false)}>
                        Batal
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-center text-muted mt-5">
                    <p>Klik "Edit Profil" untuk mengubah data dan menjadikan profil Anda lebih menarik!</p>
                    <span role="img" aria-label="sparkles">✨</span>
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