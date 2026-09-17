import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Briefcase,
  Building,
  MapPin,
  Plus,
  Edit3,
  UploadCloud,
  FileText,
  Cpu,
  Users,
  CheckSquare,
  AlertCircle,
  CheckCircle,
  Award
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import SkillAutocomplete from '../../components/SkillAutocomplete';
import projectApi from '../../api/projectApi';
import projectSkillApi from '../../api/projectSkillApi';
import jobDescriptionApi from '../../api/jobDescriptionApi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt'];

export default function ProjectDetailsPage() {
  const { id: projectId } = useParams();

  const [project, setProject] = useState(null);
  const [projectSkills, setProjectSkills] = useState([]);
  const [jobDescription, setJobDescription] = useState(null);

  const [loadingProject, setLoadingProject] = useState(true);
  const [loadingSkills, setLoadingSkills] = useState(true);
  const [loadingJD, setLoadingJD] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Skill Modal State
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingSkillId, setEditingSkillId] = useState(null);
  const [skillName, setSkillName] = useState('');
  const [requiredProficiency, setRequiredProficiency] = useState(3);
  const [importance, setImportance] = useState(3);
  const [submittingSkill, setSubmittingSkill] = useState(false);

  // JD Upload State
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadingJD, setUploadingJD] = useState(false);
  const [processingJD, setProcessingJD] = useState(false);
  const [extractedSkills, setExtractedSkills] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      // 1. Fetch Manager Projects to locate this project
      try {
        setLoadingProject(true);
        const projectsList = await projectApi.getManagerProjects();
        if (isMounted && Array.isArray(projectsList)) {
          const found = projectsList.find((p) => String(p.id) === String(projectId));
          setProject(found || null);
        }
      } catch {
        if (isMounted) setProject(null);
      } finally {
        if (isMounted) setLoadingProject(false);
      }

      // 2. Fetch Project Required Skills
      try {
        setLoadingSkills(true);
        const skillsList = await projectSkillApi.getSkillsForProject(projectId);
        if (isMounted) setProjectSkills(Array.isArray(skillsList) ? skillsList : []);
      } catch {
        if (isMounted) setProjectSkills([]);
      } finally {
        if (isMounted) setLoadingSkills(false);
      }

      // 3. Fetch Job Description Metadata
      try {
        setLoadingJD(true);
        const jdData = await jobDescriptionApi.getJobDescription(projectId);
        if (isMounted) setJobDescription(jdData || null);
      } catch {
        if (isMounted) setJobDescription(null);
      } finally {
        if (isMounted) setLoadingJD(false);
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [projectId, refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // --- PROJECT SKILLS ACTIONS ---
  const handleOpenSkillModal = (skill = null) => {
    setError('');
    if (skill) {
      setEditingSkillId(skill.id);
      setSkillName(skill.skillName || '');
      setRequiredProficiency(skill.requiredProficiency || 3);
      setImportance(skill.importance || 3);
    } else {
      setEditingSkillId(null);
      setSkillName('');
      setRequiredProficiency(3);
      setImportance(3);
    }
    setIsSkillModalOpen(true);
  };

  const handleSkillSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!skillName.trim()) {
      setError('Please search and select a skill name.');
      return;
    }

    const profVal = parseInt(requiredProficiency, 10);
    const impVal = parseInt(importance, 10);

    if (isNaN(profVal) || profVal < 1 || profVal > 5) {
      setError('Required proficiency must be between 1 and 5.');
      return;
    }

    if (isNaN(impVal) || impVal < 1 || impVal > 5) {
      setError('Importance weight must be between 1 and 5.');
      return;
    }

    try {
      setSubmittingSkill(true);
      const payload = {
        projectId: parseInt(projectId, 10),
        skillName: skillName.trim(),
        requiredProficiency: profVal,
        importance: impVal,
      };

      if (editingSkillId) {
        await projectSkillApi.updateProjectSkill(editingSkillId, payload);
        setSuccess('Required project skill updated successfully!');
      } else {
        await projectSkillApi.addProjectSkill(payload);
        setSuccess('Required project skill added successfully!');
      }

      setIsSkillModalOpen(false);
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to save project skill.');
    } finally {
      setSubmittingSkill(false);
    }
  };

  // --- JOB DESCRIPTION ACTIONS ---
  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds maximum allowed limit of 5MB.');
      setSelectedFile(null);
      return;
    }

    const ext = file.name.split('.').pop()?.toLowerCase();
    if (!ext || !ALLOWED_EXTENSIONS.includes(ext)) {
      setError('File type not supported. Allowed formats: PDF, DOCX, DOC, TXT');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleJDUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select a valid Job Description file (PDF, DOCX, DOC, TXT <= 5MB).');
      return;
    }

    try {
      setUploadingJD(true);
      await jobDescriptionApi.uploadJobDescription(projectId, selectedFile);
      setSuccess(`Job Description "${selectedFile.name}" uploaded successfully!`);
      setSelectedFile(null);
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to upload Job Description file.');
    } finally {
      setUploadingJD(false);
    }
  };

  const handleProcessJD = async () => {
    setError('');
    setSuccess('');
    setExtractedSkills([]);

    try {
      setProcessingJD(true);
      const res = await jobDescriptionApi.processJobDescription(projectId);
      if (res && Array.isArray(res.detectedSkills)) {
        setExtractedSkills(res.detectedSkills);
        setSuccess(`Job Description parsed! ${res.detectedSkills.length} required skills extracted.`);
      } else {
        setSuccess('Job Description processing completed.');
      }
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to process Job Description.');
    } finally {
      setProcessingJD(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Project Details & Requirements</h1>
          <p>Configure project skill constraints, Job Description files, and navigate to candidate matching.</p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Link to={`/manager/projects/${projectId}/candidates`} className="btn btn-primary" style={{ textDecoration: 'none' }}>
            <Users size={18} />
            <span>Match Candidates</span>
          </Link>
          <Link to={`/manager/projects/${projectId}/applications`} className="btn btn-secondary" style={{ textDecoration: 'none' }}>
            <CheckSquare size={18} />
            <span>Applications</span>
          </Link>
        </div>
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

      {/* PROJECT METADATA CARD */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Card title={loadingProject ? 'Loading Project Details...' : project?.title || `Project #${projectId}`}>
          {project && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Building size={16} /> Department: <strong style={{ color: 'var(--text-main)' }}>{project.department}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={16} /> Location: <strong style={{ color: 'var(--text-main)' }}>{project.location}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <Briefcase size={16} /> Min Experience: <strong style={{ color: 'var(--text-main)' }}>{project.experienceRequired} yrs</strong>
                </span>
                <Badge variant={project.status === 'OPEN' ? 'indigo' : 'secondary'}>{project.status}</Badge>
              </div>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
                {project.description}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="grid grid-cols-2">
        {/* REQUIRED PROJECT SKILLS CARD */}
        <Card
          title="Required Project Skills"
          subtitle="Skill constraints & weight importance (1 - 5)"
          action={
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleOpenSkillModal(null)}>
              <Plus size={16} /> Add Required Skill
            </button>
          }
        >
          {loadingSkills ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading required skills...</div>
          ) : projectSkills.length === 0 ? (
            <div className="empty-state">
              <Award size={36} />
              <h3>No required skills specified</h3>
              <p>Click "Add Required Skill" above or upload a Job Description to parse skills automatically.</p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Skill Name</th>
                    <th>Req. Proficiency</th>
                    <th>Importance Weight</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {projectSkills.map((sk) => (
                    <tr key={sk.id}>
                      <td style={{ fontWeight: 600 }}>{sk.skillName}</td>
                      <td><Badge variant="indigo">{sk.requiredProficiency} / 5</Badge></td>
                      <td><Badge variant="amber">{sk.importance} / 5</Badge></td>
                      <td>
                        <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => handleOpenSkillModal(sk)} title="Edit Skill">
                          <Edit3 size={15} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* JOB DESCRIPTION CARD */}
        <Card title="Job Description Document" subtitle="Upload & process JD files (PDF, DOCX, DOC, TXT <= 5MB)">
          {loadingJD ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading Job Description data...</div>
          ) : (
            <div>
              {jobDescription ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                      <FileText size={24} style={{ color: 'var(--primary)' }} />
                      <div>
                        <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{jobDescription.fileName}</h4>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Uploaded: {jobDescription.uploadedAt || 'N/A'}</p>
                      </div>
                    </div>
                    <Badge variant={jobDescription.processingStatus === 'PROCESSED' ? 'success' : 'amber'}>
                      {jobDescription.processingStatus}
                    </Badge>
                  </div>

                  <button
                    className="btn btn-primary w-full"
                    onClick={handleProcessJD}
                    disabled={processingJD}
                  >
                    <Cpu size={18} />
                    <span>{processingJD ? 'Parsing Document...' : 'Parse & Extract Skills'}</span>
                  </button>

                  {extractedSkills.length > 0 && (
                    <div style={{ marginTop: '0.5rem' }}>
                      <p style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--success)', marginBottom: '0.5rem' }}>
                        Extracted {extractedSkills.length} required skills from document:
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {extractedSkills.map((s, idx) => (
                          <Badge key={idx} variant="indigo">{s.name || s.skillName || s}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <form onSubmit={handleJDUploadSubmit}>
                  <div style={{
                    border: '2px dashed var(--border-color)',
                    borderRadius: 'var(--radius-md)',
                    padding: '1.5rem',
                    textAlign: 'center',
                    backgroundColor: 'var(--bg-surface)',
                    cursor: 'pointer',
                    marginBottom: '1rem'
                  }}>
                    <UploadCloud size={36} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-main)' }}>
                      {selectedFile ? selectedFile.name : 'Select Job Description document'}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                      {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, DOC, TXT up to 5MB'}
                    </p>
                    <input
                      type="file"
                      accept=".pdf,.docx,.doc,.txt"
                      onChange={handleFileChange}
                      style={{ marginTop: '0.75rem' }}
                    />
                  </div>

                  <button type="submit" className="btn btn-primary w-full" disabled={!selectedFile || uploadingJD}>
                    {uploadingJD ? 'Uploading JD...' : 'Upload Job Description'}
                  </button>
                </form>
              )}
            </div>
          )}
        </Card>
      </div>

      {/* SKILL MODAL */}
      <Modal isOpen={isSkillModalOpen} onClose={() => setIsSkillModalOpen(false)} title={editingSkillId ? 'Edit Required Skill' : 'Add Required Skill'}>
        <form onSubmit={handleSkillSubmit}>
          <div className="form-group">
            <label className="form-label">Skill Name (Search Catalog)</label>
            <SkillAutocomplete
              value={skillName}
              onChange={(val) => setSkillName(val)}
              onSelectSkill={(s) => setSkillName(s.name)}
              placeholder="Search skill catalog..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Required Proficiency (1 - 5): {requiredProficiency}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={requiredProficiency}
              onChange={(e) => setRequiredProficiency(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>1 (Basic)</span>
              <span>3 (Intermediate)</span>
              <span>5 (Expert)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Importance Weight (1 - 5): {importance}</label>
            <input
              type="range"
              min="1"
              max="5"
              value={importance}
              onChange={(e) => setImportance(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>1 (Nice to have)</span>
              <span>3 (Important)</span>
              <span>5 (Critical)</span>
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsSkillModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submittingSkill}>
              {submittingSkill ? 'Saving...' : 'Save Required Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
