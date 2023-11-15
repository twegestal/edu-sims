import { useMemo } from 'react';
import ky from 'ky';
import { useAuth } from './useAuth.jsx';
import { api } from '../api/index.js';

const prefixUrl = '/api';

const getHeaders = (token) => ({
  'Content-Type': 'application/json',
  ...(token ? { Authorization: `Bearer ${token}` } : {}),
});

export const useApi = (method) => {
  const { user } = useAuth() || {};
  const token = user ? user.token : undefined;

  const apiClient = useMemo(
    () =>
      ky.create({
        prefixUrl,
        headers: getHeaders(token),
      }),
    [token],
  );

  return async (options = {}) => {
    const { body, headers: customHeaders } = options;
    const finalOptions = {
      json: body,
      headers: {
        ...getHeaders(token),
        ...customHeaders,
      },
    };
    const apiMethod = api(apiClient)[method];
    if (typeof apiMethod !== 'function') {
      throw new Error(`API method '${method}' is not defined`);
    }

    return apiMethod(finalOptions);
  };
};
