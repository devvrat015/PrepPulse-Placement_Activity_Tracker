import React, { useEffect, useState } from 'react';
import { applicationAPI } from '../api/endpoints';
import { formatDate, formatDateForInput, getStatusColor } from '../utils/helpers';
import styles from './Applications.module.css';

export const Applications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    companyName: '',
    role: '',
    status: 'APPLIED',
    appliedDate: formatDateForInput(new Date()),
  });

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const res = await applicationAPI.getApplications();
      setApplications(res.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (editingId) {
        await applicationAPI.updateApplication(editingId, {
          ...formData,
          appliedDate: new Date(formData.appliedDate),
        });
        setApplications((prev) =>
          prev.map((app) => (app._id === editingId ? { ...app, ...formData } : app))
        );
        setEditingId(null);
      } else {
        const res = await applicationAPI.createApplication({
          ...formData,
          appliedDate: new Date(formData.appliedDate),
        });
        setApplications((prev) => [res.data, ...prev]);
      }
      resetForm();
      setShowForm(false);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to save application');
    }
  };

  const handleEdit = (app) => {
    setEditingId(app._id);
    setFormData({
      companyName: app.companyName,
      role: app.role,
      status: app.status,
      appliedDate: formatDateForInput(app.appliedDate),
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this application?')) return;

    try {
      await applicationAPI.deleteApplication(id);
      setApplications((prev) => prev.filter((a) => a._id !== id));
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to delete application');
    }
  };

  const resetForm = () => {
    setFormData({
      companyName: '',
      role: '',
      status: 'APPLIED',
      appliedDate: formatDateForInput(new Date()),
    });
    setEditingId(null);
  };

  if (loading) {
    return <div className={styles.container}><p>Loading applications...</p></div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>🏢 Company Applications</h1>
        <button className={styles.addBtn} onClick={() => setShowForm(!showForm)}>
          {showForm ? '✕ Close' : '➕ Add Application'}
        </button>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {showForm && (
        <div className={styles.form}>
          <h2>{editingId ? 'Edit Application' : 'Add New Application'}</h2>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                required
                placeholder="e.g., Google, Microsoft"
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="role">Role</label>
              <input
                type="text"
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label htmlFor="status">Status</label>
                <select id="status" name="status" value={formData.status} onChange={handleChange}>
                  <option value="APPLIED">Applied</option>
                  <option value="OA">OA (Online Assessment)</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="OFFER">Offer</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="appliedDate">Applied Date</label>
                <input
                  type="date"
                  id="appliedDate"
                  name="appliedDate"
                  value={formData.appliedDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className={styles.formActions}>
              <button type="submit" className={styles.submitBtn}>
                {editingId ? 'Update' : 'Add'} Application
              </button>
              <button
                type="button"
                className={styles.cancelBtn}
                onClick={() => {
                  resetForm();
                  setShowForm(false);
                }}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {applications.length === 0 ? (
        <div className={styles.empty}>
          <p>No applications yet. Start applying!</p>
        </div>
      ) : (
        <div className={styles.list}>
          {applications.map((app) => (
            <div key={app._id} className={styles.item}>
              <div className={styles.itemHeader}>
                <div>
                  <h3>{app.companyName}</h3>
                  <p className={styles.role}>{app.role}</p>
                </div>
                <span
                  className={styles.status}
                  style={{ backgroundColor: getStatusColor(app.status) }}
                >
                  {app.status}
                </span>
              </div>
              <p className={styles.appliedDate}>Applied: {formatDate(app.appliedDate)}</p>
              <div className={styles.actions}>
                <button onClick={() => handleEdit(app)} className={styles.editBtn}>
                  ✏️ Edit
                </button>
                <button onClick={() => handleDelete(app._id)} className={styles.deleteBtn}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
