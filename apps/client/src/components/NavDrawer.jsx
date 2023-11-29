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
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>
                    <p>{user.email}</p>
                </DrawerHeader>

                <DrawerBody>
                    <Flex flexDirection={'column'} justifyContent={'space-between'} h={'25%'}>
                        <Link to='/'>
                            <Button w={'100%'} onClick={props.onClose}>
                                Hem
                            </Button>
                        </Link>
                        <Link to='/profilePage'>
                            <Button w={'100%'} onClick={props.onClose}>
                                Min profil
                            </Button>
                        </Link>
                        <Button onClick={logout}>Logout</Button>
                    </Flex>
                </DrawerBody>

                <DrawerFooter>
                    <Button variant='outline' w={'100%'} onClick={props.onClose}>
                        Stäng
                    </Button>
                </DrawerFooter>
            </DrawerContent>
            </Drawer>
        </>
    );
}


//./components/NavBar.jsx