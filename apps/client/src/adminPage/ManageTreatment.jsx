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
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { DeleteIcon, EditIcon, AddIcon } from '@chakra-ui/icons';
import { useTreatment } from '../hooks/useTreatment';
import ManageTreatmentTypes from './ManageTreatmentTypes';
import ManageTreatmentSubtypes from './ManageTreatmentSubtypes';

export default function ManageTreatment({}) {
  const [newTreatment, setNewTreatment] = useState({});
  const {
    treatmentTypes,
    getTreatmentTypes,
    treatmentSubtypes,
    getTreatmentSubTypes,
    treatmentList,
    getTreatmentList,
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

  const handleAddTreatment = (subtypeId) => {};

  const handleAddTreatmentType = (treatmentType) => {};

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
                              onClick={() => handleAddTreatment(field.id)}
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
                                    .map((subtype) => (
                                      <Tr key={subtype.id}>
                                        <Td>{subtype.name}</Td>
                                        <Td>
                                          <IconButton icon={<EditIcon />} />
                                        </Td>
                                        <Td>
                                          <IconButton icon={<DeleteIcon />} />
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
          <ManageTreatmentSubtypes />
        </VStack>
        {/* <Box gridColumn={'span 1'} position={'sticky'} top={'0'} height={'fit-content'}>
          <ManageTreatmentTypes onAdd={handleAddTreatmentType} />
        </Box> */}
      </Grid>
    </>
  );
}
