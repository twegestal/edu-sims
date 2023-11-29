import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';

import { useCases } from '../hooks/useCases';
import { useDiagnosis } from '../hooks/useDiagnosis';
import LoadingSkeleton from '../loadingSkeleton';
import Confirm from '../components/Confirm';

export default function DiagnosisModal({ isOpen, onClose, moduleData }) {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [prompt, setPrompt] = useState('Ange en uppmaning till användaren');
  const [feedbackCorrect, setFeedbackCorrect] = useState('Ange korrekt feedback');
  const [feedbackIncorrect, setFeedbackIncorrect] = useState('Ange inkorrekt feedback');
  const [loading, setLoading] = useState(true);

  const [resultDiagnosis, setResultDiagnosis] = useState([]);
  const [diagnosisHtml, setDiagnosisHtml] = useState('');
  const [diagnosisNames, setDiagnosisNames] = useState();

  const { medicalFields, getMedicalFields } = useCases();
  const { diagnosisList, getDiagnosisList } = useDiagnosis();

  useEffect(() => {
    const fetchMedicalFields = async () => {
      await getMedicalFields();
    };

    const arr = ['s1', 's2', 's3', 's4'];
    setResultDiagnosis(arr);

    fetchMedicalFields();
  }, []);

  const changeMedicalField = async (medicalFieldId) => {
    await getDiagnosisList(medicalFieldId);
  };

  useEffect(() => {
    if (diagnosisList.length > 0) {
      let arr = [];
      const diagnosisMap = {};
      diagnosisList.map(
        (diagnosis, index) => (
          (arr[index] = diagnosis.name), (diagnosisMap[diagnosis.name] = diagnosis.id)
        ),
      );
      setDiagnosisNames(diagnosisMap);
      setResultDiagnosis(arr);
    }

    console.log(diagnosisList);
  }, [diagnosisList]);

  useEffect(() => {
    if (medicalFields.length > 0) {
      setLoading(false);
    }
  }, [medicalFields]);

  const filterDiagnosis = (searchString) => {
    var filterdList = [];
    if (searchString.length > 0) {
      filterdList = resultDiagnosis.filter((obj) => {
        return obj.toLowerCase().includes(searchString.toLowerCase());
      });
    }
    console.log(filterdList);
    setDiagnosisHtml(
      filterdList.map((item) => (
        <Card key={item}>
          <div onClick={() => setDiagnosis(item)}>
            <HStack>
              <Text>{item}</Text>
              <IconButton
                id={item}
                margin={0.5}
                size='md'
                colorScheme='teal'
                icon={<SmallAddIcon />}
              />
            </HStack>
          </div>
        </Card>
      )),
    );
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const buildStep = () => {
    onClose();
  };

  const clearContent = () => {
    setPrompt('');
    setFeedbackCorrect('');
    setFeedbackIncorrect('');
  };

  return (
    <>
      <Modal isOpen={isOpen} onClose={buildStep}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Diagnos</ModalHeader>
          <ModalBody>
            {loading ? (
              <LoadingSkeleton />
            ) : (
              <FormControl>
                <FormLabel>Uppmaning till användaren</FormLabel>
                <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}></Textarea>
                <Card>
                  <FormLabel>Ange korrekt diagnos</FormLabel>
                  <RadioGroup onChange={(e) => changeMedicalField(e)}>
                    <HStack>
                      {medicalFields.map((element) => (
                        <Radio value={element.id}>{element.name}</Radio>
                      ))}
                    </HStack>
                  </RadioGroup>

                  <Input
                    id='inputField'
                    placeholder='Sök korrekt diagnos här'
                    onChange={(e) => filterDiagnosis(e.target.value)}
                  />
                  {diagnosisHtml}
                </Card>
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
            )}
          </ModalBody>
          <ModalFooter>
            <Button onClick={buildStep}>Spara ändringar</Button>
            <Button onClick={clearContent}>Rensa</Button>
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
