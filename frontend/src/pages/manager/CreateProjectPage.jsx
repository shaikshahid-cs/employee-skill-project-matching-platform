import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FolderPlus, AlertCircle, Cpu, UploadCloud, Plus, Trash2,
  CheckCircle2, Sparkles, ShieldCheck
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import SkillAutocomplete from '../../components/SkillAutocomplete';
import projectApi from '../../api/projectApi';
import documentApi from '../../api/documentApi';

export default function CreateProjectPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: '',
    description: '',
    department: 'Engineering',
    location: 'Remote',
    workMode: 'REMOTE',
    status: 'OPEN',
    requiredRole: 'Software Engineer',
    isRoleMandatory: false,
    requiredDomain: 'Backend Development',
    isDomainMandatory: false,
    minExperienceYears: 2.0,
    isExperienceMandatory: false,
    requiredDegreeLevel: 'BACHELOR',
    requiredDegreeField: 'Computer Science',
    isEducationMandatory: false,
    requiredCertification: '',
    isCertificationMandatory: false,
  });

  const [skills, setSkills] = useState([
    { skillName: 'Java', minProficiency: 3, importance: 4, isMandatory: true },
    { skillName: 'Spring Boot', minProficiency: 3, importance: 4, isMandatory: false },
  ]);

  const [newSkillName, setNewSkillName] = useState('');
  const [newProf, setNewProf] = useState(3);
  const [newImp, setNewImp] = useState(3);
  const [newMandatory, setNewMandatory] = useState(false);

  // Assistive JD state
  const [isJdModalOpen, setIsJdModalOpen] = useState(false);
  const [jdFile, setJdFile] = useState(null);
  const [extractingJd, setExtractingJd] = useState(false);
  const [jdPreview, setJdPreview] = useState(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleAddSkillRow = () => {
    if (!newSkillName.trim()) return;
    setSkills([
      ...skills,
      {
        skillName: newSkillName.trim(),
        minProficiency: parseInt(newProf, 10),
        importance: parseInt(newImp, 10),
        isMandatory: Boolean(newMandatory),
      },
    ]);
    setNewSkillName('');
    setNewProf(3);
    setNewImp(3);
    setNewMandatory(false);
  };

  const handleRemoveSkillRow = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
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

  const handleApplyJdPreviewToForm = () => {
    if (!jdPreview) return;
    setForm((prev) => ({
      ...prev,
      title: jdPreview.title || prev.title,
      description: jdPreview.description || prev.description,
      requiredRole: jdPreview.requiredRole || prev.requiredRole,
      isRoleMandatory: Boolean(jdPreview.isRoleMandatory),
      requiredDomain: jdPreview.requiredDomain || prev.requiredDomain,
      isDomainMandatory: Boolean(jdPreview.isDomainMandatory),
      minExperienceYears: jdPreview.minExperienceYears ?? prev.minExperienceYears,
      isExperienceMandatory: Boolean(jdPreview.isExperienceMandatory),
      requiredDegreeLevel: jdPreview.requiredDegreeLevel || prev.requiredDegreeLevel,
      requiredDegreeField: jdPreview.requiredDegreeField || prev.requiredDegreeField,
      isEducationMandatory: Boolean(jdPreview.isEducationMandatory),
      requiredCertification: jdPreview.requiredCertification || prev.requiredCertification,
      isCertificationMandatory: Boolean(jdPreview.isCertificationMandatory),
    }));

    if (jdPreview.skills && jdPreview.skills.length > 0) {
      const mappedSkills = jdPreview.skills.map((s) => ({
        skillName: s.skillName,
        minProficiency: s.minProficiency || 3,
        importance: s.importance || 3,
        isMandatory: Boolean(s.isMandatory),
      }));
      setSkills(mappedSkills);
    }

    setIsJdModalOpen(false);
    setJdPreview(null);
    setJdFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!form.title.trim() || !form.description.trim()) {
      setError('Please provide a Project Title and Scope Description.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        department: form.department,
        location: form.location,
        workMode: form.workMode,
        status: form.status,
        requiredRole: form.requiredRole,
        isRoleMandatory: form.isRoleMandatory,
        requiredDomain: form.requiredDomain,
        isDomainMandatory: form.isDomainMandatory,
        minExperienceYears: parseFloat(form.minExperienceYears) || 0,
        experienceRequired: parseFloat(form.minExperienceYears) || 0,
        isExperienceMandatory: form.isExperienceMandatory,
        requiredDegreeLevel: form.requiredDegreeLevel,
        requiredDegreeField: form.requiredDegreeField,
        isEducationMandatory: form.isEducationMandatory,
        requiredCertification: form.requiredCertification,
        isCertificationMandatory: form.isCertificationMandatory,
        skills: skills.map((s) => ({
          skillName: s.skillName,
          minProficiency: s.minProficiency,
          importance: s.importance,
          isMandatory: s.isMandatory,
        })),
      };

      const newProject = await projectApi.createProject(payload);
      if (newProject && newProject.id) {
        navigate(`/manager/projects/${newProject.id}`, { replace: true });
      } else {
        navigate('/manager/projects', { replace: true });
      }
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create project.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Create Project Requisition</h1>
          <p>Define project scope and configure explicit Mandatory vs. Preferred candidate matching criteria.</p>
        </div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => { setIsJdModalOpen(true); setJdPreview(null); }}
        >
          <Cpu size={16} />
          <span>Extract from Job Description Doc</span>
        </button>
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {/* BASIC PROJECT INFO */}
        <Card title="1. Project Overview & Scope" subtitle="Core metadata and operational logistics">
          <div className="form-group">
            <label className="form-label">Project Title *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Distributed Payment Gateway & High-Throughput Engine"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Scope & Technical Architecture *</label>
            <textarea
              rows="4"
              className="form-input"
              required
              placeholder="Describe deliverables, architecture, team objectives, and tech stack..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label className="form-label">Department</label>
              <input
                type="text"
                className="form-input"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Location / Hub</label>
              <input
                type="text"
                className="form-input"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Work Mode</label>
              <select
                className="form-input"
                value={form.workMode}
                onChange={(e) => setForm({ ...form, workMode: e.target.value })}
              >
                <option value="REMOTE">Fully Remote</option>
                <option value="HYBRID">Hybrid</option>
                <option value="ONSITE">Onsite</option>
              </select>
            </div>
          </div>
        </Card>

        {/* STRUCTURED MATCHING CRITERIA WITH MANDATORY TOGGLES */}
        <Card
          title="2. Matching Criteria (Mandatory vs. Preferred)"
          subtitle="Designate non-negotiable requirements vs. preferred qualifications (Mandatory failures cap matching scores at 40%)"
        >
          {/* ROLE & DOMAIN */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Target Role *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Java Backend Developer"
                value={form.requiredRole}
                onChange={(e) => setForm({ ...form, requiredRole: e.target.value })}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="role-mandatory"
                  checked={form.isRoleMandatory}
                  onChange={(e) => setForm({ ...form, isRoleMandatory: e.target.checked })}
                />
                <label htmlFor="role-mandatory" style={{ fontSize: '0.85rem', color: form.isRoleMandatory ? '#f87171' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>
                  {form.isRoleMandatory ? '🔒 Mandatory Requirement' : 'Preferred Qualification'}
                </label>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Required Domain *</label>
              <select
                className="form-input"
                value={form.requiredDomain}
                onChange={(e) => setForm({ ...form, requiredDomain: e.target.value })}
              >
                <option value="Backend Development">Backend Development</option>
                <option value="Frontend Development">Frontend Development</option>
                <option value="Full Stack Development">Full Stack Development</option>
                <option value="Cloud Computing">Cloud Computing</option>
                <option value="DevOps & SRE">DevOps & SRE</option>
                <option value="Data Engineering">Data Engineering</option>
                <option value="AI & Machine Learning">AI & Machine Learning</option>
                <option value="Cybersecurity">Cybersecurity</option>
              </select>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="domain-mandatory"
                  checked={form.isDomainMandatory}
                  onChange={(e) => setForm({ ...form, isDomainMandatory: e.target.checked })}
                />
                <label htmlFor="domain-mandatory" style={{ fontSize: '0.85rem', color: form.isDomainMandatory ? '#f87171' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>
                  {form.isDomainMandatory ? '🔒 Mandatory Requirement' : 'Preferred Qualification'}
                </label>
              </div>
            </div>
          </div>

          {/* EXPERIENCE & EDUCATION */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.25rem' }}>
            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Minimum Experience (Years) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                required
                value={form.minExperienceYears}
                onChange={(e) => setForm({ ...form, minExperienceYears: parseFloat(e.target.value) || 0 })}
              />
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="exp-mandatory"
                  checked={form.isExperienceMandatory}
                  onChange={(e) => setForm({ ...form, isExperienceMandatory: e.target.checked })}
                />
                <label htmlFor="exp-mandatory" style={{ fontSize: '0.85rem', color: form.isExperienceMandatory ? '#f87171' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>
                  {form.isExperienceMandatory ? '🔒 Mandatory Requirement' : 'Preferred Qualification'}
                </label>
              </div>
            </div>

            <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <label className="form-label">Degree Level & Target Field</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <select
                  className="form-input"
                  value={form.requiredDegreeLevel}
                  onChange={(e) => setForm({ ...form, requiredDegreeLevel: e.target.value })}
                >
                  <option value="BACHELOR">Bachelor's Degree</option>
                  <option value="MASTER">Master's Degree</option>
                  <option value="DOCTORATE">Doctorate / PhD</option>
                  <option value="DIPLOMA">Diploma</option>
                </select>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Field (e.g. Computer Science)"
                  value={form.requiredDegreeField}
                  onChange={(e) => setForm({ ...form, requiredDegreeField: e.target.value })}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
                <input
                  type="checkbox"
                  id="edu-mandatory"
                  checked={form.isEducationMandatory}
                  onChange={(e) => setForm({ ...form, isEducationMandatory: e.target.checked })}
                />
                <label htmlFor="edu-mandatory" style={{ fontSize: '0.85rem', color: form.isEducationMandatory ? '#f87171' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>
                  {form.isEducationMandatory ? '🔒 Mandatory Requirement' : 'Preferred Qualification'}
                </label>
              </div>
            </div>
          </div>

          {/* CERTIFICATION */}
          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
            <label className="form-label">Required Industry Certification (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AWS Certified Solutions Architect or CKA"
              value={form.requiredCertification}
              onChange={(e) => setForm({ ...form, requiredCertification: e.target.value })}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
              <input
                type="checkbox"
                id="cert-mandatory"
                checked={form.isCertificationMandatory}
                onChange={(e) => setForm({ ...form, isCertificationMandatory: e.target.checked })}
              />
              <label htmlFor="cert-mandatory" style={{ fontSize: '0.85rem', color: form.isCertificationMandatory ? '#f87171' : 'var(--text-muted)', fontWeight: 500, cursor: 'pointer' }}>
                {form.isCertificationMandatory ? '🔒 Mandatory Requirement' : 'Preferred Qualification'}
              </label>
            </div>
          </div>
        </Card>

        {/* REQUIRED SKILLS MATRIX */}
        <Card title="3. Technical Skills Requisition (Max 35 Points)" subtitle="Define required skills with proficiency (1-5), importance weight, and mandatory flags">
          {skills.length > 0 && (
            <div className="table-container" style={{ marginBottom: '1.25rem' }}>
              <table className="table">
                <thead>
                  <tr>
                    <th>Skill</th>
                    <th>Min Proficiency</th>
                    <th>Importance (1-5)</th>
                    <th>Requirement Type</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {skills.map((s, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{s.skillName}</td>
                      <td>Level {s.minProficiency} / 5</td>
                      <td>Weight: {s.importance} / 5</td>
                      <td>
                        {s.isMandatory ? (
                          <span style={{ color: '#f87171', fontWeight: 600, fontSize: '0.8rem' }}>🔒 Mandatory</span>
                        ) : (
                          <span style={{ color: 'var(--text-dim)', fontSize: '0.8rem' }}>Preferred</span>
                        )}
                      </td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-secondary"
                          style={{ padding: '0.25rem 0.45rem', color: '#f87171' }}
                          onClick={() => handleRemoveSkillRow(idx)}
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

          {/* Add skill row inline */}
          <div style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface)',
            border: '1px solid var(--border-color)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-end',
            flexWrap: 'wrap'
          }}>
            <div style={{ flex: 2, minWidth: '200px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Search or Enter Skill</label>
              <SkillAutocomplete
                value={newSkillName}
                onChange={(val) => setNewSkillName(val)}
                onSelectSkill={(skill) => setNewSkillName(skill.name)}
                placeholder="e.g. Docker, PostgreSQL..."
              />
            </div>

            <div style={{ flex: 1, minWidth: '110px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Min Prof (1-5)</label>
              <select className="form-input" value={newProf} onChange={(e) => setNewProf(e.target.value)}>
                <option value="1">1 - Novice</option>
                <option value="2">2 - Elementary</option>
                <option value="3">3 - Competent</option>
                <option value="4">4 - Advanced</option>
                <option value="5">5 - Expert</option>
              </select>
            </div>

            <div style={{ flex: 1, minWidth: '110px' }}>
              <label className="form-label" style={{ fontSize: '0.75rem' }}>Importance (1-5)</label>
              <select className="form-input" value={newImp} onChange={(e) => setNewImp(e.target.value)}>
                <option value="1">1 - Low</option>
                <option value="2">2 - Moderate</option>
                <option value="3">3 - Standard</option>
                <option value="4">4 - High</option>
                <option value="5">5 - Critical</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', paddingBottom: '0.5rem' }}>
              <input
                type="checkbox"
                id="new-mandatory"
                checked={newMandatory}
                onChange={(e) => setNewMandatory(e.target.checked)}
              />
              <label htmlFor="new-mandatory" style={{ fontSize: '0.8rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                Mandatory
              </label>
            </div>

            <button type="button" className="btn btn-secondary" onClick={handleAddSkillRow}>
              <Plus size={16} />
              <span>Add to Requisition</span>
            </button>
          </div>
        </Card>

        {/* SUBMIT BUTTON */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <button type="button" className="btn btn-secondary" onClick={() => navigate('/manager/projects')}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={submitting} style={{ minWidth: '180px' }}>
            <FolderPlus size={18} />
            <span>{submitting ? 'Creating Project...' : 'Post Project Requisition'}</span>
          </button>
        </div>
      </form>

      {/* ASSISTIVE JD EXTRACTION MODAL */}
      <Modal isOpen={isJdModalOpen} onClose={() => setIsJdModalOpen(false)} title="Assistive Job Description Extraction">
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
              Upload Job Description Document
            </p>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.75rem' }}>
              PDF, DOCX, DOC, or TXT
            </p>

            <input
              type="file"
              id="jd-file-input"
              accept=".pdf,.docx,.doc,.txt"
              onChange={(e) => setJdFile(e.target.files?.[0] || null)}
              style={{ display: 'none' }}
            />
            <label htmlFor="jd-file-input" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
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
              {extractingJd ? 'Extracting Requirements...' : 'Extract Requirements'}
            </button>
          </div>

          {jdPreview && (
            <div style={{
              background: 'var(--bg-surface)',
              padding: '1rem',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              maxHeight: '300px',
              overflowY: 'auto'
            }}>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                Extracted Proposal Preview
              </h4>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Title:</strong> {jdPreview.title}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Role:</strong> {jdPreview.requiredRole}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Domain:</strong> {jdPreview.requiredDomain}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Min Experience:</strong> {jdPreview.minExperienceYears} yrs</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Degree:</strong> {jdPreview.requiredDegreeLevel} in {jdPreview.requiredDegreeField}</p>
              <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}><strong>Skills:</strong> {jdPreview.skills?.map(s => s.skillName).join(', ')}</p>

              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
                <button type="button" className="btn btn-primary" onClick={handleApplyJdPreviewToForm}>
                  Apply to Project Form
                </button>
              </div>
            </div>
          )}
        </div>
      </Modal>
    </div>
  );
}
