import { useState } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  Button,
  useToast,
  SimpleGrid,
  Box,
  InputGroup,
  InputRightElement,
  VStack,
  Heading,
  HStack,
  Text,
} from '@chakra-ui/react';
import { CheckCircleIcon, NotAllowedIcon } from '@chakra-ui/icons';
import { validatePassword, errorsToString } from 'api';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

export default function ResetPassword({ isOpen, onClose, email, userToEditId }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [passwordIsLoading, setPasswordIsLoading] = useState(false);
  const { user } = useAuth();
  const { updatePassword, updatePasswordAdmin } = useUser();
  const toast = useToast();

  const handleShowPassword = () => setShowPassword(!showPassword);

  const passwordCriteria = {
    uppercase: /[A-Z]/.test(passwordInput),
    lowercase: /[a-z]/.test(passwordInput),
    number: /\d/.test(passwordInput),
    specialChar: /[!@#$%^&*(),.?":{}|<>]/.test(passwordInput),
    length: passwordInput.length >= 8 && passwordInput.length <= 12,
    match: passwordInput && passwordInput === confirmPasswordInput,
  };

  const Icon = ({ meetsCriteria }) => {
    return meetsCriteria ? <CheckCircleIcon color={'green'} /> : <NotAllowedIcon color={'red'} />;
  };

  const handlePasswordReset = async () => {
    setPasswordIsLoading(true);
    if (passwordInput === confirmPasswordInput) {
      const validationResult = validatePassword({ password: passwordInput });
      if (validationResult.success) {
        let result;
        if (userToEditId != undefined) {
          result = await updatePasswordAdmin(user.id, passwordInput, userToEditId);
        } else {
          result = await updatePassword(user.id, passwordInput);
        }
        if (result) {
          showToast(
            'Uppdatering av lösenord',
            `Lösenordet för ${email} har uppdaterats`,
            'success',
          );
          handleClose();
        } else {
          showToast(
            'Uppdatering av lösenord',
            `Lösenordet för ${email} kunde inte uppdateras`,
            'warning',
          );
        }
      } else {
        showToast('Fel vid byte av lösenord', errorsToString(validationResult.errors), 'warning');
      }
    } else {
      showToast('Fel vid byte av lösenord', 'Lösenorden måste matcha', 'warning');
    }
    setPasswordIsLoading(false);
  };

  const handleClose = () => {
    setPasswordInput('');
    setConfirmPasswordInput('');
    onClose();
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
    <Modal isOpen={isOpen} onClose={handleClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sätt nytt lösenord för {email}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <SimpleGrid columns={2} spacing={5}>
            <Box>
              <FormControl isRequired>
                <FormLabel>Lösenord</FormLabel>
                <Input
                  id='passwordInput'
                  placeholder='Lösenord...'
                  value={passwordInput}
                  autoComplete='off'
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setPasswordInput(e.target.value)}
                />

                <FormLabel>Bekräfta lösenord</FormLabel>
                <Input
                  id='repeatPasswordInput'
                  placeholder='Upprepa lösenord...'
                  value={confirmPasswordInput}
                  autoComplete='off'
                  type={showPassword ? 'text' : 'password'}
                  onChange={(e) => setConfirmPasswordInput(e.target.value)}
                />
                <Button marginTop={'5%'} size={'sm'} onClick={handleShowPassword}>
                  {showPassword ? 'Dölj lösenord' : 'Visa lösenord'}
                </Button>
              </FormControl>
            </Box>
            <Box>
              <VStack alignItems={'flex-start'}>
                <Heading size={'md'}>Lösenordsregler:</Heading>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.length} />
                  <Text>8 till 12 tecken</Text>
                </HStack>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.uppercase} />
                  <Text>Minst en versal</Text>
                </HStack>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.lowercase} />
                  <Text>Minst en gemen</Text>
                </HStack>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.number} />
                  <Text>Minst en siffra</Text>
                </HStack>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.specialChar} />
                  <Text>Minst ett specialtecken</Text>
                </HStack>
                <HStack>
                  <Icon meetsCriteria={passwordCriteria.match} />
                  <Text>Lösenorden måste matcha</Text>
                </HStack>
              </VStack>
            </Box>
          </SimpleGrid>
        </ModalBody>

        <ModalFooter>
          <Button
            colorScheme='blue'
            mr={3}
            onClick={handlePasswordReset}
            isLoading={passwordIsLoading}
          >
            Spara
          </Button>
          <Button onClick={handleClose}>Avbryt</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
