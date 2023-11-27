import { packageResponse } from '../utils/apiUtils.js';
const prefix = 'statistic/';

export const statisticApi = (apiClient) => ({
  getTotalAmountUsers: async () => {
    const response = await apiClient.get(`${prefix}getTotalAmountUsers`);
    return packageResponse(response);
  },

  getActiveUsers: async (headers) => {
    const response = await apiClient.get(`${prefix}getActiveUsers`, headers);
    return packageResponse(response);
  },

  allCasesStatistics: async (headers) => {
    const response = await apiClient.get(`${prefix}allCasesStatistics`, headers);
    return packageResponse(response);
  },
});
