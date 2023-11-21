const prefix = 'user/';

export const userApi = (apiClient) => ({
  getUser: async () => apiClient.get('/user').json(),

  getAllUsers: async (headers) => apiClient.get(`${prefix}getAllUsers`, headers).json(),

  clearUserInfo: async (headers) => apiClient.put(`${prefix}clearUserInfo`, headers).json(),

  createUserGroup: async (headers) => apiClient.post(`${prefix}createUserGroup`, headers).json(),
});
