import {
  Button,
  Divider,
  HStack,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Text,
  VStack,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import GenericAccordion from '../../../components/GenericAccordion';
import { AddIcon, SearchIcon } from '@chakra-ui/icons';
import { IoIosCloseCircleOutline } from 'react-icons/io';

export default function Treatment({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const [searchTerms, setSearchTerms] = useState({});
  const [chosenTreatments, setChosenTreatments] = useState([]);

  useEffect(() => {
    console.log('chosenTreatments: ', chosenTreatments);
  }, [chosenTreatments]);

  const setupAccordions = () => {
    return (
      <GenericAccordion
        allowMultiple={true}
        variant={'edu_treatment_type'}
        accordionItems={Object.entries(stepData.treatments_to_display).map(([type, subTypes]) => ({
          heading: type,
          content: (
            <>
              <GenericAccordion
                allowMultiple={true}
                variant={'edu_treatment_subtype'}
                accordionItems={Object.entries(subTypes).map(([subType, treatments]) => ({
                  heading: subType,
                  content: (
                    <>
                      <InputGroup>
                        <InputLeftElement>
                          <SearchIcon />
                        </InputLeftElement>
                        <Input
                          placeholder='Sök...'
                          value={searchTerms[subType] ? searchTerms[subType] : ''}
                          variant='edu_input'
                          onChange={(e) =>
                            setSearchTerms((prevState) => {
                              const newState = { ...prevState };
                              newState[subType] = e.target.value;
                              return newState;
                            })
                          }
                        ></Input>
                        {searchTerms[subType] && (
                          <InputRightElement
                            onClick={(e) => {
                              setSearchTerms((prevState) => {
                                const newState = { ...prevState };
                                newState[subType] = '';
                                return newState;
                              });
                            }}
                          >
                            <IoIosCloseCircleOutline />
                          </InputRightElement>
                        )}
                      </InputGroup>
                      {treatments.map((treatment) => (
                        <HStack
                          key={treatment.id}
                          justifyContent='left'
                          paddingLeft='3%'
                          paddingTop='1%'
                          paddingBottom='1%'
                          onClick={() =>
                            setChosenTreatments((prevState) => {
                              let newState = [...prevState];
                              newState.push(treatment);
                              return newState;
                            })
                          }
                        >
                          <AddIcon />
                          <Text>{treatment.name}</Text>
                        </HStack>
                      ))}
                    </>
                  ),
                }))}
              />
            </>
          ),
        }))}
      />
    );
  };

  const getChosenTreatments = () => {
    return chosenTreatments.map((treatment) => <Text>{treatment.name}</Text>);
  };

  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };
  return (
    <>
      <VStack spacing='5'>
        <Text align='left'>{stepData.prompt}</Text>

        <Divider variant='edu' />

        <Heading size='sm'>Välj behandlingar från listan:</Heading>
        {setupAccordions()}

        {chosenTreatments.length > 0 && (
          <>
            <Divider variant='edu' />

            {getChosenTreatments()}
          </>
        )}

        {isFinished === false && <Button onClick={finishStep}>Klart!!!</Button>}
      </VStack>
    </>
  );
}
