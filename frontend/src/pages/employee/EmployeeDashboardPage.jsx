import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  User, Award, Clock, Briefcase, ChevronRight, AlertCircle,
  CheckCircle2, ArrowUpRight, FileText, Sparkles, GraduationCap, Eye
} from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import MatchExplanationModal from '../../components/MatchExplanationModal';
import { useAuth } from '../../context/useAuth';
import employeeApi from '../../api/employeeApi';
import employeeSkillApi from '../../api/employeeSkillApi';
import { qualificationApi, experienceApi } from '../../api/qualificationApi';
import projectApi from '../../api/projectApi';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [educations, setEducations] = useState([]);
  const [certifications, setCertifications] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Explain modal state
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profData, skillData, expData, eduData, certData, assignData, recData] = await Promise.allSettled([
          employeeApi.getProfile(),
          employeeSkillApi.getSkills(),
          experienceApi.getExperiences(),
          qualificationApi.getEducations(),
          qualificationApi.getCertifications(),
          projectApi.getMyAssignedProjects(),
          projectApi.getRecommendedProjects(),
        ]);

        if (isMounted) {
          if (profData.status === 'fulfilled') setProfile(profData.value);
          if (skillData.status === 'fulfilled' && Array.isArray(skillData.value)) setSkills(skillData.value);
          if (expData.status === 'fulfilled' && Array.isArray(expData.value)) setExperiences(expData.value);
          if (eduData.status === 'fulfilled' && Array.isArray(eduData.value)) setEducations(eduData.value);
          if (certData.status === 'fulfilled' && Array.isArray(certData.value)) setCertifications(certData.value);
          if (assignData.status === 'fulfilled' && Array.isArray(assignData.value)) setAssignments(assignData.value);
          if (recData.status === 'fulfilled' && Array.isArray(recData.value)) setRecommendations(recData.value);
        }
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || err.message || 'Failed to load dashboard metrics.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Completeness score
  const missingItems = [];
  let completionScore = 0;

  if (profile?.designation && profile?.primaryDomain) completionScore += 25;
  else missingItems.push('Designation & Primary Domain');

  if (skills.length > 0) completionScore += 25;
  else missingItems.push('Technical Skills (Add at least 1 skill)');

  if (experiences.length > 0) completionScore += 25;
  else missingItems.push('Work History (Add past positions)');

  if (educations.length > 0 || certifications.length > 0) completionScore += 25;
  else missingItems.push('Education & Certifications');

  const topMatch = recommendations.length > 0 ? Math.round(recommendations[0].matchScore) : 0;

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span>Welcome back, {profile?.name || user?.name || 'Employee'}</span>
            <Badge variant="indigo">Employee Portal</Badge>
          </h1>
          <p style={{ marginTop: '0.35rem' }}>
            {profile?.designation ? `${profile.designation} • ${profile.department || 'Engineering'}` : 'Manage your career profile and discover matched opportunities.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to="/employee/resume" className="btn btn-secondary">
            <FileText size={16} /> Assistive Resume Import
          </Link>
          <Link to="/employee/projects" className="btn btn-primary">
            <Briefcase size={16} /> My Assigned Projects
          </Link>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.85rem',
          marginBottom: '1.25rem'
        }}>
          {error}
        </div>
      )}

      {/* METRICS ROW */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Verified Skills"
          value={loading ? '...' : skills.length}
          subtitle="Inventory entries"
          icon={Award}
          accent="indigo"
        />
        <StatCard
          title="Total Experience"
          value={loading ? '...' : `${profile?.totalExperienceYears ?? profile?.experience ?? 0} yrs`}
          subtitle="Engineering tenure"
          icon={Clock}
          accent="emerald"
        />
        <StatCard
          title="Assigned Projects"
          value={loading ? '...' : assignments.length}
          subtitle="Active team roles"
          icon={Briefcase}
          accent="cyan"
        />
        <StatCard
          title="Top Match Score"
          value={loading ? '...' : `${topMatch}%`}
          subtitle="Algorithm alignment"
          icon={Sparkles}
          accent="amber"
        />
      </div>

      {/* PROFILE HEALTH & COMPLETENESS */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Card title="Profile Readiness & Completeness" subtitle="Complete your profile to maximize matching precision">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                Readiness Score: {completionScore}%
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                {completionScore === 100 ? 'All profile dimensions established' : `${missingItems.length} items to complete`}
              </span>
            </div>

            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '4px', overflow: 'hidden' }}>
              <div style={{
                width: `${completionScore}%`,
                height: '100%',
                backgroundColor: completionScore === 100 ? '#10b981' : completionScore >= 50 ? '#6366f1' : '#f59e0b',
                transition: 'width 0.4s ease'
              }} />
            </div>

            {missingItems.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Suggested additions:</span>
                {missingItems.map((item, idx) => (
                  <span key={idx} style={{
                    fontSize: '0.75rem',
                    padding: '0.2rem 0.5rem',
                    borderRadius: '6px',
                    background: 'rgba(239, 68, 68, 0.1)',
                    color: '#fca5a5',
                    border: '1px solid rgba(239, 68, 68, 0.2)'
                  }}>
                    + {item}
                  </span>
                ))}
              </div>
            )}
          </div>
        </Card>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* ASSIGNED PROJECTS WIDGET */}
        <Card
          title="Active Assignments"
          subtitle="Staffed initiatives"
          action={
            <Link to="/employee/projects" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
              <span>View All</span>
              <ChevronRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading assignments...</div>
          ) : assignments.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={32} />
              <h3>No active assignments</h3>
              <p>Project managers will assign you to initiatives matching your skills and experience.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {assignments.slice(0, 3).map((a) => (
                <div key={a.id} style={{
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{a.projectTitle}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>Role: {a.assignedRole || 'Team Member'}</p>
                  </div>
                  <Badge variant="emerald">{a.status || 'ACTIVE'}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* TOP MATCHED PROJECTS WIDGET */}
        <Card
          title="Top Algorithmic Matches"
          subtitle="Ranked by compatibility"
          action={
            <Link to="/employee/projects" className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}>
              <span>View All Matches</span>
              <ChevronRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading matches...</div>
          ) : recommendations.length === 0 ? (
            <div className="empty-state">
              <Sparkles size={32} />
              <h3>No match scores yet</h3>
              <p>Add your technical skills and domain experience to compute real-time scores.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {recommendations.slice(0, 3).map((rec) => {
                const score = Math.round(rec.matchScore);
                return (
                  <div key={rec.id || rec.projectId} style={{
                    padding: '0.85rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{rec.projectTitle}</h4>
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                        Skills: {rec.skillsPoints ?? 0}/35 pts &bull; {rec.mandatoryPassed !== false ? 'Mandatory Met' : 'Mandatory Flag'}
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{
                        fontSize: '1rem',
                        fontWeight: 700,
                        color: score >= 75 ? '#34d399' : score >= 50 ? '#fbbf24' : '#f87171'
                      }}>
                        {score}%
                      </span>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.25rem 0.5rem', fontSize: '0.75rem' }}
                        onClick={() => { setSelectedMatchId(rec.id); setIsExplanationOpen(true); }}
                      >
                        <Eye size={12} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>

      <MatchExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        matchResultId={selectedMatchId}
      />
    </div>
  );
}
