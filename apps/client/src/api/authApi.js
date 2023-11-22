import { packageResponse } from "../utils/apiUtils.js";

export const authApi = (apiClient) => ({
  login: async (body) => packageResponse(apiClient.post('auth/login', body)),

  logout: async (data) => packageResponse(apiClient.post('user/logout', data)),

  register: async (body) => packageResponse(apiClient.post('auth/register', body)),

  resetPassword: async (body) => packageResponse(apiClient.post('auth/reset-password', body)),

  refresh: async () => packageResponse(apiClient.post('auth/refresh')),
});
