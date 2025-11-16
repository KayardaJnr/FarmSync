import React from 'react';
import styles from './StatCard.module.css';

const StatCard = ({ title, value, icon, color = 'gray', small = false }) => {
  const Icon = icon;
  
  return (
    <div className={`${styles.card} ${styles[color]} ${small ? styles.small : ''}`}>
      <div className={styles.content}>
        <div>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
        </div>
        {Icon && (
          <div className={`${styles.iconWrapper} ${styles[`icon_${color}`]}`}>
            <Icon size={24} />
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;