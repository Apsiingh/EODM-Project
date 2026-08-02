import axios from 'axios';

export const validationService = {
  validateDocument: async (documentId: string) => {
    return axios.post(`/api/validation/check/${documentId}`);
  },
  getValidationQueue: async () => {
    return axios.get('/api/validation/queue');
  }
};
