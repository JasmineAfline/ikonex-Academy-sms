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
      width: '100%',
      height: '100%',
      background: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <div style={{ padding: '1.75rem 1.5rem', borderBottom: '1px solid #1e293b' }}>
        <div style={{
          width: '38px', height: '38px', borderRadius: '9px',
          background: '#2563eb', display: 'flex', alignItems: 'center',
          justifyContent: 'center', fontSize: '14px', fontWeight: 700,
          color: '#fff', marginBottom: '12px',
        }}>IA</div>
        <div style={{ color: '#f1f5f9', fontWeight: 700, fontSize: '14px' }}>
          Ikonex Academy
        </div>
        <div style={{ color: '#475569', fontSize: '12px', marginTop: '3px' }}>
          Student Management System
        </div>
      </div>

      <nav style={{ padding: '1.25rem 0.75rem', flex: 1 }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#334155', letterSpacing: '0.1em', padding: '0 0.75rem', marginBottom: '0.5rem' }}>
          NAVIGATION
        </div>
        {links.map(link => {
          const active = pathname === link.href;
          return (
            <Link key={link.href} href={link.href} style={{
              display: 'flex', alignItems: 'center',
              padding: '0.6rem 0.875rem', borderRadius: '8px',
              textDecoration: 'none', marginBottom: '2px',
              color: active ? '#ffffff' : '#64748b',
              background: active ? '#2563eb' : 'transparent',
              fontWeight: active ? 600 : 400,
              fontSize: '13.5px',
              transition: 'all 0.15s',
            }}
              onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#cbd5e1'; }}
              onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.color = '#64748b'; }}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>

      <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid #1e293b' }}>
        <div style={{ fontSize: '11px', color: '#334155' }}>© 2025 Ikonex Academy</div>
      </div>
    </aside>
  );
}