import axios from 'axios';

export const documentService = {
  uploadDocument: async (formData: FormData) => {
    return axios.post('/api/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
  },
  getDocuments: async () => {
    return axios.get('/api/documents');
  },
  getDocumentById: async (id: string) => {
    return axios.get(`/api/documents/${id}`);
  }
};
