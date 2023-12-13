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
import LoadingSkeleton from '../loadingSkeleton.jsx';

export default function ShowAllCases() {
  const [caseToRandomise, setCaseToRandomise] = useState();
  const { cases, getAllCases, medicalFields, getMedicalFields, publishCase, newPublishment } =
    useCases();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [buttonsLoadingState, setButtonsLoadingState] = useState({})


  useEffect(() => {
    const fetchCases = async () => {
      await getAllCases();
      await getMedicalFields();
      setLoading(false)
    };
    fetchCases();
  }, []);

  useEffect(() => {
    if(loading==false){
      const initialState = {}
      cases.forEach((medicalCase) => {
        initialState['edit_' + medicalCase.id] = false;
        initialState['publish_' + medicalCase.id] = false;
        initialState['unpublish_' + medicalCase.id] = false;
        initialState['delete_' + medicalCase.id] = false;
      });
      setButtonsLoadingState(initialState)
    }
  }, [loading]);


  useEffect(() => {
    console.log(buttonsLoadingState)
  }, [buttonsLoadingState]);

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
    handleButtonChange('publish', caseId)
    if (isPublished) {
      if (confirm('Är du säker på att du vill avpublicera?')) {
        const response = await publishCase(caseId, isPublished);
      }
    }
    if (!isPublished) {
      if (confirm('Är du säker på att du vill publicera?')) {
        const response = await publishCase(caseId, isPublished);
        if (response != undefined){
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
    handleButtonChange('publish', caseId)
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

  const handleButtonChange = (method,id) => {
    console.log('körs')
    setButtonsLoadingState((prev) => ({
      ...prev,
      [method + '_' + id]: !prev[method + '_' + id],
    }));
  };

  return (
    <div>
      {loading ? (
        <LoadingSkeleton />
      ):(
        <>
          <Box maxW={'90%'} margin={'auto'}>
            <Accordion allowToggle defaultIndex={[0]}>
              {Object.keys(groupedCases).map((medicalFieldId) => (
                <AccordionItem key={medicalFieldId}>
                  <AccordionButton>
                    <Heading margin={'auto'} size='sm'>
                      {getMedicalFieldName(medicalFieldId)}{' '}
                    </Heading>
                  </AccordionButton>
                  <AccordionPanel pb={4} className="caseAccordion">
                    {groupedCases[medicalFieldId].map((caseItem) => (
                      <Box key={caseItem.id}>
                        {user.isAdmin && (
                          <Flex justify={'space-evenly'} direction={'column'}>
                            <p>Name: {caseItem.name}</p>
                            <p>Skapat av: {caseItem.end_user.email}</p>
                            <StartCase caseId={caseItem.id} />
                            <Button colorScheme='teal' marginBottom='5%'>
                              Redigera fallet
                            </Button>
                            {(caseItem.published == false || caseItem.published == null) && (
                              <Button
                                marginBottom='5%'
                                onClick={(e) => {
                                  handlePublish(caseItem.id, caseItem.published)
                                }}
                                colorScheme='teal'
                                isLoading={buttonsLoadingState['publish_'+ caseItem.id]}
                              >
                                Publicera fallet
                              </Button>
                            )}
                            {caseItem.published && (
                              <Button
                                marginBottom='5%'
                                onClick={(e) => handlePublish(caseItem.id, caseItem.published)}
                                colorScheme='teal'
                                id={'unpublish_' + caseItem.id}
                              >
                                Avpublicera fallet
                              </Button>
                            )}
                            <Button
                              onClick={(e) => removeCase(caseItem.id)}
                              colorScheme='teal'
                              marginBottom='5%'
                              id={'remove_' + caseItem.id}
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
        </>
      )}
    </div>
  );
}
