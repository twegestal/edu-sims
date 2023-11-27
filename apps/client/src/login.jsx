import { useState } from 'react';
import { Input, Button } from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { useAlert } from './hooks/useAlert.jsx';
import { validateLogin, errorsToString } from 'api';

export default function Login() {
  const { login } = useAuth();
  const [emailInput, setEmailInput] = useState('Email');
  const [passwordInput, setPasswordInput] = useState('Password');
  const { setAlert } = useAlert();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = { email: emailInput, password: passwordInput };
    const validationResult = validateLogin(data);
    if (validationResult.success) {
      const result = await login(emailInput, passwordInput);
      if (!result) {
        setAlert('error', 'Fel vid inloggning', 'inkorrekt användarnamn eller lösenord');
      }
    } else {
      setAlert('error', 'Fel vid inloggning', errorsToString(validationResult.errors));
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
