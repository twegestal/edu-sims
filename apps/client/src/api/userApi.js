export const userApi = (apiClient) => ({
  getUser: async () => apiClient.get('/user').json(),
});
