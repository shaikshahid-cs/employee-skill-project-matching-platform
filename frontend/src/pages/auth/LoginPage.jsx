import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LogIn, AlertCircle } from 'lucide-react';
import { useAuth } from '../../context/useAuth';
import authApi from '../../api/authApi';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    try {
      setSubmitting(true);
      const response = await authApi.login({ email, password });
      const userData = login(response);

      // Role-based post-login redirection
      if (userData.role === 'EMPLOYEE') {
        navigate('/employee/dashboard', { replace: true });
      } else if (userData.role === 'MANAGER') {
        navigate('/manager/dashboard', { replace: true });
      } else if (userData.role === 'ADMIN') {
        navigate('/admin/dashboard', { replace: true });
      } else {
        navigate('/', { replace: true });
      }
    } catch (err) {
      setError(err.message || 'Failed to sign in. Please check your credentials.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Sign in to your account</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
          Enter your credentials to access the platform
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

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label" htmlFor="login-email">Email Address</label>
          <input
            id="login-email"
            type="email"
            className="form-input"
            placeholder="user@organization.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label className="form-label" htmlFor="login-password">Password</label>
          <input
            id="login-password"
            type="password"
            className="form-input"
            placeholder="••••••••"
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
          <LogIn size={18} />
          <span>{submitting ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>

      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>
          Enterprise Account Notice: All user accounts are centrally provisioned by System Administrators. Contact your administrator if you need access.
        </p>
      </div>
    </div>
  );
}
