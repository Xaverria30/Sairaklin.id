"use client";

import Link from "next/link";
import Image from "next/image";
import logo from "./logo.png"; 
import { Inter } from 'next/font/google'; // Import font untuk optimasi
import styles from "./landing.module.css";

const inter = Inter({ subsets: ['latin'] }); // Load font Inter

export default function LandingPage() {
  return (
    <div className={`${styles.wrapper} ${inter.className}`}> {/* Terapkan font di wrapper */}
      {/* Navbar */}
      <header className={styles.navbar}>
        <div className={styles.logo}>
          <Image
            src={logo}
            alt="Logo Sairaklin.id - Layanan Kebersihan Profesional"
            width={50}
            height={50}
            priority
          />
          <span>Sairaklin.id</span>
        </div>
        <nav className={styles.navLinks}>
          <Link href="/auth/login" className={styles.btnLogin} aria-label="Login ke akun Anda">
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroText}>
          <h1>Bersih, Rapi & Nyaman Setiap Hari</h1>
          <p>
            Sairaklin.id menghadirkan layanan kebersihan profesional untuk kos,
            apartemen, dan rumah. Login sekarang dan rasakan pengalaman bersih
            maksimal dengan tim ahli kami!
          </p>
          <Link href="/auth/login" className={styles.btnLoginHero} aria-label="Login untuk memesan layanan">
            Login untuk Memesan
          </Link>
        </div>
        <div className={styles.heroIllustration}>
        </div>
      </section>

      {/* Services */}
      <section className={styles.section}>
        <h2>Layanan Kami</h2>
        <div className={styles.serviceCards}>
          <div className={styles.card}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M3 7V5C3 3.89543 3.89543 3 5 3H19C20.1046 3 21 3.89543 21 5V7M3 7V19C3 20.1046 3.89543 21 5 21H19C20.1046 21 21 20.1046 21 19V7M3 7H21" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
            <h3>Pembersihan Rutin</h3>
            <p>Kamar atau apartemen tetap rapi & harum setiap hari/minggu.</p>
          </div>
          <div className={styles.card}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2L13.09 8.26L20 9L13.09 9.74L12 16L10.91 9.74L4 9L10.91 8.26L12 2Z" stroke="#f472b6" strokeWidth="2"/>
            </svg>
            <h3>Deep Clean + Pewangi</h3>
            <p>Pembersihan menyeluruh dengan pewangi premium untuk hasil maksimal.</p>
          </div>
          <div className={styles.card}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="#3b82f6" strokeWidth="2"/>
            </svg>
            <h3>Custom Request</h3>
            <p>Pilih area atau layanan khusus sesuai kebutuhanmu.</p>
          </div>
          <div className={styles.card}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 7V3M16 7V3M5 11H19M5 11V19C5 20.1046 5.89543 21 7 21H17C18.1046 21 19 20.1046 19 19V11M5 11V7C5 5.89543 5.89543 5 7 5H17C18.1046 5 19 5.89543 19 7V11" stroke="#f472b6" strokeWidth="2"/>
            </svg>
            <h3>Layanan Event</h3>
            <p>Kebersihan untuk acara khusus agar nyaman & bersih.</p>
          </div>
        </div>
      </section>

      {/* Why Us */}
      <section className={styles.section}>
        <h2>Mengapa Memilih Kami?</h2>
        <div className={styles.whyCards}>
          <div className={styles.whyCard}>
            <h4>Profesional</h4>
            <p>Tim berpengalaman & terlatih dengan standar kebersihan tinggi.</p>
          </div>
          <div className={styles.whyCard}>
            <h4>Fleksibel & Tepat Waktu</h4>
            <p>Jadwal sesuai kebutuhan, selalu tepat waktu & transparan.</p>
          </div>
          <div className={styles.whyCard}>
            <h4>Hasil Terbukti</h4>
            <p>Nyaman, wangi, dan rapi — terbukti oleh pelanggan kami.</p>
          </div>
          <div className={styles.whyCard}>
            <h4>Harga Terjangkau</h4>
            <p>Kualitas premium tanpa menguras kantong.</p>
          </div>
        </div>
      </section>

      {/* Kenapa Harus Sairaklin.id */}
      <section className={styles.whyChoose}>
        <h2>Kenapa Harus Sairaklin.id?</h2>
        <div className={styles.whyCards}>
          <div className={styles.whyCard}>
            <h4>Tersebar Luas di Indonesia</h4>
            <p>
              Hadir di Jakarta, Tangerang, Depok, Bekasi, Bogor, Bandung, Medan,
              Surabaya dan Denpasar.
            </p>
          </div>
          <div className={styles.whyCard}>
            <h4>Bisa Pilih Helper Sesuka Kamu</h4>
            <p>
              Langganan Prepaid, kamu bisa pilih helper favorit kamu. Hati tenang
              rumah bersih!
            </p>
          </div>
          <div className={styles.whyCard}>
            <h4>Privasi Kamu Aman!</h4>
            <p>Chat dan komunikasi hanya di aplikasi, aman no tipu-tipu!</p>
          </div>
          <div className={styles.whyCard}>
            <h4>Bayar Pake Apa Aja Bisa!</h4>
            <p>
              Metode pembayaran favoritmu ada semua, mulai dari dompet digital,
              virtual account, sampai kartu kredit.
            </p>
          </div>
        </div>
        {/* Tombol Login dihapus dari sini untuk menghindari redundansi */}
      </section>

      {/* Testimonial */}
      <section className={styles.section}>
        <h2>Apa Kata Pengguna?</h2>
        <div className={styles.testCards}>
          <div className={styles.testCard}>
            <p>
              "Kos saya selalu harum & rapi tiap minggu. Timnya cepat &
              profesional!"
            </p>
            <span>- Siska, Mahasiswa</span>
          </div>
          <div className={styles.testCard}>
            <p>
              "Deep clean top banget — rumah saya terasa baru setiap minggu."
            </p>
            <span>- Dedi, Pekerja Profesional</span>
          </div>
          <div className={styles.testCard}>
            <p>Tim ramah & cekatan. Sangat memudahkan pekerjaan saya!</p>
            <span>- Rina, Mahasiswa</span>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContainer}>
          <div className={styles.company}>
            <h3>PT Sairaklin Internasional</h3>
            <p>
              Jl. Tomang Utara No.15, Tomang, Kec. Grogol Petamburan, Kota
              Jakarta Barat, DKI Jakarta 11440
            </p>
          </div>
          <div className={styles.connect}>
            <h4>Connect With Us</h4>
            <div className={styles.socials}>
              <a href="https://www.instagram.com/sairaklin.id" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi Instagram Sairaklin.id">
                Instagram
              </a>
              <a href="https://www.tiktok.com/@sairaklin.id" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi TikTok Sairaklin.id">
                TikTok
              </a>
              <a href="https://www.facebook.com/sairaklin.id" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi Facebook Sairaklin.id">
                Facebook
              </a>
              <a href="https://www.linkedin.com/company/sairaklin.id" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi LinkedIn Sairaklin.id">
                LinkedIn
              </a>
              <a href="https://www.youtube.com/c/sairaklin.id" target="_blank" rel="noopener noreferrer" aria-label="Kunjungi YouTube Sairaklin.id">
                YouTube
              </a>
            </div>
          </div>
          <div className={styles.contact}>
            <h4>Hubungi Kami</h4>
            <p>Call Center: (021) 50928699</p>
            <p>Email: support@sairaklin.id</p>
            <p>Whatsapp: (+62) 811-918-938</p>
          </div>
        </div>

        <p className={styles.copy}>© 2025 Sairaklin.id | All rights reserved</p>
      </footer>
    </div>
  );
}