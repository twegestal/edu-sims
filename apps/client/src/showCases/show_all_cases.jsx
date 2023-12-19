import React, { useEffect, useState } from 'react';
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  Button,
  Heading,
  useToast,
  SimpleGrid,
  Card,
  CardBody,
  Stack,
  Text,
  CardFooter,
  ButtonGroup,
  AccordionIcon,
  IconButton,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
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
  const [buttonsLoadingState, setButtonsLoadingState] = useState({});

  useEffect(() => {
    const fetchCases = async () => {
      await getAllCases();
      await getMedicalFields();
      setLoading(false);
    };
    fetchCases();
  }, []);

  useEffect(() => {
    if (loading == false) {
      const initialState = {};
      cases.forEach((medicalCase) => {
        initialState['edit_' + medicalCase.id] = false;
        initialState['publish_' + medicalCase.id] = false;
        initialState['unpublish_' + medicalCase.id] = false;
        initialState['delete_' + medicalCase.id] = false;
      });
      setButtonsLoadingState(initialState);
    }
  }, [loading]);

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

  const handlePublish = async (caseId, isPublished) => {
    if (isPublished) {
      handleButtonChange('unpublish', caseId);
      if (confirm('Är du säker på att du vill avpublicera?')) {
        const response = await publishCase(caseId, isPublished);
        if (response != undefined) {
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
      handleButtonChange('unpublish', caseId);
    }
    if (!isPublished) {
      handleButtonChange('publish', caseId);
      if (confirm('Är du säker på att du vill publicera?')) {
        const response = await publishCase(caseId, isPublished);
        if (response != undefined) {
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
      handleButtonChange('publish', caseId);
    }
  };

  const removeCase = (caseId) => {
    handleButtonChange('remove', caseId);
    if (confirm('Är du säker på att du vill ta bort fallet?')) {
      //TODO: API call
      console.log('Ta bort');
    }
    handleButtonChange('remove', caseId);
  };

  const randomiseCase = () => {
    const casesToRandomise = cases.filter((c) => c.published === true);
    const caseId = casesToRandomise[Math.floor(Math.random() * casesToRandomise.length)].id;
    setCaseToRandomise(caseId);
  };

  const handleButtonChange = (method, id) => {
    setButtonsLoadingState((prev) => ({
      ...prev,
      [method + '_' + id]: !prev[method + '_' + id],
    }));
  };

  return (
    <>
      {loading ? (
        <SimpleGrid columns={[1, 2, 3]} spacing={10} justifyContent={'space-around'}>
          {Array.from({ length: 9 }).map((_, index) => (
            <LoadingSkeleton key={index} />
          ))}
        </SimpleGrid>
      ) : (
        <Accordion allowToggle>
          {Object.keys(groupedCases).map((medicalFieldId) => (
            <AccordionItem key={medicalFieldId}>
              <AccordionButton>
                <Heading margin={'auto'} size='sm'>
                  {getMedicalFieldName(medicalFieldId)}{' '}
                </Heading>
                <AccordionIcon />
              </AccordionButton>
              <AccordionPanel pb={4} className='caseAccordion'>
                {user.isAdmin ? (
                  <SimpleGrid columns={[1, 2, 3]} spacing={10} justifyContent={'space-around'}>
                    {groupedCases[medicalFieldId].map((caseItem) => (
                      <Card maxW={'md'} alignItems={'center'}>
                        <CardBody>
                          <Stack>
                            <Heading size={'md'}>{caseItem.name}</Heading>
                            <Text>Skapat av {caseItem.end_user.email}</Text>
                          </Stack>
                        </CardBody>
                        <CardFooter>
                          <Stack>
                            <StartCase caseId={caseItem.id} caseToRandomise={caseToRandomise} />
                            <ButtonGroup>
                              <Button
                                onClick={() => handlePublish(caseItem.id, caseItem.published)}
                                isLoading={
                                  caseItem.published
                                    ? buttonsLoadingState['unpublish_' + caseItem.id]
                                    : buttonsLoadingState['publish_' + caseItem.id]
                                }
                              >
                                {caseItem.published ? 'Avpublicera' : 'Publicera'}
                              </Button>
                              <IconButton
                                icon={<EditIcon />}
                                isLoading={buttonsLoadingState['edit_' + caseItem.id]}
                              >
                                Redigera
                              </IconButton>
                              <IconButton
                                icon={<DeleteIcon />}
                                onClick={() => removeCase(caseItem.id)}
                                isLoading={buttonsLoadingState['remove_' + caseItem.id]}
                              >
                                Ta bort fallet
                              </IconButton>
                            </ButtonGroup>
                          </Stack>
                        </CardFooter>
                      </Card>
                    ))}
                  </SimpleGrid>
                ) : (
                  <SimpleGrid columns={[1, 2, 3]} spacing={10} justifyContent={'space-around'}>
                    {groupedCases[medicalFieldId]
                      .filter((c) => c.published === true)
                      .map((caseItem) => (
                        <Card maxW={'md'} alignItems={'center'}>
                          <CardBody>
                            <Stack>
                              <Heading size={'md'}>{caseItem.name}</Heading>
                            </Stack>
                          </CardBody>
                          <CardFooter>
                            <Stack>
                              <StartCase caseId={caseItem.id} caseToRandomise={caseToRandomise} />
                            </Stack>
                          </CardFooter>
                        </Card>
                      ))}
                  </SimpleGrid>
                )}
              </AccordionPanel>
            </AccordionItem>
          ))}
        </Accordion>
      )}
      {!user.isAdmin && (
        <Button onClick={randomiseCase} marginTop={'30px'}>
          Slumpa fall
        </Button>
      )}
    </>
  );
}
