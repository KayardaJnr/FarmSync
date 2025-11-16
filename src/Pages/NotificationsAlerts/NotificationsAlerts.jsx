import React, { useState } from 'react';
import { Bell, AlertCircle, AlertTriangle, Info, CheckCircle, Trash2, Check, X } from 'lucide-react';
import StatCard from '../../components/common/StatCard/StatCard';
import styles from './NotificationsAlerts.module.css';

const NotificationsAlertsPage = ({ data, db, userId }) => {
  const [filter, setFilter] = useState('all'); // all, unread, critical, warning, info

  const unreadCount = data.notifications.filter(n => !n.read).length;
  const criticalCount = data.notifications.filter(n => n.type === 'critical').length;
  const warningCount = data.notifications.filter(n => n.type === 'warning').length;

  const handleMarkAsRead = async (notificationId) => {
    if (!db || !userId) return;
    
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const notifRef = doc(db, `artifacts/${appId}/users/${userId}/notifications/${notificationId}`);
      await updateDoc(notifRef, { read: true });
    } catch (error) {
      console.error("Error marking notification as read: ", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    if (!db || !userId) return;
    
    try {
      const { doc, updateDoc } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const unreadNotifications = data.notifications.filter(n => !n.read);
      
      for (const notification of unreadNotifications) {
        const notifRef = doc(db, `artifacts/${appId}/users/${userId}/notifications/${notification.id}`);
        await updateDoc(notifRef, { read: true });
      }
    } catch (error) {
      console.error("Error marking all as read: ", error);
    }
  };

  const handleDelete = async (notificationId) => {
    if (!db || !userId) return;
    
    try {
      const { doc, deleteDoc } = await import('firebase/firestore');
      const appId = 'farmsync-app';
      
      const notifRef = doc(db, `artifacts/${appId}/users/${userId}/notifications/${notificationId}`);
      await deleteDoc(notifRef);
    } catch (error) {
      console.error("Error deleting notification: ", error);
    }
  };

  const filteredNotifications = data.notifications.filter(n => {
    if (filter === 'all') return true;
    if (filter === 'unread') return !n.read;
    return n.type === filter;
  });

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'critical':
        return AlertCircle;
      case 'warning':
        return AlertTriangle;
      case 'success':
        return CheckCircle;
      default:
        return Info;
    }
  };

  const NotificationCard = ({ notification }) => {
    const Icon = getNotificationIcon(notification.type);
    
    return (
      <div className={`${styles.notificationCard} ${styles[notification.type]} ${notification.read ? styles.read : styles.unread}`}>
        <div className={styles.iconWrapper}>
          <Icon size={24} />
        </div>
        
        <div className={styles.content}>
          <div className={styles.header}>
            <h3 className={styles.title}>{notification.title}</h3>
            {!notification.read && <span className={styles.unreadBadge}>New</span>}
          </div>
          <p className={styles.message}>{notification.message}</p>
          <p className={styles.time}>{notification.time}</p>
        </div>
        
        <div className={styles.actions}>
          {!notification.read && (
            <button 
              onClick={() => handleMarkAsRead(notification.id)}
              className={styles.actionButton}
              title="Mark as read"
            >
              <Check size={18} />
            </button>
          )}
          <button 
            onClick={() => handleDelete(notification.id)}
            className={`${styles.actionButton} ${styles.deleteButton}`}
            title="Delete"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Notifications & Alerts</h1>
        {unreadCount > 0 && (
          <button onClick={handleMarkAllAsRead} className={styles.markAllButton}>
            <Check size={18} />
            Mark All as Read
          </button>
        )}
      </div>

      {/* Stats Row */}
      <div className={styles.statsRow}>
        <StatCard title="Unread" value={unreadCount} icon={Bell} color="blue" small />
        <StatCard title="Critical Alerts" value={criticalCount} icon={AlertCircle} color="red" small />
        <StatCard title="Warnings" value={warningCount} icon={AlertTriangle} color="yellow" small />
        <StatCard title="Total Notifications" value={data.notifications.length} icon={Info} color="green" small />
      </div>

      {/* Filter Tabs */}
      <div className={styles.filterTabs}>
        {[
          { label: 'All', value: 'all' },
          { label: 'Unread', value: 'unread' },
          { label: 'Critical', value: 'critical' },
          { label: 'Warnings', value: 'warning' },
          { label: 'Info', value: 'info' },
        ].map((tab) => (
          <button
            key={tab.value}
            onClick={() => setFilter(tab.value)}
            className={`${styles.filterTab} ${filter === tab.value ? styles.active : ''}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className={styles.notificationsList}>
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((notification) => (
            <NotificationCard key={notification.id} notification={notification} />
          ))
        ) : (
          <div className={styles.emptyState}>
            <Bell size={64} className={styles.emptyIcon} />
            <h3 className={styles.emptyTitle}>No notifications</h3>
            <p className={styles.emptyText}>
              {filter === 'all' 
                ? "You're all caught up! No notifications to show."
                : `No ${filter} notifications at the moment.`
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationsAlertsPage;