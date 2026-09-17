import { useState, useEffect } from 'react';
import { Users, User, Briefcase, FileText, Award, Zap, AlertCircle } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
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
        const data = await adminApi.getAdminStats();
        if (isMounted) {
          setStats(data || null);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to load platform statistics.');
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
      <div className="page-header">
        <h1>Admin Platform Statistics</h1>
        <p>System-wide operational metrics, registration counts, and activity breakdown.</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: 'var(--error)',
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Total Users"
          value={loading ? '...' : (stats?.totalUsers ?? 0)}
          subtitle="Platform accounts"
          icon={Users}
          accent="indigo"
        />
        <StatCard
          title="Employees"
          value={loading ? '...' : (stats?.totalEmployees ?? 0)}
          subtitle="Registered employees"
          icon={User}
          accent="cyan"
        />
        <StatCard
          title="Managers"
          value={loading ? '...' : (stats?.totalManagers ?? 0)}
          subtitle="Project managers"
          icon={Briefcase}
          accent="emerald"
        />
        <StatCard
          title="Total Projects"
          value={loading ? '...' : (stats?.totalProjects ?? 0)}
          subtitle="Project postings"
          icon={FileText}
          accent="amber"
        />
      </div>

      <div className="grid grid-cols-4">
        <StatCard
          title="Open Projects"
          value={loading ? '...' : (stats?.openProjects ?? 0)}
          subtitle="Active requisitions"
          icon={Briefcase}
          accent="indigo"
        />
        <StatCard
          title="Applications"
          value={loading ? '...' : (stats?.totalApplications ?? 0)}
          subtitle="Submitted applications"
          icon={FileText}
          accent="cyan"
        />
        <StatCard
          title="Skills Catalog"
          value={loading ? '...' : (stats?.totalSkills ?? 0)}
          subtitle="Defined skill entries"
          icon={Award}
          accent="emerald"
        />
        <StatCard
          title="Match Calculations"
          value={loading ? '...' : (stats?.totalMatchResults ?? 0)}
          subtitle="Generated match scores"
          icon={Zap}
          accent="amber"
        />
      </div>
    </div>
  );
}
