import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'medical-field/';

export const medicalFieldApi = (apiClient) => ({
  
  getMedicalFields: async () => {
    const response = await apiClient.get(`${prefix}`);
    return packageResponse(response);
  },

  addMedicalField: async (body) => {
    const response = await apiClient.post(`${prefix}`, body);
    return packageResponse(response);
  },

  updateMedicalField: async (body) => {
    const response = await apiClient.patch(`${prefix}`, body);
    return packageResponse(response);
  },

  deleteMedicalField: async (body) => {
    const response = await apiClient.delete(`${prefix}`, body);
    return packageResponse(response);
  }

})