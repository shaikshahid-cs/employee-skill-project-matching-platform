import { useState, useEffect } from 'react';
import { GraduationCap, Award, Plus, Trash2, Edit3, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
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
  const [certName, setCertName] = useState('');
  const [certOrg, setCertOrg] = useState('');
  const [certIssue, setCertIssue] = useState('');
  const [certExpiry, setCertExpiry] = useState('');
  const [submittingCert, setSubmittingCert] = useState(false);

  // Edu Modal State
  const [isEduModalOpen, setIsEduModalOpen] = useState(false);
  const [editingEduId, setEditingEduId] = useState(null);
  const [eduDegree, setEduDegree] = useState('');
  const [eduField, setEduField] = useState('');
  const [eduInst, setEduInst] = useState('');
  const [eduYear, setEduYear] = useState('');
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
      setCertName(cert.name || '');
      setCertOrg(cert.issuingOrganization || '');
      setCertIssue(cert.issueDate || '');
      setCertExpiry(cert.expiryDate || '');
    } else {
      setEditingCertId(null);
      setCertName('');
      setCertOrg('');
      setCertIssue('');
      setCertExpiry('');
    }
    setIsCertModalOpen(true);
  };

  const handleCertSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!certName || !certOrg || !certIssue) {
      setError('Name, Organization, and Issue Date are required.');
      return;
    }

    try {
      setSubmittingCert(true);
      const payload = {
        name: certName,
        issuingOrganization: certOrg,
        issueDate: certIssue,
        expiryDate: certExpiry || null,
      };

      if (editingCertId) {
        await qualificationApi.updateCertification(editingCertId, payload);
        setSuccess('Certification updated successfully!');
      } else {
        await qualificationApi.addCertification(payload);
        setSuccess('Certification added successfully!');
      }

      setIsCertModalOpen(false);
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to save certification.');
    } finally {
      setSubmittingCert(false);
    }
  };

  const handleDeleteCert = async (id) => {
    if (!window.confirm('Delete this certification?')) return;
    try {
      await qualificationApi.deleteCertification(id);
      setSuccess('Certification deleted.');
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete certification.');
    }
  };

  // --- EDUCATION ACTIONS ---
  const handleOpenEduModal = (edu = null) => {
    setError('');
    if (edu) {
      setEditingEduId(edu.id);
      setEduDegree(edu.degree || '');
      setEduField(edu.field || '');
      setEduInst(edu.institution || '');
      setEduYear(edu.graduationYear ? String(edu.graduationYear) : '');
    } else {
      setEditingEduId(null);
      setEduDegree('');
      setEduField('');
      setEduInst('');
      setEduYear('');
    }
    setIsEduModalOpen(true);
  };

  const handleEduSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!eduDegree || !eduField || !eduInst || !eduYear) {
      setError('Degree, Field, Institution, and Graduation Year are required.');
      return;
    }

    const yearVal = parseInt(eduYear, 10);
    if (isNaN(yearVal) || yearVal < 1900 || yearVal > 2100) {
      setError('Graduation year must be between 1900 and 2100.');
      return;
    }

    try {
      setSubmittingEdu(true);
      const payload = {
        degree: eduDegree,
        field: eduField,
        institution: eduInst,
        graduationYear: yearVal,
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
      setError(err.message || 'Failed to save education record.');
    } finally {
      setSubmittingEdu(false);
    }
  };

  const handleDeleteEdu = async (id) => {
    if (!window.confirm('Delete this education record?')) return;
    try {
      await qualificationApi.deleteEducation(id);
      setSuccess('Education record deleted.');
      handleRefresh();
    } catch (err) {
      setError(err.message || 'Failed to delete education record.');
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Qualifications & Credentials</h1>
        <p>Manage your formal education background and professional certifications.</p>
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

      <div className="grid grid-cols-2">
        {/* CERTIFICATIONS CARD */}
        <Card
          title="Certifications"
          subtitle="Professional certificates & achievements"
          action={
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleOpenCertModal(null)}>
              <Plus size={16} /> Add Cert
            </button>
          }
        >
          {loadingCerts ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading certifications...</div>
          ) : certifications.length === 0 ? (
            <div className="empty-state">
              <Award size={36} />
              <h3>No certifications added</h3>
              <p>Add industry certifications to boost your candidate match weight.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {certifications.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>{item.name}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.issuingOrganization}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
                      Issued: {item.issueDate} {item.expiryDate ? `| Expires: ${item.expiryDate}` : ''}
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => handleOpenCertModal(item)} title="Edit">
                      <Edit3 size={15} />
                    </button>
                    <button className="btn-danger" style={{ padding: '0.35rem' }} onClick={() => handleDeleteCert(item.id)} title="Delete">
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* EDUCATION CARD */}
        <Card
          title="Education History"
          subtitle="Academic degrees & institutions"
          action={
            <button className="btn btn-secondary" style={{ padding: '0.4rem 0.75rem', fontSize: '0.8rem' }} onClick={() => handleOpenEduModal(null)}>
              <Plus size={16} /> Add Education
            </button>
          }
        >
          {loadingEdu ? (
            <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading education records...</div>
          ) : educations.length === 0 ? (
            <div className="empty-state">
              <GraduationCap size={36} />
              <h3>No education history recorded</h3>
              <p>Add your degrees and fields of study.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {educations.map((item) => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                  <div>
                    <h4 style={{ fontSize: '0.95rem', color: 'var(--text-main)', fontWeight: 600 }}>{item.degree} in {item.field}</h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.institution}</p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Graduation Year: {item.graduationYear}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button className="btn-secondary" style={{ padding: '0.35rem' }} onClick={() => handleOpenEduModal(item)} title="Edit">
                      <Edit3 size={15} />
                    </button>
                    <button className="btn-danger" style={{ padding: '0.35rem' }} onClick={() => handleDeleteEdu(item.id)} title="Delete">
                      <Trash2 size={15} />
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
        <form onSubmit={handleCertSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="cert-name">Certification Name</label>
            <input id="cert-name" type="text" className="form-input" placeholder="e.g. AWS Certified Solutions Architect" value={certName} onChange={(e) => setCertName(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="cert-org">Issuing Organization</label>
            <input id="cert-org" type="text" className="form-input" placeholder="e.g. Amazon Web Services" value={certOrg} onChange={(e) => setCertOrg(e.target.value)} />
          </div>
          <div className="grid grid-cols-2">
            <div className="form-group">
              <label className="form-label" htmlFor="cert-issue">Issue Date</label>
              <input id="cert-issue" type="date" className="form-input" value={certIssue} onChange={(e) => setCertIssue(e.target.value)} />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="cert-expiry">Expiry Date (Optional)</label>
              <input id="cert-expiry" type="date" className="form-input" value={certExpiry} onChange={(e) => setCertExpiry(e.target.value)} />
            </div>
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsCertModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submittingCert}>
              {submittingCert ? 'Saving...' : 'Save Certification'}
            </button>
          </div>
        </form>
      </Modal>

      {/* EDUCATION MODAL */}
      <Modal isOpen={isEduModalOpen} onClose={() => setIsEduModalOpen(false)} title={editingEduId ? 'Edit Education' : 'Add Education'}>
        <form onSubmit={handleEduSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-degree">Degree</label>
            <input id="edu-degree" type="text" className="form-input" placeholder="e.g. Bachelor of Science / B.Tech" value={eduDegree} onChange={(e) => setEduDegree(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-field">Field of Study</label>
            <input id="edu-field" type="text" className="form-input" placeholder="e.g. Computer Science" value={eduField} onChange={(e) => setEduField(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-inst">Institution</label>
            <input id="edu-inst" type="text" className="form-input" placeholder="e.g. Stanford University" value={eduInst} onChange={(e) => setEduInst(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="edu-year">Graduation Year</label>
            <input id="edu-year" type="number" min="1900" max="2100" className="form-input" placeholder="e.g. 2023" value={eduYear} onChange={(e) => setEduYear(e.target.value)} />
          </div>
          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
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
