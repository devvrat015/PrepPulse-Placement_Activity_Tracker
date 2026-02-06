import React from 'react';
import styles from './StatCard.module.css';

export const StatCard = ({ icon, label, value, color = '#667eea' }) => {
  return (
    <div className={styles.card} style={{ borderTopColor: color }}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.content}>
        <p className={styles.label}>{label}</p>
        <p className={styles.value}>{value}</p>
      </div>
    </div>
  );
};
