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
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <Sidebar />
          <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', background: 'var(--bg)' }}>
            {children}
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: {
            borderRadius: '10px', fontWeight: 500, fontSize: '13px',
            background: 'var(--surface)', color: 'var(--text-primary)',
            border: '1px solid var(--border)'
          }
        }} />
      </body>
    </html>
  );
}