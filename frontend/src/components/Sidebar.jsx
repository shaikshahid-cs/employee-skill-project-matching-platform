import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  User,
  Award,
  GraduationCap,
  FileText,
  Compass,
  CheckCircle,
  Zap,
  FolderPlus,
  Briefcase,
  Users,
  LogOut,
  X
} from 'lucide-react';
import { useAuth } from '../context/useAuth';

const navConfig = {
  employee: [
    { label: 'Dashboard', path: '/employee/dashboard', icon: LayoutDashboard },
    { label: 'My Profile', path: '/employee/profile', icon: User },
    { label: 'My Skills', path: '/employee/skills', icon: Award },
    { label: 'Work Experience', path: '/employee/experience', icon: Briefcase },
    { label: 'Qualifications', path: '/employee/qualifications', icon: GraduationCap },
    { label: 'Resume Parser', path: '/employee/resume', icon: FileText },
    { label: 'My Projects', path: '/employee/projects', icon: Compass },
    { label: 'Match Results', path: '/employee/matches', icon: Zap },
  ],
  manager: [
    { label: 'Dashboard', path: '/manager/dashboard', icon: LayoutDashboard },
    { label: 'Manager Profile', path: '/manager/profile', icon: User },
    { label: 'My Projects', path: '/manager/projects', icon: Briefcase },
    { label: 'Create Project', path: '/manager/projects/new', icon: FolderPlus },
  ],
  admin: [
    { label: 'Dashboard Stats', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'User Directory', path: '/admin/users', icon: Users },
  ],
};

export default function Sidebar({ portal = 'employee', isMobileOpen = false, onCloseMobile = () => {} }) {
  const { logout } = useAuth();
  const links = navConfig[portal] || navConfig.employee;

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          onClick={onCloseMobile}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.65)',
            backdropFilter: 'blur(4px)',
            zIndex: 45,
          }}
        />
      )}

      <aside
        className={`sidebar-aside ${isMobileOpen ? 'mobile-open' : ''}`}
        style={{
          position: 'fixed',
          top: '64px',
          left: 0,
          bottom: 0,
          width: '240px',
          backgroundColor: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRight: '1px solid var(--border-color)',
          padding: '1.25rem 0.85rem',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          zIndex: 50,
          transition: 'transform 0.3s ease',
        }}
      >
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 0.75rem 0.5rem' }}>
            <p style={{ fontSize: '0.725rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </p>
            {/* Mobile Close Button */}
            <button
              onClick={onCloseMobile}
              className="mobile-close-btn"
              style={{ background: 'none', border: 'none', color: 'var(--text-dim)', cursor: 'pointer', display: 'none' }}
            >
              <X size={18} />
            </button>
          </div>

          {links.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'active' : ''}`
                }
                style={({ isActive }) => ({
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  borderRadius: '8px',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  color: isActive ? '#ffffff' : 'var(--text-muted)',
                  background: isActive ? 'var(--primary-gradient)' : 'transparent',
                  boxShadow: isActive ? '0 2px 10px rgba(99, 102, 241, 0.3)' : 'none',
                  transition: 'all 0.2s ease',
                  textDecoration: 'none'
                })}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
          <button
            onClick={() => {
              onCloseMobile();
              logout();
            }}
            style={{
              width: '100%',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              padding: '0.65rem 0.85rem',
              borderRadius: '8px',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: 'var(--text-dim)',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
              transition: 'color 0.2s ease'
            }}
          >
            <LogOut size={18} />
            <span>Exit Session</span>
          </button>
        </div>
      </aside>
    </>
  );
}
