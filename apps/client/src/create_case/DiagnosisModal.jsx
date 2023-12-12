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
  Text,
  Checkbox,
  VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Confirm from '../components/Confirm';
import LoadingSkeleton from '../loadingSkeleton';
import { useCases } from '../hooks/useCases';
import { useDiagnosis } from '../hooks/useDiagnosis';

export default function DiagnosisModal({ isOpen, onClose, moduleData, medicalFieldId }) {
  const [loading, setLoading] = useState(true);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const moduleTypeIdentifier = 2;
  const [prompt, setPrompt] = useState('Fyll i din uppmaning till användaren');
  const [diagnosisId, setDiagnosisId] = useState();
  const [feedbackCorrect, setFeedbackCorrect] = useState('Fyll i feedback för korrekt svar');
  const [feedbackIncorrect, setFeedbackIncorrect] = useState('Fyll i feedback för inkorrekt svar');

  const { getMedicalFields } = useCases();
  const { diagnosisList, getDiagnosisList, setDiagnosisList } = useDiagnosis();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();

      if (medicalFieldId) {
        await getDiagnosisList(medicalFieldId);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    setPrompt(moduleData?.stepData?.prompt || 'Fyll i din uppmaning till användaren');
    setDiagnosisId(moduleData?.stepData?.diagnosis_id || null);
    setFeedbackCorrect(
      moduleData?.stepData?.feedback_correct || 'Fyll i feedback för korrekt svar',
    );
    setFeedbackIncorrect(
      moduleData?.stepData?.feedback_incorrect || 'Fyll i feedback för inkorrekt svar',
    );

    const updateDiagnosisList = async () => {
      await getDiagnosisList(medicalFieldId);
    };

    if (medicalFieldId) {
      updateDiagnosisList();
    } else {
      setDiagnosisList();
    }
  }, [moduleData]);

  const clearContent = () => {
    setPrompt('');
    setDiagnosisId(null);
    setFeedbackCorrect('');
    setFeedbackIncorrect('');

    setIsConfirmOpen(false);
  };

  const handleOpenConfirm = () => {
    setIsConfirmOpen(true);
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const handleCheckboxChange = (id) => {
    setDiagnosisId(diagnosisId === id ? null : id);
  };

  const buildStep = () => {
    const stepData = {
      module_type_identifier: moduleTypeIdentifier,
      prompt: prompt,
      diagnosis_id: diagnosisId,
      feedback_correct: feedbackCorrect,
      feedback_incorrect: feedbackIncorrect,
    };

    onClose(stepData);
  };

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
                  <VStack alignItems={'flex-start'}>
                    {diagnosisList ? (
                      <>
                        {diagnosisList.length > 0 ? (
                          <>
                            {diagnosisList.map((diagnosis) => (
                              <Checkbox
                                key={diagnosis.id}
                                id={diagnosis.id}
                                isChecked={diagnosis.id === diagnosisId}
                                onChange={() => handleCheckboxChange(diagnosis.id)}
                              >
                                {diagnosis.name}
                              </Checkbox>
                            ))}
                          </>
                        ) : (
                          <Text as={'i'}>
                            Det finns inga diagnoser kopplade till det valda medicinska området
                          </Text>
                        )}
                      </>
                    ) : (
                      <Text as={'i'}>Du måste välja ett medicinskt område i falldetaljer</Text>
                    )}
                  </VStack>
                  <FormLabel>Korrekt feedback</FormLabel>
                  <Textarea
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  />
                  <FormLabel>Inkorrekt feedback</FormLabel>
                  <Textarea
                    value={feedbackIncorrect}
                    onChange={(e) => setFeedbackIncorrect(e.target.value)}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={buildStep}>Spara ändringar</Button>
                <Button onClick={handleOpenConfirm} colorScheme='red' ml={3}>
                  Rensa
                </Button>
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
