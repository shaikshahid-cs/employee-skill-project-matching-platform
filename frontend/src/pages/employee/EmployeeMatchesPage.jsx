import { useState, useEffect } from 'react';
import { Zap, HelpCircle, AlertCircle, Sparkles, CheckCircle2, XCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MatchExplanationModal from '../../components/MatchExplanationModal';
import matchingApi from '../../api/matchingApi';

export default function EmployeeMatchesPage() {
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Explanation Modal State
  const [selectedMatchExplanation, setSelectedMatchExplanation] = useState(null);
  const [loadingExplanationId, setLoadingExplanationId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchMatches = async () => {
      try {
        setLoading(true);
        const data = await matchingApi.getMyMatches();
        if (isMounted) {
          setMatches(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to fetch automated match results.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchMatches();
    return () => { isMounted = false; };
  }, []);

  const handleOpenExplanation = async (matchResultId) => {
    setError('');
    try {
      setLoadingExplanationId(matchResultId);
      const explanationData = await matchingApi.getMatchExplanation(matchResultId);
      setSelectedMatchExplanation(explanationData);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to retrieve match explanation breakdown.');
    } finally {
      setLoadingExplanationId(null);
    }
  };

  const getPercent = (val) => {
    if (val === undefined || val === null) return 0;
    if (val <= 1.0) return Math.round(val * 100);
    return Math.round(val);
  };

  return (
    <div>
      <div className="page-header">
        <h1>Automated Match Results</h1>
        <p>Deterministic 5-factor match score calculation based on your profile skills, experience, and certifications.</p>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading match matrix calculations...</div>
      ) : matches.length === 0 ? (
        <Card>
          <div className="empty-state">
            <Zap size={36} />
            <h3>No match calculations available</h3>
            <p>Complete your skills matrix and profile. Matches are calculated automatically by the Spring Boot engine.</p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-2">
          {matches.map((item) => {
            const overallPct = getPercent(item.matchScore);
            const skillsPct = getPercent(item.skillsScore);
            const expPct = getPercent(item.experienceScore);
            const certPct = getPercent(item.certificationScore);

            return (
              <Card key={item.id}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>
                        {item.projectTitle || `Project #${item.projectId}`}
                      </h3>
                      {item.generatedAt && (
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                          Calculated: {new Date(item.generatedAt).toLocaleString()}
                        </p>
                      )}
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: '2rem', fontWeight: 800, color: overallPct >= 80 ? 'var(--success)' : overallPct >= 60 ? 'var(--primary)' : 'var(--warning)' }}>
                        {overallPct}%
                      </span>
                    </div>
                  </div>

                  {/* Match Bar */}
                  <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ width: `${overallPct}%`, height: '100%', background: overallPct >= 80 ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)' : 'var(--primary-gradient)', transition: 'width 0.5s ease' }} />
                  </div>

                  {/* Subscore Badges */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                    <Badge variant="indigo">Skill Match: {skillsPct}%</Badge>
                    <Badge variant="secondary">Experience Match: {expPct}%</Badge>
                    <Badge variant="secondary">Certifications: {certPct}%</Badge>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid var(--border-color)', paddingTop: '0.85rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.45rem 0.85rem', fontSize: '0.85rem' }}
                      onClick={() => handleOpenExplanation(item.id)}
                      disabled={loadingExplanationId === item.id}
                    >
                      <HelpCircle size={16} />
                      <span>{loadingExplanationId === item.id ? 'Loading Analysis...' : 'Why this candidate score?'}</span>
                    </button>
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
        explanation={selectedMatchExplanation}
      />
    </div>
  );
}
