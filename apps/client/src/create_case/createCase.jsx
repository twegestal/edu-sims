import React, { useState, useEffect } from 'react';
import {
  Card,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Input,
  RadioGroup,
  Radio,
  HStack,
  VStack,
  Button
} from '@chakra-ui/react';
import CreateIntroduction from './createIntro.jsx';
import CreateExamination from './createExamination.jsx';
import CreateDiagnosis from './createDiagnosis.jsx';
import CreateTreatment from './createTreatment.jsx';
import CreateSummary from './createSummary.jsx';
import { useCreateCase } from '../hooks/useCreateCase.js';

export default function CreateCase(props) {
  const [caseObject, setCaseObject] = useState({
    name: 'default name',
    step: [],
  });
  const [module, setModule] = useState('0');
  const { createCase } = useCreateCase();

  const updateCaseObject = (updatedState) => {
    setCaseObject({
      ...caseObject,
      step: [...caseObject.step, updatedState],
    });
  };

  const setCaseName = (caseName) => {
    setCaseObject({
      ...caseObject,
      name: caseName,
    });
  };

  const changeModule = (radioGroup) => {
    setModule(radioGroup);
  };

  useEffect(() => {
    console.log(caseObject);
  }, [caseObject]);

  return (
    <div>
      <FormControl>
        <VStack padding='5'>
          <Input
            placeholder='Case-namn'
            id='caseNameInput'
            onChange={(e) => setCaseName(e.target.value)}
          ></Input>

          <RadioGroup defaultValue='0' onChange={(e) => changeModule(e)}>
            <HStack>
              <Radio value='0'>Introduction</Radio>
              <Radio value='1'>Examination</Radio>
              <Radio value='2'>Diagnosis</Radio>
              <Radio value='3'>Treatment</Radio>
              <Radio value='4'>Summary</Radio>
            </HStack>
          </RadioGroup>

          <div>
            {module === '0' && (
              <CreateIntroduction updateCaseObject={updateCaseObject}></CreateIntroduction>
            )}

            {module === '1' && (
              <CreateExamination updateCaseObject={updateCaseObject}></CreateExamination>
            )}

            {module === '2' && <CreateDiagnosis updateCaseObject={updateCaseObject}></CreateDiagnosis>}

            {module === '3' && <CreateTreatment updateCaseObject={updateCaseObject}></CreateTreatment>}

            {module === '4' && <CreateSummary updateCaseObject={updateCaseObject}></CreateSummary>}
          </div>

          <Button onClick={() => createCase(caseObject)}>Skapa fall!!!!!</Button>
        </VStack>
      </FormControl>
    </div>
  );
}
