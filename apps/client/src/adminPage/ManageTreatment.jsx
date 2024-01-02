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
  const [subtypeToEdit, setSubtypeToEdit] = useState();
  const [isEditSubtypeOpen, setIsEditSubtypeOpen] = useState(false);
  const [subtypeToDelete, setSubtypeToDelete] = useState();
  const [isDeleteSubtypeOpen, setIsDeleteSubtypeOpen] = useState(false);
  const [treatmentTypeToEdit, setTreatmentTypeToEdit] = useState();
  const [treatmentTypeToDelete, setTreatmentTypeToDelete] = useState();
  const [isEditTreatmentTypeOpen, setIsEditTreatmentTypeOpen] = useState(false);
  const [isDeleteTreatmentTypeOpen, setIsDeleteTreatmentTypeOpen] = useState(false);
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
    editTreatmentSubtype,
    deleteTreatmentSubtype,
    editTreatmentType,
    deleteTreatmentType,
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
        setNewTreatment({ ...newTreatment, [subtypeId]: '' });
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

  const handleCloseEditSubtype = () => {
    setIsEditSubtypeOpen(false);
    setSubtypeToEdit(null);
  };

  const handleEditSubtype = async (newName) => {
    setIsEditSubtypeOpen(false);
    const exists = treatmentSubtypes.find(
      (subtype) => subtype.name.toLowerCase().trim() === newName.toLowerCase().trim(),
    );

    if (exists) {
      showToast('Underkategori finns redan', `Underkategorin ${newName} är redan tillagd`, 'error');
    } else {
      const response = await editTreatmentSubtype(subtypeToEdit.id, newName);
      if (response) {
        showToast(
          'Underkategori uppdaterad',
          `Underkategorin ${newName} har lagts till`,
          'success',
        );
        await fetchTreatments();
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting gick fel och ${newName} kunde inte läggas till`,
          'error',
        );
      }
    }
    setSubtypeToEdit(null);
  };

  const handleCloseDeleteSubtype = () => {
    setIsDeleteSubtypeOpen(false);
    setSubtypeToDelete(null);
  };

  const handleDeleteSubtype = async () => {
    setIsDeleteSubtypeOpen(false);
    const response = await deleteTreatmentSubtype(subtypeToDelete.id);
    if (response === 200) {
      showToast('Underkategori borttagen', `Underkategorin ${subtypeToDelete.name}`, 'success');
      await fetchTreatments();
    } else {
      const message = await response.json();
      if (message === 'Cannot delete resource') {
        showToast(
          'Underkategori kan inte tas bort',
          `Underkategorin ${subtypeToDelete.name} kan inte tas bort, eftersom den har behandlingar kopplade till sig`,
          'error',
        );
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting gick fel och underkategorin ${subtypeToDelete.name} kunde inte tas bort`,
          'error',
        );
      }
    }
    setSubtypeToDelete(null);
  };

  const handleCloseEditTreatmentType = () => {
    setIsEditTreatmentTypeOpen(false);
    setTreatmentTypeToEdit(null);
  };

  const handleEditTreatmentType = async (newName) => {
    setIsEditTreatmentTypeOpen(false);

    const exists = treatmentTypes.find(
      (type) => type.name.toLowerCase().trim() === newName.toLowerCase().trim(),
    );

    if (exists) {
      showToast(
        'Huvudkategori finns redan',
        `Huvudkategorin ${newName} finns redan och kan därför inte läggas till`,
        'error',
      );
    } else {
      const response = await editTreatmentType(treatmentTypeToEdit.id, newName);
      if (response) {
        showToast(
          'Huvudkategori uppdaterad',
          `Huvudkategorin ${newName} har lagts till`,
          'success',
        );
        await fetchTreatments();
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting fick fel och ${newName} kunde inte läggas till`,
          'error',
        );
      }
    }
    setTreatmentTypeToEdit(null);
  };

  const handleCloseDeleteTreatmentType = () => {
    setIsDeleteTreatmentTypeOpen(false);
    setTreatmentTypeToDelete(null);
  };

  const handleDeleteTreatmentType = async () => {
    setIsDeleteTreatmentTypeOpen(false);
    const response = await deleteTreatmentType(treatmentTypeToDelete.id);
    if (response === 200) {
      showToast(
        'Huvudkategori borttagen',
        `Huvudkategorin ${treatmentTypeToDelete.name} har tagits bort`,
        'success',
      );
      await fetchTreatments();
    } else {
      const message = await response.json();
      if (message === 'Cannot delete resource') {
        showToast(
          'Huvudkategori kan inte tas bort',
          `Huvudkategorin ${treatmentTypeToDelete.name} har underkategorier kopplade till sig och kan därför inte tas bort`,
          'error',
        );
      } else {
        showToast(
          'Någonting gick fel',
          `Någonting gick fel och ${treatmentTypeToDelete.name} kunde inte tas bort`,
          'error',
        );
      }
    }
    setTreatmentTypeToDelete(null);
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
                  <HStack>
                    <Heading as={'h3'} size={'md'} alignSelf={'flex-start'}>
                      {treatment.name}
                    </Heading>
                    <Tooltip
                      label={`Byt namn på ${treatment.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton
                        onClick={() => {
                          setTreatmentTypeToEdit(treatment);
                          setIsEditTreatmentTypeOpen(true);
                        }}
                        icon={<EditIcon />}
                      />
                    </Tooltip>
                    <Tooltip
                      label={`Ta bort ${treatment.name}`}
                      fontSize={'md'}
                      placement='right'
                      hasArrow
                    >
                      <IconButton
                        onClick={() => {
                          setTreatmentTypeToDelete(treatment);
                          setIsDeleteTreatmentTypeOpen(true);
                        }}
                        icon={<DeleteIcon />}
                      />
                    </Tooltip>
                  </HStack>
                  {treatmentSubtypes &&
                    treatmentSubtypes
                      .filter((subtype) => subtype.treatment_type_id === treatment.id)
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
                              <IconButton
                                onClick={() => {
                                  setSubtypeToEdit(subtype);
                                  setIsEditSubtypeOpen(true);
                                }}
                                icon={<EditIcon />}
                              />
                            </Tooltip>
                            <Tooltip
                              label={`Ta bort ${subtype.name}`}
                              fontSize={'md'}
                              placement='right'
                              hasArrow
                            >
                              <IconButton
                                onClick={() => {
                                  setSubtypeToDelete(subtype);
                                  setIsDeleteSubtypeOpen(true);
                                }}
                                icon={<DeleteIcon />}
                              />
                            </Tooltip>
                          </HStack>
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
      {subtypeToEdit && (
        <ConfirmInput
          isOpen={isEditSubtypeOpen}
          onClose={handleCloseEditSubtype}
          onConfirm={handleEditSubtype}
          valueToConfirm={subtypeToEdit.name}
        />
      )}
      {subtypeToDelete && (
        <Confirm
          isOpen={isDeleteSubtypeOpen}
          onClose={handleCloseDeleteSubtype}
          header={'Ta bort underkategori'}
          body={`Är du säker på att du vill ta bort ${subtypeToDelete.name}?`}
          handleConfirm={handleDeleteSubtype}
        />
      )}
      {treatmentTypeToEdit && (
        <ConfirmInput
          isOpen={isEditTreatmentTypeOpen}
          onClose={handleCloseEditTreatmentType}
          onConfirm={handleEditTreatmentType}
          valueToConfirm={treatmentTypeToEdit.name}
        />
      )}
      {treatmentTypeToDelete && (
        <Confirm
          isOpen={isDeleteTreatmentTypeOpen}
          onClose={handleCloseDeleteTreatmentType}
          header={'Ta bort huvudkategori'}
          body={`Är du säker på att du vill ta bort ${treatmentTypeToDelete.name}?`}
          handleConfirm={handleDeleteTreatmentType}
        />
      )}
    </>
  );
}
