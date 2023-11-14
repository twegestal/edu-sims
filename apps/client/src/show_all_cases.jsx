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

export default function ShowAllCases(props) {
  const [allCases, setAllCases] = useState([]);
  const [medicalFields, setMedicalFields] = useState([]);

  useEffect(() => {
    const fetchCases = async () => {
      const headers = {
        'Content-type': 'application/json',
      };

      const cases = await props.getCallToApi('/api/case/GetAllCases', headers);
      const fields = await props.getCallToApi('/api/case/getMedicalFields', headers);

      setAllCases(cases);
      setMedicalFields(fields);
    };

    fetchCases();
  }, []); // Empty dependency array runs the effect once when the component mounts

  const groupedCases = allCases.reduce((acc, caseItem) => {
    const medicalFieldId = caseItem.medical_field_id;
    if (!acc[medicalFieldId]) {
      acc[medicalFieldId] = [];
    }
    acc[medicalFieldId].push(caseItem);
    return acc;
  }, {});

  function getMedicalFieldName(medicalFieldId) {
    const medicalField = medicalFields.find((field) => field.id === medicalFieldId);
    return medicalField ? medicalField.name : 'Unknown';
  }

  function handlePublish(caseId, published) {
    if (published == true){
      alert('Är du säker på att du vill avpublicera?')
    }
    if (published == false || published == null){
      alert('Är du säker på att du vill publicera?')
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
                  <Flex direction='row'>
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
                    <Button colorScheme='teal'>Ta bort fallet</Button>
                  </Flex>
                )}
                {props.user.isAdmin == false && (
                  <Flex direction='row'>
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
