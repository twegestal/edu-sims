import { useState } from 'react';
import { Input, Button, Box, useToast } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';

export default function Login() {
  const { login } = useAuth();
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');
  const [loading, setLoading] = useState(false)
  const toast = useToast();

  const handleSubmit = async (e) => {
    setLoading(true)
    e.preventDefault();
  
    const result = await login(emailInput, passwordInput);
    if (!result) {
      showToast('Fel vid inloggning', 'Fel användarnamn eller lösenord', 'warning');
    }
    setLoading(false)
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
    <>
      <Box marginTop={'10%'} width={'90%'} margin={'auto'}>
        <form onSubmit={handleSubmit}>
          <Input
            placeholder='Email'
            onChange={(e) => setEmailInput(e.target.value)}
            marginBottom={'8px'}
          />
          <Input
            type='password'
            placeholder='Password'
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <Button isLoading={loading} type='submit'>Logga in</Button>
        </form>
      </Box>
    </>
  );
}
