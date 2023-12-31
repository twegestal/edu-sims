import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  VStack,
  Heading,
  Box,
  Input,
  HStack,
  useToast,
  IconButton,
  Grid,
  Tooltip,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { DeleteIcon, AddIcon, EditIcon } from '@chakra-ui/icons';
import { useCases } from '../hooks/useCases';
import ManageMedicalFields from './ManageMedicalFields';
import ConfirmInput from '../components/ConfirmInput';
import Confirm from '../components/Confirm';

export default function ManageDiagnosis() {
  const [newDiagnosis, setNewDiagnosis] = useState({});
  const [currentDiagnosis, setCurrentDiagnosis] = useState();
  const [diagnosisToDelete, setDiagnosisToDelete] = useState();
  const [isConfirmValueOpen, setIsConfirmValueOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [isChangeMedicalFieldOpen, setIsChangeMedicalFieldOpen] = useState(false);
  const [isDeleteMedicalFieldOpen, setIsDeleteMedicalFieldOpen] = useState(false);
  const [medicalFieldToChange, setMedicalFieldToChange] = useState();
  const [medicalFieldToDelete, setMedicalFieldToDelete] = useState();
  const { diagnosisList, getDiagnosisList, addNewDiagnosis, updateDiagnosis, deleteDiagnosis } =
    useDiagnosis();
  const {
    medicalFields,
    getMedicalFields,
    addMedicalField,
    updateMedicalField,
    deleteMedicalField,
  } = useCases();
  const toast = useToast();

  const fetchData = async () => {
    await getDiagnosisList();
    await getMedicalFields();
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleNewDiagnosisChange = (fieldId, value) => {
    setNewDiagnosis({ ...newDiagnosis, [fieldId]: value });
  };

  const handleAddDiagnosis = async (fieldId) => {
    const newValue = newDiagnosis[fieldId]?.trim();
    if (!newValue) {
      showToast('Information saknas', 'Inget värde angavs', 'warning');
      return;
    }

    const newDiagnosisName = newValue.toLowerCase();
    const medicalField = diagnosisExists(newDiagnosisName);

    if (medicalField) {
      showToast(
        'Diagnosen finns redan',
        `${newValue} är redan tillagd under ${medicalField}`,
        'warning',
      );
    } else {
      const result = await addNewDiagnosis(newValue, fieldId);
      if (result) {
        showToast('Diagnos tillagd', `${newValue} har lagts till`, 'success');
        setNewDiagnosis({ ...newDiagnosis, [fieldId]: '' });
        await getDiagnosisList();
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
  };

  const diagnosisExists = (newDiagnosisName) => {
    const existingDiagnosis = diagnosisList.find(
      (diagnosis) => diagnosis.name.toLowerCase() === newDiagnosisName,
    );

    if (existingDiagnosis) {
      const medicalField = medicalFields.find(
        (field) => field.id === existingDiagnosis.medical_field_id,
      );
      return medicalField ? medicalField.name : false;
    }
    return false;
  };

  const handleCloseConfirm = () => {
    setIsConfirmValueOpen(false);
    setCurrentDiagnosis(null);
  };

  const handleCloseConfirmDelete = () => {
    setDiagnosisToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleDeleteDiagnosis = async () => {
    const response = await deleteDiagnosis(diagnosisToDelete.id);
    if (response === 200) {
      showToast('Diagnos borttagen', `${diagnosisToDelete.name} har tagits bort`, 'success');
      await getDiagnosisList();
    } else if (response === 400) {
      showToast(
        'Diagnos kan inte tas bort',
        `${diagnosisToDelete.name} kan inte tas bort, eftersom den är del av ett fall`,
        'warning',
      );
    } else {
      showToast('Någonting gick fel', `${diagnosisToDelete.name} kunde inte tas bort`, 'warning');
    }
    setDiagnosisToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleValueToEdit = async (newValue) => {
    setIsConfirmValueOpen(false);
    const medicalField = diagnosisExists(newValue.toLowerCase());
    if (medicalField) {
      showToast(
        'Diagnosen finns redan',
        `${newValue} är redan tillagd under ${medicalField}`,
        'warning',
      );
    } else {
      const response = await updateDiagnosis(newValue, currentDiagnosis.id);
      if (response) {
        showToast('Diagnos ändrad', `${newValue} har lagts till`, 'success');
        await getDiagnosisList();
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
  };

  const handleAddMedicalField = async (value) => {
    const exists = medicalFieldExists(value);
    if (!exists) {
      const response = await addMedicalField(value);
      if (response) {
        showToast('Medicinskt område tillagt', `${value} har lagts till`, 'success');
        fetchData();
      }
    } else {
      showToast('Medicinskt fält finns redan', `${value} är redan tillagt`, 'warning');
    }
  };

  const medicalFieldExists = (name) => {
    return medicalFields.some((field) => field.name.toLowerCase() === name.toLowerCase().trim());
  };

  const handleCloseChangeMedicalField = () => {
    setIsChangeMedicalFieldOpen(false);
    setMedicalFieldToChange(null);
  };

  const handleChangeMedicalField = async (newName) => {
    setIsChangeMedicalFieldOpen(false);

    const exists = medicalFields.find(
      (field) => field.name.toLowerCase().trim() === newName.toLowerCase().trim(),
    );

    if (exists) {
      showToast(
        'Medicinskt område finns redan',
        `Det medicinska området ${newName} är redan tillagt`,
        'error',
      );
    } else {
      const respose = await updateMedicalField(medicalFieldToChange.id, newName);
      if (respose) {
        showToast('Medicinskt område uppdaterat', `${newName} har lagts till`, 'success');
        await getMedicalFields();
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting gick fel och ${newName} kunde inte läggas till`,
          'error',
        );
      }
    }
    setMedicalFieldToChange(null);
  };

  const handleCloseDeleteMedicalField = () => {
    setIsDeleteMedicalFieldOpen(false);
    setMedicalFieldToDelete(null);
  };

  const handleDeleteMedicalField = async () => {
    setIsDeleteMedicalFieldOpen(false);
    const response = await deleteMedicalField(medicalFieldToDelete.id);
    if (response === 200) {
      showToast(
        'Medicinskt område borttaget',
        `${medicalFieldToDelete.name} har tagits bort`,
        'success',
      );
      await getMedicalFields();
    } else {
      const message = await response.json();
      if (message === 'Resource cannot be deleted') {
        showToast(
          'Fel',
          `${medicalFieldToDelete.name} kan inte tas bort eftersom det har diagnoser kopplade till sig`,
          'error',
        );
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting gick fel och ${medicalFieldToDelete.name} kunde inte tas bort`,
          'error',
        );
      }
    }
    setMedicalFieldToDelete(null);
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
          {medicalFields &&
            medicalFields.map((field) => (
              <Box
                key={field.id}
                border='1px'
                borderColor='gray.300'
                borderRadius='lg'
                p={4}
                mb={5}
                boxShadow='md'
              >
                <VStack align='left' spacing={4}>
                  <HStack>
                    <Heading as={'h3'} size={'md'} alignSelf='flex-start'>
                      {field.name}
                    </Heading>
                    <Tooltip
                      label={`Byt namn på ${field.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton
                        onClick={() => {
                          setMedicalFieldToChange(field);
                          setIsChangeMedicalFieldOpen(true);
                        }}
                        icon={<EditIcon />}
                      />
                    </Tooltip>
                    <Tooltip
                      label={`Ta bort ${field.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton
                        onClick={() => {
                          setMedicalFieldToDelete(field);
                          setIsDeleteMedicalFieldOpen(true);
                        }}
                        icon={<DeleteIcon />}
                      />
                    </Tooltip>
                  </HStack>
                  <HStack>
                    <Input
                      placeholder='Ny diagnos'
                      value={newDiagnosis[field.id] || ''}
                      onChange={(e) => handleNewDiagnosisChange(field.id, e.target.value)}
                      w={'30%'}
                    />
                    <IconButton
                      icon={<AddIcon />}
                      colorScheme='green'
                      onClick={() => handleAddDiagnosis(field.id)}
                    />
                  </HStack>
                  <TableContainer>
                    <Table variant='simple'>
                      <Thead>
                        <Tr>
                          <Th>Diagnos</Th>
                          <Th>Ändra</Th>
                          <Th>Ta bort</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {diagnosisList &&
                          diagnosisList
                            .filter((diagnosis) => diagnosis.medical_field_id === field.id)
                            .map((diagnosis) => (
                              <Tr key={diagnosis.id}>
                                <Td>{diagnosis.name}</Td>
                                <Td>
                                  <IconButton
                                    onClick={() => {
                                      setCurrentDiagnosis({
                                        id: diagnosis.id,
                                        name: diagnosis.name,
                                      });
                                      setIsConfirmValueOpen(true);
                                    }}
                                    icon={<EditIcon />}
                                  />
                                </Td>
                                <Td>
                                  <IconButton
                                    onClick={() => {
                                      setDiagnosisToDelete({
                                        id: diagnosis.id,
                                        name: diagnosis.name,
                                      });
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
                </VStack>
              </Box>
            ))}
        </Box>
        <Box
          gridColumn={'span 1'}
          position={'sticky'}
          top={'0'}
          height={'fit-content'}
          width={'fit-content'}
        >
          <ManageMedicalFields onAdd={handleAddMedicalField} />
        </Box>
      </Grid>

      {currentDiagnosis && (
        <ConfirmInput
          isOpen={isConfirmValueOpen}
          onClose={handleCloseConfirm}
          onConfirm={handleValueToEdit}
          valueToConfirm={currentDiagnosis.name}
        />
      )}
      {diagnosisToDelete && (
        <Confirm
          isOpen={isConfirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          header={'Ta bort diagnos'}
          body={`Är du säker på att du vill ta bort ${diagnosisToDelete.name}?`}
          handleConfirm={handleDeleteDiagnosis}
        />
      )}
      {medicalFieldToChange && (
        <ConfirmInput
          isOpen={isChangeMedicalFieldOpen}
          onClose={handleCloseChangeMedicalField}
          onConfirm={handleChangeMedicalField}
          valueToConfirm={medicalFieldToChange.name}
        />
      )}

      {medicalFieldToDelete && (
        <Confirm
          isOpen={isDeleteMedicalFieldOpen}
          onClose={handleCloseDeleteMedicalField}
          header={'Ta bort medicinskt område'}
          body={`Är du säker på att du vill ta bort ${medicalFieldToDelete.name}`}
          handleConfirm={handleDeleteMedicalField}
        />
      )}
    </>
  );
}
