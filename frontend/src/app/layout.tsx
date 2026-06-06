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
      <body style={{ margin: 0, padding: 0, background: '#f8fafc' }}>
        <div style={{ display: 'flex', minHeight: '100vh' }}>
          <div style={{
            width: '230px',
            minHeight: '100vh',
            background: '#0f172a',
            flexShrink: 0,
            position: 'sticky',
            top: 0,
            alignSelf: 'flex-start',
            height: '100vh',
            overflowY: 'auto',
          }}>
            <Sidebar />
          </div>
          <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto', background: '#f8fafc' }}>
            {children}
          </main>
        </div>
        <Toaster position="top-right" toastOptions={{
          style: {
            borderRadius: '10px',
            fontWeight: 500,
            fontSize: '13px',
            background: '#fff',
            color: '#0f172a',
            border: '1px solid #e2e8f0'
          }
        }} />
      </body>
    </html>
  );
}