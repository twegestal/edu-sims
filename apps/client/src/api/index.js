import { authApi } from './authApi.js';
import { caseApi } from './caseApi.js';
import { userApi } from './userApi.js';

export const api = (apiClient) =>
  Object.freeze({
    ...caseApi(apiClient),
    ...userApi(apiClient),
    ...authApi(apiClient),
  });
