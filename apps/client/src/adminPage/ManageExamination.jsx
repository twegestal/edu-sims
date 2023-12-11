import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  HStack,
  Grid,
  Box,
  VStack,
  Heading,
  IconButton,
  Input,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useExamination } from '../hooks/useExamination';

export default function ManageExamination() {
  const [newExamination, setNewExamination] = useState({});
  const [examinationToEdit, setNewExaminationToEdit] = useState();
  const [examinationToDelete, setExaminationToDelete] = useState();
  const [isConfirmInputOpen, setIsConfirmInputOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const toast = useToast();

  const {
    examinationTypes,
    getExaminationTypes,
    examinationSubtypes,
    getExaminationSubtypes,
    examinationList,
    getExaminationList,
    addNewExamination,
  } = useExamination();

  const fetchExaminations = async () => {
    await getExaminationTypes();
    await getExaminationSubtypes();
    await getExaminationList();
  };
  useEffect(() => {
    fetchExaminations();
  }, []);

  const handleExaminationChange = (subtypeId, newValue) => {
    setNewExamination({ ...newExamination, [subtypeId]: newValue });
  };

  const handleCloseConfirmInput = () => {
    setIsConfirmInputOpen(false);
    setNewExaminationToEdit({});
  };

  const handleAddExamination = async (subtypeId, examinationTypeId) => {
    const newValue = newExamination[subtypeId]?.trim();
    if (!newValue) {
      showToast('Information saknas', 'Inget värde angavs', 'warning');
      return;
    }

    const newExaminationName = newValue.toLowerCase();
    const examinationSubtype = examinationExists(newExaminationName);

    if (examinationSubtype) {
      showToast(
        'Utredningen finns redan',
        `${newValue} är redan tillagd under ${examinationSubtype}`,
        'warning',
      );
    } else {
      const result = await addNewExamination(newValue, subtypeId, examinationTypeId);
      if (result) {
        await fetchExaminations();
        showToast('Utredning tillagd', `${newValue} har lagts till`, 'success');
        setNewExamination({ ...newExamination, [subtypeId]: ''});
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
  };

  const examinationExists = (value) => {
    const existingExamination = examinationList.find(
      (examination) => examination.name.toLowerCase() === value,
    );

    if (existingExamination) {
      const subtype = examinationSubtypes.find(
        (type) => type.id === existingExamination.examination_subtype_id,
      );
      return subtype ? subtype.name : false;
    }
    return false;
  };

  const handleExaminationToEdit = (newValue) => {};

  const handleCloseConfirmDelete = () => {
    setExaminationToDelete({});
    setIsConfirmDeleteOpen(false);
  };

  const handleDeleteExamination = () => {};

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 2000,
      isClosable: true,
      position: 'top',
    });
  };
  return (
    <>
      <Grid templateColumns='repeat(4, 1fr)' gap={6}>
        <Box gridColumn={'span 3'}>
          {examinationTypes &&
            examinationTypes.map((examType) => (
              <Box
                key={examType.id}
                border={'1px'}
                borderColor={'gray.300'}
                borderRadius={'lg'}
                p={4}
                mb={5}
                boxShadow={'md'}
              >
                <VStack align={'left'} spacing={4}>
                  <Heading as={'h3'} size={'md'} alignSelf={'flex-start'}>
                    {examType.name}
                  </Heading>
                  {examinationSubtypes &&
                    examinationSubtypes
                      .filter((subtype) => subtype.examination_type_id === examType.id)
                      .map((subtype) => (
                        <Box key={subtype.id}>
                          <Heading as={'h5'} size={'sm'} textAlign={'left'}>
                            {subtype.name}
                          </Heading>
                          <HStack>
                            <Input
                              placeholder='Ny behandling'
                              value={newExamination?.[subtype.id] || ''}
                              onChange={(e) => handleExaminationChange(subtype.id, e.target.value)}
                              w={'30%'}
                            />
                            <IconButton
                              icon={<AddIcon />}
                              colorScheme='green'
                              onClick={() => handleAddExamination(subtype.id, examType.id)}
                            />
                          </HStack>
                          <TableContainer>
                            <Table variant={'simple'}>
                              <Thead>
                                <Tr>
                                  <Th>Behandling</Th>
                                  <Th>Ändra</Th>
                                  <Th>Ta bort</Th>
                                </Tr>
                              </Thead>
                              <Tbody>
                                {examinationList &&
                                  examinationList
                                    .filter(
                                      (examination) =>
                                        examination.examination_subtype_id === subtype.id,
                                    )
                                    .map((examination) => (
                                      <Tr key={examination.id}>
                                        <Td>{examination.name}</Td>
                                        <Td>
                                          <IconButton
                                            onClick={() => {
                                              setNewExaminationToEdit(examination);
                                              setIsConfirmInputOpen(true);
                                            }}
                                            icon={<EditIcon />}
                                          />
                                        </Td>
                                        <Td>
                                          <IconButton
                                            onClick={() => {
                                              setExaminationToDelete(examination);
                                              setIsConfirmDeleteOpen(true);
                                            }}
                                            icon={<DeleteIcon />}
                                          />
                                        </Td>
                                      </Tr>
                                    ))}
                              </Tbody>
                            </Table>
                          </TableContainer>
                        </Box>
                      ))}
                </VStack>
              </Box>
            ))}
        </Box>
        {/* <VStack
          gridColumn={'span 1'}
          position={'sticky'}
          top={0}
          height={'fit-content'}
          width={'fit-content'}
        >
          <ManageTreatmentTypes onAdd={handleAddTreatmentType} />
          <ManageTreatmentSubtypes onAdd={handleAddTreatmentSubtype} update={update} />
        </VStack> */}
      </Grid>
      {examinationToEdit && (
        <ConfirmInput
          isOpen={isConfirmInputOpen}
          onClose={handleCloseConfirmInput}
          onConfirm={handleExaminationToEdit}
          valueToConfirm={examinationToEdit.name}
        />
      )}
      {examinationToDelete && (
        <Confirm
          isOpen={isConfirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          header={'Ta bort behandling'}
          body={`Är du säker på att du vill ta bort ${examinationToDelete.name}?`}
          handleConfirm={handleDeleteExamination}
        />
      )}
    </>
  );
}
