import { useState, useEffect } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { validateRegistration } from 'api';
import { useAlert } from './hooks/useAlert';

export default function Register(props) {
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');
  const { register } = useAuth();
  const {setStatus, setMessage, setTitle, setShowAlert, showAlert} = useAlert();

  const postToRegister = async (event) => {
    event.preventDefault();

    const groupId = props.groupId;
    if (emailInput != 'Email' && passwordInput != 'Password') {

      //window.history.pushState('state', 'title', '/');
      const data = {
        email: emailInput,
        password: passwordInput,
        group_id: groupId
      }
      const validationResult = validateRegistration(data);
      if (validationResult.success) {
        await register(data);
      } else {
        console.log('innan felbanner');
        setStatus('error');
        setMessage(validationResult.errors);
        setTitle('Error when registering');
        setShowAlert(true);
        console.log('efter felbanner');
        
      }
    }
  };

  useEffect(() => {
    console.log('showAlert: ', showAlert);
  },[showAlert])
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
