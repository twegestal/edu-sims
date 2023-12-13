import { useState, useEffect } from 'react';
import {
  Box,
  Text,
  Card,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  CardBody,
  Collapse,
  useDisclosure,
  Input,
  List,
  ListIcon,
  ListItem,
  Checkbox,
  IconButton,
  HStack,
  Button,
  VStack,
} from '@chakra-ui/react';
import { SmallAddIcon, SmallCloseIcon, CheckIcon } from '@chakra-ui/icons';
import { useTreatment } from './hooks/useTreatment';
import Feedback from './performCaseComponents/Feedback';

export default function Treatment(props) {
  const [treatmentList, setTreatmentList] = useState({});
  const [loading, setLoading] = useState(true);
  const [treatmentsFetched, setTreatmentsFetched] = useState(false);
  const [checkedTreatments, setCheckedTreatments] = useState([]);
  const [feedbackText, setFeedbackText] = useState();
  const { isOpen, onToggle } = useDisclosure();
  const [feedbackWindow, setFeedbackWindow] = useState();
  const [checkboxesChecked, setCheckboxesChecked] = useState({});
  const [filteredList, setFilteredList] = useState([]);

  const {
    getTreatmentStep,
    treatmentStep,
    getTreatmentSpecificValues,
    treatmentSpecificValues,
    getTreatmentTypes,
    treatmentTypes,
    getTreatmentList,
  } = useTreatment();

  useEffect(() => {
    props.setDisplayFeedback(false);
    // Hämta nuvarande treatmentsteg
    const fetchStep = async () => {
      await getTreatmentStep(props.stepId);
      setLoading(false);
    };
    // hämta step specific values
    const fetchStepValues = async () => {
      await getTreatmentSpecificValues(props.stepId);
      setLoading(false);
    };
    // hämta kategories av treatments
    const fetchTreatmentTypes = async () => {
      await getTreatmentTypes();
      setTreatmentsFetched(true);
    };
    fetchStep();
    fetchStepValues();
    fetchTreatmentTypes();
  }, []);

  useEffect(() => {
    const getTreatmentListMap = async () => {
      const treatmentMap = {};
      for (let i = 0; i < treatmentTypes.length; i++) {
        const response = await fetchTreatmentList(treatmentTypes[i].id);
        treatmentMap[treatmentTypes[i].id] = response;
      }
      setTreatmentList(treatmentMap);
    };
    if (!loading) {
      getTreatmentListMap();
    }
  }, [treatmentTypes]);

  useEffect(() => {
    if (treatmentList) {
      checkBoxState();
    }
  }, [treatmentList]);

  // hämta lista av typer av behandlingar.
  const fetchTreatmentList = async (treatmentTypeId) => {
    return await getTreatmentList(treatmentTypeId);
  };
  const checkTreatmentBox = (treatmentId, name) => {
    setCheckedTreatments((oldValues) => [...oldValues, { treatmentId, name }]);
  };
  const removeAddedTreatment = async (id) => {
    //let newArr = checkedTreatments.filter((treatement) => treatement.treatmentId !== id)
    const newArr = [];
    for (let index = 0; index < checkedTreatments.length; index++) {
      if (id !== checkedTreatments[index].treatmentId) {
        newArr.push(checkedTreatments[index]);
      }
    }
    setCheckedTreatments(newArr);
  };

  useEffect(() => {}, [checkedTreatments]);

  const findTreatment = (searchString, treatmentTypeId) => {
    let searchResults = [];
    if (searchString.length > 0) {
      searchResults = treatmentList[treatmentTypeId].filter((obj) => {
        return obj.name.toLowerCase().includes(searchString.toLowerCase());
      });
    }
    setFilteredList(searchResults);
  };

  const ValuateFeedback = () => {
    let ok = true;
    if (checkedTreatments.length === treatmentSpecificValues.length) {
      for (let index = 0; index < treatmentSpecificValues.length; index++) {
        for (let jindex = 0; jindex < checkedTreatments.length; jindex++) {
          if (
            treatmentSpecificValues[index.treatment_Id] === checkedTreatments[jindex].treatmentId
          ) {
            break;
          } else {
            ok = false;
          }
        }
      }
    } else {
      ok = false;
    }
    ok = false;

    if (ok) {
      setFeedbackText(treatmentStep.feedback_correct);
      setFeedbackWindow();
      props.setWasCorrect(true);
    } else {
      setFeedbackText(treatmentStep.feedback_incorrect);
      setFeedbackWindow();
      props.setFaultsCounter(props.faultsCounter + 1);
      props.setWasCorrect(false);
    }

    props.setDisplayFeedback(true);
    onToggle();
  };

  const checkBoxState = () => {
    const initialCheckboxesState = {};

    Object.keys(treatmentList).forEach((treatmentId) => {
      initialCheckboxesState[treatmentId] = false;
    });

    setCheckboxesChecked(initialCheckboxesState);
  };

  const handleCheckboxChange = (treatmentId) => {
    setCheckboxesChecked((prev) => ({
      ...prev,
      [treatmentId]: !prev[treatmentId],
    }));
  };

  useEffect(() => {
    /* Waits for feedbackToDisplay to be set, and then updates the feedback variable*/
    if (props.displayFeedback && !loading) {
      props.updateFeedback(feedbackText);
    }
  }, [feedbackText]);

  return (
    <div>
      <Card variant='filled' padding='5'>
        <Text allign='left'>{treatmentStep.prompt}</Text>
      </Card>
      {!props.displayFeedback && (
        <Accordion allowToggle marginBottom={'10px'}>
          {treatmentTypes.map((treatmentType) => (
            <AccordionItem key={treatmentType.id}>
              {treatmentsFetched && (
                <h2 key={treatmentType.id}>
                  <AccordionButton onClick={() => findTreatment('', treatmentType.id)}>
                    <Box as='span' flex='1' textAlign='left'>
                      {treatmentType.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <Input
                      id='inputField'
                      onChange={(e) => findTreatment(e.target.value, treatmentType.id)}
                      placeholder='Välj behandling genom att söka'
                      marginBottom={'10px'}
                    />
                    <List id={treatmentType.id}>
                      {filteredList.map(
                        (treatmentItem, index) =>
                          index < 10 && (
                            <ListItem key={treatmentItem.id}>
                              <HStack marginBottom={'5px'}>
                                <Checkbox
                                  id={treatmentItem.id}
                                  isChecked={checkboxesChecked[treatmentItem.id]}
                                  onChange={(e) => {
                                    handleCheckboxChange(treatmentItem.id);
                                    if (e.target.checked) {
                                      checkTreatmentBox(treatmentItem.id, treatmentItem.name);
                                    } else {
                                      removeAddedTreatment(treatmentItem.id);
                                    }
                                  }}
                                ></Checkbox>
                                <label for={treatmentItem.id}>
                                  <Text>{treatmentItem.name}</Text>
                                </label>
                              </HStack>
                            </ListItem>
                          ),
                      )}
                    </List>
                  </AccordionPanel>
                </h2>
              )}
            </AccordionItem>
          ))}
        </Accordion>
      )}
      <Accordion allowToggle marginBottom={'10px'}>
        <AccordionItem>
          <AccordionButton>
            Tillagda behandlingar
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel>
            {checkedTreatments.map((Item) => (
              <h2 key={Item.id}>
                <VStack alignItems={'left'}>
                  <HStack key={Item.id}>
                    <IconButton
                      icon={<SmallCloseIcon />}
                      margin={0.5}
                      onClick={() => {
                        removeAddedTreatment(Item.treatmentId);
                        handleCheckboxChange(Item.treatmentId);
                      }}
                      variant='outline'
                      colorScheme='red'
                      size={'xs'}
                    ></IconButton>
                    <Text>{Item.name}</Text>
                  </HStack>
                </VStack>
              </h2>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
      {props.displayFeedback ? (
        <>
          <Feedback
            onToggle={onToggle}
            wasCorrect={props.wasCorrect}
            isOpen={isOpen}
            feedbackToDisplay={feedbackText}
          />
        </>
      ) : (
        //{feedbackWindow}
        <Button colorScheme='teal' margin='0.5%' onClick={() => ValuateFeedback()}>
          Klar med behandlingar
        </Button>
      )}
    </div>
  );
}
