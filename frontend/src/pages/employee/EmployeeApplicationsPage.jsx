import { useState, useEffect } from 'react';
import { CheckCircle2, AlertCircle, Clock, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import applicationApi from '../../api/applicationApi';

export default function EmployeeApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationApi.getMyApplications();
        if (isMounted) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch application records.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApplications();
    return () => { isMounted = false; };
  }, []);

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return <Badge variant="success"><CheckCircle2 size={12} style={{ marginRight: '0.25rem' }} /> Accepted</Badge>;
      case 'REJECTED':
        return <Badge variant="danger"><XCircle size={12} style={{ marginRight: '0.25rem' }} /> Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="amber"><Clock size={12} style={{ marginRight: '0.25rem' }} /> Under Review</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>My Applications</h1>
        <p>Track the current review status of project applications you have submitted.</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      <Card title="Submitted Applications" subtitle="Real-time application status feed">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading applications...</div>
        ) : applications.length === 0 ? (
          <div className="empty-state">
            <Clock size={36} />
            <h3>No applications submitted</h3>
            <p>Explore open projects in the catalog and apply to projects that match your profile.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Target Project ID</th>
                  <th>Review Status</th>
                </tr>
              </thead>
              <tbody>
                {applications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>#{app.id}</td>
                    <td style={{ color: 'var(--text-main)' }}>Project #{app.projectId}</td>
                    <td>{getStatusBadge(app.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
