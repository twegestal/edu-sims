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
} from '@chakra-ui/react';
import { validatePassword, errorsToString } from 'api';
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useAlert } from '../hooks/useAlert';

export default function ResetPassword({ isOpen, onClose, email, userToEditId }) {
  const [passwordInput, setPasswordInput] = useState('');
  const [confirmPasswordInput, setConfirmPasswordInput] = useState('');
  const { user } = useAuth();
  const { updatePassword } = useUser();
  const { setAlert } = useAlert();

  const handlePasswordReset = async () => {
    if (passwordInput === confirmPasswordInput) {
      const validationResult = validatePassword({ password: passwordInput });
      if (validationResult.success) {
        const result = await updatePassword(user.id, email, passwordInput, userToEditId);

        if (result) {
          setAlert('success', 'Uppdatering av lösenord', `Lösenordet för ${email} har uppdaterats`);
          onClose();
        } else {
          setAlert(
            'error',
            'Uppdatering av lösenord',
            `Lösenordet för ${email} kunde inte uppdateras`,
          );
        }
      } else {
        setAlert('error', 'Error vid byte av lösenord', errorsToString(validationResult.errors));
      }
    } else {
      setAlert('error', 'Error vid byte av lösenord', 'Lösenorden måste matcha');
    }
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
          <Button colorScheme='blue' mr={3} onClick={handlePasswordReset}>
            Spara
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
