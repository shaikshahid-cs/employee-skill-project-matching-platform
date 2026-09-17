import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle, User, Mail, Shield, Briefcase, PlusCircle, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import managerApi from '../../api/managerApi';
import projectApi from '../../api/projectApi';
import { useAuth } from '../../context/useAuth';

export default function ManagerProfilePage() {
  const { user } = useAuth();
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [projectsCount, setProjectsCount] = useState(0);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let isMounted = true;
    const fetchProfileAndStats = async () => {
      try {
        setLoading(true);
        const [profileData, projectsData] = await Promise.allSettled([
          managerApi.getProfile(),
          projectApi.getMyProjects(),
        ]);

        if (isMounted) {
          if (profileData.status === 'fulfilled' && profileData.value) {
            setDepartment(profileData.value.department || '');
            setDesignation(profileData.value.designation || '');
          }
          if (projectsData.status === 'fulfilled' && Array.isArray(projectsData.value)) {
            setProjectsCount(projectsData.value.length);
          }
        }
      } catch (err) {
        if (isMounted) setError(err.message || 'Failed to load manager profile.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchProfileAndStats();
    return () => { isMounted = false; };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!department.trim() || !designation.trim()) {
      setError('Please fill in both Department and Designation.');
      return;
    }

    try {
      setSaving(true);
      const updatedProfile = await managerApi.createProfile({
        department: department.trim(),
        designation: designation.trim(),
      });

      if (updatedProfile) {
        setDepartment(updatedProfile.department || department);
        setDesignation(updatedProfile.designation || designation);
      }
      setSuccess('Manager profile saved successfully!');
    } catch (err) {
      setError(err.message || 'Failed to save manager profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Manager Profile & Portal Settings</h1>
        <p>Manage your organizational unit details, manager designation, and project requisitions.</p>
      </div>

      <div className="grid grid-cols-3" style={{ marginBottom: '1.5rem' }}>
        {/* Account Details Summary */}
        <Card title="Account Info">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary)' }}>
                <User size={20} />
              </div>
              <div>
                <h4 style={{ fontSize: '1rem', fontWeight: 600 }}>{user?.name || 'Manager'}</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Role Access</span>
              <Badge variant="indigo"><Shield size={12} style={{ marginRight: '0.2rem' }} /> MANAGER</Badge>
            </div>
          </div>
        </Card>

        {/* Managed Projects Quick Stat */}
        <Card title="Project Requisitions">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: 'var(--primary)' }}>{projectsCount}</span>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Active Project Requisitions</p>
            </div>
            <Link to="/manager/create-project" className="btn btn-primary" style={{ padding: '0.45rem 0.85rem', fontSize: '0.8rem' }}>
              <PlusCircle size={14} /> New Project
            </Link>
          </div>
        </Card>

        {/* Quick Links */}
        <Card title="Quick Management Links">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <Link to="/manager/projects" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <List size={16} /> Manage All Projects
            </Link>
            <Link to="/manager/dashboard" className="btn btn-secondary" style={{ width: '100%', justifyContent: 'flex-start', fontSize: '0.85rem' }}>
              <Briefcase size={16} /> Open Manager Dashboard
            </Link>
          </div>
        </Card>
      </div>

      <Card title="Department & Manager Credentials" subtitle="Information attached to your manager account">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading manager profile...</div>
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
                <label className="form-label" htmlFor="mgr-department">Department / Organizational Unit</label>
                <input
                  id="mgr-department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Engineering / Cloud Infrastructure"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  disabled={saving}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="mgr-designation">Managerial Title / Designation</label>
                <input
                  id="mgr-designation"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Engineering Manager / Director"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  disabled={saving}
                />
              </div>
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
