import { useState, useEffect } from 'react';
import { Save, AlertCircle, CheckCircle2, User, Calendar, MapPin, Phone, Briefcase, Award } from 'lucide-react';
import Card from '../../components/ui/Card';
import employeeApi from '../../api/employeeApi';

export default function EmployeeProfilePage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    department: '',
    designation: '',
    primaryDomain: 'Backend Development',
    totalExperienceYears: 0,
    dateOfBirth: '',
    phone: '',
    location: '',
    summary: '',
  });

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
          setForm({
            name: data.name || '',
            email: data.email || '',
            department: data.department || '',
            designation: data.designation || '',
            primaryDomain: data.primaryDomain || 'Backend Development',
            totalExperienceYears: data.totalExperienceYears ?? data.experience ?? 0,
            dateOfBirth: data.dateOfBirth || '',
            phone: data.phone || '',
            location: data.location || '',
            summary: data.summary || '',
          });
        }
      } catch (err) {
        if (err?.response?.status !== 404 && isMounted) {
          setError(err?.response?.data?.message || err.message || 'Failed to load profile details.');
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

    try {
      setSaving(true);
      const updated = await employeeApi.createProfile({
        department: form.department,
        designation: form.designation,
        primaryDomain: form.primaryDomain,
        totalExperienceYears: parseFloat(form.totalExperienceYears) || 0,
        experience: parseFloat(form.totalExperienceYears) || 0,
        dateOfBirth: form.dateOfBirth,
        phone: form.phone,
        location: form.location,
        summary: form.summary,
      });

      if (updated) {
        setForm((prev) => ({
          ...prev,
          department: updated.department || prev.department,
          designation: updated.designation || prev.designation,
          primaryDomain: updated.primaryDomain || prev.primaryDomain,
          totalExperienceYears: updated.totalExperienceYears ?? updated.experience ?? prev.totalExperienceYears,
          dateOfBirth: updated.dateOfBirth || prev.dateOfBirth,
          phone: updated.phone || prev.phone,
          location: updated.location || prev.location,
          summary: updated.summary || prev.summary,
        }));
      }
      setSuccess('Profile updated successfully!');
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to save profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>Professional Employee Profile</h1>
        <p>Manage your professional identity, contact details, domain specialization, and background.</p>
      </div>

      <Card title="Personal & Professional Record" subtitle="Accurate domain, role, and experience ensure precision matching with engineering projects">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>
            Loading employee profile...
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {error && (
              <div style={{
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'rgba(239, 68, 68, 0.15)',
                border: '1px solid rgba(239, 68, 68, 0.3)',
                color: '#f87171',
                fontSize: '0.875rem',
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
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                <CheckCircle2 size={18} />
                <span>{success}</span>
              </div>
            )}

            {/* Readonly Account Header */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1rem',
              padding: '1rem',
              background: 'var(--bg-surface)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border-color)',
              marginBottom: '0.5rem'
            }}>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Full Name</span>
                <p style={{ fontWeight: 600, color: 'var(--text-main)', marginTop: '0.2rem' }}>{form.name || 'Employee'}</p>
              </div>
              <div>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase' }}>Email (Corporate)</span>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>{form.email}</p>
              </div>
            </div>

            {/* Role & Experience */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="emp-designation">Designation / Current Role *</label>
                <div style={{ position: 'relative' }}>
                  <input
                    id="emp-designation"
                    type="text"
                    className="form-input"
                    placeholder="e.g. Senior Java Backend Engineer"
                    value={form.designation}
                    onChange={(e) => setForm({ ...form, designation: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emp-department">Department *</label>
                <input
                  id="emp-department"
                  type="text"
                  className="form-input"
                  placeholder="e.g. Enterprise Cloud Solutions"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Domain & Total Experience */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="emp-domain">Primary Technical Domain *</label>
                <select
                  id="emp-domain"
                  className="form-input"
                  value={form.primaryDomain}
                  onChange={(e) => setForm({ ...form, primaryDomain: e.target.value })}
                  required
                >
                  <option value="Backend Development">Backend Development</option>
                  <option value="Frontend Development">Frontend Development</option>
                  <option value="Full Stack Development">Full Stack Development</option>
                  <option value="Cloud Computing">Cloud Computing</option>
                  <option value="DevOps & SRE">DevOps & SRE</option>
                  <option value="Data Engineering">Data Engineering</option>
                  <option value="AI & Machine Learning">AI & Machine Learning</option>
                  <option value="Cybersecurity">Cybersecurity</option>
                  <option value="Mobile Development">Mobile Development</option>
                  <option value="Quality Assurance">Quality Assurance</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emp-experience">Total Experience (Years) *</label>
                <input
                  id="emp-experience"
                  type="number"
                  step="0.5"
                  min="0"
                  className="form-input"
                  placeholder="e.g. 4.5"
                  value={form.totalExperienceYears}
                  onChange={(e) => setForm({ ...form, totalExperienceYears: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Date of Birth & Phone */}
            <div className="grid grid-cols-2">
              <div className="form-group">
                <label className="form-label" htmlFor="emp-dob">
                  Date of Birth (Profile Record)
                </label>
                <input
                  id="emp-dob"
                  type="date"
                  className="form-input"
                  value={form.dateOfBirth}
                  onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })}
                />
                <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', marginTop: '0.25rem', display: 'block' }}>
                  ℹ️ Standard profile information. Not factored into matching score or algorithms.
                </span>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="emp-phone">Phone Number</label>
                <input
                  id="emp-phone"
                  type="text"
                  className="form-input"
                  placeholder="+1 (555) 234-5678"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                />
              </div>
            </div>

            {/* Location & Summary */}
            <div className="form-group">
              <label className="form-label" htmlFor="emp-location">Location / Office Hub</label>
              <input
                id="emp-location"
                type="text"
                className="form-input"
                placeholder="e.g. New York, USA or Remote"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="emp-summary">Professional Bio / Summary</label>
              <textarea
                id="emp-summary"
                rows="4"
                className="form-input"
                style={{ resize: 'vertical' }}
                placeholder="Summary of your technical expertise, architectural experience, and project strengths..."
                value={form.summary}
                onChange={(e) => setForm({ ...form, summary: e.target.value })}
              />
            </div>

            <div style={{ marginTop: '0.5rem', display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>
                <Save size={18} />
                <span>{saving ? 'Saving...' : 'Save Profile Changes'}</span>
              </button>
            </div>
          </form>
        )}
      </Card>
    </div>
  );
}
