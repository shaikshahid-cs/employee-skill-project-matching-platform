export default function StatCard({ title, value, subtitle, icon: Icon, accent = 'indigo' }) {
  const accentColors = {
    indigo: '#6366f1',
    cyan: '#06b6d4',
    emerald: '#10b981',
    amber: '#f59e0b',
  };

  const color = accentColors[accent] || accentColors.indigo;

  return (
    <div className="glass-card" style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
      <div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 500 }}>{title}</p>
        <h2 style={{ fontSize: '1.85rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.35rem', marginBottom: '0.25rem' }}>
          {value !== undefined ? value : '—'}
        </h2>
        {subtitle && <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)' }}>{subtitle}</p>}
      </div>
      {Icon && (
        <div style={{
          padding: '0.75rem',
          borderRadius: '12px',
          background: `rgba(${accent === 'cyan' ? '6, 182, 212' : accent === 'emerald' ? '16, 185, 129' : accent === 'amber' ? '245, 158, 11' : '99, 102, 241'}, 0.15)`,
          color: color,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Icon size={22} />
        </div>
      )}
    </div>
  );
}
