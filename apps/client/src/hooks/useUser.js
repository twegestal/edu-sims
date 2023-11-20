import { useApi } from './useApi.js';
import { useAuth } from './useAuth.jsx';
import { useState } from 'react';

export const useUser = () => {
  const { user } = useAuth();
  const getUser = useApi('getUser');
  const getAllUsersApi = useApi('getAllUsers');
  const clearUserInfoApi = useApi('clearUserInfo');
  const createUserGroupApi = useApi('createUserGroup');

  const [allUsers, setAllUsers] = useState([]);
  const [createdUserGroup, setCreatedUserGroup] = useState([]);

  const getAllUsers = async (user_id) => {
    try {
      const result = await getAllUsersApi({ headers: { user_id: user_id } });
      setAllUsers(result);
    } catch (error) {
      console.error('error fetching all users: ', error);
    }
  };

  const clearUserInfo = async (user_id) => {
    try {
      const result = await clearUserInfoApi({ headers: { user_id: user_id } });
    } catch (error) {
      console.error('error clearing user info: ', error);
    }
  };

  const createUserGroup = async (name) => {
    try {
      const result = await createUserGroupApi({ headers: { name: name } });
      setCreatedUserGroup(result);
    } catch (error) {
      console.error('error creating user group: ', error);
    }
  };

  return {
    getAllUsers,
    allUsers,
    clearUserInfo,
    createUserGroup,
    createdUserGroup,
  };
};
