import React, { useEffect } from 'react';
import {
  Button,
  FormControl,
  TableContainer,
  Table,
  Thead,
  Tr,
  Th,
  Td,
  Tbody,
} from '@chakra-ui/react';
import { useUser } from '../hooks/useUser';

export default function UserGroupsCard() {
  const { userGroups, getUserGroups, deactivateUserGroup } = useUser();

  useEffect(() => {
    const fetchUserGroups = async () => {
      await getUserGroups();
    };

    fetchUserGroups();
  }, []);

  const removeRegistrationLink = async (id) => {
    const result = await deactivateUserGroup(id);
    if (result === true) {
      await getUserGroups();
    }
  };

  return (
    <TableContainer maxWidth='90%'>
      <Table>
        <Thead>
          <Tr>
            <Th>Användargrupp</Th>
            <Th>Inaktivera användargrupp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userGroups &&
            userGroups.map(
              (userGroups, _index) =>
                userGroups.is_active !== false && (
                  <Tr key={userGroups.id}>
                    <Td>{userGroups.name}</Td>
                    <Td>
                      <FormControl display={'flex'} flexDirection={'column'}>
                        <Button onClick={() => removeRegistrationLink(userGroups.id)}>
                          Inaktivera
                        </Button>
                      </FormControl>
                    </Td>
                  </Tr>
                ),
            )}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
