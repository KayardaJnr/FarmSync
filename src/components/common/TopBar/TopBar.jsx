import React, { useState } from 'react';
import { Search, Bell, User, ChevronDown } from 'lucide-react';
import styles from './TopBar.module.css';

const TopBar = ({ user, unreadCount }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e) => {
    e.preventDefault();
    // Implement search functionality here
    console.log('Searching for:', searchQuery);
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
        </form>
      </div>

      {/* Right Section */}
      <div className={styles.rightSection}>
        {/* Notifications */}
        <button className={styles.iconButton}>
          <Bell size={20} />
          {unreadCount > 0 && (
            <span className={styles.badge}>{unreadCount}</span>
          )}
        </button>

        {/* User Menu */}
        <div className={styles.userMenu}>
          <button 
            className={styles.userButton}
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className={styles.userAvatar}>
              <User size={20} />
            </div>
            <div className={styles.userInfo}>
              <span className={styles.userName}>
                {user?.displayName || user?.email || 'Farm User'}
              </span>
              <span className={styles.userRole}>Admin</span>
            </div>
            <ChevronDown size={16} className={styles.chevron} />
          </button>

          {showUserMenu && (
            <div className={styles.dropdown}>
              <div className={styles.dropdownItem}>
                <User size={16} />
                <span>Profile</span>
              </div>
              <div className={styles.dropdownItem}>
                <Bell size={16} />
                <span>Notifications</span>
              </div>
              <div className={`${styles.dropdownItem} ${styles.divider}`}>
                Settings
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;