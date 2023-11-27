import React, { useState, useEffect } from 'react';
import {
  FormControl,
  FormLabel,
  Input,
  RadioGroup,
  Radio,
  HStack,
  VStack,
  Button,
} from '@chakra-ui/react';
import CreateIntroduction from './createIntro.jsx';
import CreateExamination from './createExamination.jsx';
import CreateDiagnosis from './createDiagnosis.jsx';
import CreateTreatment from './createTreatment.jsx';
import CreateSummary from './createSummary.jsx';
import { useCreateCase } from '../hooks/useCreateCase.js';
import LoadingSkeleton from '../loadingSkeleton.jsx';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';

export default function CreateCase(props) {
  const { user } = useAuth();
  const { medicalFields, getMedicalFields } = useCases();
  const [caseObject, setCaseObject] = useState({
    name: 'default name',
    steps: [],
    medical_field_id: 'default medical field',
    creator_user_id: user.id,
  });
  const [module, setModule] = useState('0');
  const { createCase } = useCreateCase();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMedicalFields = () => {
      getMedicalFields();
    };

    fetchMedicalFields();
  }, []);

  const updateCaseObject = (updatedState) => {
    setCaseObject({
      ...caseObject,
      steps: [...caseObject.steps, updatedState],
    });
  };

  const setCaseName = (caseName) => {
    setCaseObject({
      ...caseObject,
      name: caseName,
    });
  };

  const changeModule = (moduleIdentifier) => {
    setModule(moduleIdentifier);
  };

  const setMedicalField = (medicalFieldId) => {
    setCaseObject({
      ...caseObject,
      medical_field_id: medicalFieldId,
    });
  };

  useEffect(() => {
    console.log(caseObject);
  }, [caseObject]);

  useEffect(() => {
    if (medicalFields.length > 0) {
      console.log(medicalFields);
      setLoading(false);
    }
  }, [medicalFields]);

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <div>
          <FormControl>
            <VStack padding='5'>
              <Input
                placeholder='Case-namn'
                id='caseNameInput'
                onChange={(e) => setCaseName(e.target.value)}
              ></Input>

              <FormLabel>Medical Field</FormLabel>
              <RadioGroup onChange={(e) => setMedicalField(e)}>
                <HStack key={'göran'}>
                  {medicalFields.length > 0 ? (
                    medicalFields.map((medicalField, index) => (
                      <>
                        <Radio key={index} value={medicalField.id}>
                          {medicalField.name}
                        </Radio>
                      </>
                    ))
                  ) : (
                    <p>det var tomt?</p>
                  )}
                </HStack>
              </RadioGroup>

              <FormLabel>Modul</FormLabel>
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

                {module === '2' && (
                  <CreateDiagnosis updateCaseObject={updateCaseObject}></CreateDiagnosis>
                )}

                {module === '3' && (
                  <CreateTreatment updateCaseObject={updateCaseObject}></CreateTreatment>
                )}

                {module === '4' && (
                  <CreateSummary updateCaseObject={updateCaseObject}></CreateSummary>
                )}
              </div>

              <Button onClick={() => createCase(caseObject)}>Skapa fall!!!!!</Button>
            </VStack>
          </FormControl>
        </div>
      )}
    </>
  );
}
