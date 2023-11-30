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
import { useAuth } from '../hooks/useAuth';
import { useUser } from '../hooks/useUser';
import { useAlert } from '../hooks/useAlert';

export default function ChangeUsername({ isOpen, onClose, }) {
  const [usernameInput, setUsernameInput] = useState('');
  const { user } = useAuth();
  const { updateUsername } = useUser();
  const { setAlert } = useAlert();

  const handleUsernameChange = async () => {
      const result = await updateUsername(user.id, usernameInput,);

      if (result) {
        setAlert('success', 'Ditt användarnamn har uppdaterats');
        onClose();
      } else {
        setAlert(
          'error',
          'Uppdatering av användarnamn',
          `Användarnamnet kunde inte uppdateras`,
        );
      }
    };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Uppdatera användarnamnet för {user.email}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Användarnamn</FormLabel>
            <Input
              type='username'
              placeholder='Nytt användarnamn'
              onChange={(e) => setUsernameInput(e.target.value)}
            />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={handleUsernameChange}>
            Spara
          </Button>
          <Button onClick={onClose}>Cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
