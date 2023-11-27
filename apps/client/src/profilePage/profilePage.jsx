import React, { useState, useEffect } from 'react';
import { Button, Flex, Avatar, Box, Heading, Card, CardHeader, CardBody, Text, VStack } from '@chakra-ui/react';
import { DeleteIcon, EditIcon } from '@chakra-ui/icons'
import ResetPassword from '../adminPage/ResetPassword';
import { useAuth } from '../hooks/useAuth.jsx';
import Confirm from '../components/Confirm';
import { useAlert } from '../hooks/useAlert';
import { useUser } from '../hooks/useUser';


export default function ProfilePage(props) {

  const [isResetPasswordOpen, setIsResetPasswordOpen] = useState(false);
  const { user, logout } = useAuth();
  const { setAlert } = useAlert();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { clearUserInfo, } = useUser();

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

  const handleRemoveUser = async () => {
    setIsConfirmOpen(false);
    const response = await clearUserInfo(user.id);
    if (response) {
      setAlert('success', 'Din användare har tagits bort');
      await logout()
    } else {
      setAlert(
        'error',
        'Användare kunde inte tas bort',
      );
    }
  };

  return (
    <div>
        <Card maxW='md'>
        <CardHeader>
            <Flex spacing='4'>
            <Flex flex='1' gap='4' justifyContent={'space-around'} alignItems='center' flexWrap='wrap'>
                <Avatar size="md" bg='teal.500' />
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
                        <DeleteIcon boxSize={6}/> 
                    </Flex>
                </Button>
                <Button>
                    <Flex verticalAlign={'center'}>
                        <Text marginRight={'5%'}>Uppdatera användarnamn</Text>
                        <EditIcon boxSize={6}/> 
                    </Flex>
                </Button>
                <Button onClick={openResetPassword}>
                    <Flex verticalAlign={'center'}>
                        <Text marginRight={'5%'}>Uppdatera lösenord</Text>
                        <EditIcon boxSize={6}/> 
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
    </div>
  );
}
