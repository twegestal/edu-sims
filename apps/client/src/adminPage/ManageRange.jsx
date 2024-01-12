import {
  FormControl,
  IconButton,
  Input,
  Table,
  TableContainer,
  Tbody,
  Td,
  Th,
  Thead,
  Tooltip,
  Tr,
  useToast,
} from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useExamination } from '../hooks/useExamination';
import { EditIcon } from '@chakra-ui/icons';
import ConfirmRange from './ConfirmRange';

export default function ManageRange({ update }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [examinationToEdit, setExaminationToEdit] = useState();
  const [isConfirmRangeOpen, setIsConfirmRangeOpen] = useState(false);
  const { examinationList, getExaminationList, editExaminationRange } = useExamination();
  const toast = useToast();

  const fetchExaminations = async () => {
    await getExaminationList();
  };

  useEffect(() => {
    fetchExaminations();
  }, []);

  useEffect(() => {
    fetchExaminations();
  }, [update]);

  const filteredList = searchTerm
    ? examinationList.filter((examination) =>
        examination.name.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : examinationList;

  const handleCloseConfirmRange = () => {
    setIsConfirmRangeOpen(false);
    setExaminationToEdit(null);
  };

  const handleEditExaminationRange = async (min, max, unit) => {
    setIsConfirmRangeOpen(false);
    const response = await editExaminationRange(examinationToEdit.id, min, max, unit);
    if (response) {
      showToast(
        'Utredning uppdaterad',
        `Värden för ${examinationToEdit.name} har uppdaterats`,
        'success',
      );
      await fetchExaminations();
    } else {
      showToast(
        'Någonting gick fel',
        `Någonting gick fel och ${examinationToEdit.name} kunde inte uppdateras`,
        'error',
      );
    }
    setExaminationToEdit(null);
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
      {examinationList && (
        <FormControl>
          <Input
            autoComplete='off'
            marginBottom={'5px'}
            placeholder='Sök efter en utredning...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </FormControl>
      )}

      <TableContainer>
        <Table variant={'simple'}>
          <Thead>
            <Tr>
              <Th>Utredning</Th>
              <Th>Undre gräns</Th>
              <Th>Övre gräns</Th>
              <Th>Enhet</Th>
              <Th>Ändra</Th>
            </Tr>
          </Thead>
          <Tbody>
            {examinationList &&
              filteredList.map((examination) => (
                <Tr key={examination.id}>
                  <Td>{examination.name}</Td>
                  <Td>{examination.min_value}</Td>
                  <Td>{examination.max_value}</Td>
                  <Td>{examination.unit}</Td>
                  <Td>
                    <Tooltip
                      label={`Ändra värden för ${examination.name}`}
                      fontSize={'md'}
                      placement='left'
                      hasArrow
                    >
                      <IconButton
                        onClick={() => {
                          setExaminationToEdit(examination);
                          setIsConfirmRangeOpen(true);
                        }}
                        icon={<EditIcon />}
                      />
                    </Tooltip>
                  </Td>
                </Tr>
              ))}
          </Tbody>
        </Table>
      </TableContainer>
      {examinationToEdit && (
        <ConfirmRange
          isOpen={isConfirmRangeOpen}
          onClose={handleCloseConfirmRange}
          minProp={examinationToEdit.min_value}
          maxProp={examinationToEdit.max_value}
          unitProp={examinationToEdit.unit}
          name={examinationToEdit.name}
          onConfirm={handleEditExaminationRange}
        />
      )}
    </>
  );
}
