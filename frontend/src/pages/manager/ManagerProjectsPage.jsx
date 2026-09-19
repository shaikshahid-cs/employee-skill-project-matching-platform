import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Plus, Briefcase, Building, MapPin, Search, AlertCircle, Users,
  Trash2, ChevronRight, CheckCircle2
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import projectApi from '../../api/projectApi';

export default function ManagerProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const data = await projectApi.getManagerProjects();
      setProjects(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to fetch manager projects.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (e, id, title) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete project "${title}"?`)) return;
    try {
      await projectApi.deleteProject(id);
      setSuccess(`Project "${title}" deleted.`);
      fetchProjects();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete project.');
    }
  };

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.requiredRole && p.requiredRole.toLowerCase().includes(q)) ||
      (p.requiredDomain && p.requiredDomain.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>My Project Requisitions</h1>
          <p>Create and manage projects, configure mandatory evaluation criteria, and staff matching engineering talent.</p>
        </div>
        <Link to="/manager/projects/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Post New Requisition</span>
        </Link>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem', fontSize: '0.95rem' }}
          placeholder="Filter projects by title, required role, domain, or department..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading manager projects...</div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <div className="empty-state">
            <Briefcase size={36} />
            <h3>No projects found</h3>
            <p>{searchQuery ? 'No project postings match your search filter.' : 'You have not posted any project requisitions yet.'}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2">
          {filteredProjects.map((proj) => (
            <Card key={proj.id}>
              <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{proj.title}</h3>
                    <Badge variant={proj.status === 'OPEN' ? 'emerald' : 'secondary'}>{proj.status}</Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Briefcase size={14} /> <strong>Role:</strong> {proj.requiredRole || 'Engineer'}
                    </span>
                    <span>&bull;</span>
                    <span><strong>Domain:</strong> {proj.requiredDomain || 'Backend'}</span>
                    <span>&bull;</span>
                    <span>{proj.minExperienceYears ?? proj.experienceRequired ?? 0} yrs exp</span>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: 'var(--text-muted)',
                    lineHeight: '1.5',
                    marginBottom: '1.25rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {proj.description || 'No detailed description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <Link to={`/manager/projects/${proj.id}`} className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.825rem', textDecoration: 'none' }}>
                    <Users size={14} />
                    <span>Candidate Matching & Team</span>
                  </Link>

                  <button
                    className="btn btn-secondary"
                    style={{ padding: '0.45rem 0.65rem', color: '#f87171' }}
                    onClick={(e) => handleDelete(e, proj.id, proj.title)}
                    title="Delete Project"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
