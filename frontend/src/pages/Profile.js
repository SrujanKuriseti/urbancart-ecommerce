import React, { useEffect, useState } from 'react';
import { customerAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [edit, setEdit] = useState(false);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.role === 'admin') {
      setLoading(false);
      setProfile(null);
      return;
    }
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const res = await customerAPI.getProfile();
      setProfile(res.data);
      setForm(res.data);
    } catch (e) {
      setProfile(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading profile...</p>
      </div>
    );
  }

  if (user?.role === 'admin')
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>👤</div>
          <h2 style={styles.emptyTitle}>Admin Account</h2>
          <p style={styles.emptyText}>
            This page is only available for customer users. As an admin, you do not have a customer profile.
          </p>
        </div>
      </div>
    );

  if (!profile)
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.emptyCard}>
          <div style={styles.emptyIcon}>❌</div>
          <h2 style={styles.emptyTitle}>Profile Not Found</h2>
          <p style={styles.emptyText}>
            You do not have a customer profile associated with this account.
          </p>
        </div>
      </div>
    );

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await customerAPI.updateProfile(form);
      setEdit(false);
      fetchProfile();
      alert('Profile updated!');
    } catch (e) {
      alert('Error updating profile');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.profileCard}>
        {/* Header with Avatar */}
        <div style={styles.header}>
          <div style={styles.avatarCircle}>
            {profile.first_name?.[0]}{profile.last_name?.[0]}
          </div>
          <h1 style={styles.name}>
            {profile.first_name} {profile.last_name}
          </h1>
          <p style={styles.email}>{profile.email}</p>
        </div>

        {/* Profile Content */}
        {!edit ? (
          <div style={styles.viewMode}>
            {/* Info Cards */}
            <div style={styles.infoGrid}>
              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Full Name</p>
                  <p style={styles.infoValue}>
                    {profile.first_name} {profile.last_name}
                  </p>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Email</p>
                  <p style={styles.infoValue}>{profile.email || 'Not provided'}</p>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Shipping Address</p>
                  <p style={styles.infoValue}>{profile.address || 'Not set'}</p>
                </div>
              </div>

              <div style={styles.infoCard}>
                <div style={styles.infoIcon}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div style={styles.infoContent}>
                  <p style={styles.infoLabel}>Phone</p>
                  <p style={styles.infoValue}>{profile.phone || 'Not set'}</p>
                </div>
              </div>
            </div>

            <button onClick={() => setEdit(true)} style={styles.editBtn}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
              </svg>
              Edit Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={styles.editMode}>
            <div style={styles.formGrid}>
              <div style={styles.formGroup}>
                <label style={styles.label}>First Name</label>
                <div style={styles.inputWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    name="first_name"
                    value={form.first_name || ''}
                    onChange={handleChange}
                    placeholder="First Name"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Last Name</label>
                <div style={styles.inputWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  <input
                    name="last_name"
                    value={form.last_name || ''}
                    onChange={handleChange}
                    placeholder="Last Name"
                    required
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Email</label>
                <div style={styles.inputWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                    <polyline points="22,6 12,13 2,6"></polyline>
                  </svg>
                  <input
                    name="email"
                    value={form.email || ''}
                    onChange={handleChange}
                    placeholder="Email"
                    required
                    disabled
                    style={{ ...styles.input, background: '#f1f5f9', cursor: 'not-allowed' }}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Shipping Address</label>
                <div style={styles.inputWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                  <input
                    name="address"
                    value={form.address || ''}
                    onChange={handleChange}
                    placeholder="Shipping Address"
                    style={styles.input}
                  />
                </div>
              </div>

              <div style={styles.formGroup}>
                <label style={styles.label}>Phone</label>
                <div style={styles.inputWrapper}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" style={styles.inputIcon}>
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                  <input
                    name="phone"
                    value={form.phone || ''}
                    onChange={handleChange}
                    placeholder="Phone"
                    style={styles.input}
                  />
                </div>
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.saveBtn}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '8px' }}>
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
                Save Changes
              </button>
              <button type="button" onClick={() => setEdit(false)} style={styles.cancelBtn}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f8fafc',
    padding: '2rem',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '60vh',
  },
  spinner: {
    width: '50px',
    height: '50px',
    border: '4px solid #e2e8f0',
    borderTop: '4px solid #667eea',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    marginTop: '1rem',
    fontSize: '1.1rem',
    color: '#64748b',
  },
  emptyContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '70vh',
    padding: '2rem',
  },
  emptyCard: {
    background: '#fff',
    borderRadius: '20px',
    padding: '4rem 3rem',
    textAlign: 'center',
    maxWidth: '500px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.06)',
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem',
  },
  emptyTitle: {
    fontSize: '1.8rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: '1rem',
  },
  emptyText: {
    fontSize: '1.05rem',
    color: '#64748b',
    lineHeight: '1.6',
  },
  profileCard: {
    background: '#fff',
    borderRadius: '24px',
    boxShadow: '0 4px 24px rgba(0, 0, 0, 0.08)',
    overflow: 'hidden',
    maxWidth: '900px',
    width: '100%',
    marginTop: '2rem',
  },
  header: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '3rem 2rem',
    textAlign: 'center',
    color: '#fff',
  },
  avatarCircle: {
    width: '100px',
    height: '100px',
    borderRadius: '50%',
    background: 'rgba(255, 255, 255, 0.2)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 1.5rem',
    fontSize: '2.5rem',
    fontWeight: '700',
    backdropFilter: 'blur(10px)',
    border: '4px solid rgba(255, 255, 255, 0.3)',
  },
  name: {
    fontSize: '2rem',
    fontWeight: '700',
    marginBottom: '0.5rem',
    color: '#fff',
  },
  email: {
    fontSize: '1rem',
    opacity: 0.9,
    color: '#fff',
  },
  viewMode: {
    padding: '2.5rem',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  infoCard: {
    background: '#f8fafc',
    padding: '1.5rem',
    borderRadius: '16px',
    display: 'flex',
    gap: '1rem',
    border: '1px solid #e2e8f0',
    transition: 'transform 0.2s, box-shadow 0.2s',
  },
  infoIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: '0.85rem',
    color: '#64748b',
    marginBottom: '0.25rem',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: '1rem',
    color: '#1e293b',
    fontWeight: '600',
  },
  editBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
  },
  editMode: {
    padding: '2.5rem',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '1.5rem',
    marginBottom: '2rem',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '0.95rem',
    fontWeight: '600',
    color: '#334155',
    marginBottom: '0.5rem',
  },
  inputWrapper: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  inputIcon: {
    position: 'absolute',
    left: '16px',
    pointerEvents: 'none',
  },
  input: {
    width: '100%',
    padding: '14px 16px 14px 48px',
    fontSize: '1rem',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    transition: 'all 0.2s',
    outline: 'none',
    fontFamily: 'inherit',
  },
  formActions: {
    display: 'flex',
    gap: '1rem',
  },
  saveBtn: {
    flex: 1,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: '#fff',
    border: 'none',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 14px rgba(102, 126, 234, 0.4)',
  },
  cancelBtn: {
    flex: 1,
    background: '#f1f5f9',
    color: '#64748b',
    border: '2px solid #e2e8f0',
    padding: '16px',
    borderRadius: '12px',
    fontSize: '1.05rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
};

// Add spinner animation
const styleSheet = document.styleSheets[0];
const keyframes = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
try {
  styleSheet.insertRule(keyframes, styleSheet.cssRules.length);
} catch (e) {
  // Ignore if already exists
}

export default UserProfile;