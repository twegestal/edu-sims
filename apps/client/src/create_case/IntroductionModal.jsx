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
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import Confirm from '../components/Confirm';

export default function IntroductionModal({ isOpen, onClose, moduleData }) {
  const moduleTypeIdentifier = 0;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [description, setDescription] = useState();
  const [prompt, setPrompt] = useState();
  const [feedbackCorrect, setFeedbackCorrect] = useState();
  const [feedbackIncorrect, setFeedbackIncorrect] = useState();

  useEffect(() => {
    setDescription(moduleData?.stepData?.description || '');
    setPrompt(moduleData?.stepData?.prompt || '');
    setFeedbackCorrect(moduleData?.stepData?.feedback_correct || '');
    setFeedbackIncorrect(moduleData?.stepData?.feedback_incorrect || '');
  }, [moduleData]);

  const clearContent = () => {
    setDescription('');
    setPrompt('');
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

  const buildStep = () => {
    const stepData = {
      module_type_identifier: moduleTypeIdentifier,
      description: description,
      prompt: prompt,
      feedback_correct: feedbackCorrect,
      feedback_incorrect: feedbackIncorrect,
    };
    onClose(stepData);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={buildStep}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Introduktion</ModalHeader>

          <ModalBody>
            <FormControl>
              <FormLabel fontWeight={'bold'}>Beskrivning</FormLabel>
              <Textarea
                placeholder='Fyll i din beskrivning av ett patientmöte'
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>

              <FormLabel fontWeight={'bold'}>Uppmaning</FormLabel>
              <Textarea
                placeholder='Fyll i din uppmaning till användaren som en Ja/Nej-fråga'
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              ></Textarea>

              <FormLabel fontWeight={'bold'}>Feedbeck för rätt svar</FormLabel>
              <Textarea
                placeholder='Fyll i feedback för rätt svar'
                value={feedbackCorrect}
                onChange={(e) => setFeedbackCorrect(e.target.value)}
              ></Textarea>

              <FormLabel fontWeight={'bold'}>Feedback för fel svar</FormLabel>
              <Textarea
                placeholder='Fyll i feedback för fel svar'
                value={feedbackIncorrect}
                onChange={(e) => setFeedbackIncorrect(e.target.value)}
              ></Textarea>
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
  );
}
