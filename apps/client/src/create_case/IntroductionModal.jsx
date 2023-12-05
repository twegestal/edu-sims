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

  const [description, setDescription] = useState('Fyll i din beskrivning av ett patientmöte');
  const [prompt, setPrompt] = useState('Fyll i din uppmaning till användaren som en Ja/Nej-fråga');
  const [feedbackCorrect, setFeedbackCorrect] = useState('Fyll i feedback för korrekt svar');
  const [feedbackIncorrect, setFeedbackIncorrect] = useState('Fyll i feedback för inkorrekt svar');

  useEffect(() => {
    setDescription(
      moduleData?.stepData?.description || 'Fyll i din beskrivning av ett patientmöte',
    );
    setPrompt(
      moduleData?.stepData?.prompt || 'Fyll i din uppmaning till användaren som en Ja/Nej-fråga',
    );
    setFeedbackCorrect(
      moduleData?.stepData?.feedback_correct || 'Fyll i feedback för korrekt svar',
    );
    setFeedbackIncorrect(
      moduleData?.stepData?.feedback_incorrect || 'Fyll i feedback för inkorrekt svar',
    );
  }, [moduleData]);

  const clearContent = () => {
    setDescription('');
    setPrompt('');
    setFeedbackCorrect('');
    setFeedbackIncorrect('');

    setIsConfirmOpen(false);
  };

  const resetContent = () => {
    //TODO: kan detta vara en lösning, tror inte det??
    setDescription('Fyll i din beskrivning av ett patientmöte');
    setPrompt('Fyll i din uppmaning till användaren som en Ja/Nej-fråga');
    setFeedbackCorrect('Fyll i feedback för korrekt svar');
    setFeedbackIncorrect('Fyll i feedback för inkorrekt svar');
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
    //resetContent();
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
              <FormLabel>Beskrivning</FormLabel>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              ></Textarea>

              <FormLabel>Uppmaning</FormLabel>
              <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}></Textarea>

              <FormLabel>Korrekt feedback</FormLabel>
              <Textarea
                value={feedbackCorrect}
                onChange={(e) => setFeedbackCorrect(e.target.value)}
              ></Textarea>

              <FormLabel>Inkorrekt feedback</FormLabel>
              <Textarea
                value={feedbackIncorrect}
                onChange={(e) => setFeedbackIncorrect(e.target.value)}
              ></Textarea>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button onClick={buildStep}>Spara ändringar</Button>

            <Button onClick={handleOpenConfirm} colorScheme='red' ml={3}>Rensa</Button>
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
