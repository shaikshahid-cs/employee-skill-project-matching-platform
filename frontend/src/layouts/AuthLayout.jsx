import { Outlet } from 'react-router-dom';
import { Briefcase } from 'lucide-react';

export default function AuthLayout() {
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: 'var(--bg-base)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
      padding: '1.5rem',
      overflow: 'hidden'
    }}>
      <div style={{
        position: 'absolute',
        top: '20%',
        left: '30%',
        width: '400px',
        height: '400px',
        background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, rgba(11, 15, 23, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />
      <div style={{
        position: 'absolute',
        bottom: '20%',
        right: '30%',
        width: '350px',
        height: '350px',
        background: 'radial-gradient(circle, rgba(6, 182, 212, 0.12) 0%, rgba(11, 15, 23, 0) 70%)',
        pointerEvents: 'none',
        zIndex: 0
      }} />

      <div style={{ width: '100%', maxWidth: '440px', zIndex: 10 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff',
            marginBottom: '0.75rem',
            boxShadow: 'var(--shadow-glow)'
          }}>
            <Briefcase size={26} />
          </div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>MatchPulse</h1>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>Enterprise Employee Matching Platform</p>
        </div>

        <div className="glass-card">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
