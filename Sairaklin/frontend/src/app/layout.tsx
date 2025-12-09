import 'bootstrap/dist/css/bootstrap.min.css';
import './globals.css';
import { ReactNode } from 'react';

export const metadata = {
  title: 'Sairaklin.id',
  description: 'Website klinik modern berbasis Next.js + Bootstrap',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}

