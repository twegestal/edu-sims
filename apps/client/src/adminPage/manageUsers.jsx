import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Input,
  TableContainer,
  FormControl,
  Box,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser.js';
import { useAuth } from '../hooks/useAuth.jsx';




export default function ManageUsers(props) {
  const { getAllUsers, allUsers, clearUserInfo } = useUser();
  const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers(user.id);
    };

    fetchUsers();
  }, []);

  function removeUser(userId) {
    /*
    Does not remove the user from the DB, only sets username to "DeletedUser", randomizes a password and sets group_id to "Deleted users".
    This is done to be able to keep statistics consistent.
    */
    if (confirm('Är du säker på att du vill ta bort användaren?')) {
      clearUserInfo(userId)
    }
  }



  return (
    <Flex direction={'column'} justifyContent={'space-between'}>

      <Box mb="5%">
        <h2>Hantera användare</h2>
      </Box>

      <Box mb="5%">
        <h3>Skapa registreringslänk för nya användare</h3>
        <FormControl>
          <Flex direction={'row'}>
            <Input placeholder='Skriv namnet på den nya användargrupp länken skall skapas för'/>
            <Button>Generera länk</Button>
          </Flex>
        </FormControl>
      </Box>

      <Box>
        <h3>Ändra lösenord och ta bort användare</h3>
        <TableContainer maxWidth='90%'>
          <Table>
            <Thead>
              <Tr>
                <Th>Email</Th>
                <Th>Byt lösenord</Th>
                <Th isNumeric>Ta bort användare</Th>
              </Tr>
            </Thead>
            <Tbody>
              {allUsers.map((aUser, index) => (
                aUser.email !== "DeletedUser" && (
                  <Tr key={index}>
                    <Td>{aUser.email}</Td>
                    <Td>
                      <FormControl display={'flex'} flexDirection={'column'}>
                        <Input/>
                        <Button> Sätt nytt lösenord </Button>
                      </FormControl>
                    </Td>
                    <Td>
                      <Button onClick={(e) => removeUser(aUser.id)}>
                        <DeleteIcon />
                      </Button>
                    </Td>
                  </Tr>
                )
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
