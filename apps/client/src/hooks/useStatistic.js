import { useState } from 'react';
import { useApi } from './useApi';

export const useStatistics = () => {
  const getTotalAmountUsersApi = useApi('getTotalAmountUsers');
  const getActiveUsersApi = useApi('getActiveUsers')
  const allCasesStatisticsApi = useApi('allCasesStatistics')

  const [amountUser, setAmountUser] = useState([]);
  const [activeUsers, setActiveUsers] = useState([]);


  const getTotalAmountUsers = async () => {
    try {
      const response = await getTotalAmountUsersApi();
      if (response.status === 200) {
        setAmountUser(response.data);
      }
    } catch (error) {
      console.error('Error fetching cases: ', error);
    }
  };

  const getActiveUsers = async (startdate) => {
    try {
      const response = await getActiveUsersApi({headers: { startdate: startdate }});
      if (response.status === 200) {
        setActiveUsers(response.data);
      }
    } catch (error) {
      console.error('Error fetching cases: ', error);
    }
  };

  const allCasesStatistics = async() => {
    try {
      const response = await allCasesStatisticsApi();
      if (response.status === 200) {
        return response
      }
    } catch (error) {
      console.error('Error fetching cases: ', error);
    }
  }


  return {
    amountUser,
    getTotalAmountUsers,
    getActiveUsers,
    activeUsers,
    allCasesStatistics,
  };
};
