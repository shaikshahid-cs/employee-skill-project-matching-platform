import { useState, useEffect } from 'react';
import { Briefcase, CheckCircle2, AlertCircle, Award, Calendar, Eye, Inbox, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MatchExplanationModal from '../../components/MatchExplanationModal';
import projectApi from '../../api/projectApi';
import matchingApi from '../../api/matchingApi';

export default function EmployeeProjectsPage() {
  const [assignedProjects, setAssignedProjects] = useState([]);
  const [recommendedMatches, setRecommendedMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Explanation Modal State
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchProjectsData = async () => {
      try {
        setLoading(true);
        const [assignedRes, recommendedRes] = await Promise.allSettled([
          projectApi.getMyAssignedProjects(),
          projectApi.getRecommendedProjects(),
        ]);

        if (isMounted) {
          if (assignedRes.status === 'fulfilled') {
            setAssignedProjects(Array.isArray(assignedRes.value) ? assignedRes.value : []);
          }
          if (recommendedRes.status === 'fulfilled') {
            setRecommendedMatches(Array.isArray(recommendedRes.value) ? recommendedRes.value : []);
          }
        }
      } catch (err) {
        if (isMounted) setError('Failed to load projects data.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProjectsData();
    return () => { isMounted = false; };
  }, []);

  const handleOpenExplanation = (matchResultId) => {
    setSelectedMatchId(matchResultId);
    setIsExplanationOpen(true);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Assigned & Matching Projects</h1>
        <p>Your official project assignments and algorithmic alignment with open organizational requisitions.</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.875rem',
          marginBottom: '1.25rem'
        }}>
          {error}
        </div>
      )}

      {/* SECTION 1: ASSIGNED PROJECTS */}
      <div style={{ marginBottom: '2rem' }}>
        <Card
          title="Assigned Engineering Teams"
          subtitle={`Active project staffing allocations (${assignedProjects.length})`}
        >
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading assignments...</div>
          ) : assignedProjects.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={36} />
              <h3>No active assignments</h3>
              <p>When project managers staff you on an initiative, your assigned role and project details will appear here.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2">
              {assignedProjects.map((a) => (
                <div
                  key={a.id}
                  style={{
                    padding: '1.25rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {a.projectTitle}
                      </h3>
                      <Badge variant="emerald">{a.status || 'ASSIGNED'}</Badge>
                    </div>

                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Assigned Role</span>
                      <p style={{ fontWeight: 600, color: 'var(--primary)', fontSize: '0.95rem' }}>{a.assignedRole || 'Team Member'}</p>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                      <span><strong>Manager:</strong> {a.assignedByManagerName || 'Project Manager'}</span>
                      <span><strong>Date:</strong> {a.assignmentDate ? new Date(a.assignmentDate).toLocaleDateString() : 'Active'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* SECTION 2: MATCHING OPPORTUNITIES */}
      <Card
        title="Matching Project Opportunities"
        subtitle="Ranked by deterministic 6-factor algorithm against your verified skills, experience, and domain"
      >
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Calculating algorithmic matches...</div>
        ) : recommendedMatches.length === 0 ? (
          <div className="empty-state">
            <Inbox size={36} />
            <h3>No matching projects found</h3>
            <p>Complete your skills inventory and experience profile to calculate match scores against open projects.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Project Requisition</th>
                  <th>Match Score</th>
                  <th>Mandatory Criteria</th>
                  <th>Skills Overlap</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recommendedMatches.map((m) => {
                  const score = Math.round(m.matchScore);
                  const isPassed = m.mandatoryPassed !== false;
                  return (
                    <tr key={m.id || m.projectId}>
                      <td style={{ fontWeight: 600 }}>
                        <div style={{ color: 'var(--text-main)', fontSize: '0.95rem' }}>{m.projectTitle}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                          Project #{m.projectId}
                        </div>
                      </td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <span style={{
                            fontSize: '1.05rem',
                            fontWeight: 700,
                            color: score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171'
                          }}>
                            {score}%
                          </span>
                          <div style={{ width: '60px', height: '6px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{
                              width: `${Math.min(100, score)}%`,
                              height: '100%',
                              backgroundColor: score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171'
                            }} />
                          </div>
                        </div>
                      </td>
                      <td>
                        {isPassed ? (
                          <Badge variant="emerald">PASS</Badge>
                        ) : (
                          <Badge variant="rose">MANDATORY FAILED</Badge>
                        )}
                      </td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                        {m.skillsPoints !== undefined ? `${m.skillsPoints} / 35 pts` : `${Math.round((m.skillsScore || 0) * 100)}%`}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                          onClick={() => handleOpenExplanation(m.id)}
                        >
                          <Eye size={14} />
                          <span>Explain Match</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* MATCH EXPLANATION MODAL */}
      <MatchExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        matchResultId={selectedMatchId}
      />
    </div>
  );
}
