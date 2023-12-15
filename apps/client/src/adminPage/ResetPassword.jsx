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
} from '@chakra-ui/react';
import { validatePassword, errorsToString } from 'api';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';

export default function ResetPassword({ isOpen, onClose, email, userToEditId }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const [passwordIsLoading, setPasswordIsLoading] = useState(false)
  const { user } = useAuth();
  const { updatePassword, updatePasswordAdmin } = useUser();
  const toast = useToast();

  const handlePasswordReset = async () => {
    setPasswordIsLoading(true)
    if (passwordInput === confirmPasswordInput) {
      const validationResult = validatePassword({ password: passwordInput });
      if (validationResult.success) {
        var result;
        if (userToEditId != undefined){
          result = await updatePasswordAdmin(user.id, passwordInput, userToEditId);
        } else{
          result = await updatePassword(user.id, passwordInput);
        }
        if (result) {
          showToast(
            'Uppdatering av lösenord',
            `Lösenordet för ${email} har uppdaterats`,
            'success',
          );
          onClose();
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
    setPasswordIsLoading(false)
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
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Sätt nytt lösenord för {email}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Lösenord</FormLabel>
            <Input
              type='password'
              placeholder='Lösenord'
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </FormControl>

          <FormControl mt={4}>
            <FormLabel>Upprepa lösenord</FormLabel>
            <Input
              type='password'
              placeholder='Upprepa lösenord'
              onChange={(e) => setConfirmPasswordInput(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handlePasswordReset} isLoading={passwordIsLoading}>
            Spara
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
