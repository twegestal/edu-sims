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
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@chakra-ui/react';
import { useState } from 'react';

export default function ManageExaminationTypes({ onAdd }) {
  const [value, setValue] = useState('');
  const [isError, setIsError] = useState();

  const handleAddExaminationType = () => {
    if (value) {
      setValue('');
      onAdd(value);
    } else {
      setIsError(true);
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
          <FormControl isRequired isInvalid={isError}>
            <FormLabel>Fyll i namnet på ny huvudkategorin</FormLabel>
            <Input
              placeholder='Ny huvudkategori...'
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                setIsError(false);
              }}
            />
            {isError && <FormErrorMessage>Huvudkategori måste fyllas i</FormErrorMessage>}
          </FormControl>
        </Stack>
      </CardBody>
      <CardFooter>
        <Button onClick={handleAddExaminationType}>Lägg till</Button>
      </CardFooter>
    </Card>
  );
}
