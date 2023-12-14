import { useState, createContext, useContext, useEffect } from 'react';
import { useApi } from './useApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const loginApi = useApi('login');
  const registerApi = useApi('register');
  const refreshTokenApi = useApi('refreshToken');

  useEffect(() => {
    if (user === null) {
      refreshAuth();
    }
  }, []);

  const refreshAuth = async () => {
    try {
      const response = await refreshTokenApi();
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      console.error('error refreshing auth: ', error);
    }
  };

  const login = async (email, password) => {
    try {
      const response = await loginApi({ body: { email, password } });
      if (response.data.token) {
        setUser(response.data);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Login failed', error);
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

  const updateToken = (token) => {
    const updatedUser = user;
    updatedUser.token = token;
    setUser(updatedUser);
  };

  const setUserNull = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, updateToken, setUserNull }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
