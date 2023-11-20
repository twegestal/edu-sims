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
  Card,
  CardHeader,
  CardBody,
  Text,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser.js';
import { useAuth } from '../hooks/useAuth.jsx';

export default function ManageUsers(props) {
  const { getAllUsers, allUsers, clearUserInfo, createUserGroup, createdUserGroup } = useUser();
  const { user } = useAuth();
  const toast = useToast();
  const [inputUserGroup, setInputUserGroup] = useState('');
  const [link, setLink] = useState('');
  const [userRemoved, setUserRemoved] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      await getAllUsers(user.id);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    //Ändra URL till serverns domän
    const url = 'http://localhost:5173';
    setLink(url + '/register?groupId=' + createdUserGroup.id);
  }, [createdUserGroup]);

  useEffect(() => {
    if (userRemoved != '') {
      toast({
        title: 'Information rensad',
        description: 'Information kopplad till användaren ' + userRemoved + ' har tagits bort',
        status: 'success',
        duration: 9000,
        isClosable: true,
      });
    }

    const fetchUsers = async () => {
      await getAllUsers(user.id);
    };

    fetchUsers();
  }, [userRemoved]);

  async function removeUser(userId, userEmail) {
    /*
    Does not remove the user from the DB, only sets username to "DeletedUser", randomizes a password and sets group_id to "Deleted users".
    This is done to be able to keep statistics consistent.
    */
    if (confirm('Är du säker på att du vill ta bort användaren?')) {
      await clearUserInfo(userId);
      setUserRemoved(userEmail);
    }
  }

  const handleInputUserGroupChange = (event) => {
    // Update the state with the value of the input field
    setInputUserGroup(event.target.value);
  };

  const generateRegLink = () => {
    if (inputUserGroup.length > 0) {
      createUserGroup(inputUserGroup);
    }
  };

  return (
    <Flex direction={'column'} justifyContent={'space-between'}>
      <Box mb='5%'>
        <h2>Hantera användare</h2>
      </Box>

      <Box mb='5%'>
        <h3>Skapa registreringslänk för nya användare</h3>
        <FormControl>
          <Flex direction={'row'}>
            <Input
              placeholder='Skriv namnet på den nya användargrupp länken skall skapas för'
              value={inputUserGroup}
              onChange={handleInputUserGroupChange}
            />
            <Button onClick={generateRegLink}>Generera länk</Button>
          </Flex>
        </FormControl>
        {createdUserGroup.length != 0 && (
          <Card>
            <CardHeader>
              <Text>Registeringslänk för användargruppen {createdUserGroup.name}</Text>
            </CardHeader>
            <CardBody>
              <Flex direction={'row'}>
                <Text>{link}</Text>
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(link);
                  }}
                  marginLeft='1%'
                >
                  Kopiera
                </Button>
              </Flex>
            </CardBody>
          </Card>
        )}
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
              {allUsers.map(
                (aUser, index) =>
                  aUser.email !== 'DeletedUser' && (
                    <Tr key={index}>
                      <Td>{aUser.email}</Td>
                      <Td>
                        <FormControl display={'flex'} flexDirection={'column'}>
                          <Input />
                          <Button> Sätt nytt lösenord </Button>
                        </FormControl>
                      </Td>
                      <Td>
                        <Button onClick={(e) => removeUser(aUser.id, aUser.email)}>
                          <DeleteIcon />
                        </Button>
                      </Td>
                    </Tr>
                  ),
              )}
            </Tbody>
          </Table>
        </TableContainer>
      </Box>
    </Flex>
  );
}
