import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Sidebar from '@/components/Sidebar';

export const metadata: Metadata = {
  title: 'Ikonex Academy SMS',
  description: 'Student Management System',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div style={{ display: 'flex', minHeight: '100vh', background: '#f0f4f8' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto', maxWidth: '1200px' }}>
            {children}
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: { borderRadius: '10px', fontWeight: 500, fontSize: '14px' }
        }} />
      </body>
    </html>
  );
}