import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Heading,
  Stack,
  Input,
  Button,
  Box,
  Text,
  Select,
  useToast,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useExamination } from '../hooks/useExamination';

export default function ManageExaminationSubtypes({ onAdd, update }) {
  const [value, setValue] = useState('');
  const [examinationType, setExaminationType] = useState();
  const { examinationTypes, getExaminationTypes } = useExamination();
  const toast = useToast();

  const fetchExaminationTypes = async () => {
    await getExaminationTypes();
  };
  useEffect(() => {
    fetchExaminationTypes();
  }, [update]);

  const handleAddExaminationType = () => {
    if (value && examinationType) {
      setValue('');
      setExaminationType('');
      onAdd(value, examinationType);
    } else {
      toast({
        title: 'Värde saknas',
        description: 'Fyll i namn och kategori',
        status: 'warning',
        duration: 2000,
        isClosable: true,
        position: 'top',
      });
    }
  };
  return (
    <Card>
      <CardHeader>
        <Heading as={'h3'} size={'md'}>
          {' '}
          Ny underkategori
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {' '}
          <Box>
            <Text mb={4} textAlign='left'>
              {' '}
              Skriv in namnet på en ny underkategori.
            </Text>
          </Box>
          <Input
            placeholder='Ny underkategori...'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <Select
            placeholder='Välj huvudkategori...'
            onChange={(e) => setExaminationType(e.target.value)}
          >
            {examinationTypes &&
              examinationTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </Select>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddExaminationType}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
