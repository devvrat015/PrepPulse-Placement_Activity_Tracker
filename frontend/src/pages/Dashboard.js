import React, { useEffect, useState } from 'react';
import { analyticsAPI } from '../api/endpoints';
import { StatCard } from '../components/StatCard';
import { DistributionChart } from '../components/DistributionChart';
import styles from './Dashboard.module.css';

export const Dashboard = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const res = await analyticsAPI.getSummary();
      setAnalytics(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading dashboard...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  if (!analytics) {
    return <div className={styles.container}><p>No data available</p></div>;
  }

  const scoreColor =
    analytics.readinessScore >= 70 ? '#43e97b' : analytics.readinessScore >= 40 ? '#f093fb' : '#fa709a';

  return (
    <div className={styles.container}>
      <h1>📊 Placement Readiness Dashboard</h1>

      {/* Main Stats */}
      <div className={styles.grid}>
        <StatCard
          icon="🔥"
          label="Current Streak"
          value={`${analytics.streak} days`}
          color="#f093fb"
        />
        <StatCard
          icon="⏱️"
          label="Weekly Effort"
          value={`${analytics.weeklyEffort} hrs`}
          color="#4facfe"
        />
        <StatCard
          icon="✅"
          label="Total Activities"
          value={analytics.totalActivities}
          color="#667eea"
        />
        <StatCard
          icon="🎯"
          label="Readiness Score"
          value={analytics.readinessScore}
          color={scoreColor}
        />
      </div>

      {/* Charts */}
      <div className={styles.chartsSection}>
        <div className={styles.chartCard}>
          <h2>Activity Distribution</h2>
          <DistributionChart distribution={analytics.distribution} />
        </div>

        <div className={styles.chartCard}>
          <h2>Weak Area Alert</h2>
          <div className={styles.weakArea}>
            <h3>{analytics.weakArea.type}</h3>
            <p>{analytics.weakArea.suggestion}</p>
          </div>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className={styles.scoreCard}>
        <h2>📈 Score Breakdown</h2>
        <div className={styles.scoreDetails}>
          <div className={styles.scoreItem}>
            <span>Streak (30%)</span>
            <span>{Math.round((analytics.streak / 14) * 30)}/30</span>
          </div>
          <div className={styles.scoreItem}>
            <span>Weekly Effort (30%)</span>
            <span>{Math.round((analytics.weeklyEffort / 10) * 30)}/30</span>
          </div>
          <div className={styles.scoreItem}>
            <span>Activity Balance (20%)</span>
            <span>Calculated</span>
          </div>
          <div className={styles.scoreItem}>
            <span>Interview Practice (20%)</span>
            <span>Calculated</span>
          </div>
        </div>
      </div>
    </div>
  );
};
