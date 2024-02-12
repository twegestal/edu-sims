import {
  AlertDialog,
  AlertDialogBody,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  Button,
  ButtonGroup,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';

export default function ConfirmRange({
  isOpen,
  onClose,
  minProp,
  maxProp,
  unitProp,
  name,
  onConfirm,
}) {
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [unit, setUnit] = useState();
  const [minError, setMinError] = useState(false);
  const [maxError, setMaxError] = useState(false);
  const [unitError, setUnitError] = useState(false);

  useEffect(() => {
    setMin(minProp ? minProp : '');
    setMax(maxProp ? maxProp : '');
    setUnit(unitProp ? unitProp : '');
  }, []);

  const handleConfirm = () => {
    const isMinValid = min.trim() !== '';
    const isMaxValid = max.trim() !== '';
    const isUnitValid = unit.trim() !== '';

    if (isMinValid && isMaxValid && isUnitValid) {
      onConfirm(min.trim(), max.trim(), unit.trim());
    } else {
      setMinError(!isMinValid);
      setMaxError(!isMaxValid);
      setUnitError(!isUnitValid);
    }
  };

  return (
    <AlertDialog motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize={'lg'} fontWeight={'bold'}>
            Normalvärden för {name}
          </AlertDialogHeader>
          <AlertDialogBody>
            <FormControl isRequired isInvalid={minError}>
              <FormLabel>Undre gräns</FormLabel>
              <Input
                placeholder='Fyll i undre gräns...'
                value={min}
                onChange={(e) => {
                  setMin(e.target.value);
                  setMinError(false);
                }}
              />
              {minError && <FormErrorMessage>Fyll i undre gräns</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={maxError}>
              <FormLabel>Övre gräns</FormLabel>
              <Input
                placeholder='Fyll i övre gräns...'
                value={max}
                onChange={(e) => {
                  setMax(e.target.value);
                  setMaxError(false);
                }}
              />
              {maxError && <FormErrorMessage>Fyll i övre gräns</FormErrorMessage>}
            </FormControl>
            <FormControl isRequired isInvalid={unitError}>
              <FormLabel>Enhet</FormLabel>
              <Input
                placeholder='Fyll i enhet...'
                value={unit}
                onChange={(e) => {
                  setUnit(e.target.value);
                  setUnitError(false);
                }}
              />
              {unitError && <FormErrorMessage>Fyll i enhet</FormErrorMessage>}
            </FormControl>
          </AlertDialogBody>
          <AlertDialogFooter>
            <ButtonGroup>
              <Button onClick={handleConfirm}>Bekräfta</Button>
              <Button onClick={onClose}>Avbryt</Button>
            </ButtonGroup>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
