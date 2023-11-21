export const authApi = (apiClient) => ({
  login: async (body) => {
    const response = await apiClient.post('auth/login', body);
    return { status: response.status, headers: response.headers, data: await response.json() };
  },

  logout: async (data) => apiClient.post('user/logout', data).json(),

  register: async (body) => {
    const response = await apiClient.post('auth/register', body);
    return { status: response.status, headers: response.headers, data: await response.json() };
  },

  resetPassword: async (body) => apiClient.post('auth/reset-password', body).json(),

  refresh: async () => apiClient.post('auth/refresh').json(),
});
