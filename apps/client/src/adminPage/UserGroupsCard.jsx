import React, { useState, useEffect } from 'react';
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

export default function UserGroupsCard({ userGroups, removeRegistrationLink }) {
  return (
    <TableContainer maxWidth='90%'>
      <Table>
        <Thead>
          <Tr>
            <Th>Användargrupp</Th>
            <Th>Radera användargrupp</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userGroups &&
            userGroups.map(
              (userGroups, index) =>
                userGroups.is_active !== false && (
                  <Tr key={userGroups.id}>
                    <Td>{userGroups.name}</Td>
                    <Td>
                      <FormControl display={'flex'} flexDirection={'column'}>
                        <Button onClick={() => removeRegistrationLink(userGroups.id)}>
                          Radera användargrupp
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
