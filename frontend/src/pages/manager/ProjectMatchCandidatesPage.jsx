import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Play, HelpCircle, Trash2, Zap, AlertCircle, CheckCircle, ArrowLeft, UserCheck, CheckCircle2, Star, Mail, Briefcase, Award, Search } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MatchExplanationModal from '../../components/MatchExplanationModal';
import matchingApi from '../../api/matchingApi';
import applicationApi from '../../api/applicationApi';

export default function ProjectMatchCandidatesPage() {
  const { id: projectId } = useParams();

  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [calculating, setCalculating] = useState(false);
  const [actioningId, setActioningId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Explanation Modal State
  const [selectedExplanation, setSelectedExplanation] = useState(null);
  const [loadingExpId, setLoadingExpId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchStoredMatches = async () => {
      try {
        setLoading(true);
        const data = await matchingApi.getProjectMatches(projectId);
        if (isMounted) {
          setMatches(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch stored candidate matches.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchStoredMatches();
    return () => { isMounted = false; };
  }, [projectId, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  const handleRunMatchEngine = async () => {
    setError('');
    setSuccess('');

    try {
      setCalculating(true);
      const calculatedData = await matchingApi.calculateAllProjectMatches(projectId);
      setMatches(Array.isArray(calculatedData) ? calculatedData : []);
      setSuccess(`Candidate match calculation completed for Project #${projectId}!`);
    } catch (err) {
      setError(err.message || 'Failed to execute candidate match engine calculation.');
    } finally {
      setCalculating(false);
    }
  };

  const handleSelectCandidate = async (employeeId, status) => {
    setError('');
    setSuccess('');

    try {
      setActioningId(`${employeeId}-${status}`);
      await applicationApi.selectCandidate(projectId, employeeId, status);
      setSuccess(`Candidate updated to status: ${status}!`);
    } catch (err) {
      setError(err.message || `Failed to set candidate status to ${status}.`);
    } finally {
      setActioningId(null);
    }
  };

  const handleOpenExplanation = async (matchResultId) => {
    setError('');
    try {
      setLoadingExpId(matchResultId);
      const data = await matchingApi.getMatchExplanation(matchResultId);
      setSelectedExplanation(data);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to retrieve match score explanation.');
    } finally {
      setLoadingExpId(null);
    }
  };

  const handleDeleteMatch = async (matchResultId) => {
    if (!window.confirm('Delete this candidate match entry?')) return;
    setError('');
    try {
      await matchingApi.deleteMatch(matchResultId);
      setSuccess('Candidate match record deleted.');
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete candidate match record.');
    }
  };

  const getPercent = (val) => {
    if (val === undefined || val === null) return 0;
    if (val <= 1.0) return Math.round(val * 100);
    return Math.round(val);
  };

  const filteredMatches = matches.filter((item) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    const name = item.employeeName?.toLowerCase() || '';
    const email = item.employeeEmail?.toLowerCase() || '';
    const desig = item.employeeDesignation?.toLowerCase() || '';
    const dept = item.employeeDepartment?.toLowerCase() || '';
    return name.includes(query) || email.includes(query) || desig.includes(query) || dept.includes(query);
  });

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <Link to={`/manager/projects/${projectId}`} style={{ color: 'var(--text-muted)', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.85rem' }}>
              <ArrowLeft size={16} /> Back to Project Details
            </Link>
          </div>
          <h1>Candidate Matching Engine</h1>
          <p>Evaluate employee candidates for Project #{projectId} based on skills, experience, and certifications.</p>
        </div>

        <button
          className="btn btn-primary"
          onClick={handleRunMatchEngine}
          disabled={calculating}
        >
          <Play size={18} />
          <span>{calculating ? 'Calculating Matches...' : 'Run Match Engine'}</span>
        </button>
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

      {/* FILTER SEARCH BAR */}
      {matches.length > 0 && (
        <div style={{ marginBottom: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <Search size={16} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
            <input
              type="text"
              placeholder="Search candidate by name, designation, email, or department..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                width: '100%',
                padding: '0.6rem 1rem 0.6rem 2.4rem',
                backgroundColor: 'var(--bg-surface)',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-md)',
                color: 'var(--text-main)',
                fontSize: '0.85rem'
              }}
            />
          </div>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Showing {filteredMatches.length} of {matches.length} candidates
          </span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading candidate match results...</div>
      ) : filteredMatches.length === 0 ? (
        <Card>
          <div className="empty-state">
            <Zap size={36} />
            <h3>No candidate matches found</h3>
            <p>Click "Run Match Engine" above to calculate candidate suitability scores across all employee profiles.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2">
          {filteredMatches.map((item) => {
            const overallPct = getPercent(item.matchScore);
            const skillsPct = getPercent(item.skillsScore);
            const expPct = getPercent(item.experienceScore);
            const certPct = getPercent(item.certificationScore);

            const displayName = item.employeeName || `Employee #${item.employeeId}`;
            const displayTitle = item.employeeDesignation || 'Software Engineer';
            const displayDept = item.employeeDepartment || 'Engineering';
            const skillsList = Array.isArray(item.employeeSkills) ? item.employeeSkills : [];

            return (
              <Card key={item.id}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {/* Candidate Profile Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <UserCheck size={20} style={{ color: 'var(--primary)' }} />
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-main)' }}>
                          {displayName}
                        </h3>
                      </div>
                      <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <Briefcase size={14} /> {displayTitle} • {displayDept}
                      </p>
                      {item.employeeEmail && (
                        <p style={{ fontSize: '0.775rem', color: 'var(--text-dim)', marginTop: '0.15rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                          <Mail size={12} /> {item.employeeEmail}
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '2.2rem', fontWeight: 800, color: overallPct >= 80 ? 'var(--success)' : overallPct >= 60 ? 'var(--primary)' : 'var(--warning)' }}>
                        {overallPct}%
                      </span>
                      <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Overall Fit</p>
                    </div>
                  </div>

                  {/* Visual Match Bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overallPct}%`, height: '100%', background: overallPct >= 80 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'var(--primary-gradient)', transition: 'width 0.5s ease' }} />
                  </div>

                  {/* Subscore Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <Badge variant="indigo">Skill Match: {skillsPct}%</Badge>
                    <Badge variant="secondary">Experience: {expPct}%</Badge>
                    <Badge variant="secondary">Certs: {certPct}%</Badge>
                    {item.employeeExperience > 0 && (
                      <Badge variant="info">{item.employeeExperience} yrs exp</Badge>
                    )}
                  </div>

                  {/* Employee Skills Tags */}
                  {skillsList.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.2rem' }}>
                      {skillsList.slice(0, 5).map((sk, idx) => (
                        <span key={idx} style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem', borderRadius: '4px', backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border-color)', color: 'var(--text-muted)' }}>
                          {sk}
                        </span>
                      ))}
                      {skillsList.length > 5 && (
                        <span style={{ fontSize: '0.725rem', padding: '0.15rem 0.45rem', color: 'var(--text-dim)' }}>
                          +{skillsList.length - 5} more
                        </span>
                      )}
                    </div>
                  )}

                  {/* MANAGER DIRECT ACTIONS */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      <button
                        className="btn btn-primary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', backgroundColor: 'var(--success)' }}
                        onClick={() => handleSelectCandidate(item.employeeId, 'ACCEPTED')}
                        disabled={actioningId === `${item.employeeId}-ACCEPTED`}
                      >
                        <CheckCircle2 size={14} /> Accept
                      </button>

                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        onClick={() => handleSelectCandidate(item.employeeId, 'SHORTLISTED')}
                        disabled={actioningId === `${item.employeeId}-SHORTLISTED`}
                      >
                        <Star size={14} /> Shortlist
                      </button>
                    </div>

                    <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        onClick={() => handleOpenExplanation(item.id)}
                        disabled={loadingExpId === item.id}
                      >
                        <HelpCircle size={14} />
                        <span>{loadingExpId === item.id ? 'Loading...' : 'Why this score?'}</span>
                      </button>

                      <button
                        className="btn-danger"
                        style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', borderRadius: 'var(--radius-md)' }}
                        onClick={() => handleDeleteMatch(item.id)}
                        title="Remove Match Entry"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Match Explanation Modal */}
      <MatchExplanationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        explanation={selectedExplanation}
      />
    </div>
  );
}
