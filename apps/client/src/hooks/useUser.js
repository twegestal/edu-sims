import { useApi } from './useApi.js';
import { useAuth } from './useAuth.jsx';
import { useState } from 'react';

export const useUser = () => {
  const { user } = useAuth();
  const getUser = useApi('getUser');
  const getAllUsersApi = useApi('getAllUsers');
  const clearUserInfoApi = useApi('clearUserInfo');
  const createUserGroupApi = useApi('createUserGroup');
  const deactivateUserGroupApi = useApi('deactivateUserGroup');
  const getUserGroupsApi = useApi('getUserGroups');
  const updatePasswordApi = useApi('updatePassword');
  const assingAdminPrivilegeApi = useApi('assingAdminPrivilege')
  const revokeAdminPrivilegeApi = useApi('revokeAdminPrivilege')
  const updateUsernameApi = useApi('updateUsername')

  const [allUsers, setAllUsers] = useState([]);
  const [createdUserGroup, setCreatedUserGroup] = useState([]);
  const [userGroups, setUserGroups] = useState();

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

  const assingAdminPrivilege = async (user_id) => {
    try {
      const response = await assingAdminPrivilegeApi({ headers: { user_id: user_id } });
      return response.status === 200;
    } catch (error) {
      console.error('error assingning admin priviliege: ', error);
    }
  };

  const revokeAdminPrivilege = async (user_id) => {
    try {
      const response = await revokeAdminPrivilegeApi({ headers: { user_id: user_id } });
      return response.status === 200;
    } catch (error) {
      console.error('error revoking admin priviliege: ', error);
    }
  };

  const createUserGroup = async (name) => {
    try {
      const response = await createUserGroupApi({ body: { groupName: name } });
      if (response.status === 201) {
        setCreatedUserGroup(response.data);
      }
    } catch (error) {
      console.error('error creating user group: ', error);
    }
  };
  
  const deactivateUserGroup = async (id) => {
    try {
      const response = await deactivateUserGroupApi({
        headers: { id: user.id, user_group_id: id },
      });
      if (response.status === 200) {
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('error deactivating user group:', error);
    }
  };

  const getUserGroups = async () => {
    try {
      const response = await getUserGroupsApi({ headers: { id: user.id } });
      if (response.status == 200) {
        setUserGroups(response.data);
      }
    } catch (error) {
      console.error('error fetching user groups: ', error);
    }
  };

  const updatePassword = async (id, email, newPassword) => {
    try {
      const response = await updatePasswordApi({
        headers: { id: id, userToEditId: userToEditId },
        body: { email: email, newPassword: newPassword, },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error changing password: ', error);
    }
  };

  const updateUsername = async (id, newUsername,) => {
    try {
      const response = await updateUsernameApi({
        headers: { id: id},
        body: { newUsername: newUsername, },
      });
      return response.status === 201;
    } catch (error) {
      console.error('error changing username: ', error);
    }
  };


  return {
    getAllUsers,
    allUsers,
    clearUserInfo,
    assingAdminPrivilege,
    revokeAdminPrivilege,
    createUserGroup,
    createdUserGroup,
    deactivateUserGroup,
    updatePassword,
    updateUsername,
    userGroups,
    getUserGroups,
  };
};
