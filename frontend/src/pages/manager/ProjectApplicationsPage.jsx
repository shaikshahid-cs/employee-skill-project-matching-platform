import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, XCircle, Clock, ArrowLeft, AlertCircle, CheckCircle, User, Award, Eye } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import applicationApi from '../../api/applicationApi';

export default function ProjectApplicationsPage() {
  const { id: projectId } = useParams();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewingId, setReviewingId] = useState(null);
  const [statusFilter, setStatusFilter] = useState('ALL');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchApplications = async () => {
      try {
        setLoading(true);
        const data = await applicationApi.getProjectApplications(projectId);
        if (isMounted) {
          setApplications(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch project applications.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchApplications();
    return () => { isMounted = false; };
  }, [projectId, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleReview = async (applicationId, status) => {
    setError('');
    setSuccess('');

    try {
      setReviewingId(applicationId);
      await applicationApi.reviewApplication(applicationId, { status });
      setSuccess(`Application #${applicationId} updated to ${status.replace('_', ' ')}!`);
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to review project application.');
    } finally {
      setReviewingId(null);
    }
  };

  const filteredApplications = applications.filter((app) => {
    if (statusFilter === 'ALL') return true;
    return (app.status || 'PENDING').toUpperCase() === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'ACCEPTED':
        return <Badge variant="success"><CheckCircle2 size={12} style={{ marginRight: '0.25rem' }} /> Accepted</Badge>;
      case 'SHORTLISTED':
        return <Badge variant="indigo">Shortlisted</Badge>;
      case 'UNDER_REVIEW':
        return <Badge variant="info">Under Review</Badge>;
      case 'REJECTED':
        return <Badge variant="danger"><XCircle size={12} style={{ marginRight: '0.25rem' }} /> Rejected</Badge>;
      case 'PENDING':
      default:
        return <Badge variant="amber"><Clock size={12} style={{ marginRight: '0.25rem' }} /> Pending</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <Link to={`/manager/projects/${projectId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
            <ArrowLeft size={16} /> Back to Project Details
          </Link>
        </div>
        <h1>Review Project Applications</h1>
        <p>Evaluate candidate application submissions for Project #{projectId}.</p>
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

      {/* STATUS FILTER TABS */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
        {['ALL', 'PENDING', 'UNDER_REVIEW', 'SHORTLISTED', 'ACCEPTED', 'REJECTED'].map((st) => (
          <button
            key={st}
            onClick={() => setStatusFilter(st)}
            className={`btn ${statusFilter === st ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
          >
            {st.replace('_', ' ')}
            {st === 'ALL' ? ` (${applications.length})` : ` (${applications.filter(a => (a.status || 'PENDING').toUpperCase() === st).length})`}
          </button>
        ))}
      </div>

      <Card title="Candidate Applications" subtitle="Manage candidate lifecycle status for this requisition">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading applicant submissions...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="empty-state">
            <Clock size={36} />
            <h3>No applications found</h3>
            <p>No applicant submissions match the selected status filter.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Application</th>
                  <th>Candidate Employee</th>
                  <th>Applied On</th>
                  <th>Current Status</th>
                  <th>Review Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredApplications.map((app) => (
                  <tr key={app.id}>
                    <td style={{ fontWeight: 600 }}>App #{app.id}</td>
                    <td>
                      <div>
                        <div style={{ color: 'var(--text-main)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                          <User size={16} style={{ color: 'var(--primary)' }} />
                          <span>{app.employeeName || `Employee #${app.employeeId}`}</span>
                        </div>
                        {(app.employeeDesignation || app.employeeDepartment) && (
                          <div style={{ fontSize: '0.775rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                            {app.employeeDesignation || 'Candidate'} {app.employeeDepartment ? `• ${app.employeeDepartment}` : ''}
                          </div>
                        )}
                        {app.employeeEmail && (
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                            {app.employeeEmail}
                          </div>
                        )}
                        {Array.isArray(app.employeeSkills) && app.employeeSkills.length > 0 && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem', marginTop: '0.35rem' }}>
                            {app.employeeSkills.slice(0, 4).map((sk, idx) => (
                              <span key={idx} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                                {sk}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                    </td>
                    <td>{getStatusBadge(app.status)}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem' }}
                          onClick={() => handleReview(app.id, 'SHORTLISTED')}
                          disabled={reviewingId === app.id || app.status === 'SHORTLISTED'}
                        >
                          Shortlist
                        </button>
                        <button
                          className="btn btn-primary"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', backgroundColor: 'var(--success)' }}
                          onClick={() => handleReview(app.id, 'ACCEPTED')}
                          disabled={reviewingId === app.id || app.status === 'ACCEPTED'}
                        >
                          <CheckCircle2 size={13} /> Accept
                        </button>
                        <button
                          className="btn-danger"
                          style={{ padding: '0.3rem 0.55rem', fontSize: '0.75rem', borderRadius: 'var(--radius-md)' }}
                          onClick={() => handleReview(app.id, 'REJECTED')}
                          disabled={reviewingId === app.id || app.status === 'REJECTED'}
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    </td>
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
