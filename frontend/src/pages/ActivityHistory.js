import React, { useEffect, useState } from 'react';
import { activityAPI } from '../api/endpoints';
import { formatDate, formatDateForInput, getRelativeTime, getActivityColor } from '../utils/helpers';
import styles from './ActivityHistory.module.css';

export const ActivityHistory = () => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const res = await activityAPI.getActivities();
      setActivities(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load activities');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this activity?')) return;

    try {
      await activityAPI.deleteActivity(id);
      setActivities((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete activity');
    }
  };

  if (loading) {
    return <div className={styles.container}><p>Loading activities...</p></div>;
  }

  if (error) {
    return <div className={styles.container}><p style={{ color: 'red' }}>{error}</p></div>;
  }

  return (
    <div className={styles.container}>
      <h1>📝 Activity History</h1>

      {activities.length === 0 ? (
        <div className={styles.empty}>
          <p>No activities yet. Start by adding one!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {activities.map((activity) => (
            <div
              key={activity._id}
              className={styles.item}
              style={{ borderLeftColor: getActivityColor(activity.type) }}
            >
              <div className={styles.header}>
                <div className={styles.typeAndDate}>
                  <span
                    className={styles.type}
                    style={{ backgroundColor: getActivityColor(activity.type) }}
                  >
                    {activity.type}
                  </span>
                  <span className={styles.date}>{formatDate(activity.date)}</span>
                  <span className={styles.relative}>{getRelativeTime(activity.createdAt)}</span>
                </div>
                <button
                  onClick={() => handleDelete(activity._id)}
                  className={styles.deleteBtn}
                  title="Delete activity"
                >
                  ✕
                </button>
              </div>

              <div className={styles.details}>
                <div className={styles.detail}>
                  <span className={styles.label}>Duration</span>
                  <span className={styles.value}>{activity.duration} min</span>
                </div>
                <div className={styles.detail}>
                  <span className={styles.label}>Confidence</span>
                  <span className={styles.value}>⭐ {activity.confidenceLevel}/5</span>
                </div>
              </div>

              {activity.notes && <p className={styles.notes}>{activity.notes}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
