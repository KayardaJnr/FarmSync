import React, { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ menuItems, unreadCount, onLogout, isCollapsed, setIsCollapsed }) => {
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 769px)');
    const handle = (e) => setIsDesktop(e.matches);
    // set initial
    setIsDesktop(mq.matches);
    // listen for changes
    if (mq.addEventListener) mq.addEventListener('change', handle);
    else mq.addListener(handle);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', handle);
      else mq.removeListener(handle);
    };
  }, []);

  // On desktop always show sidebar (not collapsed). On mobile, use collapse state.
  const open = isDesktop ? true : !isCollapsed;
  return (
    <>
      <div className={`${styles.sidebar} ${open ? styles.open : styles.collapsed}`}>
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
            onClick={() => setIsCollapsed && setIsCollapsed(true)}
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
        onClick={() => {
          setIsCollapsed && setIsCollapsed(true);
          onLogout && onLogout();
        }}
        className={`${styles.navItem} ${styles.logout}`}
      >
        <LogOut size={18} />
        <span className={styles.navLabel}>Logout</span>
      </button>
    </nav>
      </div>
      {/* overlay only meaningful on mobile when sidebar is open */}
      {!isDesktop && (
        <div
          className={styles.overlay}
          onClick={() => setIsCollapsed && setIsCollapsed(true)}
        />
      )}
    </>
  );
};

export default React.memo(Sidebar);
