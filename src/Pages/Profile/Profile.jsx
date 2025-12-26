import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Save, Edit2, Camera } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile } from 'firebase/auth';
// import { useAuth } from '../../context/AuthContext';
import styles from './Profile.module.css';

const ProfilePage = ({ db }) => {
  const { user, userRole, getRoleLabel } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    role: '',
    createdAt: '',
    photoURL: ''
  });
  const [editData, setEditData] = useState({
    name: '',
    phone: ''
  });

  useEffect(() => {
    if (user) {
      fetchProfileData();
    }
  }, [user]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      
      if (userDoc.exists()) {
        const data = userDoc.data();
        const profile = {
          name: data.name || user.displayName || '',
          email: user.email || data.email || '',
          phone: data.phone || '',
          role: data.role || 'room-attendant',
          createdAt: data.createdAt || '',
          photoURL: user.photoURL || ''
        };
        setProfileData(profile);
        setEditData({
          name: profile.name,
          phone: profile.phone
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage({ type: 'error', text: 'Failed to load profile data' });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      // Update Firestore
      await updateDoc(doc(db, 'users', user.uid), {
        name: editData.name,
        phone: editData.phone,
        updatedAt: new Date().toISOString()
      });

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: editData.name
      });

      setProfileData({
        ...profileData,
        name: editData.name,
        phone: editData.phone
      });

      setMessage({ type: 'success', text: '✓ Profile updated successfully!' });
      setIsEditing(false);

      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditData({
      name: profileData.name,
      phone: profileData.phone
    });
    setIsEditing(false);
    setMessage(null);
  };

  const getInitials = () => {
    const name = profileData.name || profileData.email;
    return name.charAt(0).toUpperCase();
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner}></div>
        <p>Loading profile...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className={styles.editButton}>
            <Edit2 size={18} />
            Edit Profile
          </button>
        )}
      </div>

      {message && (
        <div className={`${styles.message} ${styles[message.type]}`}>
          {message.text}
        </div>
      )}

      <div className={styles.profileGrid}>
        {/* Profile Card */}
        <div className={styles.card}>
          <div className={styles.avatarSection}>
            <div className={styles.avatarWrapper}>
              {profileData.photoURL ? (
                <img src={profileData.photoURL} alt="Profile" className={styles.avatar} />
              ) : (
                <div className={styles.avatarPlaceholder}>
                  {getInitials()}
                </div>
              )}
              <button className={styles.avatarButton} title="Change photo">
                <Camera size={16} />
              </button>
            </div>
            <div className={styles.avatarInfo}>
              <h2>{profileData.name || 'User'}</h2>
              <span className={styles.roleTag} style={{
                background: userRole === 'admin' ? '#ff6b6b15' : 
                           userRole === 'sales-rep' ? '#2196f315' :
                           userRole === 'vet' ? '#9c27b015' : '#1D9E5315',
                color: userRole === 'admin' ? '#ff6b6b' : 
                       userRole === 'sales-rep' ? '#2196f3' :
                       userRole === 'vet' ? '#9c27b0' : '#1D9E53'
              }}>
                <Shield size={14} />
                {getRoleLabel(userRole)}
              </span>
            </div>
          </div>

          <div className={styles.infoSection}>
            <div className={styles.infoItem}>
              <Mail size={18} className={styles.infoIcon} />
              <div>
                <label>Email Address</label>
                <p>{profileData.email}</p>
              </div>
            </div>

            <div className={styles.infoItem}>
              <Calendar size={18} className={styles.infoIcon} />
              <div>
                <label>Member Since</label>
                <p>{formatDate(profileData.createdAt)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit Form */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>
            {isEditing ? 'Edit Information' : 'Personal Information'}
          </h3>

          {isEditing ? (
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name *</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({ ...editData, name: e.target.value })}
                  required
                  placeholder="Enter your full name"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Email Address</label>
                <input
                  type="email"
                  value={profileData.email}
                  disabled
                  className={styles.disabledInput}
                />
                <small>Email cannot be changed</small>
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({ ...editData, phone: e.target.value })}
                  placeholder="+234 xxx xxx xxxx"
                  disabled={saving}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Role</label>
                <input
                  type="text"
                  value={getRoleLabel(profileData.role)}
                  disabled
                  className={styles.disabledInput}
                />
                <small>Contact your administrator to change your role</small>
              </div>

              <div className={styles.formActions}>
                <button 
                  type="button" 
                  onClick={handleCancel}
                  className={styles.cancelButton}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className={styles.saveButton}
                  disabled={saving}
                >
                  {saving ? (
                    <>Saving...</>
                  ) : (
                    <>
                      <Save size={18} />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className={styles.infoList}>
              <div className={styles.infoRow}>
                <label>Full Name</label>
                <p>{profileData.name || 'Not set'}</p>
              </div>
              <div className={styles.infoRow}>
                <label>Email Address</label>
                <p>{profileData.email}</p>
              </div>
              <div className={styles.infoRow}>
                <label>Phone Number</label>
                <p>{profileData.phone || 'Not set'}</p>
              </div>
              <div className={styles.infoRow}>
                <label>Role</label>
                <p>{getRoleLabel(profileData.role)}</p>
              </div>
            </div>
          )}
        </div>

        {/* Account Stats */}
        <div className={styles.card}>
          <h3 className={styles.cardTitle}>Account Statistics</h3>
          <div className={styles.statsGrid}>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{formatDate(profileData.createdAt)}</div>
              <div className={styles.statLabel}>Account Created</div>
            </div>
            <div className={styles.statCard}>
              <div className={styles.statValue}>{getRoleLabel(userRole)}</div>
              <div className={styles.statLabel}>Current Role</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;