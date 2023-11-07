import { useQuery } from '@tanstack/react-query';

import { useApi } from './useApi.js';
import { useAuth } from './useAuth.jsx';

export const useUser = () => {
  const { user } = useAuth();
  const getUser = useApi('getUser');
  return useQuery(['user'], getUser, {
    staleTime: 5 * 60 * 1000,
    enabled: !!user.token,
  });
};
