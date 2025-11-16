import React from 'react';
import styles from './FormMessage.module.css';

const FormMessage = ({ message }) => {
  if (!message) return null;
  
  return (
    <div className={`${styles.message} ${styles[message.type]}`}>
      {message.text}
    </div>
  );
};

export default FormMessage;