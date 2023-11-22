import { useApi } from './useApi.js';
import { useAuth } from './useAuth.jsx';
import { useState } from 'react';

export const useUser = () => {
  const { user } = useAuth();
  const getUser = useApi('getUser');
  const getAllUsersApi = useApi('getAllUsers');
  const clearUserInfoApi = useApi('clearUserInfo');
  const createUserGroupApi = useApi('createUserGroup');
  const updatePasswordApi = useApi('updatePassword');

  const [allUsers, setAllUsers] = useState([]);
  const [createdUserGroup, setCreatedUserGroup] = useState([]);

  const getAllUsers = async (user_id) => {
    try {
      const response = await getAllUsersApi({ headers: { user_id: user_id } });
      if (response.status === 200) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error('error fetching all users: ', error);
    }
  };

  const clearUserInfo = async (user_id) => {
    try {
      const response = await clearUserInfoApi({ headers: { user_id: user_id } });
      return response.status === 200;
    } catch (error) {
      console.error('error clearing user info: ', error);
    }
  };

  const createUserGroup = async (name) => {
    try {
      const response = await createUserGroupApi({ headers: { name: name } });
      if (response.status === 200) {
        setCreatedUserGroup(response.data);
      }
    } catch (error) {
      console.error('error creating user group: ', error);
    }
  };

  const updatePassword = async (id, email, newPassword) => {
    try {
      const response = await updatePasswordApi({
        headers: { id: id },
        body: { email: email, newPassword: newPassword },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error changing password: ', error);
    }
  };

  return {
    getAllUsers,
    allUsers,
    clearUserInfo,
    createUserGroup,
    createdUserGroup,
    updatePassword,
  };
};
