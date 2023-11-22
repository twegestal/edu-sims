import { useAuth } from './useAuth.jsx';

export const useErrors = () => {
  const { refresh } = useAuth();

  const handleApiError = (response) => {
    if (response.status === 401 && response.data === 'Invalid token') {
      refresh();
    } else if (response.status === 401 && response.data === 'Invalid refresh token') {
      //set user null
    }
  };

  return { handleApiError };
};
