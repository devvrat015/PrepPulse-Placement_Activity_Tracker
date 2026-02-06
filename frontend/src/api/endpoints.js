import api from './axios';

export const authAPI = {
  register: (name, email, password) => api.post('/auth/register', { name, email, password }),
  login: (email, password) => api.post('/auth/login', { email, password }),
  getMe: () => api.get('/auth/me'),
};

export const activityAPI = {
  createActivity: (data) => api.post('/activities', data),
  getActivities: () => api.get('/activities'),
  getWeeklyActivities: () => api.get('/activities/weekly'),
  deleteActivity: (id) => api.delete(`/activities/${id}`),
};

export const applicationAPI = {
  createApplication: (data) => api.post('/applications', data),
  getApplications: () => api.get('/applications'),
  updateApplication: (id, data) => api.patch(`/applications/${id}`, data),
  deleteApplication: (id) => api.delete(`/applications/${id}`),
};

export const analyticsAPI = {
  getSummary: () => api.get('/analytics/summary'),
};
