import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'auth/'

export const authApi = (apiClient) => ({
  login: async (body) => {
    const response = await apiClient.post(`${prefix}login`, body);
    return packageResponse(response);
  },

  register: async (body) => {
    const response = await apiClient.post(`${prefix}register`, body);
    return packageResponse(response);
  },

  refreshToken: async () => {
    const response = await apiClient.get(`${prefix}refreshToken`);
    return packageResponse(response);
  },
});
