import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, AlertCircle, CheckCircle, UserCheck, Briefcase } from 'lucide-react';
import authApi from '../../api/authApi';

export default function RegisterPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!name || !email || !password || !role) {
      setError('Please fill in all fields.');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await authApi.register({ name, email, password, role });
      setSuccess('Registration successful! Redirecting to login...');

      // Redirect to login page after successful registration
      setTimeout(() => {
        navigate('/login', { replace: true });
      }, 1500);
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be registered.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Create an account</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Join the Employee Matching Platform
        </p>
      </div>

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

      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '1.25rem' }}>
          <label className="form-label">I am joining as</label>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <button
              type="button"
              onClick={() => setRole('EMPLOYEE')}
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: role === 'EMPLOYEE' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: role === 'EMPLOYEE' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                color: role === 'EMPLOYEE' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: role === 'EMPLOYEE' ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <UserCheck size={18} />
              <span>Employee</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('MANAGER')}
              disabled={submitting}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                padding: '0.75rem',
                borderRadius: 'var(--radius-md)',
                border: role === 'MANAGER' ? '2px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: role === 'MANAGER' ? 'rgba(99, 102, 241, 0.12)' : 'var(--bg-card)',
                color: role === 'MANAGER' ? 'var(--primary)' : 'var(--text-secondary)',
                fontWeight: role === 'MANAGER' ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              <Briefcase size={18} />
              <span>Manager</span>
            </button>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-name">Full Name</label>
          <input
            id="register-name"
            type="text"
            className="form-input"
            placeholder="John Doe"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-email">Email Address</label>
          <input
            id="register-email"
            type="email"
            className="form-input"
            placeholder="john.doe@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            className="form-input"
            placeholder="At least 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={submitting}
          />
        </div>

        <button
          type="submit"
          className="btn btn-primary w-full"
          style={{ marginTop: '0.5rem', padding: '0.75rem' }}
          disabled={submitting}
        >
          <UserPlus size={18} />
          <span>{submitting ? 'Creating account...' : 'Complete Registration'}</span>
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Already registered?{' '}
          <Link to="/login" style={{ fontWeight: 600 }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
