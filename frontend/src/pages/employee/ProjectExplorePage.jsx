import { useState, useEffect } from 'react';
import { Search, MapPin, Building, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import projectApi from '../../api/projectApi';
import applicationApi from '../../api/applicationApi';

export default function ProjectExplorePage() {
  const [projects, setProjects] = useState([]);
  const [myApplications, setMyApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const [applyingId, setApplyingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        const [openProjects, apps] = await Promise.all([
          projectApi.getOpenProjects(),
          applicationApi.getMyApplications(),
        ]);
        if (isMounted) {
          setProjects(Array.isArray(openProjects) ? openProjects : []);
          setMyApplications(Array.isArray(apps) ? apps : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load project requisitions.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjectsData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const appliedProjectIds = new Set(myApplications.map((a) => a.projectId));

  const filteredProjects = projects.filter((p) => {
    const q = searchQuery.toLowerCase();
    return (
      (p.title && p.title.toLowerCase().includes(q)) ||
      (p.department && p.department.toLowerCase().includes(q)) ||
      (p.location && p.location.toLowerCase().includes(q))
    );
  });

  const handleApply = async (projectId) => {
    setError('');
    setSuccess('');

    try {
      setApplyingId(projectId);
      await applicationApi.applyToProject({ projectId });
      setSuccess('Application submitted successfully!');
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to submit application for project.');
    } finally {
      setApplyingId(null);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Explore Open Projects</h1>
        <p>Discover open project requisitions matching your professional domain and skills.</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', color: 'var(--success)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircle size={18} />
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
          placeholder="Filter open projects by title, department, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading open projects...</div>
      ) : filteredProjects.length === 0 ? (
        <Card>
          <div className="empty-state">
            <Briefcase size={36} />
            <h3>No open projects found</h3>
            <p>{searchQuery ? 'No project postings match your search query.' : 'There are currently no open project requisitions available.'}</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2">
          {filteredProjects.map((proj) => {
            const hasApplied = appliedProjectIds.has(proj.id);
            return (
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

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    {hasApplied ? (
                      <Badge variant="success" style={{ padding: '0.5rem 0.85rem' }}>
                        <CheckCircle size={14} style={{ marginRight: '0.35rem' }} /> Applied ✓
                      </Badge>
                    ) : (
                      <button
                        className="btn btn-primary"
                        onClick={() => handleApply(proj.id)}
                        disabled={applyingId === proj.id}
                      >
                        {applyingId === proj.id ? 'Submitting...' : 'Apply to Project'}
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
