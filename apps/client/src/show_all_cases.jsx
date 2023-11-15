import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Flex
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCases } from './hooks/useCases';

export default function ShowAllCases() {
  const { cases, getAllCases, medicalFields, getMedicalFields } = useCases();

  useEffect(() => {
    const fetchCases = async () => {
      await getAllCases();
      await getMedicalFields();
    };

    fetchCases();
  }, []);

  const groupedCases = cases.reduce((acc, caseItem) => {
    const medicalFieldId = caseItem.medical_field_id;
    if (!acc[medicalFieldId]) {
      acc[medicalFieldId] = [];
    }
    acc[medicalFieldId].push(caseItem);
    return acc;
  }, {});

  const getMedicalFieldName = (medicalFieldId) => {
    const medicalField = medicalFields.find((field) => field.id === medicalFieldId);
    return medicalField ? medicalField.name : 'Unknown';
  };

  return (
    <div>
      <Accordion allowToggle>
        {Object.keys(groupedCases).map((medicalFieldId) => (
          <AccordionItem key={medicalFieldId}>
            <AccordionButton>
              <h2>{getMedicalFieldName(medicalFieldId)} </h2>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {groupedCases[medicalFieldId].map((caseItem) => (
                <div key={caseItem.id}>
                  <Flex>
                    <p>Name: {caseItem.name}</p>
                    <Link to={'/case/caseid=' + caseItem.id}>
                        <Button colorScheme='teal'>Starta fallet</Button>
                    </Link>
                  </Flex>
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
