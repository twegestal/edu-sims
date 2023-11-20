export const authApi = (apiClient) => ({
  login: async (body) => {
    const response = await apiClient.post('user/login', body);
    return { status: response.status, headers: response.headers, data: await response.json() };
  },

  logout: async (data) => apiClient.post('logout', data).json(),

  register: async (body) => {
    const response = await apiClient.post('user/register', body);
    return { status: response.status, headers: response.headers, data: await response.json() };
  },

  resetPassword: async (body) => apiClient.post('reset-password', body).json(),
});
