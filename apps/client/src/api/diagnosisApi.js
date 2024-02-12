import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'diagnosis/';

export const diagnosisApi = (apiClient) => ({
    
  getDiagnosisList: async (headers) => {
    const response = await apiClient.get(`${prefix}`, headers);
    return packageResponse(response);
  },

  addNewDiagnosis: async (body) => {
    const response = await apiClient.post(`${prefix}`, body);
    return packageResponse(response);
  },

  updateDiagnosis: async (body) => {
    const response = await apiClient.patch(`${prefix}`, body);
    return packageResponse(response);
  },

  deleteDiagnosis: async (body) => {
    const response = await apiClient.delete(`${prefix}`, body);
    return packageResponse(response);
  },



})