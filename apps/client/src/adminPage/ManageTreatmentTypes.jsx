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
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ManageTreatmentTypes({ onAdd }) {
  const [value, setValue] = useState('');
  const toast = useToast();

  const handleAddTreatmentType = () => {
    if (value) {
      setValue('');
      onAdd(value);
    } else {
      toast({
        title: 'Värde saknas',
        description: 'Fyll i namn för ny kategori',
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
          Ny huvudkategori
        </Heading>
      </CardHeader>
      <CardBody>
        <Stack spacing={4}>
          {' '}
          <Box>
            <Text mb={4} textAlign='left'>
              {' '}
              Skriv in namnet på en ny huvudkategori.
            </Text>
          </Box>
          <Input
            placeholder='Ny huvudkategori...'
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddTreatmentType}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
