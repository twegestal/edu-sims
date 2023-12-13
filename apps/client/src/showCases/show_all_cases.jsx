import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Flex,
  Box,
  Heading,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useCases } from '../hooks/useCases.js';
import { useAuth } from '../hooks/useAuth.jsx';
import StartCase from './startCase.jsx';
import { errorWithPathToString } from 'api';

export default function ShowAllCases() {
  const [caseToRandomise, setCaseToRandomise] = useState();
  const { cases, getAllCases, medicalFields, getMedicalFields, publishCase, newPublishment } =
    useCases();
  const { user } = useAuth();
  const toast = useToast();

  useEffect(() => {
    const fetchCases = async () => {
      await getAllCases();
      await getMedicalFields();
    };

    fetchCases();
  }, []);

  useEffect(() => {
    const fetchCases = async () => {
      await getAllCases();
      await getMedicalFields();
    };

    fetchCases();
  }, [newPublishment]);

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

  async function handlePublish(caseId, isPublished) {
    if (isPublished) {
      if (confirm('Är du säker på att du vill avpublicera?')) {
        const response = await publishCase(caseId, isPublished);
      }
    }
    if (!isPublished) {
      if (confirm('Är du säker på att du vill publicera?')) {
        const response = await publishCase(caseId, isPublished);
        if (response.errors) {
          toast({
            title: 'Fel vid publicering av fall',
            description: errorWithPathToString(response.errors[0]),
            status: 'error',
            duration: 9000,
            position: 'top',
            isClosable: true,
          });
        }
      }
    }
  }

  function removeCase(caseId) {
    if (confirm('Är du säker på att du vill ta bort fallet?')) {
      //TODO: API call
      console.log('Ta bort');
    }
  }

  const randomiseCase = () => {
    const casesToRandomise = cases.filter((c) => c.published === true);
    const caseId = casesToRandomise[Math.floor(Math.random() * casesToRandomise.length)].id;
    setCaseToRandomise(caseId);
  };

  const handleCaseToEdit = (id) => {
    localStorage.setItem('caseId', id);
  };

  return (
    <Box maxW={'90%'} margin={'auto'}>
      <Accordion allowToggle defaultIndex={[0]}>
        {Object.keys(groupedCases).map((medicalFieldId) => (
          <AccordionItem key={medicalFieldId}>
            <AccordionButton>
              <Heading margin={'auto'} size='sm'>
                {getMedicalFieldName(medicalFieldId)}{' '}
              </Heading>
            </AccordionButton>
            <AccordionPanel pb={4}>
              {groupedCases[medicalFieldId].map((caseItem) => (
                <Box key={caseItem.id}>
                  {user.isAdmin && (
                    <Flex justify={'space-evenly'} direction={'column'}>
                      <p>Name: {caseItem.name}</p>
                      <p>Skapat av: {caseItem.end_user.email}</p>
                      <StartCase caseId={caseItem.id} />
                      <Link
                      onClick={() => handleCaseToEdit(caseItem.id)}
                      to={'/caseBuilder'}>
                        <Button colorScheme='teal' marginBottom='5%'>
                          Redigera fallet
                        </Button>
                      </Link>
                      {(caseItem.published == false || caseItem.published == null) && (
                        <Button
                          marginBottom='5%'
                          onClick={(e) => handlePublish(caseItem.id, caseItem.published)}
                          colorScheme='teal'
                        >
                          Publicera fallet
                        </Button>
                      )}
                      {caseItem.published && (
                        <Button
                          marginBottom='5%'
                          onClick={(e) => handlePublish(caseItem.id, caseItem.published)}
                          colorScheme='teal'
                        >
                          Avpublicera fallet
                        </Button>
                      )}
                      <Button
                        onClick={(e) => removeCase(caseItem.id)}
                        colorScheme='teal'
                        marginBottom='5%'
                      >
                        Ta bort fallet
                      </Button>
                    </Flex>
                  )}
                  {user.isAdmin == false && caseItem.published && (
                    <Flex direction={'column'}>
                      <p>{caseItem.name}</p>
                      <StartCase caseId={caseItem.id} caseToRandomise={caseToRandomise} />
                    </Flex>
                  )}
                </Box>
              ))}
            </AccordionPanel>
          </AccordionItem>
        ))}
      </Accordion>
      {!user.isAdmin && <Button onClick={randomiseCase}>Slumpa fall</Button>}
    </Box>
  );
}
