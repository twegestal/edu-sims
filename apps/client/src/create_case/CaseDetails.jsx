import {
  FormControl,
  FormLabel,
  Input,
  VStack,
  Button,
  Select,
  Heading,
  Spacer,
  ButtonGroup,
  FormErrorMessage,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCases } from '../hooks/useCases';
import { useNavigate } from 'react-router-dom';
import Confirm from '../components/Confirm.jsx';

export default function CaseDetails({ onSave, onUpdate, setMedicalFieldId, caseDetailsData }) {
  const [caseName, setCaseName] = useState();
  const [isConfirmExitOpen, setIsConfirmExitOpen] = useState(false);
  const [selectedMedicalField, setSelectedMedicalField] = useState('');
  const [caseNameError, setCaseNameError] = useState();
  const [medicalFieldError, setMedicalFieldError] = useState();

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
    setMedicalFieldError(false);
  };

  const handleSave = () => {
    if (caseName && selectedMedicalField) {
      onSave(caseName);
    } else {
      if (!caseName) {
        setCaseNameError(true);
      }

      if (!selectedMedicalField) {
        setMedicalFieldError(true);
      }
    }
  };

  const handleUpdate = () => {
    if (caseName && selectedMedicalField) {
      onUpdate(caseName);
    } else {
      if (!caseName) {
        setCaseNameError(true);
      }

      if (!selectedMedicalField) {
        setMedicalFieldError(true);
      }
    }
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
        <FormControl isRequired isInvalid={caseNameError}>
          <FormLabel>Namn på fallet</FormLabel>
          <Input
            autocomplete='off'
            value={caseName}
            placeholder='Fyll i namnet på fallet'
            onChange={(e) => {
              setCaseName(e.target.value);
              setCaseNameError(false);
            }}
          ></Input>
          {caseNameError && (
            <FormErrorMessage>Du måste fylla i ett namn för fallet</FormErrorMessage>
          )}
        </FormControl>
        <FormControl isRequired isInvalid={medicalFieldError}>
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
          {medicalFieldError && (
            <FormErrorMessage>Du måste välja ett medicinskt område för fallet</FormErrorMessage>
          )}
        </FormControl>
        <Spacer />
        <ButtonGroup marginBottom={'30%'}>
          {caseDetailsData ? (
            <Button onClick={handleUpdate}>Uppdatera fallet</Button>
          ) : (
            <Button onClick={handleSave}>Spara fallet</Button>
          )}
          <Button onClick={() => setIsConfirmExitOpen(true)}>Avsluta utan att spara</Button>
        </ButtonGroup>
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
