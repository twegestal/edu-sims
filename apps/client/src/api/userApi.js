import { packageResponse } from "../utils/apiUtils.js";
const prefix = 'user/';

export const userApi = (apiClient) => ({
  getUser: async () => packageResponse(apiClient.get('/user')),

  getAllUsers: async (headers) => packageResponse(apiClient.get(`${prefix}getAllUsers`, headers)),

  clearUserInfo: async (headers) => packageResponse(apiClient.put(`${prefix}clearUserInfo`, headers)),

  createUserGroup: async (headers) => packageResponse(apiClient.post(`${prefix}createUserGroup`, headers)),
});
