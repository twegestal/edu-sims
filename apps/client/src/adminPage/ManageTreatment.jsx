import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { DeleteIcon } from '@chakra-ui/icons';
import { useTreatment } from '../hooks/useTreatment';

export default function ManageTreatment() {
  const { treatmentTypes, getTreatmentTypes } = useTreatment();

  useEffect(() => {
    const fetchTreatments = async () => {
      await getTreatmentTypes();
    };
    fetchTreatments();
  }, []);
  
  return (
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
          {treatmentTypes &&
            treatmentTypes.map((treatment) => (
              <Tr key={treatment.id}>
                <Td>{treatment.name}</Td>
                <Td>
                  <Button colorScheme='blue'>Ändra</Button>
                </Td>
                <Td>
                  <Button colorScheme='red'>
                    <DeleteIcon />
                  </Button>
                </Td>
              </Tr>
            ))}
        </Tbody>
      </Table>
    </TableContainer>
  );
}
