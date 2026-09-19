import { useState, useEffect } from 'react';
import { Users, User, Briefcase, FileText, CheckCircle2, ShieldAlert, UserPlus } from 'lucide-react';
import { Link } from 'react-router-dom';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import adminApi from '../../api/adminApi';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getOverview();
        if (isMounted) {
          setStats(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err?.response?.data?.message || err.message || 'Failed to load platform statistics.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStats();
    return () => { isMounted = false; };
  }, []);

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Admin Control Center</h1>
          <p>System-wide operational metrics, account governance, and platform health.</p>
        </div>
        <Link to="/admin/users" className="btn btn-primary">
          <UserPlus size={16} />
          <span>Provision Accounts</span>
        </Link>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          {error}
        </div>
      )}

      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Users"
          value={loading ? '...' : (stats?.totalUsers ?? 0)}
          subtitle="Provisioned accounts"
          icon={Users}
          accent="indigo"
        />
        <StatCard
          title="Employees"
          value={loading ? '...' : (stats?.totalEmployees ?? 0)}
          subtitle="Registered talent profiles"
          icon={User}
          accent="emerald"
        />
        <StatCard
          title="Managers"
          value={loading ? '...' : (stats?.totalManagers ?? 0)}
          subtitle="Project managers"
          icon={Briefcase}
          accent="cyan"
        />
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '2rem' }}>
        <StatCard
          title="Active Accounts"
          value={loading ? '...' : (stats?.activeAccounts ?? 0)}
          subtitle="Authorized users"
          icon={CheckCircle2}
          accent="emerald"
        />
        <StatCard
          title="Inactive Accounts"
          value={loading ? '...' : (stats?.inactiveAccounts ?? 0)}
          subtitle="Suspended accounts"
          icon={ShieldAlert}
          accent="amber"
        />
        <StatCard
          title="Total Projects"
          value={loading ? '...' : (stats?.totalProjects ?? 0)}
          subtitle="Projects in platform"
          icon={FileText}
          accent="indigo"
        />
      </div>

      <Card title="Quick Governance Actions" subtitle="Administrative account lifecycle and platform management">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Provision New Employees
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                Create employee records with initial designation, domain, experience years, and date of birth. Initial credentials require first-login password change.
              </p>
            </div>
            <Link to="/admin/users" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Manage Directory &rarr;
            </Link>
          </div>

          <div style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}>
            <div>
              <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Security & Credential Resets
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1rem' }}>
                Generate temporary passwords for employees or managers who are locked out or need onboarding resets.
              </p>
            </div>
            <Link to="/admin/users" className="btn btn-secondary" style={{ alignSelf: 'flex-start' }}>
              Reset Credentials &rarr;
            </Link>
          </div>
        </div>
      </Card>
    </div>
  );
}
