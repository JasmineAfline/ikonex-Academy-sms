export default function Dashboard() {
  return (
    <div>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>
        Welcome to Ikonex Academy SMS
      </h1>
      <p style={{ color: '#6b7280', marginBottom: '2rem' }}>
        Manage students, classes, subjects and results all in one place.
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {[
          { label: 'Class Streams', href: '/streams', color: '#3b82f6', icon: '🏫' },
          { label: 'Students', href: '/students', color: '#10b981', icon: '👩‍🎓' },
          { label: 'Subjects', href: '/subjects', color: '#f59e0b', icon: '📚' },
          { label: 'Scores', href: '/scores', color: '#8b5cf6', icon: '📝' },
          { label: 'Results', href: '/results', color: '#ef4444', icon: '📊' },
        ].map(card => (
          <a key={card.href} href={card.href} style={{
            background: '#fff', borderRadius: '10px', padding: '1.5rem',
            textDecoration: 'none', color: '#111', boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
            borderTop: `4px solid ${card.color}`, display: 'block'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{card.icon}</div>
            <div style={{ fontWeight: 600 }}>{card.label}</div>
          </a>
        ))}
      </div>
    </div>
  );
}