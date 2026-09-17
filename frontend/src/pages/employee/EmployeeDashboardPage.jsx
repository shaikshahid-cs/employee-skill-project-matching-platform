import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { User, Award, Clock, Briefcase, ChevronRight, AlertCircle, Sparkles, CheckCircle2, ArrowUpRight, FileText, FolderGit2 } from 'lucide-react';
import StatCard from '../../components/ui/StatCard';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import { useAuth } from '../../context/useAuth';
import employeeApi from '../../api/employeeApi';
import employeeSkillApi from '../../api/employeeSkillApi';
import applicationApi from '../../api/applicationApi';
import projectApi from '../../api/projectApi';
import resumeApi from '../../api/resumeApi';

export default function EmployeeDashboardPage() {
  const { user } = useAuth();

  const [profile, setProfile] = useState(null);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [recommendations, setRecommendations] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [profData, skillData, projData, resData, appData, recData] = await Promise.allSettled([
          employeeApi.getProfile(),
          employeeSkillApi.getSkills(),
          Promise.resolve([]),
          resumeApi.getResumes(),
          applicationApi.getMyApplications(),
          projectApi.getRecommendedProjects(),
        ]);

        if (isMounted) {
          if (profData.status === 'fulfilled') setProfile(profData.value);
          if (skillData.status === 'fulfilled' && Array.isArray(skillData.value)) setSkills(skillData.value);
          if (projData.status === 'fulfilled' && Array.isArray(projData.value)) setProjects(projData.value);
          if (resData.status === 'fulfilled' && Array.isArray(resData.value)) setResumes(resData.value);
          if (appData.status === 'fulfilled' && Array.isArray(appData.value)) setApplications(appData.value);
          if (recData.status === 'fulfilled' && Array.isArray(recData.value)) setRecommendations(recData.value);
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load dashboard metrics.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchDashboardData();
    return () => { isMounted = false; };
  }, []);

  // Calculate profile completeness
  const missingItems = [];
  let completionScore = 0;

  if (profile?.department && profile?.designation) completionScore += 30;
  else missingItems.push('Basic Profile Info (Department & Designation)');

  if (skills.length > 0) completionScore += 25;
  else missingItems.push('Skills Matrix (Add at least 1 skill)');

  if (projects.length > 0) completionScore += 25;
  else missingItems.push('Project Experience (Add at least 1 project)');

  if (resumes.length > 0) completionScore += 20;
  else missingItems.push('Resume Document (Upload & parse resume)');

  const getMatchPercent = (val) => {
    if (val === undefined || val === null) return 0;
    if (val <= 1.0) return Math.round(val * 100);
    return Math.round(val);
  };

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

        <Link to="/employee/projects" className="btn btn-primary">
          <Briefcase size={16} /> Explore Open Opportunities
        </Link>
      </div>

      {error && (
        <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* PROFILE COMPLETENESS BANNER */}
      {!loading && completionScore < 100 && (
        <div className="glass-card" style={{ marginBottom: '1.5rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(15, 23, 42, 0.8) 100%)', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
            <div style={{ flex: 1, minWidth: '280px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <Sparkles size={18} style={{ color: 'var(--primary)' }} />
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Profile Completeness: {completionScore}%</h3>
              </div>
              
              {/* Progress Bar */}
              <div style={{ width: '100%', height: '8px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', marginBottom: '0.75rem' }}>
                <div style={{ width: `${completionScore}%`, height: '100%', background: 'var(--primary-gradient)', transition: 'width 0.5s ease' }} />
              </div>

              {missingItems.length > 0 && (
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                  <strong style={{ color: 'var(--text-main)' }}>Action Recommended:</strong> Complete {missingItems.join(', ')} to maximize your candidate match score!
                </p>
              )}
            </div>

            <Link to="/employee/profile" className="btn btn-secondary" style={{ whiteSpace: 'nowrap' }}>
              Complete Profile <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      )}

      {/* STAT CARDS GRID */}
      <div className="grid grid-cols-4" style={{ marginBottom: '1.5rem' }}>
        <StatCard
          title="Recorded Skills"
          value={loading ? '...' : skills.length}
          subtitle="Skills in active matrix"
          icon={Award}
        />
        <StatCard
          title="Projects Recorded"
          value={loading ? '...' : projects.length}
          subtitle="Portfolio projects"
          icon={FolderGit2}
        />
        <StatCard
          title="Active Applications"
          value={loading ? '...' : applications.length}
          subtitle="Submitted requisitions"
          icon={Clock}
        />
        <StatCard
          title="Matched Opportunities"
          value={loading ? '...' : recommendations.length}
          subtitle="Recommended jobs"
          icon={Briefcase}
        />
      </div>

      {/* MAIN TWO COLUMN GRID */}
      <div className="grid grid-cols-2">
        {/* RECOMMENDED OPPORTUNITIES FEED */}
        <Card
          title="Top Recommended Opportunities"
          subtitle="Highest matching job requisitions based on your skill matrix"
          action={
            <Link to="/employee/projects" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', textDecoration: 'none' }}>
              Explore All <ChevronRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading recommendations...</div>
          ) : recommendations.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={36} />
              <h3>No recommendations yet</h3>
              <p>Add skills and project experience to get automated opportunity matches.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {recommendations.slice(0, 4).map((rec) => {
                const matchPct = getMatchPercent(rec.matchScore);
                return (
                  <div key={rec.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', transition: 'border-color 0.2s ease' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                        <h4 style={{ fontSize: '0.975rem', fontWeight: 600, color: 'var(--text-main)' }}>
                          {rec.projectTitle || `Opportunity #${rec.projectId}`}
                        </h4>
                      </div>
                      <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Calculated Match: <strong style={{ color: matchPct >= 80 ? 'var(--success)' : 'var(--primary)' }}>{matchPct}%</strong>
                      </p>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Badge variant={matchPct >= 80 ? 'success' : matchPct >= 60 ? 'indigo' : 'amber'}>
                        {matchPct}% Match
                      </Badge>
                      <Link to="/employee/projects" className="btn btn-secondary" style={{ padding: '0.4rem 0.65rem', fontSize: '0.775rem' }}>
                        View Details <ArrowUpRight size={14} />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>

        {/* RECENT APPLICATIONS TABLE */}
        <Card
          title="My Recent Applications"
          subtitle="Status tracker for your recent opportunity submissions"
          action={
            <Link to="/employee/applications" className="btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem', textDecoration: 'none' }}>
              View All <ChevronRight size={14} />
            </Link>
          }
        >
          {loading ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading applications...</div>
          ) : applications.length === 0 ? (
            <div className="empty-state">
              <Clock size={36} />
              <h3>No applications submitted</h3>
              <p>Explore recommended projects and submit applications to track progress here.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Opportunity</th>
                    <th>Applied Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.slice(0, 4).map((app) => (
                    <tr key={app.id}>
                      <td style={{ fontWeight: 600 }}>
                        {app.projectTitle ? app.projectTitle : `Opportunity #${app.projectId}`}
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                        {app.appliedAt ? new Date(app.appliedAt).toLocaleDateString() : 'Recent'}
                      </td>
                      <td>
                        <Badge variant={
                          app.status === 'ACCEPTED' ? 'success' :
                          app.status === 'REJECTED' ? 'danger' :
                          app.status === 'SHORTLISTED' ? 'indigo' :
                          app.status === 'UNDER_REVIEW' ? 'info' : 'amber'
                        }>
                          {app.status ? app.status.replace('_', ' ') : 'PENDING'}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
