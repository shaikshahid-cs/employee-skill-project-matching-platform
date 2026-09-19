import { useState, useEffect } from 'react';
import Modal from './Modal';
import Badge from './ui/Badge';
import {
  CheckCircle2, AlertCircle, UserCheck, Briefcase, Award,
  Clock, ShieldAlert, Sparkles, AlertTriangle
} from 'lucide-react';
import matchingApi from '../api/matchingApi';

export default function MatchExplanationModal({
  isOpen,
  onClose,
  matchResultId,
  projectId,
  employeeId,
  explanation: initialExplanation,
}) {
  const [data, setData] = useState(initialExplanation || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    if (initialExplanation) {
      setData(initialExplanation);
      return;
    }

    const fetchExplanation = async () => {
      try {
        setLoading(true);
        setError('');
        let res = null;

        if (projectId && employeeId) {
          res = await matchingApi.getCandidateExplanation(projectId, employeeId);
        } else if (matchResultId) {
          res = await matchingApi.getMatchExplanation(matchResultId);
        }

        if (res) {
          setData(res);
        }
      } catch (err) {
        setError(err?.response?.data?.message || err.message || 'Failed to retrieve match breakdown.');
      } finally {
        setLoading(false);
      }
    };

    fetchExplanation();
  }, [isOpen, matchResultId, projectId, employeeId, initialExplanation]);

  if (!isOpen) return null;

  const scorePercentage = data ? Math.round(data.overallMatchScore) : 0;
  const isMandatoryPassed = data ? data.mandatoryPassed !== false : true;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Deterministic Match Score Explanation" maxWidth="720px">
      {loading ? (
        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
          Computing granular 6-dimension algorithmic breakdown...
        </div>
      ) : error ? (
        <div style={{
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          color: '#f87171',
          fontSize: '0.875rem'
        }}>
          {error}
        </div>
      ) : data ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', maxHeight: '72vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
          {/* Header Summary */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            backgroundColor: 'var(--bg-surface)',
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)',
            flexWrap: 'wrap',
            gap: '1rem'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                <UserCheck size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.2rem', color: 'var(--text-main)', fontWeight: 700 }}>
                  {data.employeeName || 'Candidate'}
                </h3>
              </div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {data.employeeDesignation} &bull; {data.employeeDepartment || 'Engineering'}
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                <Briefcase size={14} /> Requisition: <strong style={{ color: 'var(--text-main)' }}>{data.projectTitle}</strong>
              </p>
            </div>

            <div style={{ textAlign: 'right' }}>
              <span style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: scorePercentage >= 75 ? '#34d399' : scorePercentage >= 50 ? '#fbbf24' : '#f87171'
              }}>
                {scorePercentage}%
              </span>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Final Match Score</p>
            </div>
          </div>

          {/* Mandatory Enforcement Notice */}
          {!isMandatoryPassed && (
            <div style={{
              backgroundColor: 'rgba(239, 68, 68, 0.12)',
              border: '1px solid rgba(239, 68, 68, 0.4)',
              borderRadius: 'var(--radius-md)',
              padding: '1rem',
              color: '#fca5a5',
              fontSize: '0.875rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                <AlertTriangle size={18} style={{ color: '#ef4444' }} />
                <span>Mandatory Requirement Failure — Score Capped at 40.0%</span>
              </div>
              <ul style={{ margin: 0, paddingLeft: '1.25rem', lineHeight: '1.5' }}>
                {data.failedMandatoryReasons?.map((reason, idx) => (
                  <li key={idx}>{reason}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 6 Category Points Breakdown */}
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              6-Dimension Point Allocation (100 Points Total)
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem', textAlign: 'center' }}>
              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Skills (35)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.skillsPoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>

              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Exp (20)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.experiencePoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>

              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Role (15)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.rolePoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>

              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Edu (12)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.educationPoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>

              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Certs (10)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.certificationPoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>

              <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Domain (8)</p>
                <p style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>
                  {data.domainPoints?.toFixed(1) ?? '0.0'}
                </p>
              </div>
            </div>
          </div>

          {/* Strengths and Gaps */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: '#34d399' }}>
                <CheckCircle2 size={16} />
                <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Key Strengths</h5>
              </div>
              {data.strengths && data.strengths.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {data.strengths.map((s, idx) => (
                    <li key={idx}>{s}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Standard baseline match.</p>
              )}
            </div>

            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.5rem', color: '#f59e0b' }}>
                <AlertCircle size={16} />
                <h5 style={{ fontSize: '0.85rem', fontWeight: 600 }}>Identified Gaps</h5>
              </div>
              {data.missingOrGaps && data.missingOrGaps.length > 0 ? (
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.825rem', color: 'var(--text-main)', lineHeight: '1.5' }}>
                  {data.missingOrGaps.map((g, idx) => (
                    <li key={idx}>{g}</li>
                  ))}
                </ul>
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No notable qualification gaps.</p>
              )}
            </div>
          </div>

          {/* Skills Breakdown */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div>
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.4rem' }}>
                Matched Technical Skills ({data.matchedSkills?.length || 0})
              </h5>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {data.matchedSkills && data.matchedSkills.length > 0 ? (
                  data.matchedSkills.map((s, idx) => (
                    <Badge key={idx} variant="emerald">{s}</Badge>
                  ))
                ) : (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No overlapping skills found with requisition.</p>
                )}
              </div>
            </div>

            {data.missingSkills && data.missingSkills.length > 0 && (
              <div>
                <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600, marginBottom: '0.4rem' }}>
                  Missing Requisition Skills ({data.missingSkills.length})
                </h5>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                  {data.missingSkills.map((s, idx) => (
                    <Badge key={idx} variant="rose">{s}</Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button className="btn btn-secondary" onClick={onClose}>
              Close Explanation
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
