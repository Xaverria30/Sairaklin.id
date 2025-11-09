'use client';

import { OrderDetail } from '@/components/OrderDetail';

export default function OrderDetailPage() {
  return (
    <div className="min-h-screen bg-light text-dark p-5">
      <h1 className="text-center mb-4">Detail Pesanan</h1>
      <OrderDetail
        navigateTo={() => {}}
        onLogout={() => {}}
        orderId={null}
        userRole={null}
      />
    </div>
  );
}
