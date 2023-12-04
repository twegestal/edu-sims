import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  Heading,
  Checkbox,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Confirm from '../components/Confirm';
import LoadingSkeleton from '../loadingSkeleton';
import { useCases } from '../hooks/useCases';
import { useDiagnosis } from '../hooks/useDiagnosis';

export default function DiagnosisModal({ isOpen, onClose, moduleData }) {
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const moduleTypeIdentifier = 2;
  const [prompt, setPrompt] = useState('Fyll i din uppmaning till användaren');
  const [diagnosisId, setDiagnosisId] = useState();
  const [feedbackCorrect, setFeedbackCorrect] = useState('Fyll i feedback för korrekt svar');
  const [feedbackInCorrect, setFeedbackInCorrect] = useState('Fyll i feedback för inkorrekt svar');

  const { medicalFields, getMedicalFields } = useCases();
  const { diagnosisList, getDiagnosisList } = useDiagnosis();
  const [diagnosisMap, setDiagnosisMap] = useState();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();
      await getDiagnosisList();
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    console.log('medicalFields: ', medicalFields);
    console.log('diagnosisList: ', diagnosisList);

    if (medicalFields && diagnosisList) {
      generateDiagnosisMap();
    }
  }, [medicalFields, diagnosisList]);

  useEffect(() => {
    if (diagnosisMap) {
      console.log('diagnosisStateVAriable:', diagnosisMap);
    }
  }, [diagnosisMap]);

  const generateDiagnosisMap = () => {
    const diagnosisMap = new Map();
    medicalFields.forEach((medicalField) => {
      const newArr = diagnosisList.filter(
        (diagnosis) => diagnosis.medical_field_id === medicalField.id,
      );
      diagnosisMap.set(medicalField.name, newArr);
    });

    console.log('daignosisMap innan setMetod:', diagnosisMap);
    setDiagnosisMap(diagnosisMap);
  };

  const clearContent = () => {};

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const buildStep = () => {};

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Modal isOpen={isOpen} onClose={buildStep}>
            <ModalOverlay />

            <ModalContent>
              <ModalHeader>Diagnos</ModalHeader>

              <ModalBody>
                <FormControl>
                  <FormLabel>Uppmaning till användaren</FormLabel>
                  <Textarea
                    value={prompt}
                    placeholder={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <FormLabel>Ange korrekt diagnos från listan</FormLabel>
                  {/* { diagnosisMap && 
                    Object.keys(diagnosisMap).map((key) => (
                      <>
                      <Heading>{key}</Heading>
                      <p>hallå</p>
                      
                      {diagnosisMap[key].map((diagnosis) => (
                        <Checkbox id={diagnosis.id}>{diagnosis.name}</Checkbox>
                      ))}

                      </>
                      
                      
                      
                    ))
                  } */}

                  {diagnosisMap.size > 0 &&
                    Array.from(diagnosisMap).forEach(([key, values]) => (
                      <>
                        <Heading>{key}</Heading>
                        <p>hallå</p>

                        {values.map((diagnosis) => (
                          <Checkbox id={diagnosis.id}>{diagnosis.name}</Checkbox>
                        ))}
                      </>
                    ))}
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={buildStep}>Spara ändringar</Button>
                <Button onClick={handleOpenConfirm}>Rensa</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Confirm
            isOpen={isConfirmOpen}
            onClose={handleCloseConfirm}
            header={'Rensa information'}
            body={'Är du säker på att du vill rensa informationen?'}
            handleConfirm={clearContent}
          />
        </>
      )}
    </>
  );
}
