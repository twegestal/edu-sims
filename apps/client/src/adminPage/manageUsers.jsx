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
  IconButton,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser.js';
import UserTable from './UserTable.jsx';
import UserGroupsCard from './UserGroupsCard.jsx';

export default function ManageUsers() {
  const { createdUserGroup, createUserGroup } = useUser();
  const [inputUserGroup, setInputUserGroup] = useState('');
  const [showUserGroupCard, setShowUserGroupCard] = useState(false);
  const [showUserTable, setShowUserTable] = useState(false);

  const handleInputUserGroupChange = (event) => {
    setInputUserGroup(event.target.value);
  };

  const generateRegLink = async () => {
    if (inputUserGroup.length > 0) {
      await createUserGroup(inputUserGroup);
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
        {createdUserGroup.length !== 0 && (
          <Card>
            <CardHeader>
              <Text>Registeringslänk för användargruppen {createdUserGroup.name}</Text>
            </CardHeader>
            <CardBody>
              <Flex direction={'row'}>
                <Text>{createdUserGroup.registration_link}</Text>
                <IconButton
                  icon={<CopyIcon />}
                  onClick={() => {
                    navigator.clipboard.writeText(createdUserGroup.registration_link);
                  }}
                  marginLeft='1%'
                >
                  Kopiera
                </IconButton>
              </Flex>
            </CardBody>
          </Card>
        )}
      </Box>

      <Box>
        <Button onClick={() => setShowUserGroupCard(!showUserGroupCard)}>
          {showUserGroupCard ? 'Dölj aktiva grupper' : 'Visa aktiva grupper'}
        </Button>
        <Button onClick={() => setShowUserTable(!showUserTable)}>
          {showUserTable ? 'Dölj användare' : 'Visa användare'}
        </Button>
      </Box>

      {showUserGroupCard && <UserGroupsCard />}
      {showUserTable && <UserTable />}
    </Flex>
  );
}
