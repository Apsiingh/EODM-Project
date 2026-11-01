import axios from 'axios';

const API_BASE = '/api/auth';

export interface LoginCredentials {
  email?: string;
  username?: string;
  password: string;
}

export interface RegisterPayload {
  username: string;
  email: string;
  password: string;
  designation?: string;
  role?: string;
}

export interface AuthUserData {
  id: string;
  username: string;
  email: string;
  designation?: string;
  status?: string;
  roles?: string[];
}

export interface AuthResponseData {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  user: AuthUserData;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponseData> => {
    const response = await axios.post(`${API_BASE}/login`, credentials);
    if (response.data?.accessToken) {
      localStorage.setItem('auth_token', response.data.accessToken);
      localStorage.setItem('refresh_token', response.data.refreshToken);
      localStorage.setItem('auth_user', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  register: async (payload: RegisterPayload): Promise<AuthResponseData> => {
    const response = await axios.post(`${API_BASE}/register`, payload);
    return response.data;
  },

  logout: async () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('auth_user');
    return Promise.resolve(true);
  },

  refreshToken: async (token?: string): Promise<AuthResponseData> => {
    const refreshToken = token || localStorage.getItem('refresh_token');
    if (!refreshToken) throw new Error('No refresh token stored');
    const response = await axios.post(`${API_BASE}/refresh`, { refreshToken });
    if (response.data?.accessToken) {
      localStorage.setItem('auth_token', response.data.accessToken);
    }
    return response.data;
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) return null;
    const response = await axios.get(`${API_BASE}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return response.data;
  },

  checkHealth: async () => {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  }
};
