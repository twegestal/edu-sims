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

export default function ConfirmStartCase({ isOpen, onClose, onRestart, onContinue, caseName }) {
  return (
    <AlertDialog motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            <Text>Påbörjat försök finns på fall "{caseName}"</Text>
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
