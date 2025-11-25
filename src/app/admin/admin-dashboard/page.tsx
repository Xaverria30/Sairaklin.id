"use client";

import React, { useState } from "react";
import styles from "@/app/admin/admin-dashboard/style.module.css";
import Image from "next/image";
import logo from "./logo.png"; 
import { Calendar, CheckCircle, Clock, XCircle, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";

type Order = {
  id: number;
  nama: string;
  layanan: string;
  tanggal: string;
  waktu: string;
  alamat: string;
  petugas: string;
  status: "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";
};

type AdminProfile = {
  username: string;
  namaLengkap: string;
  phone: string;
};

const AdminDashboardPage: React.FC = () => {
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      nama: "user1",
      layanan: "Pembersihan Rutin",
      tanggal: "10/11/2025",
      waktu: "09:00",
      alamat: "Jl. Sudirman No. 123, Kamar 205",
      petugas: "P",
      status: "Selesai",
    },
    {
      id: 2,
      nama: "user2",
      layanan: "Pembersihan Deep Clean",
      tanggal: "12/11/2025",
      waktu: "14:00",
      alamat: "Jl. Sudirman No. 123, Kamar 205",
      petugas: "P",
      status: "Diproses",
    },
  ]);

  const [activeTab, setActiveTab] = useState<"dashboard" | "profile">("dashboard");
  const [profile, setProfile] = useState<AdminProfile>({
    username: "admin",
    namaLengkap: "Admin Sairaklin",
    phone: "+62 812-3456-7890",
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<AdminProfile>(profile);

  // Hitung summary
  const totalSelesai = orders.filter((o) => o.status === "Selesai").length;
  const totalPending = orders.filter((o) => o.status === "Menunggu" || o.status === "Diproses").length;
  const totalBatal = orders.filter((o) => o.status === "Dibatalkan").length;

  // Update status pesanan
  const handleStatusChange = (id: number, newStatus: Order["status"]) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o)));
  };

  // Hapus pesanan
  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus pesanan ini?")) {
      setOrders((prev) => prev.filter((o) => o.id !== id));
    }
  };

  // Simpan profil admin
  const saveProfile = () => {
    setProfile(form);
    setEditing(false);
    alert("Profil disimpan (frontend only).");
  };

  // Logout
  const handleLogout = () => {
    alert("Logout berhasil (frontend only).");
    router.push("/");
  };

  return (
    <div className={styles.wrapper}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>
          <Image
            src= {logo}
            alt="Sairaklin"
            width={80}
            height={80}
            style={{ borderRadius: 12, marginBottom: 10 }}
          />
          <span>Sairaklin.id</span>
        </div>

        <nav className={styles.nav}>
          <button
            className={`${styles.navItem} ${activeTab === "dashboard" ? styles.active : ""}`}
            onClick={() => setActiveTab("dashboard")}
            type="button"
          >
            Dashboard
          </button>

          <button
            className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
            onClick={() => setActiveTab("profile")}
            type="button"
          >
            Profil
          </button>
        </nav>

        <button className={styles.logout} onClick={handleLogout} type="button">
          Keluar
        </button>
      </aside>

      {/* Main Content */}
      <main className={styles.main}>
        {/* DASHBOARD */}
        {activeTab === "dashboard" && (
          <>
            <header className={styles.header}>
              <h2>Dashboard Admin</h2>
              <p>Kelola semua pesanan layanan kebersihan dengan efisien</p>
            </header>

            {/* Status Summary */}
            <section className={styles.statusSummary}>
              <div className={`${styles.statusCard} ${styles.waiting}`}>
                <span className={styles.statusIcon}>
                  <Calendar size={22} />
                </span>
                <div>
                  <p>Pesanan Hari Ini</p>
                  <h3>0</h3>
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.done}`}>
                <span className={styles.statusIcon}>
                  <CheckCircle size={22} />
                </span>
                <div>
                  <p>Total Selesai</p>
                  <h3>{totalSelesai}</h3>
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.processing}`}>
                <span className={styles.statusIcon}>
                  <Clock size={22} />
                </span>
                <div>
                  <p>Pesanan Pending</p>
                  <h3>{totalPending}</h3>
                </div>
              </div>

              <div className={`${styles.statusCard} ${styles.waiting}`}>
                <span className={styles.statusIcon}>
                  <XCircle size={22} />
                </span>
                <div>
                  <p>Pesanan Batal</p>
                  <h3>{totalBatal}</h3>
                </div>
              </div>
            </section>

            {/* Orders List */}
            <section className={styles.ordersSection}>
              <div className={styles.ordersHeader}>
                <h3>Daftar Pesanan</h3>
              </div>

              <div className={styles.ordersList}>
                {orders.map((order) => (
                  <div key={order.id} className={styles.orderCard}>
                    <div className={styles.orderTop}>
                      <div>
                        <h4>{order.nama}</h4>
                        <p>{order.layanan}</p>
                      </div>

                      <select
                        aria-label={`Ubah status pesanan ${order.id}`}
                        className={styles.statusTag}
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
                      <p>
                        <strong>Tanggal:</strong> {order.tanggal} {order.waktu}
                      </p>
                      <p>
                        <strong>Alamat:</strong> {order.alamat}
                      </p>
                    </div>

                    <div className={styles.orderActions}>
                      <button className={styles.detailBtn} onClick={() => handleDelete(order.id)} type="button">
                        Hapus
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        )}

        {/* PROFILE */}
        {activeTab === "profile" && (
          <div className={styles.profileSection}>
            <h3>Profil Admin</h3>

            <div className={styles.profileGrid}>
              <div className={styles.profileCard}>
      

                <h5>{profile.namaLengkap}</h5>
                <p>@{profile.username}</p>
                <p>{profile.phone}</p>

                <button onClick={() => setEditing(true)} type="button">
                  <Pencil size={14} style={{ verticalAlign: "middle", marginRight: 6 }} /> Edit Profil
                </button>
              </div>

              {editing && (
                <div className={styles.profileCard}>
                  <h6>Edit Profil</h6>

                  <label>
                    Nama Lengkap
                    <input
                      value={form.namaLengkap}
                      onChange={(e) => setForm({ ...form, namaLengkap: e.target.value })}
                      placeholder="Nama Lengkap"
                    />
                  </label>

                  <label>
                    Username
                    <input
                      value={form.username}
                      onChange={(e) => setForm({ ...form, username: e.target.value })}
                      placeholder="Username"
                    />
                  </label>

                  <label>
                    Nomor Telepon
                    <input
                      value={form.phone}
                      onChange={(e) => setForm({ ...form, phone: e.target.value })}
                      placeholder="Nomor Telepon"
                    />
                  </label>

                  <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                    <button onClick={saveProfile} type="button">
                      Simpan
                    </button>
                    <button
                      onClick={() => {
                        setForm(profile);
                        setEditing(false);
                      }}
                      type="button"
                    >
                      Batal
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboardPage;
