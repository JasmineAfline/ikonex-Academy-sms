'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ streams: 0, students: 0, subjects: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([api.get('/streams'), api.get('/students'), api.get('/subjects')])
      .then(([s, st, su]) => setStats({ streams: s.data.length, students: st.data.length, subjects: su.data.length }))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const cards = [
    { label: 'Class Streams', value: stats.streams, href: '/streams', accent: 'var(--primary)', desc: 'Total active streams' },
    { label: 'Students', value: stats.students, href: '/students', accent: 'var(--success)', desc: 'Registered students' },
    { label: 'Subjects', value: stats.subjects, href: '/subjects', accent: 'var(--warning)', desc: 'Active subjects' },
    { label: 'Results', value: 'View', href: '/results', accent: 'var(--purple)', desc: 'Rankings and reports' },
  ];

  const actions = [
    { label: 'Register Student', href: '/students', style: 'btn-primary' },
    { label: 'Record Scores', href: '/scores', style: 'btn-primary' },
    { label: 'View Results', href: '/results', style: 'btn-primary' },
    { label: 'Manage Subjects', href: '/subjects', style: 'btn-primary' },
  ];

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
        <p>Ikonex Academy — Student Management System overview</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div className="card" style={{ borderTop: `3px solid ${card.accent}`, cursor: 'pointer', transition: 'box-shadow 0.15s, transform 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-lg)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'var(--shadow-sm)'; (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1, marginBottom: '6px' }}>
                {loading ? '—' : card.value}
              </div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div className="card">
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.07em', textTransform: 'uppercase', marginBottom: '1rem' }}>Quick Actions</div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {actions.map(a => (
            <Link key={a.href} href={a.href} style={{ textDecoration: 'none' }}>
              <button className={a.style}>{a.label}</button>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}