export default function PageHeader({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div style={{ marginBottom: '1.75rem' }}>
      <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', letterSpacing: '-0.4px' }}>{title}</h1>
      {subtitle && <p style={{ color: '#64748b', marginTop: '4px', fontSize: '14px' }}>{subtitle}</p>}
    </div>
  );
}