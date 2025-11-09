'use client';

import { Profile } from '@/components/Profile';

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-light text-dark p-5">
      <h1 className="text-center mb-4">Profil Pengguna</h1>
      <Profile navigateTo={() => {}} onLogout={() => {}} userRole={null} />
    </div>
  );
}
