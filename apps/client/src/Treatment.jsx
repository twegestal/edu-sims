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
  Step,
} from '@chakra-ui/react';
import { SmallAddIcon, SmallCloseIcon } from '@chakra-ui/icons';
import { useTreatment } from './hooks/useTreatment';

export default function Treatment(props) {
  const [treatmentList, setTreatmentList] = useState({});
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState();
  const [treatmentsFetched, setTreatmentsFetched] = useState(false);
  const [checkedTreatments, setCheckedTreatments] = useState([]);
  const [feedbackText, setFeedbackText] = useState();
  const { isOpen, onToggle } = useDisclosure();
  const [feedbackWindow, setFeedbackWindow] = useState();

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

  // hämta lista av typer av behandlingar.
  const fetchTreatmentList = async (treatmentTypeId) => {
    return await getTreatmentList(treatmentTypeId);
  };
  const checkTreatmentBox = (treatmentId, name) => {
    setCheckedTreatments((oldValues) => [...oldValues, { treatmentId, name }]);
  };
  const removeAddedTreatment = (id) => {
    const newArr = [];
    for (let index = 0; index < checkedTreatments.length; index++) {
      if (id != checkedTreatments[index].treatmentId) {
        newArr.push(checkedTreatments[index]);
      }
    }
    setCheckedTreatments(newArr);
  };

  useEffect(() => {}, [checkedTreatments]);

  const checkForId = (id) => {
    let ok = true;
    for (let index = 0; index < checkedTreatments.length; index++) {
      if (checkedTreatments[index].treatmentId == id) {
        ok = false;
      }
    }
    return ok;
  };

  const findTreatment = (searchString, treatmentTypeId) => {
    let filteredList = [];
    if (searchString.length > 0) {
      filteredList = treatmentList[treatmentTypeId].filter((obj) => {
        if (checkForId(obj.id)) {
          return obj.name.toLowerCase().includes(searchString.toLowerCase());
        }
        return;
      });
    }
    setSearchResults(
      filteredList.map((treatmentItem, index) => (
        <ListItem key={index}>
          <HStack>
            <Text>{treatmentItem.name}</Text>
            <IconButton
              id={treatmentItem.id}
              margin={0.5}
              size='xs'
              colorScheme='teal'
              icon={<SmallAddIcon />}
              onClick={(e) => checkTreatmentBox(e.target.id, treatmentItem.name)}
            ></IconButton>
          </HStack>
        </ListItem>
      )),
    );
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
    } else {
      setFeedbackText(treatmentStep.feedback_incorrect);
      setFeedbackWindow();
      props.setFaultsCounter(props.faultsCounter + 1)
    }

    props.setDisplayFeedback(true);
    onToggle();
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
      <Card>
        <Accordion>
          {treatmentTypes.map((treatmentType) => (
            <AccordionItem key={treatmentType.id}>
              {treatmentsFetched && (
                <h2>
                  <AccordionButton onClick={() => findTreatment('', treatmentType.id)}>
                    <Box as='span' flex='1' textAlign='left'>
                      {treatmentType.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                  <AccordionPanel>
                    <List id={treatmentType.id}>{searchResults}</List>
                    <Input
                      id='inputField'
                      onChange={(e) => findTreatment(e.target.value, treatmentType.id)}
                      placeholder='Välj behandling genom att söka'
                    />
                  </AccordionPanel>
                </h2>
              )}
            </AccordionItem>
          ))}
          <AccordionItem key={'AddedValues'}>
            <AccordionButton>
              Added Treatments
              <AccordionIcon />
            </AccordionButton>
            <AccordionPanel>
              {checkedTreatments.map((Item) => (
                <h2 key={Item}>
                  <VStack alignItems={'left'}>
                    <HStack>
                      <Text>{Item.name}</Text>
                      <IconButton
                        key={Item.treatmentId}
                        icon={<SmallCloseIcon />}
                        colorScheme='teal'
                        margin={0.5}
                        onClick={() => removeAddedTreatment(Item.treatmentId)}
                      ></IconButton>
                    </HStack>
                  </VStack>
                </h2>
              ))}
            </AccordionPanel>
          </AccordionItem>
        </Accordion>
        {props.displayFeedback ? (
          <Card variant='filled' margin='0.5%'>
            <Button onClick={onToggle}>Feedback</Button>
            <Collapse in={isOpen}>
              <CardBody>
                <Text align='left'>{feedbackText}</Text>
              </CardBody>
            </Collapse>
          </Card>
        ) : (
          //{feedbackWindow}
          <Button colorScheme='teal' margin='0.5%' onClick={() => ValuateFeedback()}>
            Klar med behandlingar
          </Button>
        )}
      </Card>
    </div>
  );
}
