import { useRef, useEffect } from 'react';
import { Box, Image, Flex, Avatar, Button, useDisclosure } from '@chakra-ui/react';
import { HamburgerIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/images/png/EDU-SIMS_logo_transparent3.png';
import NavDrawer from './NavDrawer';
import { useAuth } from '../hooks/useAuth.jsx';

export default function NavBar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user } = useAuth();
  const btnRef = useRef();
  const navigate = useNavigate();

  const linkToIndex = () => {
    return navigate('/');
  };

  useEffect(() => {
    onClose();
  }, []);

  return (
    <>
      <Flex
        bg='gu.bg'
        color='white'
        textAlign={'center'}
        justifyContent={'space-around'}
        marginBottom={'30px'}
        id='navBar'
      >
        <Image
          width='20%'
          src={logo}
          alt='EDU-SIMS logo'
          onClick={linkToIndex}
          id='imageLink'
          minW={'90px'}
          maxW={'130px'}
          maxH={'115px'}
        />
        <Box margin={'auto'}>
          <p>EDU-SIMS</p>
        </Box>
        {user && (
          <Button
            ref={btnRef}
            onClick={onOpen}
            marginTop={'auto'}
            marginBottom={'auto'}
            bg={'none'}
            height={'100%'}
          >
            <Avatar size='sm' marginRight={'30%'} />
          </Button>
        )}
      </Flex>
      {user && <NavDrawer isOpen={isOpen} onClose={onClose} btnRef={btnRef} />}
    </>
  );
}
