import { useState, useEffect } from 'react';
import { Search, Filter, Inbox, Eye, AlertCircle, Shield } from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import adminApi from '../../api/adminApi';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Selected User Modal State
  const [selectedUser, setSelectedUser] = useState(null);
  const [loadingUserDetail, setLoadingUserDetail] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchUsers = async () => {
      try {
        setLoading(true);
        const data = await adminApi.getAllUsers();
        if (isMounted) {
          setUsers(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Failed to retrieve user directory.');
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUsers();
    return () => { isMounted = false; };
  }, []);

  const handleViewUser = async (id) => {
    setError('');
    try {
      setLoadingUserDetail(id);
      const detail = await adminApi.getUserById(id);
      setSelectedUser(detail);
      setIsModalOpen(true);
    } catch (err) {
      setError(err.message || 'Failed to retrieve user details.');
    } finally {
      setLoadingUserDetail(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const query = searchQuery.toLowerCase();
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(query)) ||
      (user.email && user.email.toLowerCase().includes(query)) ||
      (user.role && user.role.toLowerCase().includes(query));

    const matchesRole =
      roleFilter === 'ALL' || (user.role && user.role.toUpperCase() === roleFilter);

    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
        return <Badge variant="indigo">ADMIN</Badge>;
      case 'MANAGER':
        return <Badge variant="cyan">MANAGER</Badge>;
      case 'EMPLOYEE':
      default:
        return <Badge variant="emerald">EMPLOYEE</Badge>;
    }
  };

  return (
    <div>
      <div className="page-header">
        <h1>User Directory & Roles</h1>
        <p>System administrative overview of registered user accounts and assigned authorization roles.</p>
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

      {/* FILTER & SEARCH BAR */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem' }}
            placeholder="Search directory by name, email, or role..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Filter size={18} style={{ color: 'var(--text-dim)' }} />
          <select
            className="form-input"
            style={{ width: 'auto', minWidth: '140px' }}
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="ALL">All Roles</option>
            <option value="EMPLOYEE">Employees</option>
            <option value="MANAGER">Managers</option>
            <option value="ADMIN">Admins</option>
          </select>
        </div>
      </div>

      {/* USER DIRECTORY TABLE */}
      <Card title="Registered User Accounts" subtitle={`Showing ${filteredUsers.length} of ${users.length} total user accounts`}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading user directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Inbox size={36} />
            <h3>No users found</h3>
            <p>{searchQuery || roleFilter !== 'ALL' ? 'No user accounts match your current search and role filter.' : 'No user accounts exist in the platform repository.'}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>User ID</th>
                  <th>Full Name</th>
                  <th>Email Address</th>
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 600 }}>#{u.id}</td>
                    <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>{u.name}</td>
                    <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                    <td>{getRoleBadge(u.role)}</td>
                    <td>
                      <button
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.8rem' }}
                        onClick={() => handleViewUser(u.id)}
                        disabled={loadingUserDetail === u.id}
                      >
                        <Eye size={14} />
                        <span>{loadingUserDetail === u.id ? 'Loading...' : 'View Details'}</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* USER DETAILS INSPECTION MODAL */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="User Account Details">
        {selectedUser && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
              <div style={{ width: '48px', height: '48px', borderRadius: '50%', backgroundColor: 'rgba(99, 102, 241, 0.15)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Shield size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-main)' }}>{selectedUser.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{selectedUser.email}</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>User ID</p>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginTop: '0.25rem' }}>#{selectedUser.id}</p>
              </div>

              <div style={{ padding: '0.85rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Assigned Authorization Role</p>
                <div style={{ marginTop: '0.35rem' }}>{getRoleBadge(selectedUser.role)}</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
              <button className="btn btn-secondary" onClick={() => setIsModalOpen(false)}>
                Close
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
