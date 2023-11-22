import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  IconButton,
  Box,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  VStack,
  Flex,
  Card,
} from '@chakra-ui/react';
import { FaNotesMedical } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { MdFeedback } from 'react-icons/md';
import { BiTestTube } from 'react-icons/bi';
import Introduction from './introduction.jsx';
import Examination from './examination.jsx';
import Summary from './summary.jsx';
import Diagnosis from './diagnosis.jsx';
import { Editor } from '@tinymce/tinymce-react';
import { WarningIcon } from '@chakra-ui/icons';
import Treatment from './Treatment.jsx';
import { useCases } from './hooks/useCases.js';

export default function PerformCase() {
  let params = useParams();
  let caseid = params['caseid'].split('caseid=')[1];
  let attemptId = params['attemptid'].split('attemptid=')[1];
  const { isOpen: isNotesOpen, onOpen: onNotesOpen, onClose: onNotesClose } = useDisclosure();
  const { isOpen: isHomeOpen, onOpen: onHomeOpen, onClose: onHomeClose } = useDisclosure();
  const { isOpen: isDescOpen, onOpen: onDescOpen, onClose: onDescClose } = useDisclosure();
  const {
    isOpen: isFeedbackOpen,
    onOpen: onFeedbackOpen,
    onClose: onFeedbackClose,
  } = useDisclosure();
  const {
    isOpen: isTreatmentResultsOpen,
    onOpen: onTreatmentResultsOpen,
    onClose: onTreatmentResultsClose,
  } = useDisclosure();
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState({});
  const [currentIndex, setCurrentIndex] = useState();
  const [displayFeedback, setDisplayFeedback] = useState(false);
  const [description, setDescription] = useState('');
  const [notes, setNotes] = useState('');
  const [feedback, setFeedback] = useState([]);
  const [treatmentResults, setTreatmentResults] = useState([]);
  const editorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [faultsCounter, setFaultsCounter] = useState(0);
  const [correctDiagnosis, setCorrectDiagnosis] = useState(false);
  const [caseIsFinished, setCaseIsFinished] = useState(false);
  const [finishCaseTimestamp, setFinishCaseTimestamp] = useState([]);
  const [nbrTestPerformed, setNbrTestPerformed] = useState(0);

  const { caseById, getCaseById, updateAttempt } = useCases();

  useEffect(() => {
    const getCaseList = async () => {
      await getCaseById(caseid);
      setLoading(false);
    };
    getCaseList();
  }, []);

  useEffect(() => {
    if (!loading) {
      setCurrentStep(caseById[0]);
      setCurrentIndex(caseById[0].index);
    }
  }, [caseById]);

  useEffect(() => {
    // When caseIsFinished variable is set to true, the attempt data will be updated
    if (caseIsFinished == true) {
      attemptUpdateFunction();
      return navigate('/');
    }
  }, [caseIsFinished]);

  useEffect(() => {
    // When caseIsFinished variable is set to true, the attempt data will be updated
    if (caseIsFinished == true) {
      attemptUpdateFunction();
      return navigate('/');
    }
  }, [caseIsFinished]);

  const attemptUpdateFunction = () => {
    //Variabels needed to update the attempt record
    const isFinished = caseIsFinished;
    const faults = faultsCounter;
    const timestamp_finished = finishCaseTimestamp;
    const correct_diagnosis = correctDiagnosis;
    const nbr_of_tests_performed = nbrTestPerformed;

    //Updates the attempt record
    updateAttempt(
      attemptId,
      isFinished,
      faults,
      timestamp_finished,
      correct_diagnosis,
      nbr_of_tests_performed,
    );
  };

  const nextStep = async (event) => {
    let nextIndex = currentIndex + 1;

    let indexOfNextStep = caseById.findIndex((x) => x.index === nextIndex);
    attemptUpdateFunction();

    setCurrentStep(caseById[indexOfNextStep]);
    setCurrentIndex(caseById[indexOfNextStep].index);
  };

  const saveNotes = () => {
    /*Saves text from the text editor to the notes variable */
    if (editorRef.current) {
      setNotes(editorRef.current.getContent());
      onNotesClose();
    }
  };
  //FIXME: key is not unique
  const updateLabResultsList = (resultsObject) => {
    setTreatmentResults([
      ...treatmentResults,
      <Flex key={'1'} alignItems='center' flexDirection='column'>
        {Object.keys(resultsObject).map((index) =>
          resultsObject[index].isNormal ? (
            <Flex key={index} flexDirection='row'>
              <p>
                {resultsObject[index].name} : {resultsObject[index].value}{' '}
              </p>
            </Flex>
          ) : (
            <Flex key={index} flexDirection='row' justifyContent='space-between'>
              <WarningIcon />
              <p>
                {resultsObject[index].name} : {resultsObject[index].value}
              </p>
            </Flex>
          ),
        )}
      </Flex>,
    ]);
    setNbrTestPerformed(nbrTestPerformed + Object.keys(resultsObject).length); // saves the number of tests performed, for use in statistics
  };

  const updateFeedback = (feedbackToDisplay) => {
    setFeedback([
      ...feedback,
      <Card key={currentIndex} variant='filled'>
        <Accordion allowMultiple>
          <AccordionItem>
            <AccordionButton>
              <Box as='span' flex='1' textAlign='center'>
                Feedback från steg # {currentIndex + 1}
              </Box>
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>{feedbackToDisplay}</AccordionPanel>
          </AccordionItem>
        </Accordion>
      </Card>,
    ]);
  };

  const finishCase = () => {
    setCaseIsFinished(true);
    setFinishCaseTimestamp(getCurrentTimestamp());
  };

  const getCurrentTimestamp = () => {
    const currentDate = new Date();

    // Get parts of the timestamp
    const year = currentDate.getFullYear();
    const month = String(currentDate.getMonth() + 1).padStart(2, '0');
    const day = String(currentDate.getDate()).padStart(2, '0');
    const hours = String(currentDate.getHours()).padStart(2, '0');
    const minutes = String(currentDate.getMinutes()).padStart(2, '0');
    const seconds = String(currentDate.getSeconds()).padStart(2, '0');
    const milliseconds = String(currentDate.getMilliseconds()).padStart(3, '0');

    // Get the UTC offset
    const timezoneOffset = -currentDate.getTimezoneOffset() / 60;
    const offsetSign = timezoneOffset >= 0 ? '+' : '-';
    const timezoneOffsetString = String(Math.abs(timezoneOffset)).padStart(2, '0');

    // Construct the timestamp string
    const timestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}.${milliseconds}${offsetSign}${timezoneOffsetString}`;

    return timestamp;
  };

  return (
    <>
      <nav>
        <Box display='flex' alignItems='center' justifyContent='space-between'>
          <div className='Notes'>
            <IconButton
              onClick={onNotesOpen}
              variant='solid'
              colorScheme='blue'
              aria-label='Notes'
              fontSize='20px'
              icon={<FaNotesMedical />}
            />
            <Modal isOpen={isNotesOpen} onClose={onNotesClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Anteckningar</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Editor
                    apiKey='f20f7hhnsnotsjt5l3nxit8s7mxfmgoncdx2smt22tl5k8es'
                    onInit={(evt, editor) => (editorRef.current = editor)}
                    init={{
                      plugins:
                        'autolink  emoticons image link lists table  wordcount  tableofcontents ',
                      toolbar:
                        'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                    }}
                    initialValue={notes}
                  />
                  <Button onClick={saveNotes}>Spara anteckningar</Button>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onNotesClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className='Home'>
            <IconButton
              onClick={onHomeOpen}
              variant='solid'
              colorScheme='blue'
              aria-label='Home'
              fontSize='20px'
              icon={<AiFillHome />}
            />
            <Modal isOpen={isHomeOpen} onClose={onHomeClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Är du säker på att du vill avsluta</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Link to='/'>
                    <Button>Avsluta</Button>
                  </Link>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onHomeClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className='Desc'>
            <IconButton
              onClick={onDescOpen}
              variant='solid'
              colorScheme='blue'
              aria-label='Description'
              fontSize='20px'
              icon={<BsFileEarmarkPerson />}
            />
            <Modal isOpen={isDescOpen} onClose={onDescClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Beskrivning</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{description}</ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onDescClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className='Feedback'>
            <IconButton
              onClick={onFeedbackOpen}
              variant='solid'
              colorScheme='blue'
              aria-label='Feedback'
              fontSize='20px'
              icon={<MdFeedback />}
            />
            <Modal isOpen={isFeedbackOpen} onClose={onFeedbackClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Feedback</ModalHeader>
                <ModalCloseButton />
                <ModalBody>
                  <Flex direction='column' rowGap='2'>
                    {feedback}
                  </Flex>
                </ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onFeedbackClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
          <div className='TreatmentResults'>
            <IconButton
              onClick={onTreatmentResultsOpen}
              variant='solid'
              colorScheme='blue'
              aria-label='Results'
              fontSize='20px'
              icon={<BiTestTube />}
            />
            <Modal isOpen={isTreatmentResultsOpen} onClose={onTreatmentResultsClose}>
              <ModalOverlay />
              <ModalContent>
                <ModalHeader>Labbtester</ModalHeader>
                <ModalCloseButton />
                <ModalBody>{treatmentResults}</ModalBody>

                <ModalFooter>
                  <Button colorScheme='blue' mr={3} onClick={onTreatmentResultsClose}>
                    Close
                  </Button>
                </ModalFooter>
              </ModalContent>
            </Modal>
          </div>
        </Box>
      </nav>
      <div>{loading ? <p></p> : <p>{caseById[0].medical_case.name}</p>}</div>
      <VStack alignItems='stretch'>
        {currentStep.module_type_identifier === 0 && (
          <div>
            <Introduction
              stepId={currentStep.step_id}
              caseData={caseById}
              displayFeedback={displayFeedback}
              setDisplayFeedback={setDisplayFeedback}
              setDescription={setDescription}
              updateFeedback={updateFeedback}
              faultsCounter={faultsCounter}
              setFaultsCounter={setFaultsCounter}
            ></Introduction>
          </div>
        )}
        {currentStep.module_type_identifier === 1 && (
          <div>
            <Examination
              stepId={currentStep.step_id}
              displayFeedback={displayFeedback}
              setDisplayFeedback={setDisplayFeedback}
              updateLabResultsList={updateLabResultsList}
              updateFeedback={updateFeedback}
              faultsCounter={faultsCounter}
              setFaultsCounter={setFaultsCounter}
              setNbrTestPerformed={setNbrTestPerformed}
            ></Examination>
          </div>
        )}
        {currentStep.module_type_identifier === 2 && (
          <div>
            <Diagnosis
              stepId={currentStep.step_id}
              medicalFieldId={currentStep.medical_case.medical_field_id}
              displayFeedback={displayFeedback}
              setDisplayFeedback={setDisplayFeedback}
              updateFeedback={updateFeedback}
              feedback={feedback}
              faultsCounter={faultsCounter}
              setFaultsCounter={setFaultsCounter}
              setCorrectDiagnosis={setCorrectDiagnosis}
            ></Diagnosis>
          </div>
        )}
        {currentStep.module_type_identifier === 3 && (
          <div>
            <Treatment
              stepId={currentStep.step_id}
              displayFeedback={displayFeedback}
              setDisplayFeedback={setDisplayFeedback}
              updateFeedback={updateFeedback}
              faultsCounter={faultsCounter}
              setFaultsCounter={setFaultsCounter}
            ></Treatment>
          </div>
        )}
        {currentStep.module_type_identifier === 4 && (
          <div>
            <Summary stepId={currentStep.step_id}>
              displayFeedback = {displayFeedback}
              setDisplayFeedback = {setDisplayFeedback}
            </Summary>
          </div>
        )}
        {currentIndex + 1 <= caseById.length - 1 && displayFeedback && (
          <Button onClick={nextStep} colorScheme='teal'>
            Nästa
          </Button>
        )}
        {currentIndex + 1 > caseById.length - 1 && (
          <Button onClick={finishCase} colorScheme='teal'>
            Avsluta
          </Button>
        )}
      </VStack>
    </>
  );
}
