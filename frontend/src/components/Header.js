import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import styles from './Header.module.css';

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <Link to="/" className={styles.logo}>
          📊 Placement Tracker
        </Link>
        {user && (
          <nav className={styles.nav}>
            <Link to="/">Dashboard</Link>
            <Link to="/activities">Activities</Link>
            <Link to="/add-activity">Add Activity</Link>
            <Link to="/applications">Companies</Link>
            <span className={styles.user}>{user.name}</span>
            <button onClick={handleLogout} className={styles.logout}>
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
};
