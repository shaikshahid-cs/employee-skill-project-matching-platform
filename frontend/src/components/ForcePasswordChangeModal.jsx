import { useState } from 'react';
import { useAuth } from '../context/useAuth';
import authApi from '../api/authApi';

export default function ForcePasswordChangeModal() {
  const { user, updateUser, logout } = useAuth();
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!user || !user.mustChangePassword) {
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!oldPassword) {
      setError('Please enter your temporary password provided by Administrator.');
      return;
    }

    if (!newPassword || newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (newPassword === oldPassword) {
      setError('New password must be different from current password.');
      return;
    }

    try {
      setLoading(true);
      await authApi.changePassword({ currentPassword: oldPassword, oldPassword, newPassword });
      updateUser({ mustChangePassword: false });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Failed to update password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      backgroundColor: 'rgba(5, 10, 25, 0.85)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 9999,
      padding: '1.5rem'
    }}>
      <div className="glass-card" style={{
        maxWidth: '480px',
        width: '100%',
        padding: '2.5rem',
        borderRadius: '16px',
        border: '1px solid rgba(239, 68, 68, 0.4)',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5), 0 0 30px rgba(239, 68, 68, 0.2)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'rgba(239, 68, 68, 0.15)',
            color: '#ef4444',
            fontSize: '1.8rem',
            marginBottom: '1rem'
          }}>
            🔒
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '700', marginBottom: '0.5rem', color: '#fff' }}>
            Password Reset Required
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
            Welcome, <strong>{user.name}</strong>! Your account was provisioned by an administrator with a temporary password. You must set a new permanent password to continue.
          </p>
        </div>

        {error && (
          <div style={{
            backgroundColor: 'rgba(239, 68, 68, 0.12)',
            border: '1px solid rgba(239, 68, 68, 0.4)',
            color: '#fca5a5',
            padding: '0.75rem 1rem',
            borderRadius: '8px',
            fontSize: '0.875rem',
            marginBottom: '1.25rem'
          }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Current (Temporary) Password
            </label>
            <input
              type="password"
              className="input-field"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              placeholder="Enter initial password"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              New Permanent Password
            </label>
            <input
              type="password"
              className="input-field"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="At least 6 characters"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.825rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Confirm New Password
            </label>
            <input
              type="password"
              className="input-field"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Re-enter new password"
              required
              style={{ width: '100%' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              type="button"
              onClick={logout}
              className="btn btn-secondary"
              style={{ flex: 1 }}
            >
              Sign Out
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary"
              style={{ flex: 2 }}
            >
              {loading ? 'Updating...' : 'Set Password & Continue'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
