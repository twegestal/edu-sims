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
  
  export default function ConfirmTreatmentValues({
    isOpen,
    onClose,
    handleConfirm,
    treatmentName,
    treatmentId,
    stepSpecificTreatments,
  }) {
    const [treatmentDose, setTreatmentDose] = useState('Fyll i dosering här');
  
    useEffect(() => {
      if (isOpen) {
        stepSpecificTreatments.forEach((element) => {
          if (element.treatment_id === treatmentId) {
            if (element.value) {
              setTreatmentDose(element.value);
            } else {
              setTreatmentDose('Fyll i dosering här');
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
              {'Fyll i dosering'}
            </AlertDialogHeader>
  
            <AlertDialogBody>
              {`Fyll i dosering för behandlingen "${treatmentName}" om det är applicerbart.`}
              <Textarea
                value={treatmentDose}
                placeholder={treatmentDose}
                onChange={(e) => setTreatmentDose(e.target.value)}
              ></Textarea>
            </AlertDialogBody>
  
            <AlertDialogFooter>
              <Button onClick={onClose}>Avbryt</Button>
              <Button
                colorScheme='teal'
                onClick={() => handleConfirm(treatmentDose)}
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
  