import { packageResponse } from '../utils/apiUtils.js';

export const authApi = (apiClient) => ({
  login: async (body) => {
    const response = await apiClient.post('auth/login', body);
    return packageResponse(response);
  },

  logout: async (data) => {
    const response = await apiClient.post('user/logout', data);
    return packageResponse(response);
  },

  register: async (body) => {
    const response = await apiClient.post('auth/register', body);
    return packageResponse(response);
  },

  resetPassword: async (body) => {
    const response = await apiClient.post('auth/reset-password', body);
    return packageResponse(response);
  },
});
