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
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useExamination } from '../hooks/useExamination';
import Confirm from '../components/Confirm';
import ConfirmInput from '../components/ConfirmInput';
import ManageExaminationTypes from './ManageExaminationTypes';
import ManageExaminationSubtypes from './ManageExaminationSubtypes';

export default function ManageExamination() {
  const [newExamination, setNewExamination] = useState({});
  const [examinationToEdit, setNewExaminationToEdit] = useState();
  const [examinationToDelete, setExaminationToDelete] = useState();
  const [isConfirmInputOpen, setIsConfirmInputOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const toast = useToast();

  const {
    examinationTypes,
    getExaminationTypes,
    examinationSubtypes,
    getExaminationSubtypes,
    examinationList,
    getExaminationList,
    addNewExamination,
    updateExamination,
    deleteExamination,
    addNewExaminationType,
    addNewExaminationSubtype,
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
        setNewExamination({ ...newExamination, [subtypeId]: '' });
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

  const handleExaminationToEdit = async (newValue) => {
    const examination = newValue.trim().toLowerCase();
    const examinationSubtype = examinationExists(examination);

    if (examinationSubtype) {
      showToast(
        'Undersökningen finns redan',
        `${newValue} är redan tillagd under ${examinationSubtype}`,
        'warning',
      );
    } else {
      const response = await updateExamination(newValue, examinationToEdit.id);
      if (response) {
        showToast('Undersökning ändrad', `${newValue} har lagts till`, 'success');
        await fetchExaminations();
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
    setNewExaminationToEdit(null);
  };

  const handleCloseConfirmDelete = () => {
    setExaminationToDelete({});
    setIsConfirmDeleteOpen(false);
  };

  const handleDeleteExamination = async () => {
    const response = await deleteExamination(examinationToDelete.id);
    if (response === 200) {
      showToast('Undersökning borttagen', `${examinationToDelete.name} har tagits bort`, 'success');
      await fetchExaminations();
    } else if (response === 400) {
      showToast(
        'Undersökningen kan inte tas bort',
        `${examinationToDelete.name} kan inte tas bort, eftersom den är del av ett fall`,
        'warning',
      );
    } else {
      showToast('Någonting gick fel', `${examinationToDelete.name} kunde inte tas bort`, 'warning');
    }
    setIsConfirmDeleteOpen(false);
  };

  const handleAddExaminationType = async (name) => {
    const examinationType = name.toLowerCase().trim();
    const exists = examinationTypes.some(
      (type) => type.name.toLowerCase().trim() === examinationType,
    );
    if (exists) {
      showToast('Huvudkategorin finns redan', ` ${name} är redan tillagd`, 'warning');
    } else {
      const response = await addNewExaminationType(name);
      if (response) {
        showToast('Kategori tillagd', `Kategorin ${name} har lagts till`, 'success');
        await fetchExaminations();
        setUpdate((prev) => !prev);
      } else {
        showToast('Någonting gick fel', `${name} kunde inte läggas till`, 'warning');
      }
    }
  };

  const handleAddExaminationSubtype = async (name, examinationType) => {
    const subtype = name.toLowerCase().trim();
    const exists = examinationSubtypes.some((sub) => sub.name === subtype);

    if (exists) {
      showToast('Underkategori finns redan', `Underkategorin ${name} är redan tillagd`, 'warning');
    } else {
      const response = await addNewExaminationSubtype(name, examinationType);
      if (response) {
        showToast('Underkategori tillagd', `Underkategorin ${name} har blivit tillagd`, 'success');
        await fetchExaminations();
      } else {
        showToast('Någonting gick fel', `Underkategorin ${name} kunde inte läggas till`, 'warning');
      }
    }
  };

  const showToast = (title, description, status) => {
    toast({
      title: title,
      description: description,
      status: status,
      duration: 9000,
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
                  <HStack>
                    <Heading as={'h3'} size={'md'} alignSelf={'flex-start'}>
                      {examType.name}
                    </Heading>
                    <Tooltip
                      label={`Byt namn på ${examType.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton icon={<EditIcon />} />
                    </Tooltip>
                    <Tooltip
                      label={`Ta bort ${examType.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton icon={<DeleteIcon />} />
                    </Tooltip>
                  </HStack>
                  {examinationSubtypes &&
                    examinationSubtypes
                      .filter((subtype) => subtype.examination_type_id === examType.id)
                      .map((subtype) => (
                        <Box key={subtype.id}>
                          <HStack marginBottom={'10px'}>
                            <Heading as={'h5'} size={'sm'} textAlign={'left'}>
                              {subtype.name}
                            </Heading>
                            <Tooltip
                              label={`Byt namn på ${subtype.name}`}
                              fontSize={'md'}
                              placement='right'
                              hasArrow
                            >
                              <IconButton icon={<EditIcon />} />
                            </Tooltip>
                            <Tooltip
                              label={`Ta bort ${subtype.name}`}
                              fontSize={'md'}
                              placement='right'
                              hasArrow
                            >
                              <IconButton icon={<DeleteIcon />} />
                            </Tooltip>
                          </HStack>
                          <HStack>
                            <Input
                              placeholder='Ny undersökning'
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
                                  <Th>Undersökning</Th>
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
        <VStack
          gridColumn={'span 1'}
          position={'sticky'}
          top={0}
          height={'fit-content'}
          width={'fit-content'}
        >
          <ManageExaminationTypes onAdd={handleAddExaminationType} />
          <ManageExaminationSubtypes onAdd={handleAddExaminationSubtype} update={update} />
        </VStack>
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
          header={'Ta bort undersökning'}
          body={`Är du säker på att du vill ta bort ${examinationToDelete.name}?`}
          handleConfirm={handleDeleteExamination}
        />
      )}
    </>
  );
}
