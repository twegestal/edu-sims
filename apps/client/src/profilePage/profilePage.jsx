import React, { useState, useEffect } from 'react';
import {
  Button,
  Flex,
  Avatar,
  Box,
  Heading,
  Card,
  CardHeader,
  CardBody,
  Text,
  VStack,
  useToast,
} from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons';
import ResetPassword from '../adminPage/ResetPassword';
import { useAuth } from '../hooks/useAuth.jsx';
import Confirm from '../components/Confirm';
import { useUser } from '../hooks/useUser';
import ChangeUsername from './changeUsername.jsx';

export default function ProfilePage(props) {
  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const [isChangeUsernameOpen, setIsChangeUsernameOpen] = useState(false);
  const { user, logout } = useAuth();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { clearUserInfo } = useUser();
  const toast = useToast();

  const openConfirm = () => {
    setIsConfirmOpen(true);
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  const openResetPassword = () => {
    setIsResetPasswordOpen(true);
  };

  const closeResetPassword = () => {
    setIsResetPasswordOpen(false);
  };

  const openChangeUsername = () => {
    setIsChangeUsernameOpen(true);
  };

  const closeChangeUsername = () => {
    setIsChangeUsernameOpen(false);
  };

  const handleRemoveUser = async () => {
    setIsConfirmOpen(false);
    const response = await clearUserInfo(user.id);
    if (response) {
      showToast('Borttagen', 'Din användarprofil har tagits bort', 'success');
      await logout();
    } else {
      showToast('Fel', 'Användare kunde inte tas bort', 'warning');
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <Box>
      <Card maxW='md' margin={'auto'}>
        <CardHeader>
          <Flex spacing='4'>
            <Flex flex='1' gap='4' alignItems='center' flexWrap='wrap'>
              <Avatar size='md' bg='teal.500' />
              <Box>
                <Heading size='sm'>Min profil</Heading>
              </Box>
            </Flex>
          </Flex>
        </CardHeader>
        <CardBody>
          <VStack justifyContent={'space-between'}>
            <Button onClick={openConfirm}>
              <Flex verticalAlign={'center'}>
                <Text marginRight={'5%'}>Ta bort ditt konto</Text>
                <DeleteIcon boxSize={6} />
              </Flex>
            </Button>
            <Button>
              <Flex verticalAlign={'center'} onClick={openChangeUsername}>
                <Text marginRight={'5%'}>Uppdatera användarnamn</Text>
                <EditIcon boxSize={6} />
              </Flex>
            </Button>
            <Button onClick={openResetPassword}>
              <Flex verticalAlign={'center'}>
                <Text marginRight={'5%'}>Uppdatera lösenord</Text>
                <EditIcon boxSize={6} />
              </Flex>
            </Button>
          </VStack>
        </CardBody>
      </Card>

      <ResetPassword
        isOpen={isResetPasswordOpen}
        onClose={closeResetPassword}
        email={user.email}
        userToEditId={user.id}
      />
      <Confirm
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        header={'Ta bort konto'}
        body={`Är du säker att du vill ta bort ditt konto?`}
        handleConfirm={() => handleRemoveUser(user)}
      />
      <ChangeUsername isOpen={isChangeUsernameOpen} onClose={closeChangeUsername} />
    </Box>
  );
}
