import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle } from 'lucide-react';
import Card from '../../components/ui/Card';
import employeeApi from '../../api/employeeApi';

export default function EmployeeProfilePage() {
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [experience, setExperience] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const data = await employeeApi.getProfile();
        if (isMounted && data) {
          setDepartment(data.department || '');
          setDesignation(data.designation || '');
          setExperience(data.experience !== undefined ? String(data.experience) : '');
        }
      } catch (err) {
        // 404 NOT FOUND means profile not created yet, which is expected for new employees
        if (err.status !== 404 && isMounted) {
          setError(err.message || 'Failed to load profile details.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfile();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!department || !designation || experience === '') {
      setError('Please fill in all fields (Department, Designation, Experience).');
      return;
    }

    const expValue = parseFloat(experience);
    if (isNaN(expValue) || expValue < 0) {
      setError('Years of experience must be a non-negative number.');
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await employeeApi.createProfile({
        department,
        designation,
        experience: expValue,
      });

      if (updatedProfile) {
        setDepartment(updatedProfile.department || department);
        setDesignation(updatedProfile.designation || designation);
        setExperience(String(updatedProfile.experience));
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Employee Profile</h1>
        <p>Manage your professional details, department, and years of experience.</p>
      </div>

      <Card title="Personal & Professional Information" subtitle="Keep your details up to date for precise project matching">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            Loading employee profile...
          </div>
        ) : (
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

            {success && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(16, 185, 129, 0.15)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                color: 'var(--success)',
                fontSize: '0.85rem',
                marginBottom: '1.25rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle size={18} />
                <span>{success}</span>
              </div>
            )}

            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="emp-department">Department</label>
                <input
                  id="emp-department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Engineering / Product"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emp-designation">Designation / Title</label>
                <input
                  id="emp-designation"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Senior Software Engineer"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  disabled={saving}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="emp-experience">Years of Experience</label>
              <input
                id="emp-experience"
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                placeholder="e.g. 4.5"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                disabled={saving}
              />
            </div>

            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Profile'}</span>
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
