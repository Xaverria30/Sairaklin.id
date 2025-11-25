'use client';

import React, { useState } from 'react';
import styles from './style.module.css';
import logo from "./logo2.png"; 
import Image from 'next/image';
import {
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Calendar,
  LogOut,
} from 'lucide-react';

type Order = {
  id: number;
  nama: string;
  layanan: string;
  tanggal: string;
  waktu: string;
  alamat: string;
  petugas: string;
  status: 'Menunggu' | 'Diproses' | 'Selesai' | 'Dibatalkan';
};

type AdminProfile = {
  username: string;
  namaLengkap: string;
  phone: string;
};

export default function AdminDashboardPage() {
  // ====== STATE DATA PESANAN ======
  const [orders, setOrders] = useState<Order[]>([
    {
      id: 1,
      nama: 'user1',
      layanan: 'Pembersihan Rutin',
      tanggal: '10/11/2025',
      waktu: '09:00',
      alamat: 'Jl. Sudirman No. 123, Kamar 205',
      petugas: 'P',
      status: 'Selesai',
    },
    {
      id: 2,
      nama: 'user1',
      layanan: 'Pembersihan Deep Clean',
      tanggal: '12/11/2025',
      waktu: '14:00',
      alamat: 'Jl. Sudirman No. 123, Kamar 205',
      petugas: 'P',
      status: 'Diproses',
    },
  ]);

  const [activeTab, setActiveTab] = useState<'dashboard' | 'profile'>('dashboard');

  // ====== STATE PROFIL ADMIN ======
  const [profile, setProfile] = useState<AdminProfile>({
    username: 'admin',
    namaLengkap: 'Admin Sairaklin',
    phone: '+62 812-3456-7890',
  });

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(profile);

  // ====== FUNCTION PESANAN ======
  const handleStatusChange = (id: number, newStatus: Order['status']) => {
    setOrders(prev =>
      prev.map(o => (o.id === id ? { ...o, status: newStatus } : o))
    );
  };

  const handleDelete = (id: number) => {
    if (confirm('Apakah Anda yakin ingin menghapus pesanan ini?')) {
      setOrders(prev => prev.filter(o => o.id !== id));
    }
  };

  // ====== FUNCTION PROFIL ======
  const saveProfile = () => {
    setProfile(form);
    setEditing(false);
    alert('Profil disimpan (frontend only).');
  };

  const handleLogout = () => {
    alert('Logout berhasil (frontend only).');
  };

  // ====== Statistik Pesanan ======
  const totalSelesai = orders.filter(o => o.status === 'Selesai').length;
  const totalPending = orders.filter(
    o => o.status === 'Menunggu' || o.status === 'Diproses'
  ).length;
  const totalBatal = orders.filter(o => o.status === 'Dibatalkan').length;

  // ====== RENDER ======
  return (
    <div className={styles['container-root']}>
      <div style={{ display: 'flex' }}>
        {/* ================= SIDEBAR ================= */}
        <aside className={styles.sidebar}>
          <div className={styles['sidebar-top']}>
            <div className={styles.brand}>
              <Image
                src={logo}
                alt="Sairaklin.id"
                width={80}
                height={80}
                style={{
                  objectFit: 'contain',
                  width: '80%',
                  height: 'auto',
                  maxWidth: '380px',
                }}
              />
            </div>

            <nav className={styles['nav-section']}>
              <button
                className={`${styles['nav-link-custom']} ${
                  activeTab === 'dashboard' ? styles.active : ''
                }`}
                onClick={() => setActiveTab('dashboard')}
              >
                Dashboard
              </button>
              <button
                className={`${styles['nav-link-custom']} ${
                  activeTab === 'profile' ? styles.active : ''
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profil
              </button>
            </nav>
          </div>

          <div className={styles['sidebar-bottom']}>
            <button className={styles['logout-btn']} onClick={handleLogout}>
              <LogOut size={18} />
              <span>Logout</span>
            </button>
            <div className="small text-muted text-center mt-2">
              © {new Date().getFullYear()} Sairaklin.id
            </div>
          </div>
        </aside>

        {/* ================= MAIN CONTENT ================= */}
        <main className={styles['dashboard-main']}>
          {/* ================= DASHBOARD ================= */}
          {activeTab === 'dashboard' && (
            <div className="container-fluid">
              <h3 className="fw-bold">Dashboard Admin</h3>
              <p className="text-muted">
                Kelola semua pesanan layanan kebersihan dengan efisien
              </p>

              {/* Kartu Statistik */}
              <div className="row g-3 mb-4">
                <div className="col-md-3">
                  <div className={`card card-custom ${styles['card-custom']}`}>
                    <div className="card-body d-flex align-items-center gap-3">
                      <div className={styles['icon-circle']}>
                        <Calendar size={22} />
                      </div>
                      <div>
                        <div className="text-muted small">Pesanan Hari Ini</div>
                        <div className="fw-bold">0</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className={`card card-custom ${styles['card-custom']}`}>
                    <div className="card-body d-flex align-items-center gap-3">
                      <div
                        className={styles['icon-circle']}
                        style={{
                          background:
                            'linear-gradient(180deg,var(--blue-1),var(--blue-2))',
                          color: '#e0e9fbff',
                        }}
                      >
                        <CheckCircle size={22} />
                      </div>
                      <div>
                        <div className="text-muted small">Total Selesai</div>
                        <div className="fw-bold">{totalSelesai}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className={`card card-custom ${styles['card-custom']}`}>
                    <div className="card-body d-flex align-items-center gap-3">
                      <div className={styles['icon-circle']}>
                        <Clock size={22} />
                      </div>
                      <div>
                        <div className="text-muted small">Pesanan Pending</div>
                        <div className="fw-bold">{totalPending}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-md-3">
                  <div className={`card card-custom ${styles['card-custom']}`}>
                    <div className="card-body d-flex align-items-center gap-3">
                      <div className={styles['icon-circle']}>
                        <XCircle size={22} />
                      </div>
                      <div>
                        <div className="text-muted small">Pesanan Batal</div>
                        <div className="fw-bold">{totalBatal}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tabel Pesanan */}
              <div className={`card card-custom ${styles['table-wrap']}`}>
                <div className="card-body">
                  <h5 className="fw-semibold">Daftar Pesanan</h5>
                  <div className="table-responsive mt-3">
                    <table className="table align-middle">
                      <thead className="table-light">
                        <tr>
                          <th>Nama Pengguna</th>
                          <th>Jenis Layanan</th>
                          <th>Tanggal & Waktu</th>
                          <th>Alamat</th>
                          <th>Petugas</th>
                          <th>Status</th>
                          <th>Aksi</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.length > 0 ? (
                          orders.map(o => (
                            <tr key={o.id}>
                              <td>{o.nama}</td>
                              <td>{o.layanan}</td>
                              <td>
                                {o.tanggal}
                                <br />
                                <small className="text-muted">{o.waktu}</small>
                              </td>
                              <td>{o.alamat}</td>
                              <td className="text-center">
                                <span className={styles['badge-petugas']}>
                                  {o.petugas}
                                </span>
                              </td>
                              <td>
                                <select
                                  className={`form-select form-select-sm ${styles['select-sm']}`}
                                  value={o.status}
                                  onChange={e =>
                                    handleStatusChange(
                                      o.id,
                                      e.target.value as Order['status']
                                    )
                                  }
                                >
                                  <option value="Menunggu">Menunggu</option>
                                  <option value="Diproses">Diproses</option>
                                  <option value="Selesai">Selesai</option>
                                  <option value="Dibatalkan">Dibatalkan</option>
                                </select>
                              </td>
                              <td>
                                <div className="d-flex gap-2">
                                  <button
                                    className="btn btn-outline-secondary btn-sm"
                                    title="Lihat"
                                  >
                                    <Eye size={14} />
                                  </button>
                                  <button
                                    className="btn btn-outline-danger btn-sm"
                                    title="Hapus"
                                    onClick={() => handleDelete(o.id)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td
                              colSpan={7}
                              className="text-center text-muted py-4"
                            >
                              Tidak ada pesanan.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= PROFIL ================= */}
          {activeTab === 'profile' && (
            <div className={styles['profile-section']}>
              <h3 className="fw-bold">Profil Admin</h3>
              <p className="text-muted mb-4">Kelola informasi akun Anda</p>

              <div className={styles['profile-grid']}>
                {/* Kartu profil kiri */}
                <div className={styles['profile-card']}>
                  <div className="text-center mb-3">
                    <div className={styles['profile-avatar']}>
                      {profile.namaLengkap.charAt(0).toUpperCase()}
                    </div>
                    <div className="fw-bold">{profile.namaLengkap}</div>
                    <div className="text-muted">@{profile.username}</div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">
                      Nama Lengkap
                    </label>
                    <div className="p-3 bg-light rounded">
                      {profile.namaLengkap}
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label small text-muted">
                      Username
                    </label>
                    <div className="p-3 bg-light rounded">{profile.username}</div>
                  </div>

                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary"
                      onClick={() => {
                        setEditing(true);
                        setForm(profile);
                      }}
                    >
                      Edit Profil
                    </button>
                    <button
                      className="btn btn-outline-danger"
                      onClick={handleLogout}
                    >
                      Logout
                    </button>
                  </div>
                </div>

                {/* Kartu edit profil */}
                <div className={styles['profile-card']}>
                  {editing ? (
                    <>
                      <h6>Edit Profil</h6>
                      <div className="mb-3">
                        <label className="form-label small">
                          Nama Lengkap
                        </label>
                        <input
                          className="form-control"
                          value={form.namaLengkap}
                          onChange={e =>
                            setForm({ ...form, namaLengkap: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">Username</label>
                        <input
                          className="form-control"
                          value={form.username}
                          onChange={e =>
                            setForm({ ...form, username: e.target.value })
                          }
                        />
                      </div>
                      <div className="mb-3">
                        <label className="form-label small">
                          Nomor Telepon
                        </label>
                        <input
                          className="form-control"
                          value={form.phone}
                          onChange={e =>
                            setForm({ ...form, phone: e.target.value })
                          }
                        />
                      </div>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-primary"
                          onClick={saveProfile}
                        >
                          Simpan
                        </button>
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() => setEditing(false)}
                        >
                          Batal
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="text-center text-muted">
                      Klik “Edit Profil” untuk mengubah data
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
