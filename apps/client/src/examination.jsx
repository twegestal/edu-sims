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
import LoadingSkeleton from './loadingSkeleton';
import {
  fetchCategoryNames,
  fetchSubCategoryNames,
  fetchStepValues,
  fetchExaminationList,
  updateResults,
} from './utils/examinationUtils';

export default function Examination(props) {
  const [loading, setLoading] = useState(true);
  const [feedbackToDisplay, setFeedbackToDisplay] = useState();
  const [categoryNames, setCategoryNames] = useState({});
  const [subCategoryNames, setSubCategoryNames] = useState({});
  const [examinations, setExaminations] = useState({});
  const [examinationsFetched, setExaminationsFetched] = useState(false);
  const [stepSpecificValues, setStepSpecificValues] = useState({});
  const [results, setResults] = useState({});
  const [resultsReady, setResultsReady] = useState(false);
  const { isOpen, onToggle } = useDisclosure();
  const { examinationStep, getExaminationStep } = useExamination();

  useEffect(() => {
    props.setDisplayFeedback(false);
    const fetchStep = async () => {
      await getExaminationStep(props.stepId);

      setLoading(false);
    };

    fetchStep();
  }, []);

  useEffect(async () => {
    if (!loading) {
      const categoryNamesMap = await fetchCategoryNames(examinationStep);
      setCategoryNames(categoryNamesMap);

      const subCategoryNamesMap = await fetchSubCategoryNames(examinationStep);
      setSubCategoryNames(subCategoryNamesMap);

      const stepValuesMap = await fetchStepValues(props.stepId);
      setStepSpecificValues(stepValuesMap);
    }
  }, [loading, examinationStep]);

  useEffect(() => {
    setResultsReady(true);
  }, [results]);

  useEffect(() => {
    const fetchExaminations = async () => {
      const examinationsMap = await fetchExaminationList(subCategoryNames);

      setExaminations(examinationsMap);
      setExaminationsFetched(true);
    };

    if (!loading && !examinationsFetched) {
      fetchExaminations();
    }
  }, [subCategoryNames]);

  const runExams = () => {
    //TODO: lös denna skiten! ändra till att varje checkbox lägger till sig själv onclick/ontoggle typ
    const examinationsToRun = [];

    for (const subCategory of Object.keys(examinations)) {
      for (const examinationId of Object.keys(examinations[subCategory])) {
        const checkBox = document.getElementById(examinationId);

        if (checkBox.checked) {
          examinationsToRun.push(checkBox.id);
        }
      }
    }

    setResultsReady(false);
    const resultsMap = updateResults(examinationsToRun, examinations);
    setResults(resultsMap);
  };

  const evaluateAnswer = async () => {
    await props.setDisplayFeedback(true);
    onToggle();

    if (checkExams()) {
      setFeedbackToDisplay(examinationStep.feedback_correct);
    } else {
      setFeedbackToDisplay(examinationStep.feedback_incorrect);
    }
  };

  const checkExams = () => {
    for (const examination of Object.keys(stepSpecificValues)) {
      if (!stepSpecificValues[examination].userHasTested) {
        return false;
      }
    }
    return true;
  };

  useEffect(() => {
    /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
    if (props.displayFeedback && !loading) {
      props.updateFeedback(feedbackToDisplay);
    }
  }, [feedbackToDisplay]);

  useEffect(() => {
    if (loading == false) {
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
            <Text align='left'>{examinationStep.prompt}</Text>
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
                                      {examinationsFetched &&
                                        Object.entries(examinations[subCategory]).map(
                                          ([id, name], index) => (
                                            <ListItem key={index}>
                                              <Checkbox id={id}>{name}</Checkbox>
                                            </ListItem>
                                          ),
                                        )}
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

          <Button onClick={runExams} colorScheme='teal'>
            Kör utredningar
          </Button>

          <Card variant='filled'>
            <Accordion>
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

          {props.displayFeedback ? (
            <Card variant='filled'>
              <Button onClick={onToggle}>Feedback</Button>
              <Collapse in={isOpen}>
                <CardBody id='feedback'>
                  <Text align='left'>{feedbackToDisplay}</Text>
                </CardBody>
              </Collapse>
            </Card>
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
