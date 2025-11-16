import React from 'react';
import { X } from 'lucide-react';
import styles from './Modal.module.css';

const Modal = ({ title, children, onClose }) => (
  <div className={styles.overlay}>
    <div className={styles.modal}>
      <div className={styles.header}>
        <h2 className={styles.title}>{title}</h2>
        <button onClick={onClose} className={styles.closeButton}>
          <X size={20} />
        </button>
      </div>
      <div className={styles.content}>
        {children}
      </div>
    </div>
  </div>
);

export default Modal;