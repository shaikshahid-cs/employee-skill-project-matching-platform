import { useState, useEffect } from 'react';
import {
  Search, Filter, Inbox, Eye, AlertCircle, Shield, UserPlus,
  Key, Power, Trash2, CheckCircle2, Copy
} from 'lucide-react';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/Modal';
import adminApi from '../../api/adminApi';

export default function AdminUserManagementPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  // Modals state
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isManagerModalOpen, setIsManagerModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [isCredentialModalOpen, setIsCredentialModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [createdCredential, setCreatedCredential] = useState(null);

  // Form states for Create Employee
  const [empForm, setEmpForm] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'Engineering',
    designation: 'Software Engineer',
    primaryDomain: 'Backend Development',
    totalExperienceYears: 2,
    dateOfBirth: '1998-05-15',
    phone: '',
    location: 'Bangalore, India',
  });

  // Form states for Create Manager
  const [mgrForm, setMgrForm] = useState({
    fullName: '',
    email: '',
    password: '',
    department: 'Engineering',
    phone: '',
  });

  // Form state for Reset Password
  const [newPassword, setNewPassword] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminApi.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');
    try {
      const res = await adminApi.createEmployee(empForm);
      setIsEmployeeModalOpen(false);
      setCreatedCredential({
        name: res.fullName || res.name || empForm.fullName,
        email: res.email || empForm.email,
        password: res.temporaryPassword || res.initialPassword || empForm.password,
        role: 'EMPLOYEE',
      });
      setIsCredentialModalOpen(true);
      setSuccessMsg(`Employee account for ${empForm.fullName} created successfully.`);
      fetchUsers();
      // Reset form
      setEmpForm({
        fullName: '',
        email: '',
        password: '',
        department: 'Engineering',
        designation: 'Software Engineer',
        primaryDomain: 'Backend Development',
        totalExperienceYears: 2,
        dateOfBirth: '1998-05-15',
        phone: '',
        location: 'Bangalore, India',
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create employee');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    setFormSubmitting(true);
    setError('');
    try {
      const res = await adminApi.createManager(mgrForm);
      setIsManagerModalOpen(false);
      setCreatedCredential({
        name: res.fullName || res.name || mgrForm.fullName,
        email: res.email || mgrForm.email,
        password: res.temporaryPassword || res.initialPassword || mgrForm.password,
        role: 'MANAGER',
      });
      setIsCredentialModalOpen(true);
      setSuccessMsg(`Manager account for ${mgrForm.fullName} created successfully.`);
      fetchUsers();
      setMgrForm({
        fullName: '',
        email: '',
        password: '',
        department: 'Engineering',
        phone: '',
      });
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to create manager');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleToggleStatus = async (user) => {
    try {
      setError('');
      await adminApi.toggleUserStatus(user.id, !user.active);
      setSuccessMsg(`User ${user.name} status updated.`);
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to update user status');
    }
  };

  const handleOpenResetModal = (user) => {
    setSelectedUser(user);
    setNewPassword('Welcome@' + Math.floor(1000 + Math.random() * 9000));
    setIsResetModalOpen(true);
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!selectedUser || !newPassword) return;
    setFormSubmitting(true);
    try {
      await adminApi.resetPassword(selectedUser.id, newPassword);
      setIsResetModalOpen(false);
      setCreatedCredential({
        name: selectedUser.name,
        email: selectedUser.email,
        password: newPassword,
        role: selectedUser.role,
      });
      setIsCredentialModalOpen(true);
      setSuccessMsg(`Password reset for ${selectedUser.name}.`);
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to reset password');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDeleteUser = async (user) => {
    if (!window.confirm(`Are you sure you want to permanently delete user "${user.name}" (${user.email})?`)) {
      return;
    }
    try {
      setError('');
      await adminApi.deleteUser(user.id);
      setSuccessMsg(`User ${user.name} deleted.`);
      fetchUsers();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || 'Failed to delete user');
    }
  };

  const copyCredentials = () => {
    if (!createdCredential) return;
    const text = `Platform Credentials:\nRole: ${createdCredential.role}\nName: ${createdCredential.name}\nEmail: ${createdCredential.email}\nInitial Password: ${createdCredential.password}\nNote: You will be required to change your password on first login.`;
    navigator.clipboard.writeText(text);
    alert('Credentials copied to clipboard!');
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
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1>User Provisioning & Directory</h1>
          <p>Strict administrative provisioning of employee and manager accounts with initial credentials.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button
            className="btn btn-primary"
            onClick={() => {
              setEmpForm((prev) => ({ ...prev, password: 'Emp@' + Math.floor(1000 + Math.random() * 9000) }));
              setIsEmployeeModalOpen(true);
            }}
          >
            <UserPlus size={16} />
            <span>Provision Employee</span>
          </button>
          <button
            className="btn btn-secondary"
            onClick={() => {
              setMgrForm((prev) => ({ ...prev, password: 'Mgr@' + Math.floor(1000 + Math.random() * 9000) }));
              setIsManagerModalOpen(true);
            }}
          >
            <Shield size={16} />
            <span>Provision Manager</span>
          </button>
        </div>
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

      {successMsg && (
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
          <span>{successMsg}</span>
        </div>
      )}

      {/* FILTER & SEARCH BAR */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search size={18} style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
          <input
            type="text"
            className="form-input"
            style={{ paddingLeft: '2.5rem', width: '100%' }}
            placeholder="Search users by name, email, or role..."
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
      <Card title="Managed Accounts" subtitle={`Showing ${filteredUsers.length} of ${users.length} registered accounts`}>
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Loading directory...</div>
        ) : filteredUsers.length === 0 ? (
          <div className="empty-state">
            <Inbox size={36} />
            <h3>No users found</h3>
            <p>{searchQuery || roleFilter !== 'ALL' ? 'No user accounts match current filter criteria.' : 'No user accounts found.'}</p>
          </div>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Password Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = u.active !== false;
                  return (
                    <tr key={u.id}>
                      <td style={{ fontWeight: 600 }}>#{u.id}</td>
                      <td style={{ color: 'var(--text-main)', fontWeight: 500 }}>{u.name}</td>
                      <td style={{ color: 'var(--text-muted)' }}>{u.email}</td>
                      <td>{getRoleBadge(u.role)}</td>
                      <td>
                        <span style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '12px',
                          background: isActive ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                          color: isActive ? '#34d399' : '#f87171'
                        }}>
                          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: isActive ? '#34d399' : '#f87171' }} />
                          {isActive ? 'Active' : 'Deactivated'}
                        </span>
                      </td>
                      <td>
                        {u.mustChangePassword ? (
                          <span style={{ fontSize: '0.75rem', color: '#fbbf24', fontWeight: 500 }}>Pending Initial Reset</span>
                        ) : (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Established</span>
                        )}
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                          <button
                            className="btn btn-secondary"
                            title="Reset Temporary Password"
                            style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem' }}
                            onClick={() => handleOpenResetModal(u)}
                          >
                            <Key size={13} />
                            <span>Reset</span>
                          </button>

                          {u.role !== 'ADMIN' && (
                            <>
                              <button
                                className="btn btn-secondary"
                                title={isActive ? 'Deactivate User' : 'Activate User'}
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: isActive ? '#f87171' : '#34d399' }}
                                onClick={() => handleToggleStatus(u)}
                              >
                                <Power size={13} />
                              </button>

                              <button
                                className="btn btn-secondary"
                                title="Delete User Permanently"
                                style={{ padding: '0.3rem 0.5rem', fontSize: '0.75rem', color: '#f87171' }}
                                onClick={() => handleDeleteUser(u)}
                              >
                                <Trash2 size={13} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* PROVISION EMPLOYEE MODAL */}
      <Modal isOpen={isEmployeeModalOpen} onClose={() => setIsEmployeeModalOpen(false)} title="Provision New Employee">
        <form onSubmit={handleCreateEmployee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Full Name *</label>
              <input
                type="text"
                className="form-input"
                required
                value={empForm.fullName}
                onChange={(e) => setEmpForm({ ...empForm, fullName: e.target.value })}
                placeholder="e.g. Alex Morgan"
              />
            </div>
            <div>
              <label className="form-label">Email Address *</label>
              <input
                type="email"
                className="form-input"
                required
                value={empForm.email}
                onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })}
                placeholder="alex.morgan@company.com"
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Initial Password *</label>
              <input
                type="text"
                className="form-input"
                required
                value={empForm.password}
                onChange={(e) => setEmpForm({ ...empForm, password: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Date of Birth (Profile Info) *</label>
              <input
                type="date"
                className="form-input"
                required
                value={empForm.dateOfBirth}
                onChange={(e) => setEmpForm({ ...empForm, dateOfBirth: e.target.value })}
              />
              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)' }}>Used for records only; not factored into matching.</span>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Designation / Role Title *</label>
              <input
                type="text"
                className="form-input"
                required
                value={empForm.designation}
                onChange={(e) => setEmpForm({ ...empForm, designation: e.target.value })}
                placeholder="e.g. Senior Java Developer"
              />
            </div>
            <div>
              <label className="form-label">Department *</label>
              <input
                type="text"
                className="form-input"
                required
                value={empForm.department}
                onChange={(e) => setEmpForm({ ...empForm, department: e.target.value })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Primary Technical Domain *</label>
              <input
                type="text"
                className="form-input"
                required
                value={empForm.primaryDomain}
                onChange={(e) => setEmpForm({ ...empForm, primaryDomain: e.target.value })}
                placeholder="e.g. Backend Development"
              />
            </div>
            <div>
              <label className="form-label">Total Experience (Years) *</label>
              <input
                type="number"
                step="0.5"
                min="0"
                className="form-input"
                required
                value={empForm.totalExperienceYears}
                onChange={(e) => setEmpForm({ ...empForm, totalExperienceYears: parseFloat(e.target.value) || 0 })}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-input"
                value={empForm.phone}
                onChange={(e) => setEmpForm({ ...empForm, phone: e.target.value })}
                placeholder="+1 555-0199"
              />
            </div>
            <div>
              <label className="form-label">Location</label>
              <input
                type="text"
                className="form-input"
                value={empForm.location}
                onChange={(e) => setEmpForm({ ...empForm, location: e.target.value })}
                placeholder="City, Country"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsEmployeeModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
              {formSubmitting ? 'Creating...' : 'Provision Employee'}
            </button>
          </div>
        </form>
      </Modal>

      {/* PROVISION MANAGER MODAL */}
      <Modal isOpen={isManagerModalOpen} onClose={() => setIsManagerModalOpen(false)} title="Provision New Manager">
        <form onSubmit={handleCreateManager} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label className="form-label">Full Name *</label>
            <input
              type="text"
              className="form-input"
              required
              value={mgrForm.fullName}
              onChange={(e) => setMgrForm({ ...mgrForm, fullName: e.target.value })}
              placeholder="e.g. Sarah Connor"
            />
          </div>

          <div>
            <label className="form-label">Email Address *</label>
            <input
              type="email"
              className="form-input"
              required
              value={mgrForm.email}
              onChange={(e) => setMgrForm({ ...mgrForm, email: e.target.value })}
              placeholder="sarah.connor@company.com"
            />
          </div>

          <div>
            <label className="form-label">Initial Password *</label>
            <input
              type="text"
              className="form-input"
              required
              value={mgrForm.password}
              onChange={(e) => setMgrForm({ ...mgrForm, password: e.target.value })}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label className="form-label">Department *</label>
              <input
                type="text"
                className="form-input"
                required
                value={mgrForm.department}
                onChange={(e) => setMgrForm({ ...mgrForm, department: e.target.value })}
              />
            </div>
            <div>
              <label className="form-label">Phone</label>
              <input
                type="text"
                className="form-input"
                value={mgrForm.phone}
                onChange={(e) => setMgrForm({ ...mgrForm, phone: e.target.value })}
                placeholder="+1 555-0144"
              />
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button type="button" className="btn btn-secondary" onClick={() => setIsManagerModalOpen(false)}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
              {formSubmitting ? 'Creating...' : 'Provision Manager'}
            </button>
          </div>
        </form>
      </Modal>

      {/* RESET PASSWORD MODAL */}
      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} title="Reset User Password">
        {selectedUser && (
          <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Assign a new temporary password for <strong>{selectedUser.name}</strong> ({selectedUser.email}). The user will be required to change it upon next login.
            </p>

            <div>
              <label className="form-label">New Temporary Password *</label>
              <input
                type="text"
                className="form-input"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button type="button" className="btn btn-secondary" onClick={() => setIsResetModalOpen(false)}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={formSubmitting}>
                {formSubmitting ? 'Updating...' : 'Set & Force Change'}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* CREDENTIALS HANDOFF MODAL */}
      <Modal isOpen={isCredentialModalOpen} onClose={() => setIsCredentialModalOpen(false)} title="Account Provisioned Successfully">
        {createdCredential && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div style={{
              backgroundColor: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: 'var(--radius-md)',
              padding: '1.25rem'
            }}>
              <p style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 600, marginBottom: '0.75rem' }}>
                ✓ Account Created with First-Login Security Protocol
              </p>
              <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '0.5rem', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--text-dim)' }}>Role:</span>
                <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{createdCredential.role}</span>

                <span style={{ color: 'var(--text-dim)' }}>Full Name:</span>
                <span style={{ color: 'var(--text-main)' }}>{createdCredential.name}</span>

                <span style={{ color: 'var(--text-dim)' }}>Email:</span>
                <span style={{ color: 'var(--text-main)' }}>{createdCredential.email}</span>

                <span style={{ color: 'var(--text-dim)' }}>Initial Password:</span>
                <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#f59e0b', fontSize: '1rem' }}>
                  {createdCredential.password}
                </span>
              </div>
            </div>

            <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
              Provide these credentials to the user. When they log in for the first time, they will be required to immediately create their permanent confidential password.
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem' }}>
              <button type="button" className="btn btn-secondary" onClick={copyCredentials}>
                <Copy size={14} />
                <span>Copy Credentials</span>
              </button>
              <button type="button" className="btn btn-primary" onClick={() => setIsCredentialModalOpen(false)}>
                Done
              </button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
