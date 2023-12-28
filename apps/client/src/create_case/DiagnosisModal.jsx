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
  Input,
  useToast,
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
  const [prompt, setPrompt] = useState();
  const [diagnosisId, setDiagnosisId] = useState();
  const [feedbackCorrect, setFeedbackCorrect] = useState();
  const [feedbackIncorrect, setFeedbackIncorrect] = useState();
  const [searchTerm, setSearchTerm] = useState('');
  const [newDiagnosis, setNewDiagnosis] = useState('');

  const { getMedicalFields } = useCases();
  const { diagnosisList, getDiagnosisList, setDiagnosisList, addNewDiagnosis } = useDiagnosis();
  const toast = useToast();

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
    setPrompt(moduleData?.stepData?.prompt || '');
    setDiagnosisId(moduleData?.stepData?.diagnosis_id || null);
    setFeedbackCorrect(moduleData?.stepData?.feedback_correct || '');
    setFeedbackIncorrect(moduleData?.stepData?.feedback_incorrect || '');

    const updateDiagnosisList = async () => {
      await getDiagnosisList(medicalFieldId);
    };

    if (medicalFieldId) {
      updateDiagnosisList();
    } else {
      setDiagnosisList();
    }
  }, [moduleData]);

  const filteredDiagnosisList = searchTerm
    ? diagnosisList.filter((diagnosis) =>
        diagnosis.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : diagnosisList;

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

  const handleAddNewDiagnosis = async () => {
    if (newDiagnosis) {
      const exists = diagnosisList.find(
        (d) => d.name.toLowerCase().trim() === newDiagnosis.toLowerCase().trim(),
      );
      if (exists) {
        showToast(
          'Diagnos finns redan',
          `En diagnos med namnet ${newDiagnosis} finns redan`,
          'error',
        );
      } else {
        const response = await addNewDiagnosis(newDiagnosis, medicalFieldId);
        if (response) {
          showToast('Diagnos tillagd', `${newDiagnosis} har lagts till`, 'success');
          setNewDiagnosis('');
          await getDiagnosisList(medicalFieldId);
        } else {
          showToast('Någonting gick fel', `${newDiagnosis} kunde inte läggas till`, 'error');
        }
      }
    } else {
      showToast('Fel', 'Du måste ange ett namn för att kunna lägga till en diagnos', 'error');
    }
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
                <FormControl isRequired>
                  <FormLabel fontWeight={'bold'}>Uppmaning till användaren</FormLabel>
                  <Textarea
                    marginBottom={'5px'}
                    placeholder='Fyll i din uppmaning till användaren'
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                  />

                  <FormLabel fontWeight={'bold'}>Ange korrekt diagnos från listan</FormLabel>
                  {diagnosisList && (
                    <>
                      <FormLabel fontWeight={'bold'}>Sök diagnos</FormLabel>
                      <Input
                        autoComplete='off'
                        marginBottom={'5px'}
                        placeholder='Sök efter diagnos'
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </>
                  )}
                  <VStack alignItems={'flex-start'} marginBottom={'5px'}>
                    {filteredDiagnosisList ? (
                      <>
                        {filteredDiagnosisList.length > 0 ? (
                          <>
                            {filteredDiagnosisList.map((diagnosis) => (
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
                          <>
                            <Text as={'i'}>
                              Inga diagnoser hittades som matchar din sökning. Lägg till en ny
                              diagnos genom att skriva in namnet och klicka "Lägg till"
                            </Text>
                            <FormControl>
                              <Input
                                placeholder='Skriv in namnet på en ny diagnos här...'
                                onChange={(e) => setNewDiagnosis(e.target.value)}
                              ></Input>
                            </FormControl>
                            <Button onClick={handleAddNewDiagnosis}>Lägg till</Button>
                          </>
                        )}
                      </>
                    ) : (
                      <Text as={'i'}>Du måste välja ett medicinskt område i falldetaljer</Text>
                    )}
                  </VStack>
                  <FormLabel fontWeight={'bold'}>Feedback för rätt svar</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för rätt svar'
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  />
                  <FormLabel fontWeight={'bold'}>Feedback för fel svar</FormLabel>
                  <Textarea
                    placeholder='Fyll i feedback för inkorrekt svar'
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
