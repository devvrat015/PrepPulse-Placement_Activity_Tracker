import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { activityAPI } from '../api/endpoints';
import { formatDateForInput } from '../utils/helpers';
import styles from './ActivityForm.module.css';

export const AddActivity = () => {
  const [formData, setFormData] = useState({
    date: formatDateForInput(new Date()),
    type: 'DSA',
    duration: '',
    confidenceLevel: 3,
    notes: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'duration' || name === 'confidenceLevel' ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.duration || formData.duration <= 0) {
      setError('Duration must be greater than 0');
      return;
    }

    setLoading(true);

    try {
      await activityAPI.createActivity({
        ...formData,
        date: new Date(formData.date),
      });
      navigate('/activities');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add activity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>➕ Add Activity</h1>

        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="type">Activity Type</label>
            <select
              id="type"
              name="type"
              value={formData.type}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="DSA">DSA (Data Structures & Algorithms)</option>
              <option value="RESUME">Resume Building</option>
              <option value="INTERVIEW">Mock Interview</option>
              <option value="APPLICATION">Company Application</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="duration">Duration (minutes)</label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              min="1"
              required
              disabled={loading}
              placeholder="e.g., 60"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confidenceLevel">Confidence Level</label>
            <div className={styles.ratingInput}>
              {[1, 2, 3, 4, 5].map((level) => (
                <button
                  key={level}
                  type="button"
                  className={`${styles.ratingBtn} ${
                    formData.confidenceLevel === level ? styles.active : ''
                  }`}
                  onClick={() => setFormData((prev) => ({ ...prev, confidenceLevel: level }))}
                  disabled={loading}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="notes">Notes (Optional)</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              disabled={loading}
              placeholder="Add any notes about this activity..."
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? 'Adding...' : 'Add Activity'}
          </button>
        </form>
      </div>
    </div>
  );
};
