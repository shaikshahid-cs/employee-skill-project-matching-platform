import { useState, useEffect } from 'react';
import { UploadCloud, FileText, Cpu, CheckCircle, AlertCircle, Award, CheckSquare, Square, Save, Eye, RefreshCw } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import resumeApi from '../../api/resumeApi';
import employeeSkillApi from '../../api/employeeSkillApi';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED_EXTENSIONS = ['pdf', 'docx', 'doc', 'txt'];

export default function ResumeManagerPage() {
  const [resumes, setResumes] = useState([]);
  const [loading, setLoading] = useState(true);

  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [processingId, setProcessingId] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Extraction Review Workflow State
  const [reviewState, setReviewState] = useState({
    active: false,
    resumeId: null,
    fileName: '',
    detectedSkills: [], // [{ name, selected: true, proficiency: 3, yearsExperience: 1.0 }]
    rawTextPreview: '',
  });

  const [savingSkills, setSavingSkills] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchResumesData = async () => {
      try {
        setLoading(true);
        const data = await resumeApi.getResumes();
        if (isMounted) setResumes(Array.isArray(data) ? data : []);
      } catch {
        if (isMounted) setResumes([]);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchResumesData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

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

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!selectedFile) {
      setError('Please select a valid resume document first.');
      return;
    }

    try {
      setUploading(true);
      const res = await resumeApi.uploadResume(selectedFile);
      setSuccess(`Resume "${selectedFile.name}" uploaded successfully! Now click "Process & Extract" to review skills.`);
      setSelectedFile(null);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to upload resume document.');
    } finally {
      setUploading(false);
    }
  };

  const handleProcessResume = async (resumeId, fileName) => {
    setError('');
    setSuccess('');

    try {
      setProcessingId(resumeId);
      const res = await resumeApi.processResume(resumeId);

      const rawSkills = Array.isArray(res?.detectedSkills) ? res.detectedSkills : [];
      const formattedSkills = rawSkills.map((sk) => ({
        id: sk.id,
        name: sk.name || sk.skillName || sk,
        selected: true,
        proficiency: 3,
        yearsExperience: 1.0,
      }));

      setReviewState({
        active: true,
        resumeId,
        fileName: fileName || `Resume #${resumeId}`,
        detectedSkills: formattedSkills,
        rawTextPreview: `[Extracted Document Text Preview]\n\nResume parsed successfully from document "${fileName || resumeId}".\nDetected ${formattedSkills.length} relevant technical skills from content analysis. Review and confirm below to update your profile.`,
      });

      setSuccess(`Resume processed. ${formattedSkills.length} skills extracted. Please review and confirm below.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to extract skills from resume document.');
    } finally {
      setProcessingId(null);
    }
  };

  const handleToggleSkill = (index) => {
    setReviewState((prev) => {
      const updated = [...prev.detectedSkills];
      updated[index].selected = !updated[index].selected;
      return { ...prev, detectedSkills: updated };
    });
  };

  const handleSkillProficiencyChange = (index, val) => {
    setReviewState((prev) => {
      const updated = [...prev.detectedSkills];
      updated[index].proficiency = parseInt(val, 10);
      return { ...prev, detectedSkills: updated };
    });
  };

  const handleSaveConfirmedSkills = async () => {
    setError('');
    setSuccess('');

    const selectedSkills = reviewState.detectedSkills.filter((s) => s.selected);
    if (selectedSkills.length === 0) {
      setError('Please select at least one detected skill to import into your profile.');
      return;
    }

    try {
      setSavingSkills(true);
      for (const sk of selectedSkills) {
        await employeeSkillApi.addSkill({
          skillName: sk.name,
          proficiency: sk.proficiency,
          yearsExperience: sk.yearsExperience || 1.0,
        });
      }

      setSuccess(`Successfully added ${selectedSkills.length} verified skills to your employee profile!`);
      setReviewState({ active: false, resumeId: null, fileName: '', detectedSkills: [], rawTextPreview: '' });
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err.message || 'Failed to save extracted skills to your profile.');
    } finally {
      setSavingSkills(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Resume Management & Skill Extraction</h1>
        <p>Upload your resume to extract skills into your profile. Review and confirm before updating your matrix.</p>
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

      {/* STEP 1: FILE UPLOAD */}
      <div className="grid grid-cols-2" style={{ marginBottom: '1.5rem' }}>
        <Card title="Step 1: Upload Resume Document" subtitle="Supported formats: PDF, DOCX, DOC, TXT (Max 5MB)">
          <form onSubmit={handleUploadSubmit}>
            <div style={{
              border: '2px dashed var(--border-color)',
              borderRadius: 'var(--radius-md)',
              padding: '2rem 1.5rem',
              textAlign: 'center',
              backgroundColor: 'var(--bg-surface)',
              cursor: 'pointer',
              marginBottom: '1rem',
              transition: 'border-color 0.2s ease'
            }}>
              <UploadCloud size={42} style={{ color: 'var(--primary)', marginBottom: '0.75rem' }} />
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-main)' }}>
                {selectedFile ? selectedFile.name : 'Click or drop resume file here'}
              </p>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>
                {selectedFile ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB` : 'PDF, DOCX, DOC, TXT up to 5MB'}
              </p>
              <input
                type="file"
                accept=".pdf,.docx,.doc,.txt"
                onChange={handleFileChange}
                style={{ marginTop: '0.85rem' }}
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={!selectedFile || uploading}>
              {uploading ? 'Uploading Document...' : 'Upload Resume Document'}
            </button>
          </form>
        </Card>

        {/* WORKFLOW SUMMARY */}
        <Card title="Extraction Workflow Guide" subtitle="How MatchPulse safely extracts skills without corrupting user data">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>1</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Document Parsing</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Apache Tika extracts raw text safely from uploaded PDF or Word documents.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(6, 182, 212, 0.15)', color: 'var(--secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>2</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Skill Recognition</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Regex boundary pattern matching identifies technical skills registered in database.</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.85rem' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(16, 185, 129, 0.15)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '0.85rem' }}>3</div>
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 600 }}>Employee Review & Confirmation</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Review extracted skills, set proficiency ratings, and confirm before saving.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* STEP 2: INTERACTIVE SKILL REVIEW PANEL */}
      {reviewState.active && (
        <div style={{ marginBottom: '1.5rem' }}>
          <Card
            title={`Step 2: Review Extracted Information — ${reviewState.fileName}`}
            subtitle="Select verified skills and assign proficiency ratings before saving to your profile matrix"
            action={
              <button className="btn btn-secondary" onClick={() => setReviewState({ active: false, resumeId: null, fileName: '', detectedSkills: [], rawTextPreview: '' })}>
                Close Preview
              </button>
            }
          >
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.5rem', display: 'block' }}>
                Extracted Content Summary:
              </label>
              <textarea
                readOnly
                value={reviewState.rawTextPreview}
                style={{ width: '100%', height: '80px', background: 'var(--bg-base)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', padding: '0.65rem', color: 'var(--text-dim)', fontSize: '0.825rem', fontFamily: 'monospace' }}
              />
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Cpu size={18} style={{ color: 'var(--primary)' }} />
              Detected Skills ({reviewState.detectedSkills.length} identified):
            </h4>

            {reviewState.detectedSkills.length === 0 ? (
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No skills automatically detected from document text.</p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
                {reviewState.detectedSkills.map((sk, idx) => (
                  <div
                    key={idx}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.75rem',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: sk.selected ? 'rgba(99, 102, 241, 0.1)' : 'var(--bg-surface)',
                      border: sk.selected ? '1px solid rgba(99, 102, 241, 0.4)' : '1px solid var(--border-color)'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', cursor: 'pointer' }} onClick={() => handleToggleSkill(idx)}>
                      {sk.selected ? <CheckSquare size={18} style={{ color: 'var(--primary)' }} /> : <Square size={18} style={{ color: 'var(--text-dim)' }} />}
                      <span style={{ fontSize: '0.9rem', fontWeight: 600, color: sk.selected ? 'var(--text-main)' : 'var(--text-muted)' }}>{sk.name}</span>
                    </div>

                    {sk.selected && (
                      <select
                        value={sk.proficiency}
                        onChange={(e) => handleSkillProficiencyChange(idx, e.target.value)}
                        style={{ padding: '0.25rem 0.5rem', background: 'var(--bg-base)', border: '1px solid var(--border-color)', color: 'var(--text-main)', borderRadius: '4px', fontSize: '0.775rem' }}
                      >
                        <option value="1">L1 - Basic</option>
                        <option value="2">L2 - Intermediate</option>
                        <option value="3">L3 - Proficient</option>
                        <option value="4">L4 - Advanced</option>
                        <option value="5">L5 - Expert</option>
                      </select>
                    )}
                  </div>
                ))}
              </div>
            )}

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                className="btn btn-primary"
                onClick={handleSaveConfirmedSkills}
                disabled={savingSkills || reviewState.detectedSkills.filter(s => s.selected).length === 0}
              >
                <Save size={16} />
                <span>{savingSkills ? 'Saving Verified Skills...' : 'Confirm & Import to My Profile'}</span>
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* UPLOADED RESUMES LIST CARD */}
      <Card title="Stored Resume Documents" subtitle="Manage uploaded resumes and trigger automated text parsing">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading resume documents...</div>
        ) : resumes.length === 0 ? (
          <div className="empty-state">
            <FileText size={36} />
            <h3>No resumes uploaded yet</h3>
            <p>Upload a document above to extract skills and enhance your candidate matching score.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Uploaded At</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {resumes.map((doc) => (
                  <tr key={doc.id}>
                    <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <FileText size={18} style={{ color: 'var(--primary)' }} />
                      <span>{doc.fileName}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      {doc.uploadedAt ? new Date(doc.uploadedAt).toLocaleDateString() : 'Stored'}
                    </td>
                    <td>
                      <Badge variant={doc.processingStatus === 'PROCESSED' ? 'success' : 'amber'}>
                        {doc.processingStatus}
                      </Badge>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }}
                        onClick={() => handleProcessResume(doc.id, doc.fileName)}
                        disabled={processingId === doc.id}
                      >
                        <Cpu size={14} />
                        <span>{processingId === doc.id ? 'Parsing Document...' : 'Process & Review Skills'}</span>
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
  );
}
