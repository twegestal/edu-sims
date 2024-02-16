import { Button, VStack, Text, Divider, Heading, HStack, Checkbox } from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import GenericAccordion from '../../../components/GenericAccordion';

export default function Examination({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const [isDoneButtonDisabled, setIsDoneButtonDisabled] = useState(true);
  const [examinationsToDisplay, setExaminationsToDisplay] = useState();
  const [examinationsToRun, setExaminationsToRun] = useState([]);
  const [stepSpecificValues, setStepSpecificValues] = useState();
  const [resultList, setResultList] = useState([]);

  useEffect(() => {
    let tempStepSpecificValues = {};
    for (const examination of stepData.step_specific_values) {
      tempStepSpecificValues[examination.examination_id] = {
        value: examination.value,
        isNormal: examination.is_normal,
        userHasTested: false,
      };
    }
    setStepSpecificValues(tempStepSpecificValues);
    setExaminationsToDisplay(stepData.examination_to_display);
  }, []);

  useEffect(() => {
    console.log('stepValues:', stepSpecificValues);
  }, [stepSpecificValues]);

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };

  useEffect(() => {
    console.log('exams2run:', examinationsToRun);
  }, [examinationsToRun]);

  useEffect(() => {
    console.log('resultList:', resultList);
  }, [resultList]);

  const handleCheckButton = (id, isChecked, type, subType) => {
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
          value: stepSpecificValues[examination.id],
          isNormal: stepSpecificValues[examination.id].isNormal,
          maxValue: examination.max_value,
          minValue: examination.min_value,
          unit: examination.unit,
        };
        tempResultList.push(newResult);
      }
    }
    setExaminationsToRun([]);
    setResultList(tempResultList);
    setIsDoneButtonDisabled(false);
  };

  const setUpAccordions = () => {
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
                      {examinations.map((examination) => (
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
                              handleCheckButton(examination.id, e.target.checked, type, subType)
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
  return (
    <>
      <VStack spacing='5'>
        <Text align='left'>{stepData.prompt}</Text>

        <Divider variant='edu' />

        <Heading size='sm'>Välj utredningar från listan:</Heading>
        {setUpAccordions()}
        <Button isDisabled={examinationsToRun.length < 1} width='100%' onClick={runExaminations}>
          Genomför utredningar
        </Button>
        <Divider variant='edu' />

        <Button isDisabled={isDoneButtonDisabled} width='100%'>
          Klar med utredningar
        </Button>
      </VStack>
      {/* <p>Utredningsgrejer</p>
      {isFinished === false && <Button onClick={finishStep}>Gör färdigt steget</Button>} */}
    </>
  );
}
