export const authApi = (apiClient) => ({
  login: async (data) => apiClient.post('user/login', data).json(),

  logout: async (data) => apiClient.post('logout', { json: data }).json(),

  register: async (data) => apiClient.post('register', { json: data }).json(),

  resetPassword: async (data) => apiClient.post('reset-password', { json: data }).json(),
});
