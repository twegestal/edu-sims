import {
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  Textarea,
  Checkbox,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

export default function ConfirmValues({
  isOpen,
  onClose,
  handleConfirm,
  examinationName,
  examinationId,
  stepSpecificValues,
}) {
  const [examinationValue, setExaminationValue] = useState('Fyll i värde här');
  const [isNormal, setIsNormal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      stepSpecificValues.forEach((element) => {
        if (element.examination_id === examinationId) {
          if (element.value) {
            setExaminationValue(element.value);
            setIsNormal(element.is_normal);
          } else {
            setExaminationValue('Fyll i värde här');
            setIsNormal(false);
          }
        }
      });
    }
  }, [isOpen]);
  return (
    <AlertDialog motionPreset='slideInBottom' isOpen={isOpen} onClose={onClose}>
      <AlertDialogOverlay>
        <AlertDialogContent>
          <AlertDialogHeader fontSize='lg' fontWeight='bold'>
            {'Fyll i värden'}
          </AlertDialogHeader>

          <AlertDialogBody>
            {`Fyll i värdet som resultatet av utredningen "${examinationName}" ska ge.`}
            <Textarea
              value={examinationValue}
              placeholder={examinationValue}
              onChange={(e) => setExaminationValue(e.target.value)}
            ></Textarea>
            <Checkbox isChecked={isNormal} onChange={(e) => setIsNormal(e.target.checked)}>
              Normalvärde
            </Checkbox>
          </AlertDialogBody>

          <AlertDialogFooter>
            <Button onClick={onClose}>Avbryt</Button>
            <Button
              colorScheme='teal'
              onClick={() => handleConfirm(examinationValue, isNormal)}
              ml={3}
            >
              Spara värden
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialogOverlay>
    </AlertDialog>
  );
}
