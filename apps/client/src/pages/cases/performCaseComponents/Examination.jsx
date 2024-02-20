import {
  Button,
  VStack,
  Text,
  Divider,
  Heading,
  HStack,
  Checkbox,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Show,
  Input,
  InputRightElement,
  InputGroup,
  InputLeftElement,
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { IoIosCloseCircleOutline } from 'react-icons/io';
import { useState, useEffect } from 'react';
import GenericAccordion from '../../../components/GenericAccordion';
import Feedback from './Feedback';

export default function Examination({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const [isDoneButtonDisabled, setIsDoneButtonDisabled] = useState(true);
  const [examinationsToRun, setExaminationsToRun] = useState([]);
  const [performedExaminations, setPerformedExaminations] = useState([]);
  const [stepSpecificValues, setStepSpecificValues] = useState();
  const [resultList, setResultList] = useState([]);
  const [searchTerms, setSearchTerms] = useState({});

  useEffect(() => {
    if (!stepSpecificValues) {
      let tempStepSpecificValues = {};
      for (const examination of stepData.step_specific_values) {
        tempStepSpecificValues[examination.examination_id] = {
          value: examination.value,
          isNormal: examination.is_normal,
          userHasTested: false,
        };
      }
      setStepSpecificValues(tempStepSpecificValues);
      setLoading(false);
    }

    console.log('stepValues: ', stepSpecificValues);
  }, [stepSpecificValues]);

  const handleCheckBox = (id, isChecked, type, subType) => {
    const examination = stepData.examination_to_display[type][subType].filter(
      (examination) => examination.id === id,
    )[0];
    if (isChecked) {
      setExaminationsToRun([...examinationsToRun, examination]);
    } else {
      setExaminationsToRun(examinationsToRun.filter((examination) => examination.id !== id));
    }
  };

  const runExaminations = () => {
    let tempResultList = [...resultList];
    for (const examination of examinationsToRun) {
      if (examination.id in stepSpecificValues) {
        setStepSpecificValues((prevState) => {
          const newState = { ...prevState };
          newState[examination.id].userHasTested = true;
          return newState;
        });

        const newResult = {
          name: examination.name,
          value: stepSpecificValues[examination.id].value,
          isNormal: stepSpecificValues[examination.id].isNormal,
          maxValue: examination.max_value,
          minValue: examination.min_value,
          unit: examination.unit,
        };
        tempResultList.push(newResult);
      } else {
        if (examination.is_randomizable) {
          const newResult = {
            name: examination.name,
            value: randomizeNormalValue(examination),
            isNormal: true,
            maxValue: examination.max_value,
            minValue: examination.min_value,
            unit: examination.unit,
          };
          tempResultList.push(newResult);
        } else {
          const newResult = {
            name: examination.name,
            value: 'Normalvärde',
            isNormal: true,
            maxValue: null,
            minValue: null,
            unit: null,
          };
          tempResultList.push(newResult);
        }
      }
    }
    setPerformedExaminations((prevState) => {
      let newState = [...prevState];
      for (const examinationToRun of examinationsToRun) {
        newState.push(examinationToRun);
      }
      return newState;
    });
    setExaminationsToRun([]);
    setResultList(tempResultList);
    setIsDoneButtonDisabled(false);
  };

  const randomizeNormalValue = (examination) => {
    let randomizedNormalValue = 0;
    const maxValue = Number.parseFloat(examination.max_value.replace(',', '.'));
    const minValue = Number.parseFloat(examination.min_value.replace(',', '.'));

    randomizedNormalValue = (Math.random() * (maxValue - minValue) + minValue).toFixed(2);

    return randomizedNormalValue;
  };

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };

  const evaluateAnswer = () => {
    for (const [examinationId, examination] of Object.entries(stepSpecificValues)) {
      if (!examination.userHasTested) {
        return false;
      }
    }
    return true;
  };

  const setupAccordions = () => {
    return (
      <GenericAccordion
        allowMultiple={true}
        variant={'edu_exam_type'}
        accordionItems={Object.entries(stepData.examination_to_display).map(([type, subTypes]) => ({
          heading: type,
          content: (
            <>
              <GenericAccordion
                allowMultiple={true}
                variant={'edu_exam_subtype'}
                accordionItems={Object.entries(subTypes).map(([subType, examinations]) => ({
                  heading: subType,
                  content: (
                    <>
                      <InputGroup>
                        <InputLeftElement>
                          <SearchIcon />
                        </InputLeftElement>
                        <Input
                          placeholder='Sök...'
                          value={searchTerms[subType] ? searchTerms[subType] : ''}
                          variant='edu_input'
                          onChange={(e) =>
                            setSearchTerms((prevState) => {
                              const newState = { ...prevState };
                              newState[subType] = e.target.value;
                              return newState;
                            })
                          }
                        ></Input>
                        {searchTerms[subType] && (
                          <InputRightElement
                            onClick={(e) => {
                              setSearchTerms((prevState) => {
                                const newState = { ...prevState };
                                newState[subType] = '';
                                return newState;
                              });
                            }}
                          >
                            <IoIosCloseCircleOutline />
                          </InputRightElement>
                        )}
                      </InputGroup>
                      {examinations
                        .filter((examination) => {
                          return (
                            performedExaminations.filter((performedExamination) => {
                              return examination.id === performedExamination.id;
                            }).length === 0
                          );
                        })
                        .filter((examination) =>
                          searchTerms[subType]
                            ? examination.name
                                .toLowerCase()
                                .includes(searchTerms[subType].toLowerCase())
                            : true,
                        )
                        .map((examination) => (
                          <HStack
                            key={examination.id}
                            justifyContent='left'
                            paddingLeft='3%'
                            paddingTop='0.5%'
                            paddingBottom='0.5%'
                          >
                            <Checkbox
                              borderColor='black'
                              id={examination.id}
                              onChange={(e) =>
                                handleCheckBox(examination.id, e.target.checked, type, subType)
                              }
                            >
                              {examination.name}
                            </Checkbox>
                          </HStack>
                        ))}
                    </>
                  ),
                }))}
              />
            </>
          ),
        }))}
      />
    );
  };

  const setupResultList = () => {
    return (
      <>
        <Show above='lg'>
          <TableContainer width='100%'>
            <Table variant='striped' size='sm'>
              <Thead>
                <Tr>
                  <Th>Utredning</Th>
                  <Th>Värde</Th>
                  <Th>Gränsvärde</Th>
                </Tr>
              </Thead>

              <Tbody>
                {resultList.map((result, index) => (
                  <Tr key={index} color={result.isNormal ? 'black' : 'fail.bg'}>
                    <Td>{result.name}</Td>
                    <Td>
                      {result.value} {result.unit}
                    </Td>
                    <Td>
                      {result.minValue} - {result.maxValue} {result.unit}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Show>

        <Show below='lg'>
          <Heading size='sm'>Resultat:</Heading>
          <TableContainer width='100%'>
            <Table variant='striped' size='sm'>
              <Tbody>
                {resultList.map((result, index) => (
                  <Tr key={index} color={result.isNormal ? 'black' : 'fail.bg'}>
                    <Td>
                      <VStack alignItems='left'>
                        <Text as='b'>{result.name}</Text>
                        <Text>
                          Resultat: {result.value} {result.unit}
                        </Text>
                        <Text>
                          Gränsvärden: {result.minValue} - {result.maxValue} {result.unit}
                        </Text>
                      </VStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        </Show>

        <Divider variant='edu' />
      </>
    );
  };

  return (
    <>
      <VStack spacing='5'>
        <Text align='left'>{stepData.prompt}</Text>

        <Divider variant='edu' />

        <Heading size='sm'>Välj utredningar från listan:</Heading>

        {loading === false && setupAccordions()}
        <Button isDisabled={examinationsToRun.length < 1} width='100%' onClick={runExaminations}>
          Genomför utredningar
        </Button>
        <Divider variant='edu' />

        {resultList.length > 0 && setupResultList()}
        {isFinished === false ? (
          <Button isDisabled={isDoneButtonDisabled} width='100%' onClick={finishStep}>
            Klar med utredningar
          </Button>
        ) : evaluateAnswer() ? (
          <Feedback wasCorrect={true} feedbackToDisplay={stepData.feedback_correct}></Feedback>
        ) : (
          <Feedback wasCorrect={false} feedbackToDisplay={stepData.feedback_incorrect}></Feedback>
        )}
      </VStack>
    </>
  );
}
