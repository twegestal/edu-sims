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

export default function SummaryModal({ isOpen, onClose, moduleData }) {
  const moduleTypeIdentifier = 4;
  const [process, setProcess] = useState();
  const [additionalInfo, setAdditionalInfo] = useState();
  const [additionalLinks, setAdditionalLinks] = useState();

  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    setProcess(moduleData?.stepData?.process || '');
    setAdditionalInfo(moduleData?.stepData?.additional_info || '');
    setAdditionalLinks(moduleData?.stepData?.additional_links || '');
  }, [moduleData]);

  const clearContent = () => {
    setProcess('');
    setAdditionalInfo('');
    setAdditionalLinks('');

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
      process: process,
      additional_info: additionalInfo,
      additional_links: additionalLinks,
    };

    onClose(stepData);
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={buildStep}>
        <ModalOverlay />

        <ModalContent>
          <ModalHeader>Sammanfattning</ModalHeader>

          <ModalBody>
            <FormControl isRequired>
              <FormLabel fontWeight={'bold'}>Process</FormLabel>
              <Textarea
                value={process}
                placeholder='Hur hade den korrekta processen sett ut om en läkare tagit sig an fallet?'
                onChange={(e) => setProcess(e.target.value)}
              ></Textarea>

              <FormLabel fontWeight={'bold'}>Ytterligare information</FormLabel>
              <Textarea
                value={additionalInfo}
                placeholder='Fyll i övrig information om sjukdomen till studenten'
                onChange={(e) => setAdditionalInfo(e.target.value)}
              ></Textarea>

              <FormLabel fontWeight={'bold'}>Länkar</FormLabel>
              <Textarea
                value={additionalLinks}
                placeholder='Fyll i länkar till övrig information om sjukdomen'
                onChange={(e) => setAdditionalLinks(e.target.value)}
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
