import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Briefcase, Building, MapPin, Search, AlertCircle, Users, CheckSquare } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import projectApi from '../../api/projectApi';

export default function ManagerProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let isMounted = true;

    const fetchProjects = async () => {
      try {
        setLoading(true);
        const data = await projectApi.getManagerProjects();
        if (isMounted) {
          setProjects(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch manager projects.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjects();
    return () => { isMounted = false; };
  }, []);

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Projects Requisitions</h1>
          <p>Manage projects, set required skills, upload Job Descriptions, and evaluate candidates.</p>
        </div>
        <Link to="/manager/projects/new" className="btn btn-primary" style={{ textDecoration: 'none' }}>
          <Plus size={18} />
          <span>Create Project</span>
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Search Input Bar */}
      <div style={{ marginBottom: '1.5rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
        <input
          type="text"
          className="form-input"
          style={{ paddingLeft: '2.75rem', fontSize: '0.95rem' }}
          placeholder="Filter my projects by title, department, or location..."
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
                    <Badge variant={proj.status === 'OPEN' ? 'indigo' : 'secondary'}>{proj.status}</Badge>
                  </div>

                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '0.85rem' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Building size={14} /> {proj.department || 'General'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <MapPin size={14} /> {proj.location || 'Remote / Office'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Briefcase size={14} /> {proj.experienceRequired ?? 0} yrs exp
                    </span>
                  </div>

                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '1.25rem' }}>
                    {proj.description || 'No detailed description provided.'}
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                  <Link to={`/manager/projects/${proj.id}`} className="btn btn-secondary" style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', textDecoration: 'none' }}>
                    Details & Skills
                  </Link>

                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Link to={`/manager/projects/${proj.id}/candidates`} className="btn btn-secondary" style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', textDecoration: 'none' }} title="Match Engine">
                      <Users size={14} style={{ marginRight: '0.25rem' }} /> Candidates
                    </Link>
                    <Link to={`/manager/projects/${proj.id}/applications`} className="btn btn-secondary" style={{ padding: '0.45rem 0.65rem', fontSize: '0.8rem', textDecoration: 'none' }} title="View Applicants">
                      <CheckSquare size={14} style={{ marginRight: '0.25rem' }} /> Apps
                    </Link>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
