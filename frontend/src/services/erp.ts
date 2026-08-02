import axios from 'axios';

export const erpService = {
  syncErp: async (documentId: string, system: 'sap' | 'oracle' | 'dynamics') => {
    return axios.post(`/api/erp/sync/${documentId}`, { system });
  },
  getErpSyncLogs: async () => {
    return axios.get('/api/erp/logs');
  }
};
