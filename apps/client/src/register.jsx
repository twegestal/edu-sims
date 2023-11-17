import { useState } from 'react';
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Tooltip,
  IconButton,
} from '@chakra-ui/react';
import { useAuth } from './hooks/useAuth';
import { validateRegistration } from 'api';
import { useAlert } from './hooks/useAlert.jsx';
import { FcInfo } from 'react-icons/fc';

export default function Register(props) {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const { register } = useAuth();
  const { setAlert } = useAlert();

  const postToRegister = async () => {
    const groupId = props.groupId;
    if (passwordInput === confirmPasswordInput) {
      const data = {
        email: emailInput,
        password: passwordInput,
        group_id: groupId,
      };
      const validationResult = validateRegistration(data);
      if (validationResult.success) {
        await register(data);
      } else {
        setAlert('error', 'Error vid registrering', validationResult.errors[0].message);
      }
    } else {
      setAlert('error', 'Error vid registrering', 'Lösenorden måste matcha');
    }
  };

  const handleTooltipToggle = () => {
    setShowTooltip(!showTooltip);
  };

  return (
    <>
      <FormControl>
        <FormLabel>Registrering</FormLabel>
        <Input type='email' placeholder='Email' onChange={(e) => setEmailInput(e.target.value)} />
        <InputGroup>
          <Input
            type='password'
            placeholder='Lösenord'
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <InputRightElement width={'4.5rem'}>
            <Tooltip
              label='Lösenordet måste innehålla minst 8 tecken och max 12 tecken. Lösenordet måste innehålla minst en versal, minst en gemen, minst en siffra och minst ett specialtecken'
              isOpen={showTooltip}
              placement='right-end'
              hasArrow
            >
              <IconButton
                icon={<FcInfo />}
                size={'sm'}
                variant={'ghost'}
                onClick={handleTooltipToggle}
                onMouseEnter={handleTooltipToggle}
                onMouseLeave={handleTooltipToggle}
                aria-label='Password requirements'
              />
            </Tooltip>
          </InputRightElement>
        </InputGroup>
        <Input
          type='password'
          placeholder='Bekräfta lösenord'
          onChange={(e) => setConfirmPasswordInput(e.target.value)}
        />
        <Button onClick={postToRegister}>Skapa konto</Button>
      </FormControl>
    </>
  );
}
