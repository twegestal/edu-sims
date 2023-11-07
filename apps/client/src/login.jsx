import { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { validateLogin } from 'api';

export default function Login() {
  const { login } = useAuth();
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email: emailInput, password: passwordInput };
    const result = validateLogin(data);
    if (result.success) {
      login(emailInput, passwordInput);
    } else {
      //TODO show alert with result.errors
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <Input placeholder='Email' onChange={(e) => setEmailInput(e.target.value)} />
        <Input
          type='password'
          placeholder='Password'
          onChange={(e) => setPasswordInput(e.target.value)}
        />
        <Button type='submit'>Logga in</Button>
      </form>
    </>
  );
}
