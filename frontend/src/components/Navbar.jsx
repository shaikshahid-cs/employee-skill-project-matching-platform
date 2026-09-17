import { useLocation } from 'react-router-dom';
import { Briefcase, Bell, User, Menu } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import Badge from './ui/Badge';

const pathToBreadcrumbMap = {
  '/employee/dashboard': 'Dashboard',
  '/employee/profile': 'My Profile',
  '/employee/skills': 'My Skills',
  '/employee/qualifications': 'Qualifications',
  '/employee/resume': 'Resume Manager',
  '/employee/projects': 'Explore Projects',
  '/employee/applications': 'My Applications',
  '/employee/matches': 'Match Results',
  '/manager/dashboard': 'Dashboard',
  '/manager/profile': 'Manager Profile',
  '/manager/projects': 'My Projects',
  '/manager/projects/new': 'Create Project',
  '/admin/dashboard': 'Dashboard Stats',
  '/admin/users': 'User Directory',
};

export default function Navbar({ portalName = 'Platform', onToggleMobileMenu }) {
  const { user } = useAuth();
  const location = useLocation();

  const currentRole = user?.role || portalName;
  const currentRoleLabel = currentRole.charAt(0).toUpperCase() + currentRole.slice(1).toLowerCase();
  const activeSection = pathToBreadcrumbMap[location.pathname] || 'Workspace';

  return (
    <header style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      height: '64px',
      backgroundColor: 'var(--bg-glass)',
      backdropFilter: 'blur(12px)',
      WebkitBackdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border-color)',
      zIndex: 50,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem'
    }}>
      {/* Brand & Simple Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Mobile Hamburger Button */}
        <button
          onClick={onToggleMobileMenu}
          className="btn-secondary mobile-menu-btn"
          style={{
            padding: '0.45rem',
            display: 'none',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          title="Toggle Navigation Menu"
        >
          <Menu size={20} />
        </button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.65rem',
          fontWeight: 700,
          fontSize: '1.15rem',
          color: 'var(--text-main)'
        }}>
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--primary-gradient)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#ffffff'
          }}>
            <Briefcase size={18} />
          </div>
          <span>MatchPulse</span>
        </div>

        {/* Clean Breadcrumb: MatchPulse / Portal / Section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-dim)' }}>
          <span>/</span>
          <span style={{ color: 'var(--text-muted)' }}>{currentRoleLabel}</span>
          <span>/</span>
          <span style={{ color: 'var(--text-main)', fontWeight: 600 }}>{activeSection}</span>
        </div>

        <Badge variant="indigo" className="desktop-portal-badge">{currentRoleLabel} Portal</Badge>
      </div>

      {/* User & Notifications Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        <button className="btn-secondary" style={{ padding: '0.45rem', borderRadius: '50%', color: 'var(--text-muted)' }} title="Notifications">
          <Bell size={18} />
        </button>

        <div style={{ height: '24px', width: '1px', backgroundColor: 'var(--border-color)' }}></div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{
            width: '36px',
            height: '36px',
            borderRadius: '50%',
            backgroundColor: 'var(--bg-surface-hover)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'var(--text-muted)'
          }}>
            <User size={18} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>{user?.name || 'User Profile'}</span>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{user?.email || 'Logged In'}</span>
          </div>
        </div>
      </div>
    </header>
  );
}
