import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Key, 
  LogOut, 
  Save, 
  Check, 
  AlertCircle,
  Calendar,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import ErrorMessage from '../components/ErrorMessage';

export const Profile = () => {
  const { user, token, logout, updateProfile } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [role, setRole] = useState(user?.role || 'Customer');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState(null);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setSaving(true);
    setSaveError(null);
    setSaveSuccess(false);

    try {
      const res = await updateProfile({ name, email, role });
      if (res.success) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        setSaveError(res.error);
      }
    } catch (err) {
      setSaveError(err.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container" style={{ maxWidth: '800px' }}>
        {/* Header */}
        <div className="section-header" style={{ marginBottom: '2rem' }}>
          <h1 className="section-title">
            <User size={28} style={{ color: 'var(--accent-primary)' }} />
            User Account Profile
          </h1>
          <p className="section-subtitle">
            Manage your personal credentials, identity roles, and authenticated session
          </p>
        </div>

        {saveError && (
          <ErrorMessage 
            title="Profile Update Error" 
            message={saveError} 
            onRetry={() => setSaveError(null)} 
          />
        )}

        {saveSuccess && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--accent-emerald)',
            borderRadius: 'var(--radius-md)',
            padding: '1rem',
            marginBottom: '1.5rem',
            color: '#6ee7b7',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.9rem'
          }}>
            <Check size={18} /> Profile updated successfully in User Microservice database!
          </div>
        )}

        {/* Profile Card */}
        <div className="card-elevated" style={{ marginBottom: '2rem' }}>
          {/* Avatar & Role Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1.5rem',
            paddingBottom: '1.5rem',
            borderBottom: '1px solid var(--border-subtle)',
            marginBottom: '1.5rem',
            flexWrap: 'wrap'
          }}>
            <div style={{
              width: '72px',
              height: '72px',
              borderRadius: '50%',
              background: 'var(--grad-primary)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              fontWeight: 800
            }}>
              {user?.name ? user.name[0].toUpperCase() : 'U'}
            </div>

            <div style={{ flexGrow: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff' }}>
                  {user?.name || 'Customer'}
                </h2>
                <span className={`badge ${user?.role?.toLowerCase() === 'admin' ? 'badge-primary' : 'badge-cyan'}`}>
                  {user?.role || 'Customer'}
                </span>
              </div>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginTop: '0.2rem' }}>
                User ID: <code>#{user?.id}</code> | Authentication: <strong>JWT Bearer</strong>
              </p>
            </div>

            <button onClick={logout} className="btn btn-secondary btn-sm" style={{ color: 'var(--accent-rose)' }}>
              <LogOut size={15} /> Log Out
            </button>
          </div>

          {/* Edit Form */}
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label className="form-label">User Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="form-select"
              >
                <option value="Customer">Customer</option>
                <option value="Admin">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="btn btn-primary"
              style={{ marginTop: '0.5rem' }}
            >
              <Save size={16} />
              {saving ? 'Updating Backend...' : 'Save Profile Changes'}
            </button>
          </form>
        </div>

        {/* Security & JWT Inspector */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Key size={18} style={{ color: 'var(--accent-cyan)' }} />
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: '#ffffff' }}>
              JWT Security Token Details
            </h3>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
            Active authentication token automatically attached to all microservice HTTP requests:
          </p>

          <div style={{
            background: '#090d16',
            padding: '0.75rem 1rem',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border-subtle)',
            fontFamily: 'monospace',
            fontSize: '0.8rem',
            color: '#a5b4fc',
            wordBreak: 'break-all'
          }}>
            {token || 'No active JWT token.'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
