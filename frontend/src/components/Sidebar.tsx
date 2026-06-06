'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/streams', label: 'Class Streams' },
  { href: '/students', label: 'Students' },
  { href: '/subjects', label: 'Subjects' },
  { href: '/scores', label: 'Scores' },
  { href: '/results', label: 'Results' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      width: '240px', minHeight: '100vh',
      background: '#0f172a',
      padding: '0', display: 'flex', flexDirection: 'column',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)', flexShrink: 0
    }}>
      <div style={{
        padding: '1.75rem 1.5rem 1.25rem',
        borderBottom: '1px solid rgba(255,255,255,0.07)'
      }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '10px',
          background: '#3b82f6', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '16px', fontWeight: 700,
          color: '#fff', marginBottom: '12px'
        }}>IA</div>
        <div style={{ color: '#fff', fontWeight: 700, fontSize: '15px' }}>Ikonex Academy</div>
        <div style={{ color: '#475569', fontSize: '12px', marginTop: '2px' }}>Student Management</div>
      </div>

      <nav style={{ padding: '1rem 0.75rem', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#334155', letterSpacing: '0.1em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>NAVIGATION</div>
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center',
              padding: '0.6rem 0.875rem', borderRadius: '8px',
              textDecoration: 'none', marginBottom: '2px',
              color: active ? '#fff' : '#64748b',
              background: active ? '#3b82f6' : 'transparent',
              fontWeight: active ? 600 : 400, fontSize: '14px',
              transition: 'all 0.15s ease',
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{ fontSize: '11px', color: '#334155', textAlign: 'center' }}>
          Ikonex Academy © 2025
        </div>
      </div>
    </aside>
  );
}