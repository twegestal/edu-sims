import { useRef } from 'react';
import {
    Box,
    Image,
    Flex,
    Avatar,
    Button,
    useDisclosure, 
} from '@chakra-ui/react';
import {
    HamburgerIcon, 
} from '@chakra-ui/icons'
import { Link } from 'react-router-dom';
import logo from '../images/EDU-SIMS_logo_transparent.png';
import NavDrawer from './NavDrawer';

export default function NavBar() {
    const { isOpen, onOpen, onClose } = useDisclosure()
    const btnRef = useRef()
    return (
        <>
            <Flex bg='teal' minW='100%' p={4} color='white' textAlign={'center'} justifyContent={'space-around'} >
                <Flex justify-content={'space-around'} maxW={'50%'}>
                    <Image width='20%' src={logo} alt='EDU-SIMS logo'/>
                    <Box margin={'auto'}>
                        <p>EDU-SIMS</p>
                    </Box>
                </Flex>
                <Button ref={btnRef} colorScheme='teal' onClick={onOpen}>
                    <Avatar size="sm" margin={'auto'} marginRight={'30%'}/>
                </Button>
            </Flex>
            <NavDrawer             
            isOpen={isOpen}
            onClose={onClose}
            btnRef={btnRef}
            />
        </>
  );
}


//./components/NavBar.jsx