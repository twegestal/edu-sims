import { Alert, AlertIcon, AlertTitle, AlertDescription, CloseButton } from '@chakra-ui/react';
import { useAlert } from './hooks/useAlert.jsx';

export default function AlertBanner() {
  const { status, message, title, resetAlert } = useAlert();

  return (
    <Alert status={status}>
      <AlertIcon />
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>

      <CloseButton onClick={resetAlert}></CloseButton>
    </Alert>
  );
}
