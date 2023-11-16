export const authApi = (apiClient) => ({
  login: async (body) => apiClient.post('user/login', body).json(),

  logout: async (data) => apiClient.post('logout', data).json(),

  register: async (body) => apiClient.post('user/register', body).json(),

  resetPassword: async (body) => apiClient.post('reset-password', body).json(),
});
