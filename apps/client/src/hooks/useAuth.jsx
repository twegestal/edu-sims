import { useState, createContext, useContext } from 'react';
import { useApi } from './useApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loginApi = useApi('login');
  const logoutApi = useApi('logout');
  const resetPasswordApi = useApi('resetPassword');

  const login = async (email, password) => {
    try {
      const userData = await loginApi({ body: { email, password } });
      if (userData.token) {
        setUser(userData);
      }
    } catch (error) {
      console.log('Login failed', error);
    }
  };

  const logout = async (id) => {
    try {
      //await logoutApi(id);
      setUser(null);
    } catch (error) {
      console.error('Logout failed', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      //await resetPassword(email);
    } catch (error) {
      console.error('Reset password error', error);
    }
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
