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
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
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

  const handleCopyLink = (link) => {
    console.log(userGroups);
    navigator.clipboard.writeText(link);
  }
  
  return (
    <TableContainer maxWidth='90%'>
      <Table>
        <Thead>
          <Tr>
            <Th>Användargrupp</Th>
            <Th>Kopiera länk</Th>
            <Th>Inaktivera användargrupp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userGroups &&
            userGroups.map(
              (group, _index) =>
                group.is_active !== false && (
                  <Tr key={group.id}>
                    <Td>{group.name}</Td>
                    <Td><IconButton onClick={() => handleCopyLink(group.registration_link)} icon={<CopyIcon />} /></Td>
                    <Td>
                      <FormControl display={'flex'} flexDirection={'column'}>
                        <Button onClick={() => removeRegistrationLink(group.id)}>
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
