'use client';

import { OrderForm } from '@/components/OrderForm';

export default function OrderFormPage() {
  return (
    <div className="min-h-screen bg-light text-dark p-5">
      <h1 className="text-center mb-4">Formulir Pemesanan</h1>
      <OrderForm navigateTo={() => {}} onLogout={() => {}} />
    </div>
  );
}
