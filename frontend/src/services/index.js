import api from './api';

// Authentication API calls
export const authService = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  register: (username, email, password) => api.post('/auth/register', { username, email, password }),
  logout: () => api.get('/auth/logout'),
  getCurrentUser: () => api.get('/auth/me'),
};

// Leads API calls
export const leadsService = {
  getAllLeads: (params) => api.get('/leads', { params }),
  getLeadById: (id) => api.get(`/leads/${id}`),
  createLead: (data) => api.post('/leads', data),
  updateLead: (id, data) => api.put(`/leads/${id}`, data),
  deleteLead: (id) => api.delete(`/leads/${id}`),
  addNote: (leadId, noteData) => api.post(`/leads/${leadId}/notes`, noteData),
  summarizeNotes: (id) => api.post(`/leads/${id}/summarize`),
};

// Dashboard API calls
export const dashboardService = {
  getStats: () => api.get('/dashboard'),
};
