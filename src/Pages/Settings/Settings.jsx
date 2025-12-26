import React, { useState } from 'react';
import { Settings as SettingsIcon, Bell, Lock, Palette, Database, Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import styles from './Settings.module.css';

const SettingsPage = () => {
  const { isAdmin } = useAuth();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    pushNotifications: false,
    smsNotifications: false,
    weeklyReports: true,
    criticalAlerts: true,
    theme: 'light',
    language: 'en',
    autoBackup: true,
    backupFrequency: 'daily'
  });

  const [message, setMessage] = useState(null);

  const handleToggle = (key) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
    showMessage('Setting updated successfully!');
  };

  const handleSelect = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
    showMessage('Setting updated successfully!');
  };

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => setMessage(null), 3000);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <SettingsIcon size={32} className={styles.headerIcon} />
        <div>
          <h1 className={styles.title}>Settings</h1>
          <p className={styles.subtitle}>Manage your app preferences and notifications</p>
        </div>
      </div>

      {message && (
        <div className={styles.successMessage}>
          ✓ {message}
        </div>
      )}

      <div className={styles.settingsGrid}>
        {/* Notifications */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Bell size={24} className={styles.cardIcon} />
            <h2>Notifications</h2>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Email Notifications</div>
                <div className={styles.settingDescription}>Receive notifications via email</div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="emailNotifications"
                  id="emailNotifications"
                  checked={settings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Push Notifications</div>
                <div className={styles.settingDescription}>Get browser push notifications</div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="pushNotifications"
                  id="pushNotifications"
                  checked={settings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>SMS Notifications</div>
                <div className={styles.settingDescription}>Receive critical alerts via SMS</div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="smsNotifications"
                  id="smsNotifications"
                  checked={settings.smsNotifications}
                  onChange={() => handleToggle('smsNotifications')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Weekly Reports</div>
                <div className={styles.settingDescription}>Receive weekly farm summary reports</div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="weeklyReports"
                  id="weeklyReports"
                  checked={settings.weeklyReports}
                  onChange={() => handleToggle('weeklyReports')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>

            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Critical Alerts</div>
                <div className={styles.settingDescription}>Get notified of critical farm issues</div>
              </div>
              <label className={styles.toggle}>
                <input
                  type="checkbox"
                  name="criticalAlerts"
                  id="criticalAlerts"
                  checked={settings.criticalAlerts}
                  onChange={() => handleToggle('criticalAlerts')}
                />
                <span className={styles.slider}></span>
              </label>
            </div>
          </div>
        </div>

        {/* Appearance */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Palette size={24} className={styles.cardIcon} />
            <h2>Appearance</h2>
          </div>
          <div className={styles.settingsList}>
            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Theme</div>
                <div className={styles.settingDescription}>Choose your preferred theme</div>
              </div>
              <select
                name="theme"
                id="theme"
                value={settings.theme}
                onChange={(e) => handleSelect('theme', e.target.value)}
                className={styles.select}
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="auto">Auto</option>
              </select>
            </div>

            <div className={styles.settingItem}>
              <div>
                <div className={styles.settingLabel}>Language</div>
                <div className={styles.settingDescription}>Select your language</div>
              </div>
              <select
                name="language"
                id="language"
                value={settings.language}
                onChange={(e) => handleSelect('language', e.target.value)}
                className={styles.select}
              >
                <option value="en">English</option>
                <option value="fr">French</option>
                <option value="es">Spanish</option>
              </select>
            </div>
          </div>
        </div>

        {/* Security */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <Lock size={24} className={styles.cardIcon} />
            <h2>Security</h2>
          </div>
          <div className={styles.settingsList}>
            <button className={styles.actionButton}>
              <Lock size={18} />
              Change Password
            </button>
            <button className={styles.actionButton}>
              <Shield size={18} />
              Two-Factor Authentication
            </button>
          </div>
        </div>

        {/* Data & Backup (Admin Only) */}
        {isAdmin && (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <Database size={24} className={styles.cardIcon} />
              <h2>Data & Backup</h2>
            </div>
            <div className={styles.settingsList}>
              <div className={styles.settingItem}>
                <div>
                  <div className={styles.settingLabel}>Auto Backup</div>
                  <div className={styles.settingDescription}>Automatically backup your farm data</div>
                </div>
                <label className={styles.toggle}>
                  <input
                    type="checkbox"
                    name="autoBackup"
                    id="autoBackup"
                    checked={settings.autoBackup}
                    onChange={() => handleToggle('autoBackup')}
                  />
                  <span className={styles.slider}></span>
                </label>
              </div>

              <div className={styles.settingItem}>
                <div>
                  <div className={styles.settingLabel}>Backup Frequency</div>
                  <div className={styles.settingDescription}>How often to backup data</div>
                </div>
                <select
                  name="backupFrequency"
                  id="backupFrequency"
                  value={settings.backupFrequency}
                  onChange={(e) => handleSelect('backupFrequency', e.target.value)}
                  className={styles.select}
                  disabled={!settings.autoBackup}
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              <button className={styles.actionButton}>
                <Database size={18} />
                Export All Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SettingsPage;