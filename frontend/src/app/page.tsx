'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

const S = {
  card: {
    background: '#fff',
    borderRadius: '14px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    padding: '1.5rem',
  } as React.CSSProperties,
  btnPrimary: {
    background: '#2563eb',
    color: '#fff',
    border: 'none',
    borderRadius: '8px',
    padding: '0.6rem 1.25rem',
    fontWeight: 600,
    fontSize: '13px',
    cursor: 'pointer',
    fontFamily: 'inherit',
    textDecoration: 'none',
    display: 'inline-block',
  } as React.CSSProperties,
};

export default function Dashboard() {
  const [stats, setStats] = useState({ streams: 0, students: 0, subjects: 0 });

  useEffect(() => {
    Promise.all([api.get('/streams'), api.get('/students'), api.get('/subjects')])
      .then(([s, st, su]) => setStats({ streams: s.data.length, students: st.data.length, subjects: su.data.length }))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Class Streams', value: stats.streams, href: '/streams', accent: '#2563eb', desc: 'Active streams' },
    { label: 'Students', value: stats.students, href: '/students', accent: '#059669', desc: 'Registered' },
    { label: 'Subjects', value: stats.subjects, href: '/subjects', accent: '#d97706', desc: 'Active subjects' },
    { label: 'Results', value: '→', href: '/results', accent: '#7c3aed', desc: 'Rankings & reports' },
  ];

  const actions = [
    { label: 'Register Student', href: '/students', bg: '#2563eb' },
    { label: 'Record Scores', href: '/scores', bg: '#059669' },
    { label: 'View Results', href: '/results', bg: '#7c3aed' },
    { label: 'Manage Subjects', href: '/subjects', bg: '#d97706' },
  ];

  return (
    <div style={{ maxWidth: '1100px' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.3px' }}>Dashboard</h1>
        <p style={{ color: '#94a3b8', marginTop: '4px', fontSize: '13px' }}>Ikonex Academy — Student Management System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{ ...S.card, borderTop: `3px solid ${card.accent}`, cursor: 'pointer', transition: 'all 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.08)'; (e.currentTarget as HTMLDivElement).style.transform = 'none'; }}
            >
              <div style={{ fontSize: '2.25rem', fontWeight: 700, color: '#0f172a', lineHeight: 1, marginBottom: '8px' }}>{card.value}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={S.card}>
        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions.map(a => (
            <Link key={a.href} href={a.href} style={{ ...S.btnPrimary, background: a.bg }}>
              {a.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}