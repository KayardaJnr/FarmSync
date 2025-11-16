import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import styles from './Sidebar.module.css';

const Sidebar = ({ 
  menuItems, 
  unreadCount, 
  isCollapsed, 
  setIsCollapsed, 
  onLogout 
}) => (
  <div className={`${styles.sidebar} ${isCollapsed ? styles.collapsed : ''}`}>
    <div className={styles.header}>
      {!isCollapsed && (
        <div className={styles.logo}>
          <span className={styles.logoText}>FarmSync</span>
          <span className={styles.logoSubtext}>Poultry Management System</span>
        </div>
      )}
      
      <button 
        onClick={() => setIsCollapsed(!isCollapsed)} 
        className={styles.toggleButton}
      >
        <Menu size={24} />
      </button>
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
              `${styles.navItem} ${isActive ? styles.active : ''} ${isCollapsed ? styles.collapsed : ''}`
            }
            title={isCollapsed ? item.label : ''}
          >
            <Icon size={18} />
            {!isCollapsed && <span className={styles.navLabel}>{item.label}</span>}
            
            {showBadge && !isCollapsed && (
              <span className={styles.badge}>{unreadCount}</span>
            )}
            {showBadge && isCollapsed && (
              <span className={styles.badgeCollapsed}>{unreadCount}</span>
            )}
          </NavLink>
        );
      })}
      
      <button 
        onClick={onLogout} 
        className={`${styles.navItem} ${styles.logout} ${isCollapsed ? styles.collapsed : ''}`}
        title={isCollapsed ? 'Logout' : ''}
      >
        <LogOut size={18} />
        {!isCollapsed && <span className={styles.navLabel}>Logout</span>}
      </button>
    </nav>
  </div>
);

export default Sidebar;