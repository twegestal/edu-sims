import { useState } from 'react';
import { useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Box,
  Text,
  Card,
  CardBody,
  VStack,
  HStack,
  List,
  ListItem,
  Checkbox,
  Button,
  useDisclosure,
  Collapse,
} from '@chakra-ui/react';
import { WarningIcon } from '@chakra-ui/icons';
import { useExamination } from './hooks/useExamination';
import { useExaminationUtils } from './hooks/useExaminationUtils';
import LoadingSkeleton from './loadingSkeleton';
import Feedback from './performCaseComponents/Feedback';

export default function Examination(props) {
  const [loading, setLoading] = useState(true);
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [results, setResults] = useState({});
  const [resultsReady, setResultsReady] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const { examinationStep, getExaminationStep } = useExamination();
  const {
    categoryNames,
    subCategoryNames,
    stepValues,
    examinationList,
    examinationsFetched,
    updateResults,
  } = useExaminationUtils(examinationStep, props.stepId, loading);

  useEffect(() => {
    props.setDisplayFeedback(false);
    const fetchStep = async () => {
      await getExaminationStep(props.stepId);
      setLoading(false);
    };
    fetchStep();
  }, []);

  useEffect(() => {
    if (Object.keys(results).length != 0) {
      setResultsReady(true);
      setTimeout(() => {
        props.scrollToElement('resultsAccordion');
      }, 100);
    }
  }, [results]);

  const runExams = () => {
    //TODO: lös denna skiten! ändra till att varje checkbox lägger till sig själv onclick/ontoggle typ
    const examinationsToRun = [];

    for (const subCategory of Object.keys(examinationList)) {
      for (const examinationId of Object.keys(examinationList[subCategory])) {
        const checkBox = document.getElementById(examinationId);

        if (checkBox.checked) {
          examinationsToRun.push(checkBox.id);
        }
      }
    }

    setResultsReady(false);
    const resultsMap = updateResults(examinationsToRun, examinationList);
    setResults(resultsMap);
  };

  const evaluateAnswer = async () => {
    await props.setDisplayFeedback(true);
    onToggle();

    if (checkExams()) {
      setFeedbackToDisplay(examinationStep.feedback_correct);
      props.setWasCorrect(true);
    } else {
      setFeedbackToDisplay(examinationStep.feedback_incorrect);
      props.setWasCorrect(false);
    }
  };

  const checkExams = () => {
    for (const examination of Object.keys(stepValues)) {
      if (!stepValues[examination].userHasTested) {
        props.setFaultsCounter(props.faultsCounter + 1);
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
    if (!loading && props.displayFeedback) {
      props.updateFeedback(feedbackToDisplay);
    }
  }, [feedbackToDisplay]);

  useEffect(() => {
    if (!loading) {
      props.updateLabResultsList(results);
    }
  }, [results]);

  return (
    <div>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <VStack alignItems='stretch'>
          <Card variant='filled' padding='5'>
            {examinationStep && <Text align='left'>{examinationStep.prompt}</Text>}
          </Card>

          <Card variant='filled'>
            <Accordion allowMultiple>
              <AccordionItem>
                <AccordionButton>
                  <Box as='span' flex='1' textAlign='center'>
                    Utredningar
                  </Box>
                  <AccordionIcon />
                </AccordionButton>

                <AccordionPanel pb={4}>
                  <Accordion allowMultiple>
                    {Object.entries(examinationStep.examination_to_display).map(
                      ([category, subCategories], index) => (
                        <AccordionItem key={index}>
                          <h2>
                            <AccordionButton>
                              {categoryNames[category]}
                              <AccordionIcon />
                            </AccordionButton>
                          </h2>
                          <AccordionPanel>
                            <Accordion allowMultiple>
                              {subCategories.map((subCategory, i) => (
                                <AccordionItem key={i}>
                                  <AccordionButton alignContent='left'>
                                    {subCategoryNames[subCategory]}
                                    <AccordionIcon />
                                  </AccordionButton>
                                  <AccordionPanel>
                                    <List>
                                      <VStack alignItems={'flex-start'}>
                                        {examinationsFetched &&
                                          Object.entries(examinationList[subCategory]).map(
                                            ([id, name], index) => (
                                              <ListItem key={index}>
                                                <Checkbox id={id}>{name}</Checkbox>
                                              </ListItem>
                                            ),
                                          )}
                                      </VStack>
                                    </List>
                                  </AccordionPanel>
                                </AccordionItem>
                              ))}
                            </Accordion>
                          </AccordionPanel>
                        </AccordionItem>
                      ),
                    )}
                  </Accordion>
                </AccordionPanel>
              </AccordionItem>
            </Accordion>
          </Card>
          {props.displayFeedback == false && (
            <Button onClick={runExams} colorScheme='teal'>
              Kör utredningar
            </Button>
          )}
          {resultsReady == true && (
            <>
              <Card variant='filled'>
                <Accordion allowToggle defaultIndex={[0]} id='resultsAccordion'>
                  <AccordionItem>
                    <AccordionButton>
                      <Box as='span' flex='1' textAlign='center'>
                        Resultat
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel pb={4}>
                      <List>
                        {resultsReady &&
                          Object.entries(results).map(([id, fields], index) => (
                            <ListItem key={index}>
                              <HStack>
                                {!fields.isNormal && <WarningIcon />}
                                <Text>
                                  {fields.name} : {fields.value}
                                </Text>
                              </HStack>
                            </ListItem>
                          ))}
                      </List>
                    </AccordionPanel>
                  </AccordionItem>
                </Accordion>
              </Card>
            </>
          )}
          {props.displayFeedback ? (
            <>
              <Feedback
                onToggle={onToggle}
                wasCorrect={props.wasCorrect}
                isOpen={isOpen}
                feedbackToDisplay={feedbackToDisplay}
              />
            </>
          ) : (
            <Button onClick={evaluateAnswer} colorScheme='teal' id='test'>
              Klar med utredningar
            </Button>
          )}
        </VStack>
      )}
    </div>
  );
}
