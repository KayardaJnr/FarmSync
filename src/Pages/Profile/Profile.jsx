import React, { useState, useEffect } from 'react';
import { User, Mail, Shield, Calendar, Save, Edit2, Camera, Activity, Lock, LogOut } from 'lucide-react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { updateProfile, signOut } from 'firebase/auth';
import { useAuth } from '../../context/AuthContext';
import { db, auth } from '../../services/firebase';
import styles from './Profile.module.css';

const ProfilePage = () => {
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
    photoURL: '',
    farmName: '',
    farmLocation: ''
  });
  const [editData, setEditData] = useState({
    name: '',
    phone: '',
    farmName: '',
    farmLocation: ''
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
          photoURL: user.photoURL || '',
          farmName: data.farmName || 'Main Farm',
          farmLocation: data.farmLocation || 'Not specified'
        };
        setProfileData(profile);
        setEditData({
          name: profile.name,
          phone: profile.phone,
          farmName: profile.farmName,
          farmLocation: profile.farmLocation
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
        farmName: editData.farmName,
        farmLocation: editData.farmLocation,
        updatedAt: new Date().toISOString()
      });

      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: editData.name
      });

      setProfileData({
        ...profileData,
        name: editData.name,
        phone: editData.phone,
        farmName: editData.farmName,
        farmLocation: editData.farmLocation
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
      phone: profileData.phone,
      farmName: profileData.farmName,
      farmLocation: profileData.farmLocation
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error logging out:', error);
      setMessage({ type: 'error', text: 'Failed to logout' });
    }
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
                <img loading="lazy" src={profileData.photoURL} alt="Profile" className={styles.avatar} />
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

        {/* Farm Information */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Activity size={20} className={styles.cardTitleIcon} />
            <h3>Farm Information</h3>
          </div>
          {!isEditing ? (
            <div className={styles.infoSection}>
              <div className={styles.infoItem}>
                <User size={18} className={styles.infoIcon} />
                <div>
                  <label>Farm Name</label>
                  <p>{profileData.farmName}</p>
                </div>
              </div>
              <div className={styles.infoItem}>
                <Calendar size={18} className={styles.infoIcon} />
                <div>
                  <label>Location</label>
                  <p>{profileData.farmLocation}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className={styles.formSection}>
              <div className={styles.formGroup}>
                <label>Farm Name</label>
                <input
                  type="text"
                  value={editData.farmName}
                  onChange={(e) => setEditData({...editData, farmName: e.target.value})}
                  className={styles.input}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Location</label>
                <input
                  type="text"
                  value={editData.farmLocation}
                  onChange={(e) => setEditData({...editData, farmLocation: e.target.value})}
                  className={styles.input}
                />
              </div>
            </div>
          )}
        </div>

        {/* Edit Form */}
        {isEditing && (
          <div className={styles.card}>
            <div className={styles.cardTitle}>
              <Edit2 size={20} className={styles.cardTitleIcon} />
              <h3>Edit Profile</h3>
            </div>
            <form onSubmit={handleSave} className={styles.form}>
              <div className={styles.formGroup}>
                <label>Full Name</label>
                <input
                  type="text"
                  value={editData.name}
                  onChange={(e) => setEditData({...editData, name: e.target.value})}
                  className={styles.input}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                  className={styles.input}
                />
              </div>

              <div className={styles.formActions}>
                <button type="submit" disabled={saving} className={styles.button}>
                  <Save size={18} />
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
                <button type="button" onClick={handleCancel} className={styles.buttonSecondary}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Security & Logout */}
        <div className={styles.card}>
          <div className={styles.cardTitle}>
            <Lock size={20} className={styles.cardTitleIcon} />
            <h3>Security & Account</h3>
          </div>
          <div className={styles.actionList}>
            <button className={styles.actionButton}>
              <Lock size={18} />
              Change Password
            </button>
            <button className={styles.actionButtonLogout} onClick={handleLogout}>
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;