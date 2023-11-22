import { useState, createContext, useContext } from 'react';
import { useApi } from './useApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loginApi = useApi('login');
  const logoutApi = useApi('logout');
  const resetPasswordApi = useApi('resetPassword');
  const registerApi = useApi('register');

  const login = async (email, password) => {
    try {
      const response = await loginApi({ body: { email, password } });
      if (response.data.token) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('Login failed', error);
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

  const register = async ({ email, password, group_id }) => {
    try {
      const response = await registerApi({
        body: {
          email: email,
          password: password,
          group_id: group_id,
        },
      });

      if (response.status === 201) {
        login(email, password);
      }
    } catch (error) {
      console.error('Registration failed', error);
    }
  };

  const resetPassword = async (email) => {
    try {
      //await resetPassword(email);
    } catch (error) {
      console.error('Reset password error', error);
    }
  };

  const updateToken = (token) => {
    const updatedUser = user;
    updatedUser.token = token;
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, register, updateToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
