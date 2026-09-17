const variantStyles = {
  default: { bg: 'rgba(255, 255, 255, 0.08)', color: '#94a3b8', border: 'rgba(255, 255, 255, 0.12)' },
  indigo: { bg: 'rgba(99, 102, 241, 0.15)', color: '#a5b4fc', border: 'rgba(99, 102, 241, 0.3)' },
  cyan: { bg: 'rgba(6, 182, 212, 0.15)', color: '#67e8f9', border: 'rgba(6, 182, 212, 0.3)' },
  success: { bg: 'rgba(16, 185, 129, 0.15)', color: '#6ee7b7', border: 'rgba(16, 185, 129, 0.3)' },
  warning: { bg: 'rgba(245, 158, 11, 0.15)', color: '#fcd34d', border: 'rgba(245, 158, 11, 0.3)' },
  error: { bg: 'rgba(239, 68, 68, 0.15)', color: '#fca5a5', border: 'rgba(239, 68, 68, 0.3)' },
};

export default function Badge({ children, variant = 'default', className = '' }) {
  const style = variantStyles[variant] || variantStyles.default;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${className}`}
      style={{
        backgroundColor: style.bg,
        color: style.color,
        borderColor: style.border,
        fontSize: '0.75rem',
        padding: '0.2rem 0.65rem',
        borderRadius: '9999px',
        borderStyle: 'solid',
        borderWidth: '1px'
      }}
    >
      {children}
    </span>
  );
}
