import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Briefcase, Building, MapPin, Plus, Trash2, Cpu, Users,
  AlertCircle, CheckCircle2, Award, Eye, UserPlus, Filter,
  ShieldCheck, UploadCloud, ArrowLeft
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import SkillAutocomplete from '../../components/SkillAutocomplete';
import MatchExplanationModal from '../../components/MatchExplanationModal';
import projectApi from '../../api/projectApi';
import projectSkillApi from '../../api/projectSkillApi';
import matchingApi from '../../api/matchingApi';
import documentApi from '../../api/documentApi';

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [skills, setSkills] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [candidates, setCandidates] = useState([]);

  const [loading, setLoading] = useState(true);
  const [loadingCandidates, setLoadingCandidates] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Active Tab: 'candidates' | 'team' | 'specs'
  const [activeTab, setActiveTab] = useState('candidates');

  // Candidate Filters
  const [candidateSearch, setCandidateSearch] = useState('');
  const [mandatoryOnly, setMandatoryOnly] = useState(false);
  const [minScore, setMinScore] = useState(0);

  // Skill Add Modal
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [newSkillName, setNewSkillName] = useState('');
  const [newProf, setNewProf] = useState(3);
  const [newImp, setNewImp] = useState(3);
  const [newMandatory, setNewMandatory] = useState(false);
  const [submittingSkill, setSubmittingSkill] = useState(false);

  // Assign Candidate Modal
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [candidateToAssign, setCandidateToAssign] = useState(null);
  const [assignedRole, setAssignedRole] = useState('');
  const [submittingAssign, setSubmittingAssign] = useState(false);

  // Explain Match Modal
  const [selectedMatchId, setSelectedMatchId] = useState(null);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);
  const [isExplanationOpen, setIsExplanationOpen] = useState(false);

  // Assistive JD Modal
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [jdFile, setJdFile] = useState(null);
  const [extractingJd, setExtractingJd] = useState(false);
  const [jdPreview, setJdPreview] = useState(null);

  const fetchProjectData = async () => {
    try {
      setLoading(true);
      const [projData, skillsData, assignData] = await Promise.allSettled([
        projectApi.getProjectById(projectId),
        projectSkillApi.getSkillsForProject(projectId),
        projectApi.getProjectAssignments(projectId),
      ]);

      if (projData.status === 'fulfilled') setProject(projData.value);
      if (skillsData.status === 'fulfilled') setSkills(Array.isArray(skillsData.value) ? skillsData.value : []);
      if (assignData.status === 'fulfilled') setAssignments(Array.isArray(assignData.value) ? assignData.value : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load project details.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCandidates = async () => {
    try {
      setLoadingCandidates(true);
      const data = await matchingApi.getCandidatesForProject(projectId);
      setCandidates(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to calculate candidate matches.');
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    fetchProjectData();
    fetchCandidates();
  }, [projectId]);

  // Skill Management
  const handleAddSkill = async (e) => {
    e.preventDefault();
    if (!newSkillName.trim()) return;

    try {
      setSubmittingSkill(true);
      await projectSkillApi.addSkillToProject(projectId, {
        skillName: newSkillName.trim(),
        requiredProficiency: parseInt(newProf, 10),
        importance: parseInt(newImp, 10),
        mandatory: Boolean(newMandatory),
      });

      setSuccess(`Skill "${newSkillName}" added to project requirements.`);
      setIsSkillModalOpen(false);
      setNewSkillName('');
      fetchProjectData();
      fetchCandidates(); // Re-run matching
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to add skill.');
    } finally {
      setSubmittingSkill(false);
    }
  };

  const handleDeleteSkill = async (skillId, name) => {
    if (!window.confirm(`Remove required skill "${name}"?`)) return;
    try {
      await projectSkillApi.deleteSkillFromProject(projectId, skillId);
      setSuccess(`Skill "${name}" removed.`);
      fetchProjectData();
      fetchCandidates();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to remove skill.');
    }
  };

  // Staffing Actions
  const handleOpenAssignModal = (candidate) => {
    setCandidateToAssign(candidate);
    setAssignedRole(project?.requiredRole || candidate.employeeDesignation || 'Engineer');
    setIsAssignModalOpen(true);
  };

  const handleConfirmAssign = async (e) => {
    e.preventDefault();
    if (!candidateToAssign) return;

    try {
      setSubmittingAssign(true);
      await projectApi.assignEmployee(projectId, candidateToAssign.employeeId, assignedRole);
      setSuccess(`Employee ${candidateToAssign.employeeName} assigned to project as "${assignedRole}"!`);
      setIsAssignModalOpen(false);
      setCandidateToAssign(null);
      fetchProjectData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to assign candidate.');
    } finally {
      setSubmittingAssign(false);
    }
  };

  const handleUnassign = async (employeeId, employeeName) => {
    if (!window.confirm(`Unassign ${employeeName} from this project?`)) return;
    try {
      await projectApi.unassignEmployee(projectId, employeeId);
      setSuccess(`${employeeName} unassigned successfully.`);
      fetchProjectData();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to unassign member.');
    }
  };

  // Assistive JD extraction
  const handleExtractJd = async () => {
    if (!jdFile) return;
    try {
      setExtractingJd(true);
      setError('');
      const preview = await documentApi.extractJobDescription(jdFile);
      setJdPreview(preview);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to extract JD.');
    } finally {
      setExtractingJd(false);
    }
  };

  const handleApplyJdToProject = async () => {
    if (!jdPreview) return;
    try {
      setExtractingJd(true);
      await documentApi.applyJobDescription(projectId, jdPreview);
      setSuccess('Job description requirements applied to project!');
      setIsJdModalOpen(false);
      setJdPreview(null);
      setJdFile(null);
      fetchProjectData();
      fetchCandidates();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to apply JD to project.');
    } finally {
      setExtractingJd(false);
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const query = candidateSearch.toLowerCase();
    const matchesSearch =
      (c.employeeName && c.employeeName.toLowerCase().includes(query)) ||
      (c.employeeEmail && c.employeeEmail.toLowerCase().includes(query)) ||
      (c.employeeDesignation && c.employeeDesignation.toLowerCase().includes(query)) ||
      (c.employeeSkills && c.employeeSkills.some((s) => s.toLowerCase().includes(query)));

    const matchesMandatory = !mandatoryOnly || c.mandatoryPassed !== false;
    const matchesMinScore = c.matchScore >= minScore;

    return matchesSearch && matchesMandatory && matchesMinScore;
  });

  return (
    <div>
      {/* Back button & Page header */}
      <div style={{ marginBottom: '1.25rem' }}>
        <Link to="/manager/projects" className="btn btn-secondary" style={{ display: 'inline-flex', padding: '0.35rem 0.75rem', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
          <ArrowLeft size={14} />
          <span>Back to Projects</span>
        </Link>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span>{project?.title || 'Project Details'}</span>
              <Badge variant={project?.status === 'OPEN' ? 'emerald' : 'slate'}>{project?.status || 'OPEN'}</Badge>
            </h1>
            <p style={{ marginTop: '0.35rem' }}>
              Role: <strong>{project?.requiredRole}</strong> &bull; Domain: <strong>{project?.requiredDomain}</strong> &bull; Work Mode: <strong>{project?.workMode || 'Remote'}</strong>
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              className="btn btn-secondary"
              onClick={() => { setIsJdModalOpen(true); setJdPreview(null); }}
            >
              <Cpu size={16} />
              <span>Update via JD Document</span>
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.875rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* TABS HEADER */}
      <div style={{
        display: 'flex',
        gap: '0.5rem',
        borderBottom: '1px solid var(--border-color)',
        marginBottom: '1.5rem'
      }}>
        <button
          className="btn"
          style={{
            background: activeTab === 'candidates' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'candidates' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'candidates' ? '2px solid var(--primary)' : 'none',
            borderRadius: '6px 6px 0 0'
          }}
          onClick={() => setActiveTab('candidates')}
        >
          Candidate Match Matrix ({candidates.length})
        </button>

        <button
          className="btn"
          style={{
            background: activeTab === 'team' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'team' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'team' ? '2px solid var(--primary)' : 'none',
            borderRadius: '6px 6px 0 0'
          }}
          onClick={() => setActiveTab('team')}
        >
          Staffed Team ({assignments.length})
        </button>

        <button
          className="btn"
          style={{
            background: activeTab === 'specs' ? 'var(--primary)' : 'transparent',
            color: activeTab === 'specs' ? '#fff' : 'var(--text-muted)',
            borderBottom: activeTab === 'specs' ? '2px solid var(--primary)' : 'none',
            borderRadius: '6px 6px 0 0'
          }}
          onClick={() => setActiveTab('specs')}
        >
          Project Requisition Specs
        </button>
      </div>

      {/* TAB 1: CANDIDATE MATCH MATRIX */}
      {activeTab === 'candidates' && (
        <div>
          {/* Filters Bar */}
          <div style={{
            display: 'flex',
            gap: '1rem',
            alignItems: 'center',
            marginBottom: '1.25rem',
            flexWrap: 'wrap',
            padding: '1rem',
            background: 'var(--bg-surface)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-color)'
          }}>
            <div style={{ flex: 2, minWidth: '220px' }}>
              <input
                type="text"
                className="form-input"
                placeholder="Search candidates by name, designation, skill..."
                value={candidateSearch}
                onChange={(e) => setCandidateSearch(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <input
                type="checkbox"
                id="filter-mandatory"
                checked={mandatoryOnly}
                onChange={(e) => setMandatoryOnly(e.target.checked)}
              />
              <label htmlFor="filter-mandatory" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                Only Mandatory Passed
              </label>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Min Score:</span>
              <select
                className="form-input"
                style={{ width: 'auto' }}
                value={minScore}
                onChange={(e) => setMinScore(parseInt(e.target.value, 10))}
              >
                <option value="0">All Scores (0%+)</option>
                <option value="40">40%+</option>
                <option value="60">60%+</option>
                <option value="75">75%+</option>
                <option value="85">85%+</option>
              </select>
            </div>
          </div>

          <Card title="Ranked Candidate Matches" subtitle="Deterministic 6-dimension algorithmic match results">
            {loadingCandidates ? (
              <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-dim)' }}>
                Running deterministic scoring algorithm across employee database...
              </div>
            ) : filteredCandidates.length === 0 ? (
              <div className="empty-state">
                <Users size={36} />
                <h3>No candidates matched</h3>
                <p>Try adjusting filter criteria or verify employee skills in the platform.</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Candidate</th>
                      <th>Designation & Exp</th>
                      <th>Match Score</th>
                      <th>Mandatory Status</th>
                      <th>Skills Overlap</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCandidates.map((c) => {
                      const score = Math.round(c.matchScore);
                      const isPassed = c.mandatoryPassed !== false;
                      const isAlreadyAssigned = assignments.some(a => a.employeeId === c.employeeId);

                      return (
                        <tr key={c.id || c.employeeId}>
                          <td style={{ fontWeight: 600 }}>
                            <div style={{ color: 'var(--text-main)' }}>{c.employeeName}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{c.employeeEmail}</div>
                          </td>
                          <td>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-main)' }}>
                              {c.employeeDesignation || 'Engineer'}
                            </div>
                            <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                              {c.employeeExperience} yrs experience
                            </div>
                          </td>
                          <td>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{
                                fontSize: '1.1rem',
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
                          <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            {c.skillsPoints !== undefined ? `${c.skillsPoints} / 35 pts` : `${Math.round((c.skillsScore || 0) * 100)}%`}
                          </td>
                          <td>
                            <div style={{ display: 'flex', gap: '0.4rem' }}>
                              <button
                                className="btn btn-secondary"
                                style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                onClick={() => {
                                  setSelectedMatchId(c.id);
                                  setSelectedCandidateId(c.employeeId);
                                  setIsExplanationOpen(true);
                                }}
                              >
                                <Eye size={13} />
                                <span>Explain</span>
                              </button>

                              {isAlreadyAssigned ? (
                                <Badge variant="emerald">Already Staffed</Badge>
                              ) : (
                                <button
                                  className="btn btn-primary"
                                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.8rem' }}
                                  onClick={() => handleOpenAssignModal(c)}
                                >
                                  <UserPlus size={13} />
                                  <span>Assign</span>
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* TAB 2: STAFFED TEAM */}
      {activeTab === 'team' && (
        <Card title="Project Staffing & Team" subtitle={`${assignments.length} team members assigned to project`}>
          {assignments.length === 0 ? (
            <div className="empty-state">
              <Users size={36} />
              <h3>No team members staffed yet</h3>
              <p>Go to the "Candidate Match Matrix" tab to evaluate candidates and directly assign them to this project.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Member Name</th>
                    <th>Email</th>
                    <th>Assigned Role</th>
                    <th>Date Staffed</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {assignments.map((a) => (
                    <tr key={a.id}>
                      <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{a.employeeName}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{a.employeeEmail}</td>
                      <td>
                        <Badge variant="indigo">{a.assignedRole || 'Engineer'}</Badge>
                      </td>
                      <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                        {a.assignmentDate ? new Date(a.assignmentDate).toLocaleDateString() : 'Active'}
                      </td>
                      <td>
                        <button
                          className="btn btn-secondary"
                          style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#f87171' }}
                          onClick={() => handleUnassign(a.employeeId, a.employeeName)}
                        >
                          Unassign
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      )}

      {/* TAB 3: PROJECT REQUISITION SPECS */}
      {activeTab === 'specs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <Card title="Scope & Architecture" subtitle="Project description">
            <p style={{ lineHeight: '1.6', color: 'var(--text-main)', whiteSpace: 'pre-wrap' }}>
              {project?.description}
            </p>
          </Card>

          <Card title="Mandatory vs. Preferred Requisition Criteria" subtitle="Configured evaluation criteria">
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Required Role</span>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{project?.requiredRole}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {project?.isRoleMandatory ? <Badge variant="rose">🔒 Mandatory</Badge> : <Badge variant="slate">Preferred</Badge>}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Required Domain</span>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{project?.requiredDomain}</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {project?.isDomainMandatory ? <Badge variant="rose">🔒 Mandatory</Badge> : <Badge variant="slate">Preferred</Badge>}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Min Experience</span>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{project?.minExperienceYears} Years</p>
                <div style={{ marginTop: '0.5rem' }}>
                  {project?.isExperienceMandatory ? <Badge variant="rose">🔒 Mandatory</Badge> : <Badge variant="slate">Preferred</Badge>}
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Degree Level</span>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>
                  {project?.requiredDegreeLevel || 'Bachelor'} in {project?.requiredDegreeField || 'CS'}
                </p>
                <div style={{ marginTop: '0.5rem' }}>
                  {project?.isEducationMandatory ? <Badge variant="rose">🔒 Mandatory</Badge> : <Badge variant="slate">Preferred</Badge>}
                </div>
              </div>

              {project?.requiredCertification && (
                <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Required Certification</span>
                  <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>{project?.requiredCertification}</p>
                  <div style={{ marginTop: '0.5rem' }}>
                    {project?.isCertificationMandatory ? <Badge variant="rose">🔒 Mandatory</Badge> : <Badge variant="slate">Preferred</Badge>}
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Required Skills Table */}
          <Card
            title="Required Skills Inventory"
            subtitle={`${skills.length} project technical skills`}
            action={
              <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => setIsSkillModalOpen(true)}>
                <Plus size={14} />
                <span>Add Skill</span>
              </button>
            }
          >
            {skills.length === 0 ? (
              <p style={{ color: 'var(--text-dim)', fontSize: '0.875rem' }}>No skills currently assigned to requisition.</p>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>Skill</th>
                      <th>Min Proficiency</th>
                      <th>Importance Weight</th>
                      <th>Requirement Type</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {skills.map((s) => (
                      <tr key={s.id}>
                        <td style={{ fontWeight: 600 }}>{s.skillName}</td>
                        <td>Level {s.requiredProficiency || s.minProficiency} / 5</td>
                        <td>Weight: {s.importance} / 5</td>
                        <td>
                          {s.mandatory || s.isMandatory ? (
                            <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.8rem' }}>🔒 Mandatory</span>
                          ) : (
                            <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Preferred</span>
                          )}
                        </td>
                        <td>
                          <button
                            className="btn btn-secondary"
                            style={{ padding: '0.25rem 0.45rem', color: '#f87171' }}
                            onClick={() => handleDeleteSkill(s.skillId || s.id, s.skillName)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </Card>
        </div>
      )}

      {/* ASSIGN CANDIDATE MODAL */}
      <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Staff Candidate to Project">
        {candidateToAssign && (
          <form onSubmit={handleConfirmAssign} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
              Directly assigning <strong>{candidateToAssign.employeeName}</strong> ({candidateToAssign.employeeEmail}) to project <em>{project?.title}</em>.
            </p>

            <div>
              <label className="form-label">Project Role Assignment *</label>
              <input
                type="text"
                className="form-input"
                required
                value={assignedRole}
                onChange={(e) => setAssignedRole(e.target.value)}
                placeholder="e.g. Lead Backend Engineer"
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsAssignModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={submittingAssign}>
                {submittingAssign ? 'Assigning...' : 'Confirm Assignment'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ADD SKILL MODAL */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title="Add Skill to Project Requisition">
        <form onSubmit={handleAddSkill} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Skill Name *</label>
            <SkillAutocomplete
              value={newSkillName}
              onChange={(val) => setNewSkillName(val)}
              onSelectSkill={(skill) => setNewSkillName(skill.name)}
              placeholder="e.g. Docker, PostgreSQL, Go..."
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Min Proficiency (1 to 5)</label>
              <select className="form-input" value={newProf} onChange={(e) => setNewProf(e.target.value)}>
                <option value="1">1 - Novice</option>
                <option value="2">2 - Elementary</option>
                <option value="3">3 - Competent</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>

            <div>
              <label className="form-label">Importance (1 to 5)</label>
              <select className="form-input" value={newImp} onChange={(e) => setNewImp(e.target.value)}>
                <option value="1">1 - Low</option>
                <option value="2">2 - Moderate</option>
                <option value="3">3 - Standard</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Critical</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
            <input
              type="checkbox"
              id="skill-mandatory"
              checked={newMandatory}
              onChange={(e) => setNewMandatory(e.target.checked)}
            />
            <label htmlFor="skill-mandatory" style={{ fontSize: '0.85rem', color: 'var(--text-main)', cursor: 'pointer' }}>
              Mandatory Skill (Candidate must meet minimum proficiency or score caps at 40%)
            </label>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSkillModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submittingSkill}>
              {submittingSkill ? 'Adding...' : 'Add Requirement'}
            </button>
          </div>
        </form>
      </Modal>

      {/* ASSISTIVE JD EXTRACTION MODAL */}
      <Modal isOpen={isJdModalOpen} onClose={() => setIsJdModalOpen(false)} title="Update Project from Job Description Document">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{
            border: '2px dashed var(--border-color)',
            padding: '1.5rem',
            borderRadius: 'var(--radius-md)',
            textAlign: 'center',
            background: 'var(--bg-surface)'
          }}>
            <UploadCloud size={36} style={{ color: 'var(--primary)', margin: '0 auto 0.5rem' }} />
            <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', fontWeight: 500, marginBottom: '0.25rem' }}>
              Upload New Job Description Document
            </p>
            <input
              type="file"
              id="update-jd-file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            <label htmlFor="update-jd-file" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              Browse File...
            </label>
            {jdFile && (
              <div style={{ marginTop: '0.75rem', fontSize: '0.85rem', color: 'var(--primary)', fontWeight: 600 }}>
                {jdFile.name}
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="button"
              className="btn btn-primary"
              disabled={!jdFile || extractingJd}
              onClick={handleExtractJd}
            >
              {extractingJd ? 'Extracting...' : 'Extract & Preview'}
            </button>
          </div>

          {jdPreview && (
            <div style={{
              background: 'var(--bg-surface)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              maxHeight: '260px',
              overflowY: 'auto'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Extracted Proposal
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Role:</strong> {jdPreview.requiredRole}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Domain:</strong> {jdPreview.requiredDomain}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Min Experience:</strong> {jdPreview.minExperienceYears} yrs</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Skills:</strong> {jdPreview.skills?.map(s => s.skillName).join(', ')}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-primary" onClick={handleApplyJdToProject}>
                  Update Project Requirements
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* EXPLAIN MATCH MODAL */}
      <MatchExplanationModal
        isOpen={isExplanationOpen}
        onClose={() => setIsExplanationOpen(false)}
        matchResultId={selectedMatchId}
        projectId={projectId}
        employeeId={selectedCandidateId}
      />
    </div>
  );
}
