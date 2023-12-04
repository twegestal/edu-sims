import {
  Box,
  Image,
  Flex,
  Avatar,
  useDisclosure,
  Button,
  Input,
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

export default function NavDrawer(props) {
  const { user, logout } = useAuth();
    return (
        <>
          <Drawer 
          isOpen={props.isOpen}
          placement='right'
          onClose={props.onClose}
          finalFocusRef={props.btnRef} 
          >
            <DrawerOverlay />
            <DrawerContent bg={'brand.bg'}>
              <DrawerCloseButton />
              <DrawerHeader>
                  <p>{user.email}</p>
              </DrawerHeader>

              <DrawerBody>
                <Flex flexDirection={'column'} justifyContent={'space-between'}>
                  <Link to='/'>
                    <DrawerBtn onClick={props.onClose} text='Hem' />
                  </Link>
                  <Link to='/profilePage'>
                    <DrawerBtn onClick={props.onClose} text='Min profil' />
                  </Link>
                  {user.isAdmin && (
                    <>
                      <Link to='/manageUsers'>
                        <DrawerBtn onClick={props.onClose} text='Hantera användare' />
                      </Link>
                      <Link to='/manageCases'>
                        <DrawerBtn onClick={props.onClose} text='Hantera fall' />
                      </Link>
                    </>
                  )}
                </Flex>
              </DrawerBody>

              <DrawerFooter>
                <Button onClick={logout} w={'100%'}>
                  Logout
                </Button>
              </DrawerFooter>
            </DrawerContent>
        </Drawer>
    </>
  );
}

//./components/NavBar.jsx
