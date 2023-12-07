import { Table, Thead, Tbody, Tr, Th, Td, TableContainer, Button } from '@chakra-ui/react';
import { useEffect } from 'react';
import { useDiagnosis } from '../hooks/useDiagnosis';
import { DeleteIcon } from '@chakra-ui/icons';

export default function ManageDiagnosis() {
  const { diagnosisList, getDiagnosisList } = useDiagnosis();

  useEffect(() => {
    const fetchDiagnosis = async () => {
      await getDiagnosisList();
    };
    fetchDiagnosis();
  }, []);

  return (
    <TableContainer>
      <Table variant={'simple'}>
        <Thead>
          <Tr>
            <Th>Diagnos</Th>
            <Th>Ändra</Th>
            <Th>Ta bort</Th>
          </Tr>
        </Thead>
        <Tbody>
          {diagnosisList &&
            diagnosisList.map((diagnosis) => (
              <Tr key={diagnosis.id}>
                <Td>{diagnosis.name}</Td>
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
