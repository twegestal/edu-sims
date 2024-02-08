import { useState, useEffect } from 'react';
import { Card, CardBody, CardHeader, Collapse, HStack, Text, VStack, Icon } from '@chakra-ui/react';
import { AddIcon, CloseIcon, LockIcon } from '@chakra-ui/icons';
import { getMockSteps } from './ExampleData';
import Introduction from './Introduction';
import Examination from './Examination';
import Diagnosis from './Diagnosis';
import Treatment from './Treatment';
import Summary from './Summary';

export default function DisplayCase() {
  const steps = getMockSteps();

  const moduleTypeTable = ['Introduktion', 'Utredning', 'Diagnos', 'Behandling', 'Sammanfattning'];
  const [openCardIndex, setOpenCardIndex] = useState(null);
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [isFinishedArray, setIsFinishedArray] = useState(new Array(steps.length).fill(false));

  const onToggle = (index) => {
    setOpenCardIndex((prevIndex) => {
      if (prevIndex === index) {
        return;
      } else {
        return index;
      }
    });
  };

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
            <CardHeader>
              <HStack justify='space-between'>
                <Text>{moduleTypeTable[step.module_type_identifier]}</Text>
                <HStack spacing='8'>
                  {getProgressIcon(index)}
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
