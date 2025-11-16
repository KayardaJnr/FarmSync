import React, { useState, useRef } from 'react';
import { Search, Bell, User, ChevronDown, Settings, LogOut as LogOutIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useClickOutside from '../../../hooks/useClickOutside';
import styles from './TopBar.module.css';

const TopBar = ({ user, unreadCount, onLogout }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const userMenuRef = useRef(null);
  const navigate = useNavigate();

  // Close user menu when clicking outside
  useClickOutside(userMenuRef, () => setShowUserMenu(false));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      console.log('Searching for:', searchQuery);
      // TODO: Implement actual search functionality
      // You can filter data across all pages or navigate to a search results page
      alert(`Search functionality coming soon! Query: ${searchQuery}`);
    }
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
  };

  const handleProfileClick = () => {
    setShowUserMenu(false);
    // TODO: Navigate to profile page when created
    alert('Profile page coming soon!');
  };

  const handleSettingsClick = () => {
    setShowUserMenu(false);
    // TODO: Navigate to settings page when created
    alert('Settings page coming soon!');
  };

  const handleLogoutClick = () => {
    setShowUserMenu(false);
    if (onLogout) {
      onLogout();
    }
  };

  // Get user display info
  const getUserName = () => {
    if (user?.displayName) return user.displayName;
    if (user?.email) return user.email.split('@')[0];
    return 'Farm User';
  };

  const getUserEmail = () => {
    return user?.email || 'user@farmsync.com';
  };

  const getUserInitials = () => {
    const name = getUserName();
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className={styles.topBar}>
      {/* Search Bar */}
      <div className={styles.searchSection}>
        <form onSubmit={handleSearch} className={styles.searchForm}>
          <Search size={20} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search batches, inventory, records..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
          {searchQuery && (
            <button 
              type="button" 
              onClick={() => setSearchQuery('')}
              className={styles.clearButton}
            >
              ×
            </button>
          )}
        </form>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Notifications */}
        <button 
          className={styles.iconButton}
          onClick={handleNotificationsClick}
          title="View notifications"
        >
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>

        {/* User Menu */}
        <div className={styles.userMenu} ref={userMenuRef}>
          <button 
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              {getUserInitials()}
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {getUserName()}
              </span>
              <span className={styles.userRole}>Admin</span>
            </div>
            <ChevronDown 
              size={16} 
              className={`${styles.chevron} ${showUserMenu ? styles.rotated : ''}`} 
            />
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownHeader}>
                <div className={styles.dropdownAvatar}>
                  {getUserInitials()}
                </div>
                <div>
                  <div className={styles.dropdownName}>{getUserName()}</div>
                  <div className={styles.dropdownEmail}>{getUserEmail()}</div>
                </div>
              </div>

              <div className={styles.dropdownDivider}></div>

              <button className={styles.dropdownItem} onClick={handleProfileClick}>
                <User size={16} />
                <span>Profile</span>
              </button>

              <button 
                className={styles.dropdownItem} 
                onClick={handleNotificationsClick}
              >
                <Bell size={16} />
                <span>Notifications</span>
                {unreadCount > 0 && (
                  <span className={styles.dropdownBadge}>{unreadCount}</span>
                )}
              </button>

              <button className={styles.dropdownItem} onClick={handleSettingsClick}>
                <Settings size={16} />
                <span>Settings</span>
              </button>

              <div className={styles.dropdownDivider}></div>

              <button 
                className={`${styles.dropdownItem} ${styles.logout}`}
                onClick={handleLogoutClick}
              >
                <LogOutIcon size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;