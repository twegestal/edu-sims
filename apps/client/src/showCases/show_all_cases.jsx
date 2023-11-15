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

  function handlePublish(caseId, published) {

    if (published == true){
      if(confirm('Är du säker på att du vill avpublicera?')){
        //API call
        console.log("Avpublicerad")
      }
    }
    if (published == false || published == null){
      if(confirm('Är du säker på att du vill publicera?')){
        //API call
        console.log("publicerad")
      }
    }

  }

  function removeCase(caseId) {

    if(confirm('Är du säker på att du vill ta bort fallet?')){
      //API call
      console.log("Ta bort")
    }

  }


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
                {props.user.isAdmin && (
                  <Flex justify={'space-evenly'} id="navigationButtons" direction={'column'}>
                    <p>Name: {caseItem.name}</p>
                    <Link to={'/case/caseid=' + caseItem.id}>
                      <Button colorScheme='teal'>Starta fallet</Button>
                    </Link>
                    <Button colorScheme='teal'>Redigera fallet</Button>
                    {caseItem.published == false || caseItem.published == null && (
                      <Button onClick={(e) => handlePublish(caseItem.id, caseItem.published)} colorScheme='teal'>Publicera fallet</Button>
                    )}
                    {caseItem.published && (
                      <Button onClick={(e) => handlePublish(caseItem.id, caseItem.published)} colorScheme='teal'>Avpublicera fallet</Button>
                    )}
                    <Button onClick={(e) => removeCase(caseItem.id)} colorScheme='teal'>Ta bort fallet</Button>
                  </Flex>
                )}
                {props.user.isAdmin == false && (
                  <Flex>
                    <p>Name: {caseItem.name}</p>
                    <Link to={'/case/caseid=' + caseItem.id}>
                        <Button colorScheme='teal'>Starta fallet</Button>
                    </Link>
                  </Flex>
                )}
                </div>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
    </div>
  );
}
