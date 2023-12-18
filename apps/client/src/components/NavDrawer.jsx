import {
  Flex,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import DrawerBtn from './DrawerBtn.jsx';
import { useUser } from '../hooks/useUser.js';

export default function NavDrawer({ isOpen, onClose, btnRef }) {
  const { user, setUserNull } = useAuth();
  const { logout } = useUser();

  const handleLogout = async () => {
    onClose();
    await logout();
    setUserNull();
  };
  return (
    <>
      <Drawer isOpen={isOpen} placement='right' onClose={onClose} finalFocusRef={btnRef}>
        <DrawerOverlay />
        <DrawerContent bg={'brand.bg'}>
          <DrawerCloseButton />
          <DrawerHeader>
            <p>{user.email}</p>
          </DrawerHeader>

          <DrawerBody>
            <Flex flexDirection={'column'} justifyContent={'space-between'}>
              <Link onClick={onClose} to='/'>
                <DrawerBtn text='Hem' />
              </Link>
              <Link onClick={onClose} to='/profilePage'>
                <DrawerBtn text='Min profil' />
              </Link>
              {user.isAdmin && (
                <>
                  <Link onClick={onClose} to='/manageUsers'>
                    <DrawerBtn text='Hantera användare' />
                  </Link>
                  <Link onClick={onClose} to='/manageCases'>
                    <DrawerBtn text='Hantera fall' />
                  </Link>
                  <Link onClick={onClose} to='/manageLists'>
                    <DrawerBtn text='Hantera listor' />
                  </Link>
                </>
              )}
            </Flex>
          </DrawerBody>

          <DrawerFooter>
            <Button onClick={handleLogout} w={'100%'}>
              Logout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}

//./components/NavBar.jsx
