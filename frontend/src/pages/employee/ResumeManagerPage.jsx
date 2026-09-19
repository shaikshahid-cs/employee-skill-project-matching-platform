import { useState } from 'react';
import {
  UploadCloud, FileText, Cpu, CheckCircle2, AlertCircle, Award,
  Trash2, Plus, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import documentApi from '../../api/documentApi';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt'];

export default function ResumeManagerPage() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [extracting, setExtracting] = useState(false);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Review & Verification Modal State
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState(null);

  const handleFileChange = (e) => {
    setError('');
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError('File size exceeds maximum allowed limit of 10MB.');
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

  const handleExtract = async (e) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select a resume file to parse.');
      return;
    }

    try {
      setExtracting(true);
      setError('');
      setSuccess('');
      const data = await documentApi.extractResume(selectedFile);
      setPreviewData(data);
      setIsPreviewOpen(true);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to extract data from resume.');
    } finally {
      setExtracting(false);
    }
  };

  const handleApplyVerifiedData = async () => {
    if (!previewData) return;
    try {
      setApplying(true);
      setError('');
      await documentApi.applyResume(previewData);
      setSuccess('Resume data reviewed and successfully applied to your professional profile!');
      setIsPreviewOpen(false);
      setSelectedFile(null);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to apply resume profile updates.');
    } finally {
      setApplying(false);
    }
  };

  const updateExtractedSkill = (index, field, value) => {
    setPreviewData((prev) => {
      const updatedSkills = [...prev.skills];
      updatedSkills[index] = { ...updatedSkills[index], [field]: value };
      return { ...prev, skills: updatedSkills };
    });
  };

  const removeExtractedSkill = (index) => {
    setPreviewData((prev) => {
      const updated = prev.skills.filter((_, i) => i !== index);
      return { ...prev, skills: updated };
    });
  };

  const getConfidenceBadge = (confidence) => {
    switch (confidence?.toUpperCase()) {
      case 'HIGH':
        return <Badge variant="emerald">HIGH CONFIDENCE</Badge>;
      case 'MEDIUM':
        return <Badge variant="amber">MEDIUM</Badge>;
      case 'LOW':
      default:
        return <Badge variant="slate">LOW</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Assistive Resume Processing</h1>
        <p>Upload your resume to extract profile information, technical skills, education, and past work history with human-in-the-loop review.</p>
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
          padding: '1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.3)',
          color: '#34d399',
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={20} />
            <span>{success}</span>
          </div>
          <Link to="/employee/profile" className="btn btn-secondary" style={{ padding: '0.35rem 0.75rem', fontSize: '0.825rem' }}>
            <span>View Updated Profile</span>
            <ArrowRight size={14} />
          </Link>
        </div>
      )}

      <Card title="Upload Document for Assistive Extraction" subtitle="Supports PDF, DOCX, DOC, and TXT files up to 10MB">
        <form onSubmit={handleExtract}>
          <div style={{
            border: '2px dashed var(--border-color)',
            borderRadius: 'var(--radius-md)',
            padding: '2.5rem 1.5rem',
            textAlign: 'center',
            backgroundColor: 'var(--bg-surface)',
            cursor: 'pointer',
            marginBottom: '1.25rem'
          }}>
            <UploadCloud size={48} style={{ color: 'var(--primary)', margin: '0 auto 1rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              Select Resume Document
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>
              Apache Tika parses structural metadata, detecting roles, experience periods, degrees, and skills.
            </p>

            <input
              type="file"
              id="resume-file"
              accept=".pdf,.docx,.doc,.txt"
              onChange={handleFileChange}
              style={{ display: 'none' }}
            />
            <label htmlFor="resume-file" className="btn btn-secondary" style={{ cursor: 'pointer', display: 'inline-flex' }}>
              Browse File...
            </label>

            {selectedFile && (
              <div style={{
                marginTop: '1.25rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: 'rgba(99, 102, 241, 0.15)',
                borderRadius: '8px',
                color: 'var(--primary)',
                fontWeight: 500,
                fontSize: '0.875rem'
              }}>
                <FileText size={16} />
                <span>{selectedFile.name} ({(selectedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={!selectedFile || extracting}
              style={{ minWidth: '180px' }}
            >
              {extracting ? (
                <>
                  <Cpu size={16} className="animate-spin" />
                  <span>Analyzing Resume...</span>
                </>
              ) : (
                <>
                  <Cpu size={16} />
                  <span>Extract & Review Preview</span>
                </>
              )}
            </button>
          </div>
        </form>
      </Card>

      {/* VERIFICATION & PREVIEW MODAL */}
      <Modal
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        title="Review Extracted Resume Data (Assistive Preview)"
      >
        {previewData && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
            {/* Warning Banner */}
            <div style={{
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '0.85rem 1rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              fontSize: '0.85rem',
              color: '#93c5fd'
            }}>
              <ShieldCheck size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong>Assistive AI Extraction — Human Verification Required:</strong>
                <p style={{ margin: '0.2rem 0 0 0', color: 'var(--text-muted)' }}>
                  Review and edit any extracted values below. No changes are applied to your profile until you click "Confirm & Apply to Profile".
                </p>
              </div>
            </div>

            {/* Extracted Personal Info */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.75rem' }}>
                Personal Information Detected
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={previewData.fullName?.value || ''}
                    onChange={(e) => setPreviewData({ ...previewData, fullName: { ...previewData.fullName, value: e.target.value } })}
                  />
                  <div style={{ marginTop: '0.25rem' }}>{getConfidenceBadge(previewData.fullName?.confidence)}</div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone</label>
                  <input
                    type="text"
                    className="form-input"
                    value={previewData.phone?.value || ''}
                    onChange={(e) => setPreviewData({ ...previewData, phone: { ...previewData.phone, value: e.target.value } })}
                  />
                  <div style={{ marginTop: '0.25rem' }}>{getConfidenceBadge(previewData.phone?.confidence)}</div>
                </div>

                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Designation / Title</label>
                  <input
                    type="text"
                    className="form-input"
                    value={previewData.designation?.value || ''}
                    onChange={(e) => setPreviewData({ ...previewData, designation: { ...previewData.designation, value: e.target.value } })}
                  />
                  <div style={{ marginTop: '0.25rem' }}>{getConfidenceBadge(previewData.designation?.confidence)}</div>
                </div>
              </div>
            </div>

            {/* Extracted Skills */}
            <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>
                  Detected Technical Skills ({previewData.skills?.length || 0})
                </h3>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Set your actual proficiency (1-5)</span>
              </div>

              {previewData.skills?.length === 0 ? (
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>No skills detected automatically.</p>
              ) : (
                <div className="table-container" style={{ maxHeight: '200px', overflowY: 'auto' }}>
                  <table className="table" style={{ fontSize: '0.825rem' }}>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Proficiency (1-5)</th>
                        <th>Experience (Yrs)</th>
                        <th>Confidence</th>
                        <th></th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.skills?.map((s, idx) => (
                        <tr key={idx}>
                          <td style={{ fontWeight: 600 }}>{s.skillName}</td>
                          <td>
                            <select
                              className="form-input"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: 'auto' }}
                              value={s.proficiency || 3}
                              onChange={(e) => updateExtractedSkill(idx, 'proficiency', parseInt(e.target.value, 10))}
                            >
                              <option value="1">1 - Novice</option>
                              <option value="2">2 - Elementary</option>
                              <option value="3">3 - Competent</option>
                              <option value="4">4 - Advanced</option>
                              <option value="5">5 - Expert</option>
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              step="0.5"
                              min="0"
                              className="form-input"
                              style={{ padding: '0.2rem 0.5rem', fontSize: '0.8rem', width: '70px' }}
                              value={s.yearsOfExperience || 1}
                              onChange={(e) => updateExtractedSkill(idx, 'yearsOfExperience', parseFloat(e.target.value) || 0)}
                            />
                          </td>
                          <td>{getConfidenceBadge(s.confidence)}</td>
                          <td>
                            <button
                              type="button"
                              className="btn btn-secondary"
                              style={{ padding: '0.2rem 0.4rem', color: '#f87171' }}
                              onClick={() => removeExtractedSkill(idx)}
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Extracted Education */}
            {previewData.education?.length > 0 && (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Extracted Education Records ({previewData.education.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {previewData.education.map((edu, idx) => (
                    <div key={idx} style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{edu.degree}</span>
                      <span style={{ color: 'var(--text-dim)', margin: '0 0.5rem' }}>&bull;</span>
                      <span style={{ color: 'var(--text-muted)' }}>{edu.institution} ({edu.graduationYear || 'Year N/A'})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Certifications */}
            {previewData.certifications?.length > 0 && (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Extracted Certifications ({previewData.certifications.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {previewData.certifications.map((c, idx) => (
                    <div key={idx} style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{c.name}</span>
                      <span style={{ color: 'var(--text-dim)', margin: '0 0.5rem' }}>&bull;</span>
                      <span style={{ color: 'var(--text-muted)' }}>{c.issuingOrganization || 'Authority'}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Extracted Experience */}
            {previewData.experience?.length > 0 && (
              <div style={{ background: 'var(--bg-surface)', padding: '1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <h3 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                  Extracted Work History ({previewData.experience.length})
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {previewData.experience.map((exp, idx) => (
                    <div key={idx} style={{ padding: '0.5rem', background: 'rgba(255, 255, 255, 0.02)', borderRadius: '6px', fontSize: '0.85rem' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{exp.roleTitle}</span>
                      <span style={{ color: 'var(--text-dim)' }}> at </span>
                      <strong style={{ color: 'var(--primary)' }}>{exp.company}</strong>
                      <span style={{ color: 'var(--text-dim)', marginLeft: '0.5rem' }}>({exp.startDate} - {exp.current ? 'Present' : (exp.endDate || '')})</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem' }}>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setIsPreviewOpen(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-primary"
                disabled={applying}
                onClick={handleApplyVerifiedData}
              >
                {applying ? 'Applying Updates...' : 'Confirm & Apply to Profile'}
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
