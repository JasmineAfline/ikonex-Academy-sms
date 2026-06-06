import React from 'react';

export const card: React.CSSProperties = {
  background: '#fff',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  padding: '1.5rem',
};

export const btnPrimary: React.CSSProperties = {
  background: '#2563eb',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  padding: '0.6rem 1.25rem',
  fontWeight: 600,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const btnGhost: React.CSSProperties = {
  background: '#f1f5f9',
  color: '#475569',
  border: 'none',
  borderRadius: '8px',
  padding: '0.6rem 1.25rem',
  fontWeight: 500,
  fontSize: '13px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const btnEdit: React.CSSProperties = {
  background: '#fffbeb',
  color: '#d97706',
  border: 'none',
  borderRadius: '6px',
  padding: '4px 12px',
  fontWeight: 600,
  fontSize: '12px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const btnDanger: React.CSSProperties = {
  background: '#fef2f2',
  color: '#dc2626',
  border: 'none',
  borderRadius: '6px',
  padding: '4px 12px',
  fontWeight: 600,
  fontSize: '12px',
  cursor: 'pointer',
  fontFamily: 'inherit',
};

export const input: React.CSSProperties = {
  width: '100%',
  padding: '0.6rem 0.875rem',
  borderRadius: '8px',
  border: '1.5px solid #e2e8f0',
  fontSize: '14px',
  fontFamily: 'inherit',
  color: '#0f172a',
  background: '#fff',
  outline: 'none',
};

export const select: React.CSSProperties = {
  ...input,
  cursor: 'pointer',
};

export const tableWrapper: React.CSSProperties = {
  background: '#fff',
  borderRadius: '14px',
  border: '1px solid #e2e8f0',
  boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  overflow: 'hidden',
};

export const th: React.CSSProperties = {
  padding: '0.75rem 1.25rem',
  textAlign: 'left',
  fontSize: '11px',
  fontWeight: 600,
  color: '#94a3b8',
  letterSpacing: '0.07em',
  textTransform: 'uppercase',
  background: '#f8fafc',
  borderBottom: '1px solid #e2e8f0',
};

export const td: React.CSSProperties = {
  padding: '0.875rem 1.25rem',
  fontSize: '14px',
  color: '#0f172a',
  borderTop: '1px solid #f1f5f9',
};

export const badge = (color: 'blue' | 'green' | 'red' | 'yellow' | 'purple'): React.CSSProperties => {
  const map = {
    blue: { background: '#eff6ff', color: '#2563eb' },
    green: { background: '#ecfdf5', color: '#059669' },
    red: { background: '#fef2f2', color: '#dc2626' },
    yellow: { background: '#fffbeb', color: '#d97706' },
    purple: { background: '#f5f3ff', color: '#7c3aed' },
  };
  return {
    ...map[color],
    display: 'inline-flex',
    alignItems: 'center',
    padding: '3px 10px',
    borderRadius: '20px',
    fontSize: '12px',
    fontWeight: 600,
  };
};

export const gradeBadge = (grade: string): React.CSSProperties => {
  if (grade === 'A') return badge('green');
  if (grade === 'B') return badge('blue');
  if (grade === 'F') return badge('red');
  return badge('yellow');
};

export const pageHeader: React.CSSProperties = {
  marginBottom: '1.75rem',
};

export const formGroup: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '5px',
  flex: 1,
  minWidth: '150px',
};

export const label: React.CSSProperties = {
  fontSize: '12px',
  fontWeight: 500,
  color: '#475569',
};

export const emptyState: React.CSSProperties = {
  padding: '3rem',
  textAlign: 'center',
  color: '#94a3b8',
  fontSize: '13px',
};