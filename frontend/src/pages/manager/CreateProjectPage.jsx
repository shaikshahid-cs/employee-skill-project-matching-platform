import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FolderPlus, AlertCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import projectApi from '../../api/projectApi';

export default function CreateProjectPage() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [experienceRequired, setExperienceRequired] = useState('');

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !description.trim() || !department.trim() || !location.trim() || experienceRequired === '') {
      setError('Please fill in all required fields.');
      return;
    }

    const expVal = parseFloat(experienceRequired);
    if (isNaN(expVal) || expVal < 0) {
      setError('Required experience must be a non-negative number.');
      return;
    }

    try {
      setSubmitting(true);
      const newProject = await projectApi.createProject({
        title: title.trim(),
        description: description.trim(),
        department: department.trim(),
        location: location.trim(),
        experienceRequired: expVal,
      });

      if (newProject && newProject.id) {
        navigate(`/manager/projects/${newProject.id}`, { replace: true });
      } else {
        navigate('/manager/projects', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to post new project requisition.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Create Project Requisition</h1>
        <p>Post a new project opportunity to find matching talent across the organization.</p>
      </div>

      <Card title="Project Details & Requirements" subtitle="Basic information for candidate matching">
        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{
              padding: '0.75rem 1rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: 'var(--error)',
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

          <div className="form-group">
            <label className="form-label" htmlFor="proj-title">Project Title</label>
            <input
              id="proj-title"
              type="text"
              className="form-input"
              placeholder="e.g. Cloud Migration & Backend Microservices"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="proj-description">Project Description & Scope</label>
            <textarea
              id="proj-description"
              className="form-textarea"
              rows={4}
              placeholder="Describe project goals, deliverables, and team context..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="grid grid-cols-3">
            <div className="form-group">
              <label className="form-label" htmlFor="proj-dept">Department</label>
              <input
                id="proj-dept"
                type="text"
                className="form-input"
                placeholder="e.g. Infrastructure / Product"
                value={department}
                onChange={(e) => setDepartment(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-loc">Location</label>
              <input
                id="proj-loc"
                type="text"
                className="form-input"
                placeholder="e.g. Remote / New York"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                disabled={submitting}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="proj-exp">Min Required Experience (Years)</label>
              <input
                id="proj-exp"
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                placeholder="e.g. 3.0"
                value={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.value)}
                disabled={submitting}
              />
            </div>
          </div>

          <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/manager/projects')}
              disabled={submitting}
            >
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <FolderPlus size={18} />
              <span>{submitting ? 'Posting Project...' : 'Post Project Requisition'}</span>
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}
