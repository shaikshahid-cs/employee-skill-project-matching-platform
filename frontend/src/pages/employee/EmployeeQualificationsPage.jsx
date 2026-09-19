import { useState, useEffect } from 'react';
import { GraduationCap, Award, Plus, Trash2, Edit3, AlertCircle, CheckCircle2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import qualificationApi from '../../api/qualificationApi';

export default function EmployeeQualificationsPage() {
  const [certifications, setCertifications] = useState([]);
  const [educations, setEducations] = useState([]);
  const [loadingCerts, setLoadingCerts] = useState(true);
  const [loadingEdu, setLoadingEdu] = useState(true);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Cert Modal State
  const [isCertModalOpen, setIsCertModalOpen] = useState(false);
  const [editingCertId, setEditingCertId] = useState(null);
  const [certForm, setCertForm] = useState({
    name: '',
    issuingOrganization: '',
    issueDate: '',
    expiryDate: '',
    credentialId: '',
  });
  const [submittingCert, setSubmittingCert] = useState(false);

  // Edu Modal State
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduForm, setEduForm] = useState({
    degree: '',
    degreeLevel: 'BACHELOR',
    fieldOfStudy: '',
    institution: '',
    graduationYear: 2022,
    gradeGpa: '',
  });
  const [submittingEdu, setSubmittingEdu] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchQuals = async () => {
      try {
        setLoadingCerts(true);
        const res = await qualificationApi.getCertifications();
        if (isMounted) setCertifications(Array.isArray(res) ? res : []);
      } catch {
        if (isMounted) setCertifications([]);
      } finally {
        if (isMounted) setLoadingCerts(false);
      }

      try {
        setLoadingEdu(true);
        const res = await qualificationApi.getEducations();
        if (isMounted) setEducations(Array.isArray(res) ? res : []);
      } catch {
        if (isMounted) setEducations([]);
      } finally {
        if (isMounted) setLoadingEdu(false);
      }
    };

    fetchQuals();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleRefresh = () => setRefreshTrigger((prev) => prev + 1);

  // --- CERTIFICATION ACTIONS ---
  const handleOpenCertModal = (cert = null) => {
    setError('');
    if (cert) {
      setEditingCertId(cert.id);
      setCertForm({
        name: cert.name || '',
        issuingOrganization: cert.issuingOrganization || '',
        issueDate: cert.issueDate || '',
        expiryDate: cert.expiryDate || '',
        credentialId: cert.credentialId || '',
      });
    } else {
      setEditingCertId(null);
      setCertForm({
        name: '',
        issuingOrganization: '',
        issueDate: new Date().toISOString().split('T')[0],
        expiryDate: '',
        credentialId: '',
      });
    }
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!certForm.name || !certForm.issuingOrganization || !certForm.issueDate) {
      setError('Certification Name, Issuing Organization, and Issue Date are required.');
      return;
    }

    try {
      setSubmittingCert(true);
      if (editingCertId) {
        await qualificationApi.updateCertification(editingCertId, certForm);
        setSuccess('Certification updated successfully!');
      } else {
        await qualificationApi.addCertification(certForm);
        setSuccess('Certification added successfully!');
      }
      setIsCertModalOpen(false);
      handleRefresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save certification.');
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleDeleteCert = async (id, name) => {
    if (!window.confirm(`Delete certification "${name}"?`)) return;
    try {
      await qualificationApi.deleteCertification(id);
      setSuccess('Certification removed.');
      handleRefresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete certification.');
    }
  };

  // --- EDUCATION ACTIONS ---
  const handleOpenEduModal = (edu = null) => {
    setError('');
    if (edu) {
      setEditingEduId(edu.id);
      setEduForm({
        degree: edu.degree || '',
        degreeLevel: edu.degreeLevel || 'BACHELOR',
        fieldOfStudy: edu.fieldOfStudy || edu.field || '',
        institution: edu.institution || '',
        graduationYear: edu.graduationYear || 2022,
        gradeGpa: edu.gradeGpa || '',
      });
    } else {
      setEditingEduId(null);
      setEduForm({
        degree: '',
        degreeLevel: 'BACHELOR',
        fieldOfStudy: '',
        institution: '',
        graduationYear: 2022,
        gradeGpa: '',
      });
    }
    setIsEduModalOpen(true);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!eduForm.degree || !eduForm.fieldOfStudy || !eduForm.institution || !eduForm.graduationYear) {
      setError('Degree, Field of Study, Institution, and Graduation Year are required.');
      return;
    }

    try {
      setSubmittingEdu(true);
      const payload = {
        degree: eduForm.degree,
        degreeLevel: eduForm.degreeLevel,
        fieldOfStudy: eduForm.fieldOfStudy,
        institution: eduForm.institution,
        graduationYear: parseInt(eduForm.graduationYear, 10),
        gradeGpa: eduForm.gradeGpa,
      };

      if (editingEduId) {
        await qualificationApi.updateEducation(editingEduId, payload);
        setSuccess('Education record updated successfully!');
      } else {
        await qualificationApi.addEducation(payload);
        setSuccess('Education record added successfully!');
      }

      setIsEduModalOpen(false);
      handleRefresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save education record.');
    } finally {
      setSubmittingEdu(false);
    }
  };

  const handleDeleteEdu = async (id, degree) => {
    if (!window.confirm(`Delete education record "${degree}"?`)) return;
    try {
      await qualificationApi.deleteEducation(id);
      setSuccess('Education record deleted.');
      handleRefresh();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete education record.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Qualifications & Credentials</h1>
        <p>Formal academic education and professional certifications factored into matching compatibility.</p>
      </div>

      {error && (
        <div style={{
          padding: '0.75rem 1rem',
          borderRadius: 'var(--radius-md)',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#f87171',
          fontSize: '0.85rem',
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
          fontSize: '0.85rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem'
        }}>
          <CheckCircle2 size={18} />
          <span>{success}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* EDUCATION CARD */}
        <Card
          title="Formal Education"
          subtitle={`${educations.length} records`}
          action={
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => handleOpenEduModal()}>
              <Plus size={14} />
              <span>Add Education</span>
            </button>
          }
        >
          {loadingEdu ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading education records...</div>
          ) : educations.length === 0 ? (
            <div className="empty-state">
              <GraduationCap size={32} />
              <h3>No education records</h3>
              <p>Add your degrees or upload a resume to populate your academic credentials.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {educations.map((edu) => (
                <div
                  key={edu.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                      <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)' }}>{edu.degree}</h4>
                      <Badge variant="indigo">{edu.degreeLevel || 'BACHELOR'}</Badge>
                    </div>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{edu.fieldOfStudy || edu.field}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      {edu.institution} &bull; Class of {edu.graduationYear}
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => handleOpenEduModal(edu)}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem', color: '#f87171' }}
                      onClick={() => handleDeleteEdu(edu.id, edu.degree)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* CERTIFICATIONS CARD */}
        <Card
          title="Professional Certifications"
          subtitle={`${certifications.length} active credentials`}
          action={
            <button className="btn btn-secondary" style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }} onClick={() => handleOpenCertModal()}>
              <Plus size={14} />
              <span>Add Certification</span>
            </button>
          }
        >
          {loadingCerts ? (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading certifications...</div>
          ) : certifications.length === 0 ? (
            <div className="empty-state">
              <Award size={32} />
              <h3>No certifications recorded</h3>
              <p>Add industry certifications (e.g. AWS, CKA, Oracle) to boost your certification match points.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {certifications.map((cert) => (
                <div
                  key={cert.id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--bg-surface)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    gap: '0.75rem'
                  }}
                >
                  <div>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.25rem' }}>
                      {cert.name}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{cert.issuingOrganization}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Issued: {cert.issueDate} {cert.expiryDate ? `| Expires: ${cert.expiryDate}` : '| Never expires'}
                    </p>
                    {cert.credentialId && (
                      <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                        ID: {cert.credentialId}
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', gap: '0.35rem' }}>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem' }}
                      onClick={() => handleOpenCertModal(cert)}
                    >
                      <Edit3 size={13} />
                    </button>
                    <button
                      className="btn btn-secondary"
                      style={{ padding: '0.25rem 0.45rem', fontSize: '0.75rem', color: '#f87171' }}
                      onClick={() => handleDeleteCert(cert.id, cert.name)}
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* CERTIFICATION MODAL */}
      <Modal isOpen={isCertModalOpen} onClose={() => setIsCertModalOpen(false)} title={editingCertId ? 'Edit Certification' : 'Add Certification'}>
        <form onSubmit={handleCertSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Certification Name *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. AWS Certified Solutions Architect Associate"
              value={certForm.name}
              onChange={(e) => setCertForm({ ...certForm, name: e.target.value })}
            />
          </div>
          <div>
            <label className="form-label">Issuing Organization *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. Amazon Web Services"
              value={certForm.issuingOrganization}
              onChange={(e) => setCertForm({ ...certForm, issuingOrganization: e.target.value })}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Issue Date *</label>
              <input
                type="date"
                className="form-input"
                required
                value={certForm.issueDate}
                onChange={(e) => setCertForm({ ...certForm, issueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Expiry Date (Leave blank if permanent)</label>
              <input
                type="date"
                className="form-input"
                value={certForm.expiryDate}
                onChange={(e) => setCertForm({ ...certForm, expiryDate: e.target.value })}
              />
            </div>
          </div>
          <div>
            <label className="form-label">Credential ID / License Key (Optional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. AWS-12345678"
              value={certForm.credentialId}
              onChange={(e) => setCertForm({ ...certForm, credentialId: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCertModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submittingCert}>
              {submittingCert ? 'Saving...' : 'Save Certification'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDUCATION MODAL */}
      <Modal isOpen={isEduModalOpen} onClose={() => setIsEduModalOpen(false)} title={editingEduId ? 'Edit Education Record' : 'Add Education Record'}>
        <form onSubmit={handleEduSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Degree Level (Hierarchy Classification) *</label>
              <select
                className="form-input"
                value={eduForm.degreeLevel}
                onChange={(e) => setEduForm({ ...eduForm, degreeLevel: e.target.value })}
              >
                <option value="BACHELOR">Bachelor's Degree</option>
                <option value="MASTER">Master's Degree / MBA</option>
                <option value="DOCTORATE">Doctorate / PhD</option>
                <option value="DIPLOMA">Associate / Diploma</option>
                <option value="OTHER">Other Qualification</option>
              </select>
            </div>
            <div>
              <label className="form-label">Degree Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. B.Tech in Computer Science"
                value={eduForm.degree}
                onChange={(e) => setEduForm({ ...eduForm, degree: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Field of Study *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Computer Science & Engineering"
                value={eduForm.fieldOfStudy}
                onChange={(e) => setEduForm({ ...eduForm, fieldOfStudy: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Graduation Year *</label>
              <input
                type="number"
                min="1950"
                max="2035"
                className="form-input"
                required
                value={eduForm.graduationYear}
                onChange={(e) => setEduForm({ ...eduForm, graduationYear: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">University / Institution *</label>
            <input
              type="text"
              className="form-input"
              required
              placeholder="e.g. University of California, Berkeley"
              value={eduForm.institution}
              onChange={(e) => setEduForm({ ...eduForm, institution: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Grade / GPA / Honors</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 3.8 / 4.0 or First Class with Distinction"
              value={eduForm.gradeGpa}
              onChange={(e) => setEduForm({ ...eduForm, gradeGpa: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEduModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submittingEdu}>
              {submittingEdu ? 'Saving...' : 'Save Education'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
