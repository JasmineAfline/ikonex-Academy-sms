'use client';
import { useEffect, useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

export default function Dashboard() {
  const [stats, setStats] = useState({ streams: 0, students: 0, subjects: 0 });

  useEffect(() => {
    Promise.all([api.get('/streams'), api.get('/students'), api.get('/subjects')])
      .then(([s, st, su]) => setStats({ streams: s.data.length, students: st.data.length, subjects: su.data.length }))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Class Streams', value: stats.streams, href: '/streams', color: '#3b82f6', lightBg: '#eff6ff', desc: 'Active class streams' },
    { label: 'Students', value: stats.students, href: '/students', color: '#10b981', lightBg: '#f0fdf4', desc: 'Registered students' },
    { label: 'Subjects', value: stats.subjects, href: '/subjects', color: '#f59e0b', lightBg: '#fffbeb', desc: 'Active subjects' },
    { label: 'Results', value: 'View', href: '/results', color: '#8b5cf6', lightBg: '#f5f3ff', desc: 'Rankings and reports' },
  ];

  const quickActions = [
    { label: 'Register Student', href: '/students', color: '#3b82f6' },
    { label: 'Record Scores', href: '/scores', color: '#10b981' },
    { label: 'View Results', href: '/results', color: '#8b5cf6' },
    { label: 'Add Subject', href: '/subjects', color: '#f59e0b' },
  ];

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px' }}>Dashboard</h1>
        <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>Welcome to Ikonex Academy Student Management System</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        {cards.map(card => (
          <Link key={card.href} href={card.href} style={{ textDecoration: 'none' }}>
            <div style={{
              background: '#fff', borderRadius: '12px', padding: '1.5rem',
              boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 1px 8px rgba(0,0,0,0.04)',
              border: '1px solid #f1f5f9', cursor: 'pointer',
              borderTop: `3px solid ${card.color}`,
              transition: 'box-shadow 0.15s, transform 0.15s',
            }}
              onMouseEnter={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={e => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
              }}
            >
              <div style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', marginBottom: '4px' }}>{card.value}</div>
              <div style={{ fontSize: '14px', fontWeight: 600, color: '#1e293b' }}>{card.label}</div>
              <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '2px' }}>{card.desc}</div>
            </div>
          </Link>
        ))}
      </div>

      <div style={{ background: '#fff', borderRadius: '12px', padding: '1.5rem', boxShadow: '0 1px 3px rgba(0,0,0,0.06)', border: '1px solid #f1f5f9' }}>
        <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#0f172a', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Actions</h2>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {quickActions.map(action => (
            <Link key={action.href} href={action.href} style={{
              padding: '0.6rem 1.25rem', borderRadius: '8px', textDecoration: 'none',
              background: action.color, color: '#fff', fontSize: '14px', fontWeight: 500,
              transition: 'opacity 0.15s',
            }}>
              {action.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}