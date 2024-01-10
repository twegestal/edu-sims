import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  Text,
} from '@chakra-ui/react';

export default function ConfirmStartCase({ isOpen, onClose, onRestart, onContinue }) {
  return (
    <AlertDialog motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            Påbörjat försök finns
          </AlertDialogHeader>
          <AlertDialogBody>
            <Text>
              Du har redan ett påbörjat försök på det här fallet. Vill du återuppta det, eller
              starta om fallet?
            </Text>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button onClick={onContinue}>Fortsätt</Button>
              <Button onClick={onRestart}>Starta om</Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
