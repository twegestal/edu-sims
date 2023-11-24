import { useState } from 'react';
import {
  Input,
  Button,
  FormControl,
  FormLabel,
  InputGroup,
  InputRightElement,
  Tooltip,
  useBreakpointValue,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useAuth } from './hooks/useAuth';
import { validateRegistration, errorsToString } from 'api';
import { useAlert } from './hooks/useAlert.jsx';
import { useParams } from 'react-router-dom';

export default function Register() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const { register } = useAuth();
  const { setAlert } = useAlert();
  const placement = useBreakpointValue({ base: 'bottom', md: 'right' });
  let { groupId } = useParams();


  const postToRegister = async () => {
    groupId = groupId.split('groupId=')[1]
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
        setAlert('error', 'Error vid registrering', errorsToString(validationResult.errors));
      }
    } else {
      setAlert('error', 'Error vid registrering', 'Lösenorden måste matcha');
    }
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
              placement={placement}
              shouldWrapChildren
              trigger={{ base: 'click', md: 'hover' }}
              hasArrow
            >
              <InfoOutlineIcon
                color='gray.500'
                _focus={{ outline: 'none' }}
                onClick={() => setShowTooltip(!showTooltip)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
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
