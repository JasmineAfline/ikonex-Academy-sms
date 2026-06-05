'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/', label: '🏠 Dashboard' },
  { href: '/streams', label: '🏫 Class Streams' },
  { href: '/students', label: '👩‍🎓 Students' },
  { href: '/subjects', label: '📚 Subjects' },
  { href: '/scores', label: '📝 Scores' },
  { href: '/results', label: '📊 Results' },
];

export default function Sidebar() {
  const pathname = usePathname();
  return (
    <aside style={{
      width: '220px', background: '#1e3a5f', color: '#fff',
      padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'
    }}>
      <div style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.5rem', color: '#60a5fa' }}>
        Ikonex Academy
      </div>
      {links.map(link => (
        <Link key={link.href} href={link.href} style={{
          padding: '0.6rem 1rem', borderRadius: '6px', textDecoration: 'none',
          color: pathname === link.href ? '#fff' : '#93c5fd',
          background: pathname === link.href ? '#2563eb' : 'transparent',
          fontWeight: pathname === link.href ? 600 : 400,
        }}>
          {link.label}
        </Link>
      ))}
    </aside>
  );
}