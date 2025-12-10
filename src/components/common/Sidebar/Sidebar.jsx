import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ menuItems, unreadCount, onLogout }) => (
  <div className={styles.sidebar}>
    <div className={styles.header}>
    <div className={styles.logoImage}>
        <img src="src/assets/Barn.png" alt="FarmSync Logo" />
    </div>
      <div className={styles.logo}>
        <span className={styles.logoText}>FarmSync</span>
        <span className={styles.logoSubtext}>Poultry Management System</span>
      </div>
    </div>

    <nav className={styles.nav}>
      {menuItems.map((item) => {
        const Icon = item.icon;
        const showBadge = item.path === '/notifications' && unreadCount > 0;

        return (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Icon size={18} />
            <span className={styles.navLabel}>{item.label}</span>

            {showBadge && <span className={styles.badge}>{unreadCount}</span>}
          </NavLink>
        );
      })}

      <button
        onClick={onLogout}
        className={`${styles.navItem} ${styles.logout}`}
      >
        <LogOut size={18} />
        <span className={styles.navLabel}>Logout</span>
      </button>
    </nav>
  </div>
);

export default Sidebar;
