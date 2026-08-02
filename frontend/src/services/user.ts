import axios from 'axios';

export const userService = {
  getUsers: async () => {
    return axios.get('/api/users');
  },
  getUserById: async (id: string) => {
    return axios.get(`/api/users/${id}`);
  },
  updateUser: async (id: string, data: any) => {
    return axios.put(`/api/users/${id}`, data);
  }
};
