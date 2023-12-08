import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Input,
  Text,
  useToast,
  ButtonGroup,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ConfirmInput({ isOpen, onClose, onConfirm, valueToConfirm }) {
  const [newValue, setNewValue] = useState();
  const toast = useToast();

  const handleConfirm = () => {
    if (!newValue) {
      toast({
        title: 'Värde saknas',
        description: 'Fyll i ett värde eller avbryt',
        status: 'warning',
        duration: 5000,
        isClosable: true,
        position: 'top',
      });
    } else {
      onConfirm(newValue);
    }
  };

  return (
    <AlertDialog motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Ändra värden
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>{`Ange nytt värde för ${valueToConfirm}`}</Text>
            <Input placeholder='Nytt värde...' onChange={(e) => setNewValue(e.target.value)} />
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button colorScheme='teal' onClick={handleConfirm} ml={3}>
                Bekräfta
              </Button>
              <Button onClick={onClose}>Avbryt</Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
