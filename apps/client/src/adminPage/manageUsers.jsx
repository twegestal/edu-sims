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
  TabList,
  Tab,
  Tabs,
  TabPanel,
  TabPanels,
  useToast,
} from '@chakra-ui/react';
import { CopyIcon } from '@chakra-ui/icons';
import { useUser } from '../hooks/useUser.js';
import UserTable from './UserTable.jsx';
import UserGroupsCard from './UserGroupsCard.jsx';

export default function ManageUsers() {
  const { createdUserGroup, createUserGroup } = useUser();
  const [inputUserGroup, setInputUserGroup] = useState('');
  const [reloading, setReloading] = useState(false);
  const [generateIsLoading, setGenerateIsLoading] = useState(false)
  const toast = useToast();

  const handleInputUserGroupChange = (event) => {
    setInputUserGroup(event.target.value);
  };

  const generateRegLink = async () => {
    setGenerateIsLoading(true)
    if (inputUserGroup.length > 0) {
      const response = await createUserGroup(inputUserGroup);
      if (response === 201) {
        showToast('Grupp skapad', `${inputUserGroup} har skapats`, 'success');
        setReloading((previous) => !previous);
      } else if (response === 400) {
        showToast(
          'Gruppnamn upptaget',
          `Det finns redan en grupp skapad med det valda namnet`,
          'warning',
        );
      } else {
        showToast('Fel', 'Någonting gick fel och gruppen kunde inte skapas', 'warning');
      }
    }
    setGenerateIsLoading(false)
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Flex direction={'column'} justifyContent={'space-between'}>
      <Box mb='5%'>
        <h2>Hantera användare</h2>
      </Box>

      <Box mb='5%'>
        <h3>Skapa registreringslänk för nya användare</h3>
        <FormControl>
          <Flex direction={'row'} w='50%' marginLeft='25%'>
            <Input
              placeholder='Skriv namnet på den nya användargrupp länken skall skapas för'
              value={inputUserGroup}
              onChange={handleInputUserGroupChange}
            />
            <Button onClick={generateRegLink} isLoading={generateIsLoading}>Generera länk</Button>
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
      <Tabs variant={'enclosed'}>
        <TabList>
          <Tab>Grupper</Tab>
          <Tab>Användare</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <UserGroupsCard reloading={reloading} />
          </TabPanel>
          <TabPanel>
            <UserTable />
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Flex>
  );
}
