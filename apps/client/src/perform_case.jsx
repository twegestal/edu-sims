import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
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
import Introduction from './introduction.jsx';
import Examination from './examination.jsx';
import Summary from './summary.jsx';
import Diagnosis from './diagnosis.jsx';
import { WarningIcon } from '@chakra-ui/icons';
import Treatment from './Treatment.jsx';
import { useCases } from './hooks/useCases.js';
import './performCaseComponents/PerformCase.css'
import CaseNav from './performCaseComponents/CaseNav.jsx';

export default function PerformCase() {
  let params = useParams();
  let caseid = params['caseid'].split('caseid=')[1];
  let attemptId = params['attemptid'].split('attemptid=')[1];
  let reload = params['reload'].split('reload=')[1];

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
  const [wasCorrect, setWasCorrect] = useState(false)

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
      if (reload === 'true') {
        const storedIndex = JSON.parse(localStorage.getItem(caseid.toString() + 'index'));
        const storedFeedback = JSON.parse(localStorage.getItem(caseid.toString()));
        if (storedFeedback !== null) {
          for (let index = 0; index < 3; index++) {
            const listan = [];
            for (let index = 0; index < storedFeedback.length; index++) {
              listan[index] = (
                <Card key={index} variant='filled'>
                  <Accordion allowMultiple>
                    <AccordionItem>
                      <AccordionButton>
                        <Box as='span' flex='1' textAlign='center'>
                          Feedback från steg # {index + 1}
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel>{storedFeedback[index]}</AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Card>
              );
            }
            setFeedback([listan]);
            setCurrentStep(caseById[storedIndex]);
            setCurrentIndex(caseById[storedIndex].index);
          }
        }
      } else {
        localStorage.removeItem(caseid.toString());

        setCurrentStep(caseById[0]);
        setCurrentIndex(caseById[0].index);
      }
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

    localStorage.setItem(caseid.toString() + 'index', JSON.stringify(nextIndex));

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
    addFeedbackToStorage(feedbackToDisplay);
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
  const addFeedbackToStorage = (feedbackToDisplay) => {
    let feedbacks;
    try {
      feedbacks = JSON.parse(localStorage.getItem(caseid.toString()));
    } catch (error) {
      console.log(error);
    }

    if (feedbacks === null) {
      let feedbacks = [];
      feedbacks[0] = feedbackToDisplay;
      localStorage.setItem(caseid.toString(), JSON.stringify(feedbacks));
    } else {
      feedbacks[feedbacks.length] = feedbackToDisplay;
      localStorage.setItem(caseid.toString(), JSON.stringify(feedbacks));
    }
    //...
    const storedNames = JSON.parse(localStorage.getItem(caseid.toString()));

    //localStorage.removeItem(caseid.toString());
    //localStorage.removeItem("feedbackArray");
    const arr = JSON.parse(localStorage.getItem('feedbackArray'));
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
      <CaseNav
      isNotesOpen={isNotesOpen}
      onNotesOpen={onNotesOpen}
      onNotesClose={onNotesClose}
      saveNotes={saveNotes}
      notes={notes}
      onDescOpen={onDescOpen}
      isDescOpen={isDescOpen}
      onDescClose={onDescClose}
      description={description}
      onFeedbackOpen={onFeedbackOpen}
      isFeedbackOpen={isFeedbackOpen}
      onFeedbackClose={onFeedbackClose}
      feedback={feedback}
      onTreatmentResultsOpen={onTreatmentResultsOpen}
      isTreatmentResultsOpen={isTreatmentResultsOpen}
      onTreatmentResultsClose={onTreatmentResultsClose}
      treatmentResults={treatmentResults}
      onHomeOpen={onHomeOpen}
      isHomeOpen={isHomeOpen}
      onHomeClose={onHomeClose}
      ></CaseNav>
      <VStack alignItems='stretch' marginTop={'80px'} minW='80vw' id='caseContainer'>
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
              setWasCorrect={setWasCorrect}
              wasCorrect={wasCorrect}
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
              setWasCorrect={setWasCorrect}
              wasCorrect={wasCorrect}
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
              setWasCorrect={setWasCorrect}
              wasCorrect={wasCorrect}
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
              setWasCorrect={setWasCorrect}
              wasCorrect={wasCorrect}
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
          <Button onClick={nextStep} variant={'caseNav'}>
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
