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
import { useTreatment } from '../hooks/useTreatment';
import ManageTreatmentTypes from './ManageTreatmentTypes';
import ManageTreatmentSubtypes from './ManageTreatmentSubtypes';
import ConfirmInput from '../components/ConfirmInput';
import Confirm from '../components/Confirm';

export default function ManageTreatment() {
  const [newTreatment, setNewTreatment] = useState({});
  const [treatmentToEdit, setTreatmentToEdit] = useState();
  const [treatmentToDelete, setTreatmentToDelete] = useState();
  const [isConfirmInputOpen, setIsConfirmInputOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [update, setUpdate] = useState(false);
  const toast = useToast();
  const {
    treatmentTypes,
    getTreatmentTypes,
    treatmentSubtypes,
    getTreatmentSubTypes,
    treatmentList,
    getTreatmentList,
    addTreatment,
    updateTreatment,
    deleteTreatment,
    addNewTreatmentType,
    addNewTreatmentSubtype,
  } = useTreatment();

  const fetchTreatments = async () => {
    await getTreatmentTypes();
    await getTreatmentSubTypes();
    await getTreatmentList();
  };

  useEffect(() => {
    fetchTreatments();
  }, []);

  const handleTreatmentChange = (subtypeId, value) => {
    setNewTreatment({ ...newTreatment, [subtypeId]: value });
  };

  const handleAddTreatment = async (subtypeId, treatmentId) => {
    const newValue = newTreatment[subtypeId]?.trim();
    if (!newValue) {
      showToast('Information saknas', 'Inget värde angavs', 'warning');
      return;
    }

    const newTreatmentName = newValue.toLowerCase();
    const treatmentSubtype = treatmentExists(newTreatmentName);

    if (treatmentSubtype) {
      showToast(
        'Behandlingen finns redan',
        `${newValue} är redan tillagd under ${treatmentSubtype}`,
        'warning',
      );
    } else {
      const result = await addTreatment(newValue, subtypeId, treatmentId);
      if (result) {
        await fetchTreatments();
        showToast('Behandling tillagd', `${newValue} har lagts till`, 'success');
        setNewDiagnosis({ ...newTreatment, [subtypeId]: '' });
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
  };

  const treatmentExists = (value) => {
    const existingTreatment = treatmentList.find(
      (treatment) => treatment.name.toLowerCase() === value,
    );

    if (existingTreatment) {
      const subtype = treatmentSubtypes.find(
        (type) => type.id === existingTreatment.treatment_subtype_id,
      );
      return subtype ? subtype.name : false;
    }
    return false;
  };

  const handleAddTreatmentType = async (newValue) => {
    const treatmentType = newValue.toLowerCase().trim();
    const exists = treatmentTypes.some((type) => type.name.toLowerCase().trim() === treatmentType);
    if (exists) {
      showToast(
        'Kategori finns redan',
        `Kategorin ${newValue} finns redan och kan därför inte läggas till`,
        'warning',
      );
    } else {
      const response = await addNewTreatmentType(newValue);
      if (response) {
        showToast('Kategori tillagd', `Kategorin ${newValue} har lagts till`, 'success');
        await fetchTreatments();
        setUpdate((prev) => !prev);
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
  };

  const handleAddTreatmentSubtype = async (name, treatmentType) => {
    const subtype = name.toLowerCase().trim();
    const exists = treatmentSubtypes.some((sub) => sub.name === subtype);

    if (exists) {
      showToast('Underkategori finns redan', `Underkategorin ${name} är redan tillagd`, 'warning');
    } else {
      const response = await addNewTreatmentSubtype(name, treatmentType);
      if (response) {
        showToast('Underkategori tillagd', `Underkategorin ${name} har blivit tillagd`, 'success');
        await fetchTreatments();
      } else {
        showToast('Någonting gick fel', `Underkategorin ${name} kunde inte läggas till`, 'warning');
      }
    }
  };

  const handleCloseConfirmInput = () => {
    setTreatmentToEdit(null);
    setIsConfirmInputOpen(false);
  };

  const handleCloseConfirmDelete = () => {
    setTreatmentToDelete(null);
    setIsConfirmDeleteOpen(false);
  };

  const handleValueToEdit = async (newValue) => {
    const treatment = newValue.trim().toLowerCase();
    const treatmentSubtype = treatmentExists(treatment);

    if (treatmentSubtype) {
      showToast(
        'Behandlingen finns redan',
        `${newValue} är redan tillagd under ${treatmentSubtype}`,
        'warning',
      );
    } else {
      const response = await updateTreatment(newValue, treatmentToEdit.id);
      if (response) {
        showToast('Behandling ändrad', `${newValue} har lagts till`, 'success');
        await fetchTreatments();
      } else {
        showToast('Någonting gick fel', `${newValue} kunde inte läggas till`, 'warning');
      }
    }
    setTreatmentToEdit(null);
  };

  const handleDeleteTreatment = async () => {
    const response = await deleteTreatment(treatmentToDelete.id);
    if (response === 200) {
      showToast('Behandling borttagen', `${treatmentToDelete.name} har tagits bort`, 'success');
      await fetchTreatments();
    } else if (response === 400) {
      showToast(
        'Behandling kan inte tas bort',
        `${treatmentToDelete.name} kan inte tas bort, eftersom den är del av ett fall`,
        'warning',
      );
    } else {
      showToast('Någonting gick fel', `${treatmentToDelete.name} kunde inte tas bort`, 'warning');
    }
    setTreatmentToDelete(null);
    setIsConfirmDeleteOpen(false);
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
          {treatmentTypes &&
            treatmentTypes.map((treatment) => (
              <Box
                key={treatment.id}
                border={'1px'}
                borderColor={'gray.300'}
                borderRadius={'lg'}
                p={4}
                mb={5}
                boxShadow={'md'}
              >
                <VStack align={'left'} spacing={4}>
                  <Heading as={'h3'} size={'md'} alignSelf={'flex-start'}>
                    {treatment.name}
                  </Heading>
                  {treatmentSubtypes &&
                    treatmentSubtypes
                      .filter((subtype) => subtype.treatment_type_id === treatment.id)
                      .map((subtype) => (
                        <Box key={subtype.id}>
                          <Heading as={'h5'} size={'sm'} textAlign={'left'}>
                            {subtype.name}
                          </Heading>
                          <HStack>
                            <Input
                              placeholder='Ny behandling'
                              value={newTreatment?.[subtype.id] || ''}
                              onChange={(e) => handleTreatmentChange(subtype.id, e.target.value)}
                              w={'30%'}
                            />
                            <IconButton
                              icon={<AddIcon />}
                              colorScheme='green'
                              onClick={() => handleAddTreatment(subtype.id, treatment.id)}
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
                                {treatmentList &&
                                  treatmentList
                                    .filter((item) => item.treatment_subtype_id === subtype.id)
                                    .map((treatment) => (
                                      <Tr key={treatment.id}>
                                        <Td>{treatment.name}</Td>
                                        <Td>
                                          <IconButton
                                            onClick={() => {
                                              setTreatmentToEdit(treatment);
                                              setIsConfirmInputOpen(true);
                                            }}
                                            icon={<EditIcon />}
                                          />
                                        </Td>
                                        <Td>
                                          <IconButton
                                            onClick={() => {
                                              setTreatmentToDelete(treatment);
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
          <ManageTreatmentTypes onAdd={handleAddTreatmentType} />
          <ManageTreatmentSubtypes onAdd={handleAddTreatmentSubtype} update={update} />
        </VStack>
      </Grid>
      {treatmentToEdit && (
        <ConfirmInput
          isOpen={isConfirmInputOpen}
          onClose={handleCloseConfirmInput}
          onConfirm={handleValueToEdit}
          valueToConfirm={treatmentToEdit.name}
        />
      )}
      {treatmentToDelete && (
        <Confirm
          isOpen={isConfirmDeleteOpen}
          onClose={handleCloseConfirmDelete}
          header={'Ta bort behandling'}
          body={`Är du säker på att du vill ta bort ${treatmentToDelete.name}?`}
          handleConfirm={handleDeleteTreatment}
        />
      )}
    </>
  );
}
