import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'user/';

export const userApi = (apiClient) => ({
  getUser: async () => {
    const response = await apiClient.get('/user');
    return packageResponse(response);
  },

  getAllUsers: async (headers) => {
    const response = await apiClient.get(`${prefix}getAllUsers`, headers);
    return packageResponse(response);
  },

  clearUserInfo: async (headers) => {
    const response = await apiClient.put(`${prefix}clearUserInfo`, headers);
    return packageResponse(response);
  },

  createUserGroup: async (headers) => {
    const response = await apiClient.post(`${prefix}createUserGroup`, headers);
    return packageResponse(response);
  },
});
