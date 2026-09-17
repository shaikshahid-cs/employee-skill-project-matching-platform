import { useState, useEffect } from 'react';
import { Plus, Inbox, AlertCircle, CheckCircle, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import SkillAutocomplete from '../../components/SkillAutocomplete';
import employeeSkillApi from '../../api/employeeSkillApi';

export default function EmployeeSkillsPage() {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSkillName, setSelectedSkillName] = useState('');
  const [proficiency, setProficiency] = useState(5);
  const [yearsExperience, setYearsExperience] = useState(1);
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
        if (isMounted) setError(err.message || 'Failed to load skills list.');
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
      setModalError('Please search and select a skill name.');
      return;
    }

    try {
      setSubmitting(true);
      await employeeSkillApi.addSkill({
        skillName: selectedSkillName.trim(),
        proficiency: parseInt(proficiency, 10),
        yearsExperience: parseFloat(yearsExperience),
      });

      setSuccess(`Skill "${selectedSkillName}" added successfully!`);
      setIsModalOpen(false);
      setSelectedSkillName('');
      setProficiency(5);
      setYearsExperience(1);
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setModalError(err.message || 'Failed to add skill.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>My Skills Matrix</h1>
          <p>Add technical and domain skills to calculate project match compatibility.</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setIsModalOpen(true); setModalError(''); }}>
          <Plus size={18} />
          <span>Add Skill</span>
        </button>
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

      <Card title="Recorded Skills" subtitle="Skills attached to your profile">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading recorded skills...</div>
        ) : skills.length === 0 ? (
          <div className="empty-state">
            <Inbox size={36} />
            <h3>No skills recorded</h3>
            <p>Click "Add Skill" above or upload a resume to extract your skills matrix automatically.</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Skill Name</th>
                  <th>Proficiency Level</th>
                  <th>Years of Experience</th>
                </tr>
              </thead>
              <tbody>
                {skills.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Award size={16} style={{ color: 'var(--primary)' }} />
                      <span>{item.skillName}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{ flex: 1, height: '6px', backgroundColor: 'var(--bg-surface-hover)', borderRadius: '3px', overflow: 'hidden', maxWidth: '120px' }}>
                          <div style={{ width: `${(item.proficiency / 10) * 100}%`, height: '100%', background: 'var(--primary-gradient)' }} />
                        </div>
                        <Badge variant="indigo">{item.proficiency} / 10</Badge>
                      </div>
                    </td>
                    <td>{item.yearsExperience} {item.yearsExperience === 1 ? 'year' : 'years'}</td>
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
            <div style={{ padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', color: 'var(--error)', fontSize: '0.85rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertCircle size={18} />
              <span>{modalError}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Search Skill Catalogue</label>
            <SkillAutocomplete
              value={selectedSkillName}
              onChange={(val) => setSelectedSkillName(val)}
              onSelectSkill={(skill) => setSelectedSkillName(skill.name)}
              placeholder="Search catalog (e.g. Java, React, Docker)..."
            />
          </div>

          <div className="form-group">
            <label className="form-label">Proficiency Level (1 - 10): {proficiency}</label>
            <input
              type="range"
              min="1"
              max="10"
              value={proficiency}
              onChange={(e) => setProficiency(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--primary)' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)' }}>
              <span>1 (Beginner)</span>
              <span>5 (Intermediate)</span>
              <span>10 (Expert)</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="skill-exp">Years of Experience</label>
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
              {submitting ? 'Adding...' : 'Add Skill'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
