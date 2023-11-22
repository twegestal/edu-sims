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

  return {
    getAllUsers,
    allUsers,
    clearUserInfo,
    createUserGroup,
    createdUserGroup,
  };
};
