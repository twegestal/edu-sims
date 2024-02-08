import { useState, useEffect } from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Collapse,
  HStack,
  Text,
  VStack,
  Icon,
  Tooltip,
  Image,
} from '@chakra-ui/react';
import { AddIcon, CloseIcon, LockIcon, WarningIcon } from '@chakra-ui/icons';
import { getMockSteps } from './ExampleData';
import Introduction from './Introduction';
import Examination from './Examination';
import Diagnosis from './Diagnosis';
import Treatment from './Treatment';
import Summary from './Summary';
import introIcon from '../images/introIcon.png';
import examIcon from '../images/examIcon.png';
import diagnosisIcon from '../images/diagnosisIcon.png';
import questionMarkIcon from '../images/Black_question_mark.png';

export default function DisplayCase() {
  const steps = getMockSteps();

  const moduleTypeTable = ['Introduktion', 'Utredning', 'Diagnos', 'Behandling', 'Sammanfattning'];
  const [openCardIndex, setOpenCardIndex] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFinishedArray, setIsFinishedArray] = useState(new Array(steps.length).fill(false));
  const [faultsArray, setFaultsArray] = useState(new Array(steps.length).fill(false));

  const onToggle = (index) => {
    setOpenCardIndex((prevIndex) => {
      if (prevIndex === index) {
        return;
      } else {
        return index;
      }
    });
  };

  useEffect(() => {
    console.log('faulsArr:', faultsArray);
  }, [faultsArray]);

  const incrementActiveStepIndex = () => {
    setActiveStepIndex(activeStepIndex + 1);
  };

  const updateIsFinishedArray = (index) => {
    setIsFinishedArray((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  const updateFaultsArray = (index) => {
    setFaultsArray((prevState) => {
      const newState = [...prevState];
      newState[index] = true;
      return newState;
    });
  };

  const getControlIcon = (index) => {
    if (index === activeStepIndex || isFinishedArray[index]) {
      return index === openCardIndex ? (
        <CloseIcon onClick={() => onToggle(index)} />
      ) : (
        <AddIcon onClick={() => onToggle(index)} />
      );
    } else {
      return <LockIcon />;
    }
  };

  const getProgressIcon = (index) => {
    if (index === activeStepIndex) {
      return <CircleIcon color='yellow.500' />;
    }
    return isFinishedArray[index] ? (
      <CircleIcon color='green.500' />
    ) : (
      <CircleIcon color='red.500' />
    );
  };

  const getFaultsIcon = (index) => {
    if (faultsArray[index]) {
      return (
        <Tooltip label='Det fanns ett fel i svaret på detta steg' fontSize='md'>
          <WarningIcon />
        </Tooltip>
      );
    }
    return null;
  };

  const getImage = (moduleTypeIdentifier, index) => {
    if (!isFinishedArray[index] && index !== activeStepIndex) {
      return (
        <Image
          width='12%'
          src={questionMarkIcon}
          alt='Okänd'
          /* minW='12%' */
          maxW='50px'
          maxH='50px'
          minW='40px'
          minH='40px'
        />
      );
    }
    switch (moduleTypeIdentifier) {
      case 0: {
        return (
          <Image
            width='12%'
            src={introIcon}
            alt='Introduktion'
            /* minW='12%' */
            maxW='50px'
            maxH='50px'
            minW='40px'
            minH='40px'
          />
        );
      }
      case 1: {
        return (
          <Image
            width='12%'
            src={examIcon}
            alt='Utredning'
            /* minW='12%' */
            maxW='50px'
            maxH='50px'
            minW='40px'
            minH='40px'
          />
        );
      }
      case 2: {
        return (
          <Image
            width='12%'
            src={diagnosisIcon}
            alt='Diagnos'
            /* minW='12%' */
            maxW='50px'
            maxH='50px'
            minW='40px'
            minH='40px'
          />
        );
      }
    }
  };

  const getModuleName = (moduleTypeIdentifier, index) => {
    if (!isFinishedArray[index] && index !== activeStepIndex) {
      return '(❁´◡`❁)';
    }
    return moduleTypeTable[moduleTypeIdentifier];
  };

  const CircleIcon = (props) => (
    <Icon viewBox='0 0 200 200' boxSize='4' {...props}>
      <path fill='currentColor' d='M 100, 100 m -75, 0 a 75,75 0 1,0 150,0 a 75,75 0 1,0 -150,0' />
    </Icon>
  );

  const moduleSwitch = (stepData, moduleTypeIdentifier, index) => {
    switch (moduleTypeIdentifier) {
      case 0: {
        return (
          <Introduction
            stepData={stepData}
            index={index}
            updateIsFinishedArray={updateIsFinishedArray}
            incrementActiveStepIndex={incrementActiveStepIndex}
            updateFaultsArray={updateFaultsArray}
          />
        );
      }
      case 1: {
        return (
          <Examination
            stepData={stepData}
            index={index}
            updateIsFinishedArray={updateIsFinishedArray}
            incrementActiveStepIndex={incrementActiveStepIndex}
            updateFaultsArray={updateFaultsArray}
          />
        );
      }
      case 2: {
        return (
          <Diagnosis
            stepData={stepData}
            index={index}
            updateIsFinishedArray={updateIsFinishedArray}
            incrementActiveStepIndex={incrementActiveStepIndex}
            updateFaultsArray={updateFaultsArray}
          />
        );
      }
      case 3: {
        return (
          <Treatment
            stepData={stepData}
            index={index}
            updateIsFinishedArray={updateIsFinishedArray}
            incrementActiveStepIndex={incrementActiveStepIndex}
            updateFaultsArray={updateFaultsArray}
          />
        );
      }
      case 4: {
        return (
          <Summary
            stepData={stepData}
            index={index}
            updateIsFinishedArray={updateIsFinishedArray}
            incrementActiveStepIndex={incrementActiveStepIndex}
            updateFaultsArray={updateFaultsArray}
          />
        );
      }
    }
  };

  return (
    <>
      <VStack margin='1' id='stepStack' alignItems='stretch' spacing='1'>
        {steps.map((step, index) => (
          <Card key={index}>
            <CardHeader margin='-0.75'>
              <HStack justify='space-between'>
                <HStack spacing='8'>
                  {getImage(step.module_type_identifier, index)}
                  <Text>{getModuleName(step.module_type_identifier, index)}</Text>
                </HStack>

                <HStack spacing='8'>
                  {getFaultsIcon(index)}
                  {/* {getProgressIcon(index)} */}
                  {getControlIcon(index)}
                </HStack>
              </HStack>
            </CardHeader>
            <Collapse in={openCardIndex === index}>
              <CardBody>
                {moduleSwitch(step.stepData, step.module_type_identifier, index)}{' '}
                {/*TODO: OBS!!! vet inte om jag skrivit denna raden rätt, borde det inte vara "() =>" innan?? */}
              </CardBody>
            </Collapse>
          </Card>
        ))}
      </VStack>
    </>
  );
}
