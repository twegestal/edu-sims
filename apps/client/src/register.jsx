import { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';

export default function Register(props) {
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');
  const { register } = useAuth();

  const postToRegister = async (event) => {
    event.preventDefault();

    const groupId = props.groupId;
    if (emailInput != 'Email' && passwordInput != 'Password') {

      //window.history.pushState('state', 'title', '/');

      await register(emailInput, passwordInput, groupId);
    }
  };

  return (
    <div>
      <form onSubmit={postToRegister}>
        <Input placeholder='Email' onChange={(e) => setEmailInput(e.target.value)} />
        <Input placeholder='Password' onChange={(e) => setPasswordInput(e.target.value)} />
        <Button type='submit'>Skapa konto</Button>
      </form>
    </div>
  );
}
