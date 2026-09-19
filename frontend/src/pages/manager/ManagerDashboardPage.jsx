import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, Building, Plus, ChevronRight, AlertCircle, Users, Zap, CheckCircle2, Clock, ArrowUpRight } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/useAuth';
import managerApi from '../../api/managerApi';
import projectApi from '../../api/projectApi';

export default function ManagerDashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profRes, projRes] = await Promise.allSettled([
          managerApi.getProfile(),
          projectApi.getManagerProjects(),
        ]);

        if (isMounted) {
          if (profRes.status === 'fulfilled') setProfile(profRes.value);
          if (projRes.status === 'fulfilled' && Array.isArray(projRes.value)) setProjects(projRes.value);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch manager dashboard data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  const openProjects = projects.filter(p => p.status === 'OPEN');

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span>Welcome back, {profile?.name || user?.name || 'Manager'}</span>
            <Badge variant="indigo">Manager Portal</Badge>
          </h1>
          <p style={{ marginTop: '0.35rem' }}>
            {profile?.department ? `${profile.department} Department • ${profile.designation || 'Manager'}` : 'Manage job postings, candidate matching, and application reviews.'}
          </p>
        </div>

        <Link to="/manager/projects/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Create New Job Requisition</span>
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* RECRUITMENT STAT CARDS GRID */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Active Open Jobs"
          value={loading ? '...' : openProjects.length}
          subtitle="Open requisitions"
          icon={Briefcase}
        />
        <StatCard
          title="Total Posted Requisitions"
          value={loading ? '...' : projects.length}
          subtitle="All created postings"
          icon={Building}
        />
        <StatCard
          title="Manager Unit"
          value={loading ? '...' : (profile?.department || 'Not set')}
          subtitle={profile?.designation || 'Profile pending'}
          icon={Users}
        />
        <StatCard
          title="Matching Engine Status"
          value="Active"
          subtitle="Deterministic scoring ON"
          icon={Zap}
        />
      </div>

      {/* MANAGED PROJECTS FEED */}
      <Card
        title="Active Job Postings"
        subtitle="Manage required skills, document extraction, candidate matching, and application reviews"
        action={
          <Link to="/manager/projects" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', textDecoration: 'none' }}>
            View All Job Postings <ChevronRight size={14} />
          </Link>
        }
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading active postings...</div>
        ) : projects.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={36} />
            <h3>No job postings created yet</h3>
            <p>Click "Create New Job Requisition" above to post your first job opening.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2">
            {projects.map((proj) => (
              <div key={proj.id} style={{ padding: '1.15rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-main)' }}>{proj.title}</h4>
                    <Badge variant={proj.status === 'OPEN' ? 'indigo' : 'secondary'}>{proj.status}</Badge>
                  </div>
                  <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    {proj.department || 'Engineering'} • {proj.location || 'Hybrid'} • Min Exp: {proj.experienceRequired ?? 0} yrs
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5 }}>
                    {proj.description || 'Job requisition description.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <Link to={`/manager/projects/${proj.id}`} className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
                    <Users size={14} /> Candidate Matching & Team
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
