export const useErrors = () => {
  const handleApiError = (response) => {
    if (response.status === 401 && response.data === 'Invalid refresh token') {
      //set user null
    }
  };

  return { handleApiError };
};
