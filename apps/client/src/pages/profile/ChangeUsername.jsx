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
import { useAuth } from '../../hooks/useAuth';
import { useUser } from '../../hooks/useUser';

export default function ChangeUsername({ isOpen, onClose }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [usernameIsLoading, setUsernameIsLoading] = useState(false);
  const { user } = useAuth();
  const { updateUsername } = useUser();
  const toast = useToast();

  const handleUsernameChange = async () => {
    setUsernameIsLoading(true);
    const result = await updateUsername(user.id, usernameInput);

    if (result) {
      showToast('Uppdaterat', 'Ditt användarnamn har uppdaterats', 'success');
      onClose();
    } else {
      showToast('Uppdatering av användarnamn', `Användarnamnet kunde inte uppdateras`, 'warning');
    }
    setUsernameIsLoading(false);
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
          <Button
            colorScheme='blue'
            mr={3}
            onClick={handleUsernameChange}
            isLoading={usernameIsLoading}
          >
            Spara
          </Button>
          <Button onClick={onClose}>Avbryt</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
