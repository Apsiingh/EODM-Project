import axios from 'axios';

export const workflowService = {
  getWorkflowState: async (documentId: string) => {
    return axios.get(`/api/workflow/state/${documentId}`);
  },
  approveStep: async (workflowId: string, payload: { action: string; comment?: string }) => {
    return axios.post(`/api/workflow/${workflowId}/approve`, payload);
  }
};
