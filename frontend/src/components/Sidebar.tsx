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
      width: '230px', minHeight: '100vh',
      background: 'var(--sidebar-bg)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.05)'
    }}>
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        <div style={{
          width: '36px', height: '36px', borderRadius: '9px',
          background: 'var(--primary)', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '14px', fontWeight: 700,
          color: '#fff', marginBottom: '12px', letterSpacing: '-0.5px'
        }}>IA</div>
        <div style={{ color: '#f1f5f9', fontWeight: 600, fontSize: '14px' }}>Ikonex Academy</div>
        <div style={{ color: '#334155', fontSize: '12px', marginTop: '2px' }}>Student Management System</div>
      </div>

      <nav style={{ padding: '1.25rem 0.875rem', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 600, color: '#1e293b', letterSpacing: '0.1em', padding: '0 0.625rem', marginBottom: '0.5rem' }}>MENU</div>
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center',
              padding: '0.575rem 0.875rem', borderRadius: '8px',
              textDecoration: 'none', marginBottom: '2px',
              color: active ? '#fff' : 'var(--sidebar-text)',
              background: active ? 'var(--primary)' : 'transparent',
              fontWeight: active ? 600 : 400, fontSize: '13.5px',
              transition: 'all 0.15s',
            }}>
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ fontSize: '11px', color: '#1e293b' }}>© 2025 Ikonex Academy</div>
      </div>
    </aside>
  );
}