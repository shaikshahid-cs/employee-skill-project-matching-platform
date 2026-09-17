import Modal from './Modal';
import Badge from './ui/Badge';
import { CheckCircle2, AlertCircle, UserCheck, Briefcase } from 'lucide-react';

export default function MatchExplanationModal({ isOpen, onClose, explanation }) {
  if (!explanation) return null;

  const {
    projectTitle,
    employeeName,
    employeeEmail,
    employeeDesignation,
    employeeDepartment,
    overallMatchScore,
    skillsPoints,
    experiencePoints,
    certificationPoints,
    availabilityPoints,
    preferencePoints,
    matchedSkills = [],
    missingSkills = [],
    generatedAt,
  } = explanation;

  const scorePercentage = overallMatchScore <= 1.0 ? Math.round(overallMatchScore * 100) : Math.round(overallMatchScore);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Candidate Match Score Breakdown" maxWidth="660px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* Header Summary */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--bg-surface)', padding: '1.1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
              <UserCheck size={16} style={{ color: 'var(--primary)' }} />
              <h4 style={{ fontSize: '1.15rem', color: 'var(--text-main)', fontWeight: 700 }}>
                {employeeName || 'Candidate Employee'}
              </h4>
            </div>
            {(employeeDesignation || employeeDepartment) && (
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                {employeeDesignation || 'Candidate'} {employeeDepartment ? `• ${employeeDepartment}` : ''}
              </p>
            )}
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Briefcase size={13} /> Project: <strong style={{ color: 'var(--text-main)' }}>{projectTitle || 'Project Requisition'}</strong>
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>{scorePercentage}%</span>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Overall Match Score</p>
          </div>
        </div>

        {/* 5 Component Points Category Breakdown */}
        <div>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.75rem' }}>Score Weight Distribution (100 Points Total)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', textAlign: 'center' }}>
            <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Skills (Max 50)</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>{skillsPoints?.toFixed(1) ?? '0.0'}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Exp (Max 30)</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>{experiencePoints?.toFixed(1) ?? '0.0'}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Certs (Max 10)</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>{certificationPoints?.toFixed(1) ?? '0.0'}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Avail (Max 5)</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>{availabilityPoints?.toFixed(1) ?? '0.0'}</p>
            </div>
            <div style={{ padding: '0.65rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Pref (Max 5)</p>
              <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-main)', marginTop: '0.2rem' }}>{preferencePoints?.toFixed(1) ?? '0.0'}</p>
            </div>
          </div>
        </div>

        {/* Detailed Skills Comparison List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Matched Skills ({matchedSkills.length})</h5>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {matchedSkills.length > 0 ? (
                matchedSkills.map((skill, idx) => (
                  <Badge key={idx} variant="success">{skill}</Badge>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No overlapping skills found with project requirements.</p>
              )}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} style={{ color: 'var(--warning)' }} />
              <h5 style={{ fontSize: '0.85rem', color: 'var(--text-main)', fontWeight: 600 }}>Missing Required Skills ({missingSkills.length})</h5>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {missingSkills.length > 0 ? (
                missingSkills.map((skill, idx) => (
                  <Badge key={idx} variant="warning">{skill}</Badge>
                ))
              ) : (
                <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>No missing required skills!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
