import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Input,
  FormControl,
  Box,
  Card,
  CardHeader,
  CardBody,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useUser } from '../hooks/useUser.js';
import { useAuth } from '../hooks/useAuth.jsx';
import UserTable from './UserTable.jsx';

export default function ManageUsers(props) {
  const { createUserGroup, createdUserGroup } = useUser();
  const [inputUserGroup, setInputUserGroup] = useState('');
  const [link, setLink] = useState('');

  useEffect(() => {
    //Ändra URL till serverns domän
    const url = 'https://localhost:5173';
    setLink(url + '/register/groupId=' + createdUserGroup.id);
  }, [createdUserGroup]);

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
        <UserTable />
      </Box>
    </Flex>
  );
}
