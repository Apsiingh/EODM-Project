import axios from 'axios';

export const reportService = {
  getDashboardMetrics: async () => {
    return axios.get('/api/reports/dashboard');
  },
  exportReport: async (format: 'pdf' | 'csv' | 'xlsx') => {
    return axios.get(`/api/reports/export?format=${format}`, { responseType: 'blob' });
  }
};
