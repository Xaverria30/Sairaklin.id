"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import Image from "next/image";
import {
    ArrowLeft, Calendar, Clock, MapPin, CheckCircle, MessageCircle, XCircle, Star
} from 'lucide-react';
import Head from 'next/head';
import api from "@/lib/api";

type OrderStatus = "Menunggu" | "Diproses" | "Selesai" | "Dibatalkan";

interface OrderDetail {
    id: number;
    jenis: string;
    tipe: string;
    tanggal: string;
    waktu: string;
    petugas: string;
    alamat: string;
    catatan?: string;
    status: OrderStatus;
    harga: string;
    metodePembayaran: string;
    nomorPesanan: string;
    estimasiSelesai: string;
    namaPetugas?: string;
    ratingPetugas?: number;
}

const OrderDetailPage: React.FC = () => {
    const router = useRouter();
    const params = useParams();
    const { id } = params;

    const [order, setOrder] = useState<OrderDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!id) return;

        const fetchOrder = async () => {
            try {
                const response = await api.get(`/orders/${id}`);
                const data = response.data;

                setOrder({
                    id: data.id,
                    jenis: data.service_type === 'room' ? 'Paket Kamar' : (data.service_type === 'bathroom' ? 'Paket Kamar Mandi' : 'Paket Lengkap'),
                    tipe: "Regular Clean", // Placeholder
                    tanggal: data.date,
                    waktu: data.time,
                    petugas: "Perempuan", // Placeholder
                    alamat: data.address,
                    catatan: data.special_notes,
                    status: data.status,
                    harga: `Rp ${data.total_price.toLocaleString('id-ID')}`,
                    metodePembayaran: "Transfer Bank", // Placeholder
                    nomorPesanan: `ORD-${data.id}`,
                    estimasiSelesai: "2-3 jam", // Placeholder
                    namaPetugas: "Siti Nurhaliza", // Placeholder
                    ratingPetugas: 4.8, // Placeholder
                });
            } catch (err) {
                console.error("Failed to fetch order", err);
                setError("Gagal memuat detail pesanan.");
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleWhatsApp = () => {
        if (!order) return;
        const message = encodeURIComponent(
            `Halo, saya ingin menanyakan pesanan saya dengan nomor: ${order.nomorPesanan}`
        );
        window.open(`https://wa.me/6281234567890?text=${message}`, "_blank");
    };

    const getStatusConfig = (status: OrderStatus) => {
        switch (status) {
            case "Selesai":
                return { bg: '#d1fae5', color: '#065f46', icon: CheckCircle };
            case "Diproses":
                return { bg: '#dbeafe', color: '#1e40af', icon: Clock };
            case "Menunggu":
                return { bg: '#fef3c7', color: '#92400e', icon: Clock };
            case "Dibatalkan":
                return { bg: '#fee2e2', color: '#991b1b', icon: XCircle };
            default:
                return { bg: '#f3f4f6', color: '#374151', icon: Clock };
        }
    };

    if (loading) return <div className="p-5 text-center">Loading...</div>;
    if (error) return <div className="p-5 text-center text-danger">{error}</div>;
    if (!order) return <div className="p-5 text-center">Pesanan tidak ditemukan.</div>;

    const statusConfig = getStatusConfig(order.status);
    const StatusIcon = statusConfig.icon;

    return (
        <>
            <Head>
                <title>Detail Pesanan - Sairaklin.id</title>
                <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet" />
            </Head>

            <div className="container py-4">
                <div className="row justify-content-center">
                    <div className="col-lg-8">

                        {/* Back Button */}
                        <button
                            onClick={() => router.back()}
                            className="btn btn-link p-0 mb-3 text-decoration-none d-flex align-items-center"
                            style={{ color: '#ec4899' }}
                        >
                            <ArrowLeft size={20} className="me-2" />
                            Kembali ke Dashboard
                        </button>

                        {/* Status Banner */}
                        <div className="card shadow border-0 mb-3" style={{ background: 'linear-gradient(135deg, #fce7f3 0%, #dbeafe 100%)' }}>
                            <div className="card-body p-4 d-flex align-items-center">
                                <div className="rounded-circle p-3 me-3" style={{ backgroundColor: statusConfig.bg }}>
                                    <StatusIcon size={32} style={{ color: statusConfig.color }} />
                                </div>
                                <div>
                                    <h4 className="mb-1 fw-bold">Status: {order.status}</h4>
                                    <p className="mb-0 text-muted">
                                        {order.status === "Selesai" && "Pesanan Anda telah selesai dikerjakan"}
                                        {order.status === "Diproses" && `Petugas sedang dalam perjalanan. Estimasi ${order.estimasiSelesai}`}
                                        {order.status === "Menunggu" && "Menunggu konfirmasi dari petugas"}
                                        {order.status === "Dibatalkan" && "Pesanan telah dibatalkan"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Pesanan */}
                        <div className="card shadow border-0 mb-3">
                            <div className="card-body p-4">
                                <h5 className="fw-bold mb-3 pb-2 border-bottom">Informasi Pesanan</h5>
                                <div className="row g-3">
                                    <div className="col-12">
                                        <div className="d-flex align-items-start">
                                            <div className="rounded p-2 me-3" style={{ backgroundColor: '#fce7f3' }}>
                                                <CheckCircle size={20} style={{ color: '#ec4899' }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Nomor Pesanan</small>
                                                <strong>{order.nomorPesanan}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="rounded p-2 me-3" style={{ backgroundColor: '#dbeafe' }}>
                                                <Calendar size={20} style={{ color: '#3b82f6' }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Tanggal</small>
                                                <strong>{order.tanggal}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="d-flex align-items-start">
                                            <div className="rounded p-2 me-3" style={{ backgroundColor: '#dbeafe' }}>
                                                <Clock size={20} style={{ color: '#3b82f6' }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Waktu</small>
                                                <strong>{order.waktu}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="d-flex align-items-start">
                                            <div className="rounded p-2 me-3" style={{ backgroundColor: '#fce7f3' }}>
                                                <MapPin size={20} style={{ color: '#ec4899' }} />
                                            </div>
                                            <div className="flex-grow-1">
                                                <small className="text-muted d-block">Alamat</small>
                                                <strong>{order.alamat}</strong>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="card border" style={{ backgroundColor: '#f9fafb' }}>
                                            <div className="card-body">
                                                <div className="mb-2">
                                                    <span className="badge mb-2" style={{ backgroundColor: '#fce7f3', color: '#be185d' }}>
                                                        {order.tipe}
                                                    </span>
                                                </div>
                                                <h6 className="fw-bold mb-1">{order.jenis}</h6>
                                                <div className="text-muted small">Pilihan Petugas: {order.petugas}</div>
                                                <div className="mt-2 fw-bold text-primary">{order.harga}</div>
                                                {order.catatan && (
                                                    <div className="mt-2 pt-2 border-top">
                                                        <small className="text-muted d-block">Catatan Khusus:</small>
                                                        <small>{order.catatan}</small>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Informasi Petugas */}
                        {order.status !== "Menunggu" && order.status !== "Dibatalkan" && order.namaPetugas && (
                            <div className="card shadow border-0 mb-3">
                                <div className="card-body p-4">
                                    <h5 className="fw-bold mb-3 pb-2 border-bottom">Informasi Petugas</h5>
                                    <div className="d-flex align-items-center mb-3">
                                        <div className="rounded-circle me-3 bg-secondary d-flex align-items-center justify-content-center text-white" style={{ width: 80, height: 80, fontSize: 32 }}>
                                            {order.namaPetugas.charAt(0)}
                                        </div>
                                        <div className="flex-grow-1">
                                            <h6 className="fw-bold mb-1">{order.namaPetugas}</h6>
                                            <div className="d-flex align-items-center mb-1">
                                                <Star size={16} className="me-1" style={{ color: '#f59e0b', fill: '#f59e0b' }} />
                                                <span className="fw-semibold">{order.ratingPetugas}</span>
                                                <span className="text-muted small ms-1">/ 5.0</span>
                                            </div>
                                            <span className="badge" style={{ backgroundColor: '#dbeafe', color: '#1e40af' }}>
                                                Petugas {order.petugas}
                                            </span>
                                        </div>
                                    </div>

                                    <button
                                        onClick={handleWhatsApp}
                                        className="btn w-100 d-flex align-items-center justify-content-center"
                                        style={{ backgroundColor: '#25d366', color: 'white' }}
                                    >
                                        <MessageCircle size={20} className="me-2" />
                                        Hubungi Petugas via WhatsApp
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

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
