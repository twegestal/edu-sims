import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Select,
  Heading,
  Spacer,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCases } from '../hooks/useCases';
import { useNavigate } from 'react-router-dom';
import Confirm from '../components/Confirm.jsx';

export default function CaseDetails({ onSave, onUpdate, setMedicalFieldId, caseDetailsData }) {
  const [caseName, setCaseName] = useState();
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
  const [selectedMedicalField, setSelectedMedicalField] = useState('');

  const { medicalFields, getMedicalFields } = useCases();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      await getMedicalFields();
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (caseDetailsData) {
      setCaseName(caseDetailsData?.caseName || '');
      setSelectedMedicalField(caseDetailsData?.medicalFieldId || '');
    }
  }, [caseDetailsData]);

  const handleCloseConfirm = () => {
    setIsConfirmExitOpen(false);
  };

  const handleConfirmAbort = () => {
    setIsConfirmExitOpen(false);
    return navigate('/manageCases');
  };

  const handleChangeMedicalField = (e) => {
    setSelectedMedicalField(e.target.value);
    setMedicalFieldId(e.target.value);
  };

  return (
    <>
      <VStack
        minH='100vh'
        w='33%'
        bg='gray.100'
        p={4}
        boxShadow='md'
        spacing={4}
        align='stretch'
        borderRadius={4}
        marginRight={'1%'}
      >
        <Heading as={'h1'} size={'lg'}>
          Falldetaljer
        </Heading>
        <FormControl>
          <FormLabel>Namn på fallet</FormLabel>
          <Input
            autocomplete='off'
            value={caseName}
            placeholder='Fyll i namnet på fallet'
            onChange={(e) => setCaseName(e.target.value)}
          ></Input>

          <FormLabel>Medicinskt område</FormLabel>
          <Select
            placeholder='Välj ett område'
            onChange={handleChangeMedicalField}
            value={selectedMedicalField}
          >
            {medicalFields &&
              medicalFields.map((medicalField) => (
                <option key={medicalField.id} value={medicalField.id}>
                  {medicalField.name}
                </option>
              ))}
          </Select>
        </FormControl>
        <Spacer />
        {caseDetailsData ? (
          <Button onClick={() => onUpdate(caseName)}>Uppdatera fallet</Button>
        ) : (
          <Button onClick={() => onSave(caseName)}>Spara fallet</Button>
        )}
        <Button onClick={() => setIsConfirmExitOpen(true)}>Avsluta utan att spara</Button>
      </VStack>

      <Confirm
        isOpen={isConfirmExitOpen}
        onClose={handleCloseConfirm}
        header={'Avsluta'}
        body={'Är du säker på att vill avsluta utan att spara?'}
        handleConfirm={handleConfirmAbort}
      />
    </>
  );
}
