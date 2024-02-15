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
  Tooltip,
} from '@chakra-ui/react';
import { EditIcon, DeleteIcon } from '@chakra-ui/icons';
import { BiHide, BiShow } from 'react-icons/bi';
import { useCases } from '../../hooks/useCases.js';
import { useAuth } from '../../hooks/useAuth.jsx';
import StartCase from './StartCase.jsx';
import { errorWithPathToString } from 'api';
import LoadingSkeleton from '../../components/LoadingSkeleton.jsx';
import { useNavigate } from 'react-router-dom';
import Confirm from '../../components/Confirm.jsx';

export default function ShowAllCases() {
  const [caseToRandomise, setCaseToRandomise] = useState();
  const {
    cases,
    getAllCases,
    medicalFields,
    getMedicalFields,
    publishCase,
    newPublishment,
    getAttempts,
    deleteCase,
  } = useCases();
  const { user } = useAuth();
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [buttonsLoadingState, setButtonsLoadingState] = useState({});
  const [attempts, setAttempts] = useState(null);
  const [attemptsFetched, setAttemptsFetched] = useState(false);
  const navigate = useNavigate();

  const [isDeleteCaseOpen, setIsDeleteCaseOpen] = useState(false);
  const [caseToDelete, setCaseToDelete] = useState();

  const [isToggleCaseOpen, setIsToggleCaseOpen] = useState(false);
  const [caseToPublish, setCaseToPublish] = useState();

  useEffect(() => {
    fetchCases();
  }, []);

  const fetchCases = async () => {
    await getAllCases();
    await getMedicalFields();
    const result = await getAttempts();
    setAttempts(result);
    setLoading(false);
  };

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
    if (attempts !== null) {
      setAttemptsFetched(true);
    }
  }, [attempts]);

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

  const removeCase = async () => {
    handleButtonChange('remove', caseToDelete.id);
    const response = await deleteCase(caseToDelete.id);
    toast({
      title: response ? 'Fall raderat' : 'Fall kunde inte raderas',
      description: response
        ? `Fallet ${caseToDelete.name} har raderats`
        : `Fallet ${caseToDelete.name} kunde inte raderas`,
      status: response ? 'success' : 'error',
      duration: 9000,
      position: 'top',
      isClosable: true,
    });

    handleButtonChange('remove', caseToDelete.id);
    setIsDeleteCaseOpen(false);
    setCaseToDelete(null);
    await fetchCases();
  };

  /**
   * Use case needs to be updated. As of current, a successful API-call is made when it returns 'undefined'
   * An answer which actually is defined is one which has error-answers in it.
   */

  const flipCasePublished = async () => {
    const casePublished = caseToPublish.published;
    const caseId = caseToPublish.id;
    handleButtonChange(casePublished ? 'unbublish' : 'publish', caseId);
    const response = await publishCase(caseId, casePublished);
    if (response) {
      toast({
        title: 'Fel vid uppdatering av fall',
        description: errorWithPathToString(response.errors[0]),
        status: 'error',
        duration: 9000,
        position: 'top',
        isClosable: true,
      });
    } else {
      toast({
        title: 'Fallet uppdaterades korrekt',
        status: 'success',
        description: casePublished ? 'Fallet är avpublicerat' : 'Fallet är publicerat',
        duration: 9000,
        position: 'top',
        isClosable: true,
      });
    }
    handleButtonChange(casePublished ? 'unpublish' : 'publish', caseId);
    setIsToggleCaseOpen(false);
    setCaseToPublish(null);
  };

  const handleCloseDeleteCase = () => {
    setIsDeleteCaseOpen(false);
    setCaseToDelete(null);
  };

  const handleCloseTogglePublish = () => {
    setIsToggleCaseOpen(false);
    setCaseToPublish(null);
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

  const handleCaseToEdit = (caseId) => {
    localStorage.setItem('caseId', caseId);
    return navigate('/caseBuilder');
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
                  <SimpleGrid
                    key={medicalFieldId}
                    columns={[1, 2, 3]}
                    spacing={10}
                    justifyContent={'space-around'}
                  >
                    {groupedCases[medicalFieldId].map((caseItem) => (
                      <Card key={caseItem.id} maxW={'md'} alignItems={'center'}>
                        <CardBody>
                          <Stack>
                            <Heading size={'md'}>{caseItem.name}</Heading>
                            <Text>Skapat av {caseItem.end_user.email}</Text>
                          </Stack>
                        </CardBody>
                        <CardFooter>
                          <Stack>
                            {attemptsFetched && (
                              <StartCase
                                caseId={caseItem.id}
                                caseToRandomise={caseToRandomise}
                                published={caseItem.published}
                                attempts={attempts}
                                fetched={attemptsFetched}
                              />
                            )}
                            <ButtonGroup spacing={10}>
                              <Tooltip
                                label={
                                  caseItem.published
                                    ? 'Avpublicera fallet så att det inte visas för studenter'
                                    : 'Publicera fallet för att visa det för studenter'
                                }
                                fontSize={'md'}
                                placement='right'
                                hasArrow
                              >
                                <IconButton
                                  icon={caseItem.published ? <BiHide /> : <BiShow />}
                                  onClick={() => {
                                    setCaseToPublish(caseItem);
                                    setIsToggleCaseOpen(true);
                                  }}
                                  isLoading={
                                    caseItem.published
                                      ? buttonsLoadingState['unpublish_' + caseItem.id]
                                      : buttonsLoadingState['publish_' + caseItem.id]
                                  }
                                />
                              </Tooltip>
                              <Tooltip label='Redigera' fontSize={'md'} placement='right' hasArrow>
                                <IconButton
                                  icon={<EditIcon />}
                                  isLoading={buttonsLoadingState['edit_' + caseItem.id]}
                                  onClick={() => handleCaseToEdit(caseItem.id)}
                                />
                              </Tooltip>
                              <Tooltip label='Ta bort' fontSize={'md'} placement='right' hasArrow>
                                <IconButton
                                  icon={<DeleteIcon />}
                                  onClick={() => {
                                    setCaseToDelete(caseItem);
                                    setIsDeleteCaseOpen(true);
                                  }}
                                  isLoading={buttonsLoadingState['remove_' + caseItem.id]}
                                />
                              </Tooltip>
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
                        <Card key={caseItem.id} maxW={'md'} alignItems={'center'}>
                          <CardBody>
                            <Stack>
                              <Heading size={'md'}>{caseItem.name}</Heading>
                            </Stack>
                          </CardBody>
                          <CardFooter>
                            {attempts !== null && (
                              <Stack>
                                <StartCase
                                  caseId={caseItem.id}
                                  caseToRandomise={caseToRandomise}
                                  attemps={attempts}
                                  caseName={caseItem.name}
                                />
                              </Stack>
                            )}
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
      {caseToDelete && (
        <Confirm
          isOpen={isDeleteCaseOpen}
          onClose={handleCloseDeleteCase}
          header={'Ta bort fall'}
          body={`Är du säker på att du vill ta bort fallet ${caseToDelete.name}?`}
          handleConfirm={removeCase}
        />
      )}
      {caseToPublish && (
        <Confirm
          isOpen={isToggleCaseOpen}
          onClose={handleCloseTogglePublish}
          header={caseToPublish.published ? `Avpublicera fall` : `Publicera fall`}
          body={
            caseToPublish.published
              ? `Är du säker på att du vill avpublicera fallet ${caseToPublish.name}`
              : `Är du säker på att du vill publicera fallet ${caseToPublish.name}`
          }
          handleConfirm={flipCasePublished}
        />
      )}
    </>
  );
}
