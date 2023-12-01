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
  Accordion,
  chakra,
} from '@chakra-ui/react';
import { useUser } from '../hooks/useUser.js';
import UserTable from './UserTable.jsx';
import UserGroupsCard from './UserGroupsCard.jsx';

export default function ManageUsers() {
  const { createUserGroup, createdUserGroup, userGroups, getUserGroups, deactivateUserGroup } =
    useUser();
  const [inputUserGroup, setInputUserGroup] = useState('');
  const [createdUserGroups, setCreatedUserGroup] = useState([]);
  const [link, setLink] = useState('');
  const [showUserGroupCard, setShowUserGroupCard] = useState(false);
  const [pressed, setPressed] = useState('unpressed');

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

  const removeRegistrationLink = async (id) => {
    const result = await deactivateUserGroup(id);
    if (result === true) {
      console.log('tog vi bort länken?');
      showActiveRegistrationLinks();
    }
  };

  const showActiveRegistrationLinks = async () => {
    await getUserGroups();
    setShowUserGroupCard(true);
    setTimeout(() => {
      console.log(userGroups);
    }, 1000);
  };

  const handleDeactivateRegistrationLink = async (groupId) => {
    const result = await deactivateUserGroup(groupId);
    if (result) {
      await getUserGroups();
    }
  };
  const pressedShowActiveRegistrationLinks = (e) => {
    console.log(e.target.name);
    if (pressed === 'unpressed') {
      setPressed = 'pressed';
      return (Button = chakra('button', {
        baseStyle: {
          name: 'Dölj aktiva länkar',
        },
      }));
    } else {
      setPressed = 'pressed';
      return (Button = chakra('button', {
        baseStyle: {
          name: 'Visa aktiva länkar',
        },
      }));
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
            <Button
              onClick={(e) => {
                showActiveRegistrationLinks();
                pressedShowActiveRegistrationLinks(e);
              }}
            >
              Visa aktiva länkar
            </Button>
          </Flex>
          {showUserGroupCard && (
            <UserGroupsCard
              userGroups={userGroups}
              removeRegistrationLink={removeRegistrationLink}
            ></UserGroupsCard>
          )}
        </FormControl>
        {createdUserGroup.length !== 0 && (
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
