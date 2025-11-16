import React from 'react';
import styles from './IconInput.module.css';

const IconInput = ({ icon, endIcon, onEndIconClick, ...props }) => {
  const Icon = icon;
  const EndIcon = endIcon;
  
  return (
    <div className={styles.container}>
      {Icon && (
        <div className={styles.startIcon}>
          <Icon size={18} />
        </div>
      )}
      <input 
        {...props}
        className={`${styles.input} ${Icon ? styles.withStartIcon : ''} ${endIcon ? styles.withEndIcon : ''}`}
      />
      {EndIcon && (
        <button 
          type="button" 
          onClick={onEndIconClick} 
          className={styles.endIcon}
        >
          <EndIcon size={18} />
        </button>
      )}
    </div>
  );
};

export default IconInput;