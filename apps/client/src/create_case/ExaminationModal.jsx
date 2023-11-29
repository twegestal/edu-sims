import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Heading,
  Checkbox,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react';
import { useState, useEffect } from 'react';
import { useCreateCase } from '../hooks/useCreateCase';
import LoadingSkeleton from '../loadingSkeleton';
import Confirm from '../components/Confirm';

export default function ExaminationModal({ isOpen, onClose, moduleData }) {
  const [loading, setLoading] = useState(true);
  const moduleTypeIdentifier = 1;
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const [prompt, setPrompt] = useState('Fyll i din uppmaning till användaren');
  const [examinationToDisplay, setExaminationToDisplay] = useState({});
  const [stepSpecificValues, setStepSpecificValues] = useState([]);
  const [feedbackCorrect, setFeedbackCorrect] = useState('Fyll i feedback för korrekt svar');
  const [feedbackIncorrect, setFeedbackIncorrect] = useState('Fyll i feedback för inkorrekt svar');
  const [maxNbrTests, setMaxNbrTests] = useState(0);

  const [examinationCategories, setExaminationCategories] = useState();
  const [examinationSubcategories, setExaminationSubcategories] = useState();
  const [examinationList, setExaminationList] = useState();
  const { getAllExaminationTypes, getAllExaminationSubtypes, getExaminationList } = useCreateCase();

  const clearContent = () => {
    setPrompt('');
    setExaminationToDisplay({});
    setStepSpecificValues([]);
    setFeedbackCorrect('');
    setFeedbackIncorrect('');
    setMaxNbrTests(0);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      const id = '';
      const categories = await getAllExaminationTypes(id);
      const categoryMap = {};
      const subCategoryMap = {};
      const examinationsMap = {};

      for (let i = 0; i < categories.length; i++) {
        categoryMap[categories[i].id] = categories[i].name;

        const subcategories = await fetchSubcategories(categories[i].id);
        let subcategoryObject = {};
        for (let j = 0; j < subcategories.length; j++) {
          subcategoryObject[subcategories[j].id] = subcategories[j].name;

          const examinations = await fetchExaminations(subcategories[j].id);
          let examinationsArray = [];
          for (let k = 0; k < examinations.length; k++) {
            let newEntry = {
              id: examinations[k].id,
              name: examinations[k].name,
            };
            examinationsArray.push(newEntry);
            examinationsMap[subcategories[j].id] = examinationsArray;
          }
        }
        subCategoryMap[categories[i].id] = subcategoryObject;
      }

      setExaminationCategories(categoryMap);
      setExaminationSubcategories(subCategoryMap);
      setExaminationList(examinationsMap);

      setLoading(false);
    };

    fetchCategories();
  }, []);

  const fetchSubcategories = async (id) => {
    const response = await getAllExaminationSubtypes(id);
    return response;
  };

  const fetchExaminations = async (examinationSubtypeId) => {
    const response = await getExaminationList(examinationSubtypeId);

    return response;
  };

  const handleCloseConfirm = () => {
    setIsConfirmOpen(false);
  };

  const buildStep = () => {
    const stepData = {
      module_type_identifier: moduleTypeIdentifier,
      prompt: prompt,
      examination_to_display: examinationToDisplay,
      step_specific_values: stepSpecificValues,
      feedback_correct: feedbackCorrect,
      feedback_incorrect: feedbackIncorrect,
      max_nbr_tests: maxNbrTests,
    };

    onClose(stepData);
  };

  const updateExaminationTypesToDisplayGammel = (checkBox, examinationTypeId) => {
    if (checkBox.checked) {
      const examinationsMap = examinationToDisplay;

      if (examinationsMap[examinationTypeId] instanceof Array) {
        examinationsMap[examinationTypeId] = [...examinationsMap[examinationTypeId], checkBox.id];

        setExaminationToDisplay(examinationsMap);
      } else {
        examinationsMap[examinationTypeId] = [checkBox.id];

        setExaminationToDisplay(examinationsMap);
      }
    } else {
      const examinationsMap = examinationToDisplay;
      let subTypesArray = examinationsMap[examinationTypeId];
      subTypesArray = subTypesArray.filter((id) => id !== checkBox.id);

      examinationsMap[examinationTypeId] = subTypesArray;

      if (subTypesArray.length > 0) {
        setExaminationToDisplay({ ...examinationToDisplay, examinationsMap });
      } else {
        delete examinationsMap[examinationTypeId];

        setExaminationToDisplay({ ...examinationToDisplay, examinationsMap });
      }
    }
  };

  const updateExaminationTypesToDisplay = (checkBox, examinationTypeId) => {
    setExaminationToDisplay((prevExaminationToDisplay) => {
      const newExaminationToDisplay = { ...prevExaminationToDisplay };

      if (checkBox.checked) {
        newExaminationToDisplay[examinationTypeId] = [
          ...(newExaminationToDisplay[examinationTypeId] || []),
          checkBox.id,
        ];
      } else {
        newExaminationToDisplay[examinationTypeId] = (
          newExaminationToDisplay[examinationTypeId] || []
        ).filter((id) => id !== checkBox.id);

        if (newExaminationToDisplay[examinationTypeId].length === 0) {
          delete newExaminationToDisplay[examinationTypeId];
        }
      }

      return newExaminationToDisplay;
    });
  };

  return (
    <>
      {loading ? (
        <LoadingSkeleton />
      ) : (
        <>
          <Modal isOpen={isOpen} onClose={buildStep}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Utredning</ModalHeader>

              <ModalBody>
                <FormControl>
                  <FormLabel>Uppmaning</FormLabel>
                  <Textarea value={prompt} onChange={(e) => setPrompt(e.target.value)}></Textarea>

                  <FormLabel>Utredningar att visa för användare</FormLabel>
                  {Object.entries(examinationCategories).map(([categoryId, name]) => (
                    <div key={'div' + categoryId}>
                      <Heading as='h3' size='sm' key={categoryId}>
                        {name}
                      </Heading>

                      {Object.entries(examinationSubcategories[categoryId]).map(
                        ([subcategoryId, subcategoryName]) => (
                          <VStack alignItems='flex-start' key={subcategoryId}>
                            <Checkbox
                              key={'checkbox' + subcategoryId}
                              id={subcategoryId}
                              onChange={(e) =>
                                updateExaminationTypesToDisplay(e.target, categoryId)
                              }
                            >
                              {subcategoryName}
                            </Checkbox>
                          </VStack>
                        ),
                      )}
                    </div>
                  ))}

                  <FormLabel>Utredningar som ska köras av användaren</FormLabel>
                  {Object.entries(examinationToDisplay).map(([categoryId]) => (
                    <div key={'div' + categoryId}>
                      {/* byt ut mot accordionItem för huvudkategori eller behåll det som en heading/label? */}
                      <Heading key={categoryId} as='h3' size='md'>
                        {examinationCategories[categoryId]}
                      </Heading>

                      {examinationToDisplay[categoryId].map((subCategoryId) => (
                        <div key={'denna div är här just nu pga kommentarer :)' + subCategoryId}>
                          {/* byt ut mot accordionItem för underkategori eller behåll det som en heading/label? */}
                          <Heading key={subCategoryId} as='h4' size='sm'>
                            {examinationSubcategories[categoryId][subCategoryId]}
                          </Heading>

                          {/* Här nere behöver vi göra en mappning av examinationList[subCategoryId] för att få ut faktiska utredningar.
                              Varje element kommer vara ett objekt som har .id och .name så vi kan knyta id till ngt smart och skriva ut namnet*/}
                          {examinationList[subCategoryId].map((examination) => (
                            <Heading key={examination.id} as='h5' size='xs'>
                              {examination.name}
                            </Heading>
                          ))}
                        </div>
                      ))}
                    </div>
                  ))}

                  <FormLabel>Max antal test</FormLabel>
                  <NumberInput
                    value={maxNbrTests}
                    onChange={(valueAsNumber) => setMaxNbrTests(valueAsNumber)}
                  >
                    <NumberInputField />
                    <NumberInputStepper>
                      <NumberIncrementStepper />
                      <NumberDecrementStepper />
                    </NumberInputStepper>
                  </NumberInput>

                  <FormLabel>Korrekt feedback</FormLabel>
                  <Textarea
                    value={feedbackCorrect}
                    onChange={(e) => setFeedbackCorrect(e.target.value)}
                  ></Textarea>

                  <FormLabel>Inkorrekt feedback</FormLabel>
                  <Textarea
                    value={feedbackIncorrect}
                    onChange={(e) => setFeedbackIncorrect(e.target.value)}
                  ></Textarea>
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <Button onClick={buildStep}>Spara ändringar</Button>

                <Button onClick={clearContent}>Rensa</Button>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Confirm
            isOpen={isConfirmOpen}
            onClose={handleCloseConfirm}
            header={'Rensa information'}
            body={'Är du säker på att du vill rensa informationen?'}
            handleConfirm={clearContent}
          />
        </>
      )}
    </>
  );
}
