import axios from 'axios';

export const ocrService = {
  processOcr: async (documentId: string) => {
    return axios.post(`/api/ocr/process/${documentId}`);
  },
  getOcrResult: async (jobId: string) => {
    return axios.get(`/api/ocr/result/${jobId}`);
  }
};
