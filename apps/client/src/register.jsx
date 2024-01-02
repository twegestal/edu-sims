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
  useToast,
  Box,
} from '@chakra-ui/react';
import { InfoOutlineIcon } from '@chakra-ui/icons';
import { useAuth } from './hooks/useAuth';
import { validateRegistration, errorsToString } from 'api';
import { useNavigate, useParams } from 'react-router-dom';

export default function Register() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showTooltip, setShowTooltip] = useState(false);
  const { register, login } = useAuth();
  const placement = useBreakpointValue({ base: 'bottom', md: 'right' });
  let { groupId } = useParams();
  const toast = useToast();
  const navigate = useNavigate();

  const postToRegister = async () => {
    groupId = groupId.split('groupId=')[1];
    if (passwordInput === confirmPasswordInput) {
      const data = {
        email: emailInput,
        password: passwordInput,
        group_id: groupId,
      };
      const validationResult = validateRegistration(data);
      if (validationResult.success) {
        const response = await register(data);
        if (response === 201) {
          showToast(
            'Registrering lyckades',
            `Användaren ${emailInput} har registrerats`,
            'success',
          );

          const response = await login(emailInput, passwordInput);
          if (response) {
            return navigate('/');
          }
        } else if (response === 400) {
          showToast(
            'Registrering misslyckades',
            `Det finns redan en användare med användarnamnet ${emailInput}`,
            'warning',
          );
        } else {
          showToast(
            'Registrering misslyckades',
            'Någonting gick fel och registreringen kunde inte genomföras',
            'error',
          );
        }
      } else {
        showToast('Fel vid registrering', errorsToString(validationResult.errors), 'warning');
      }
    } else {
      showToast('Fel vid registrering', 'Lösenorden måste matcha', 'warning');
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
      isClosable: true,
      position: 'top',
    });
  };

  return (
    <>
      <Box width={'90%'} margin={'auto'} height={'100%'}>
        <FormControl>
          <FormLabel>Registrering</FormLabel>
          <Input
            autoComplete='off'
            type='email'
            placeholder='Email'
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <InputGroup>
            <Input
              autoComplete='off'
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
            autoComplete='off'
            type='password'
            placeholder='Bekräfta lösenord'
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
          />
          <Button onClick={postToRegister} marginTop={'20px'}>
            Skapa konto
          </Button>
        </FormControl>
      </Box>
    </>
  );
}
