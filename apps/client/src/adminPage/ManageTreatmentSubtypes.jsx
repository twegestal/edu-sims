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
import { useTreatment } from '../hooks/useTreatment';

export default function ManageTreatmentSubtypes({ onAdd, update }) {
  const [value, setValue] = useState('');
  const [treatmentType, setTreatmentType] = useState();
  const { treatmentTypes, getTreatmentTypes } = useTreatment();
  const toast = useToast();

  const fetchTreatmentTypes = async () => {
    await getTreatmentTypes();
  };
  useEffect(() => {
    fetchTreatmentTypes();
  }, [update]);

  const handleAddTreatmentSubtype = () => {
    if (value && treatmentType) {
      setValue('');
      setTreatmentType('');
      onAdd(value, treatmentType);
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
            onChange={(e) => setTreatmentType(e.target.value)}
          >
            {treatmentTypes &&
              treatmentTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
          </Select>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddTreatmentSubtype}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
