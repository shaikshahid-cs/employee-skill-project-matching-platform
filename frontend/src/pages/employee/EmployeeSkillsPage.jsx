import { useState, useEffect } from 'react';
import { Plus, Inbox, AlertCircle, CheckCircle2, Award, Trash2 } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import SkillAutocomplete from '../../components/SkillAutocomplete';
import employeeSkillApi from '../../api/employeeSkillApi';

const PROFICIENCY_LABELS = {
  1: '1 - Novice (Fundamental Concepts)',
  2: '2 - Elementary (Basic Practical Experience)',
  3: '3 - Competent (Solid Independent Delivery)',
  4: '4 - Advanced (Deep Knowledge & Best Practices)',
  5: '5 - Expert (Mastery & Architectural Authority)'
};

export default function EmployeeSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [proficiency, setProficiency] = useState(3);
  const [yearsExperience, setYearsExperience] = useState(2);
  const [submitting, setSubmitting] = useState(false);
  const [modalError, setModalError] = useState('');

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    let isMounted = true;
    const fetchSkillsData = async () => {
      try {
        setLoading(true);
        const data = await employeeSkillApi.getSkills();
        if (isMounted) {
          setSkills(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) setError(err?.response?.data?.message || err.message || 'Failed to load skills list.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchSkillsData();
    return () => { isMounted = false; };
  }, [refreshTrigger]);

  const handleAddSkillSubmit = async (e) => {
    e.preventDefault();
    setModalError('');

    if (!selectedSkillName.trim()) {
      setModalError('Please search or type a skill name.');
      return;
    }

    try {
      setSubmitting(true);
      await employeeSkillApi.addSkill({
        skillName: selectedSkillName.trim(),
        proficiency: parseInt(proficiency, 10),
        yearsExperience: parseFloat(yearsExperience) || 0,
      });

      setSuccess(`Skill "${selectedSkillName.trim()}" added to your profile.`);
      setIsModalOpen(false);
      setSelectedSkillName('');
      setProficiency(3);
      setYearsExperience(2);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setModalError(err?.response?.data?.message || err.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteSkill = async (skillItem) => {
    if (!window.confirm(`Are you sure you want to remove "${skillItem.skillName}" from your profile?`)) {
      return;
    }
    try {
      setError('');
      await employeeSkillApi.deleteSkill(skillItem.id);
      setSuccess(`Skill "${skillItem.skillName}" removed.`);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to remove skill.');
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>Technical Skills Inventory</h1>
          <p>Add technical languages, frameworks, databases, and tools to match against project skill requirements.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setIsModalOpen(true); setModalError(''); }}>
          <Plus size={18} />
          <span>Add Skill</span>
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

      <Card title="My Skills Matrix" subtitle={`Showing ${skills.length} verified technical skills`}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading recorded skills...</div>
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <Inbox size={36} />
            <h3>No skills recorded</h3>
            <p>Click "Add Skill" above or upload your resume to extract and verify your skills automatically.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Proficiency Level (1 - 5)</th>
                  <th>Experience</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Award size={16} style={{ color: 'var(--primary)' }} />
                        <span>{item.skillName}</span>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden', maxWidth: '100px' }}>
                          <div style={{ width: `${(item.proficiency / 5) * 100}%`, height: '100%', background: 'var(--primary-gradient)' }} />
                        </div>
                        <Badge variant="indigo">
                          Level {item.proficiency} / 5
                        </Badge>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)' }}>
                      {item.yearsExperience} {item.yearsExperience === 1 ? 'year' : 'years'}
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        title="Remove Skill"
                        style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#f87171' }}
                        onClick={() => handleDeleteSkill(item)}
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

      {/* Add Skill Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Skill to Profile">
        <form onSubmit={handleAddSkillSubmit}>
          {modalError && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}>
              {modalError}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Search or Enter Skill Name *</label>
            <SkillAutocomplete
              value={selectedSkillName}
              onChange={(val) => setSelectedSkillName(val)}
              onSelectSkill={(skill) => setSelectedSkillName(skill.name)}
              placeholder="e.g. Java, Python, React, Kubernetes, AWS..."
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>
              Recognizes aliases (e.g. JS, K8s, Spring) or creates new skills on-the-fly.
            </span>
          </div>

          <div className="form-group">
            <label className="form-label">Proficiency Rating (1 to 5):</label>
            <select
              className="form-input"
              value={proficiency}
              onChange={(e) => setProficiency(parseInt(e.target.value, 10))}
            >
              <option value="1">{PROFICIENCY_LABELS[1]}</option>
              <option value="2">{PROFICIENCY_LABELS[2]}</option>
              <option value="3">{PROFICIENCY_LABELS[3]}</option>
              <option value="4">{PROFICIENCY_LABELS[4]}</option>
              <option value="5">{PROFICIENCY_LABELS[5]}</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill-exp">Years of Hands-on Experience</label>
            <input
              id="skill-exp"
              type="number"
              step="0.5"
              min="0"
              className="form-input"
              value={yearsExperience}
              onChange={(e) => setYearsExperience(e.target.value)}
              placeholder="e.g. 2.5"
            />
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Adding...' : 'Add to Profile'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
