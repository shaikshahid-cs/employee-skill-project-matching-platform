import { useState, useEffect } from 'react';
import { Plus, Briefcase, Calendar, AlertCircle, CheckCircle2, Trash2, Edit3, MapPin } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import { experienceApi } from '../../api/qualificationApi';

export default function EmployeeExperiencePage() {
  const [experiences, setExperiences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const [form, setForm] = useState({
    company: '',
    roleTitle: '',
    domain: 'Backend Development',
    startDate: '',
    endDate: '',
    current: false,
    technologiesUsed: '',
    responsibilitiesSummary: '',
  });

  const fetchExperiences = async () => {
    try {
      setLoading(true);
      const data = await experienceApi.getExperiences();
      setExperiences(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to load experience history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExperiences();
  }, []);

  const handleOpenAddModal = () => {
    setEditingId(null);
    setForm({
      company: '',
      roleTitle: '',
      domain: 'Backend Development',
      startDate: '',
      endDate: '',
      current: false,
      technologiesUsed: '',
      responsibilitiesSummary: '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (exp) => {
    setEditingId(exp.id);
    setForm({
      company: exp.company || '',
      roleTitle: exp.roleTitle || '',
      domain: exp.domain || 'Backend Development',
      startDate: exp.startDate || '',
      endDate: exp.endDate || '',
      current: Boolean(exp.current),
      technologiesUsed: exp.technologiesUsed || '',
      responsibilitiesSummary: exp.responsibilitiesSummary || '',
    });
    setModalError('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!form.company.trim() || !form.roleTitle.trim() || !form.startDate.trim()) {
      setModalError('Please fill in Company, Role Title, and Start Date.');
      return;
    }

    try {
      setSubmitting(true);
      if (editingId) {
        await experienceApi.updateExperience(editingId, form);
        setSuccess('Work experience record updated.');
      } else {
        await experienceApi.addExperience(form);
        setSuccess('Work experience record added.');
      }
      setIsModalOpen(false);
      fetchExperiences();
    } catch (err) {
      setModalError(err?.response?.data?.message || err.message || 'Failed to save experience.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id, company) => {
    if (!window.confirm(`Delete experience record at "${company}"?`)) return;
    try {
      setError('');
      await experienceApi.deleteExperience(id);
      setSuccess('Experience record deleted.');
      fetchExperiences();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete record.');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Work Experience & History</h1>
          <p>Record your past engineering roles, domain history, and technologies used.</p>
        </div>
        <button className="btn btn-primary" onClick={handleOpenAddModal}>
          <Plus size={18} />
          <span>Add Experience</span>
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

      <Card title="Career Timeline" subtitle={`${experiences.length} positions recorded`}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading career history...</div>
        ) : experiences.length === 0 ? (
          <div className="empty-state">
            <Briefcase size={36} />
            <h3>No experience records</h3>
            <p>Add your employment history or import from your resume to enhance domain and role matching scores.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {experiences.map((exp) => (
              <div
                key={exp.id}
                style={{
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--bg-surface)',
                  border: '1px solid var(--border-color)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '260px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{exp.roleTitle}</h3>
                    <span style={{ color: 'var(--text-dim)' }}>at</span>
                    <strong style={{ color: 'var(--primary)' }}>{exp.company}</strong>
                    {exp.current && <Badge variant="emerald">Current Role</Badge>}
                    {exp.domain && <Badge variant="indigo">{exp.domain}</Badge>}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--text-dim)', fontSize: '0.825rem', marginBottom: '0.75rem' }}>
                    <Calendar size={14} />
                    <span>{exp.startDate} – {exp.current ? 'Present' : (exp.endDate || 'N/A')}</span>
                  </div>

                  {exp.technologiesUsed && (
                    <div style={{ marginBottom: '0.5rem', fontSize: '0.85rem' }}>
                      <span style={{ color: 'var(--text-dim)' }}>Tech Stack: </span>
                      <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{exp.technologiesUsed}</span>
                    </div>
                  )}

                  {exp.responsibilitiesSummary && (
                    <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {exp.responsibilitiesSummary}
                    </p>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    className="btn btn-secondary"
                    title="Edit Record"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem' }}
                    onClick={() => handleOpenEditModal(exp)}
                  >
                    <Edit3 size={14} />
                  </button>
                  <button
                    className="btn btn-secondary"
                    title="Delete Record"
                    style={{ padding: '0.35rem 0.5rem', fontSize: '0.8rem', color: '#f87171' }}
                    onClick={() => handleDelete(exp.id, exp.company)}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Add / Edit Experience Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Edit Experience Record' : 'Add Work Experience'}>
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {modalError && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem'
            }}>
              {modalError}
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Company / Organization *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Acme Corp"
                value={form.company}
                onChange={(e) => setForm({ ...form, company: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Role Title *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. Senior Backend Engineer"
                value={form.roleTitle}
                onChange={(e) => setForm({ ...form, roleTitle: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Technical Domain</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Cloud Architecture, Backend"
                value={form.domain}
                onChange={(e) => setForm({ ...form, domain: e.target.value })}
              />
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1.75rem' }}>
              <input
                type="checkbox"
                id="is-current"
                checked={form.current}
                onChange={(e) => setForm({ ...form, current: e.target.checked })}
              />
              <label htmlFor="is-current" style={{ fontSize: '0.9rem', color: 'var(--text-main)', cursor: 'pointer' }}>
                I currently work here
              </label>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Start Date *</label>
              <input
                type="text"
                className="form-input"
                required
                placeholder="e.g. 2021-06 or 2021"
                value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">End Date</label>
              <input
                type="text"
                className="form-input"
                disabled={form.current}
                placeholder={form.current ? 'Present' : 'e.g. 2023-12'}
                value={form.current ? '' : form.endDate}
                onChange={(e) => setForm({ ...form, endDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="form-label">Technologies & Frameworks Used</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Java 21, Spring Boot, MySQL, Docker, Kubernetes"
              value={form.technologiesUsed}
              onChange={(e) => setForm({ ...form, technologiesUsed: e.target.value })}
            />
          </div>

          <div>
            <label className="form-label">Responsibilities & Impact Summary</label>
            <textarea
              rows="3"
              className="form-input"
              placeholder="Key accomplishments, microservices delivered, systems scaled..."
              value={form.responsibilitiesSummary}
              onChange={(e) => setForm({ ...form, responsibilitiesSummary: e.target.value })}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Saving...' : (editingId ? 'Update Record' : 'Save Experience')}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
