import { useState, useEffect } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { validateRegistration } from 'api';
import { useAlert } from './hooks/useAlert.jsx';

export default function Register(props) {
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');
  const { register } = useAuth();
  const { setAlert } = useAlert();

  const postToRegister = async (event) => {
    event.preventDefault();

    const groupId = props.groupId;
    if (emailInput != 'Email' && passwordInput != 'Password') {
      //window.history.pushState('state', 'title', '/');
      const data = {
        email: emailInput,
        password: passwordInput,
        group_id: groupId,
      };
      const validationResult = validateRegistration(data);
      if (validationResult.success) {
        await register(data);
      } else {
        setAlert('error', 'Error when registering', validationResult.errors[0].message);
      }
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
