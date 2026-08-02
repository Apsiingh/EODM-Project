import axios from 'axios';

export const authService = {
  login: async (credentials: any) => {
    return axios.post('/api/auth/login', credentials);
  },
  logout: async () => {
    return axios.post('/api/auth/logout');
  },
  refreshToken: async () => {
    return axios.post('/api/auth/refresh');
  }
};
