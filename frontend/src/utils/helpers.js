/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

/**
 * Format date to YYYY-MM-DD for input fields
 */
export const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Get relative time string (e.g., "2 days ago")
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);

  if (seconds < 60) return 'just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

/**
 * Get activity type color
 */
export const getActivityColor = (type) => {
  const colors = {
    DSA: '#667eea',
    RESUME: '#764ba2',
    INTERVIEW: '#f093fb',
    APPLICATION: '#4facfe',
  };
  return colors[type] || '#999';
};

/**
 * Get status badge color
 */
export const getStatusColor = (status) => {
  const colors = {
    APPLIED: '#4facfe',
    OA: '#667eea',
    INTERVIEW: '#f093fb',
    OFFER: '#43e97b',
    REJECTED: '#fa709a',
  };
  return colors[status] || '#999';
};
