import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/common/Sidebar/Sidebar';
import TopBar from '../components/common/TopBar/TopBar';
import styles from './MainLayout.module.css';

const MainLayout = ({ 
  menuItems, 
  unreadCount, 
  isCollapsed, 
  setIsCollapsed, 
  onLogout,
  user
}) => {
  return (
    <div className={styles.layout}>
      <Sidebar
        menuItems={menuItems}
        unreadCount={unreadCount}
        isCollapsed={isCollapsed}
        setIsCollapsed={setIsCollapsed}
        onLogout={onLogout}
      />
      <div className={styles.mainContent}>
        <TopBar user={user} unreadCount={unreadCount} />
        <div className={styles.content}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;