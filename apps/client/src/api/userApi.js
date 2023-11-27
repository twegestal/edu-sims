import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'user/';

export const userApi = (apiClient) => ({
  getUser: async () => {
    const response = await apiClient.get(`${prefix}`);
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

  assingAdminPrivilege: async (headers) => {
    const response = await apiClient.put(`${prefix}assingAdminPrivilege`, headers);
    return packageResponse(response);
  },

  revokeAdminPrivilege: async (headers) => {
    const response = await apiClient.put(`${prefix}revokeAdminPrivilege`, headers);
    return packageResponse(response);
  },

  createUserGroup: async (headers) => {
    const response = await apiClient.post(`${prefix}createUserGroup`, headers);
    return packageResponse(response);
  },

  updatePassword: async (headers, body) => {
    const response = await apiClient.patch(`${prefix}update-password`, headers, body);
    return packageResponse(response);
  },

  updateUsername: async (headers, body) => {
    const response = await apiClient.patch(`${prefix}updateUsername`, headers, body);
    return packageResponse(response);
  },
});
