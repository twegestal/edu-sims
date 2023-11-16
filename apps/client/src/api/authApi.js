export const authApi = (apiClient) => ({
  login: async (data) => apiClient.post('user/login', data).json(),

  logout: async (data) => apiClient.post('logout', { json: data }).json(),

  register: async (body) => {
    const response = await apiClient.post('register', body);
    return { status: response.status, headers: response.headers, data: await response.json() };
  },

  resetPassword: async (data) => apiClient.post('reset-password', { json: data }).json(),
});
