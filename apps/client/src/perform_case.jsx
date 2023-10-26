import { useState, useEffect, useRef } from "react";
import { useParams, Link } from 'react-router-dom';
import {
IconButton,
Box,
Modal,
ModalOverlay,
ModalContent,
ModalHeader,
ModalFooter,
ModalBody,
ModalCloseButton,
useDisclosure,
Button
} from '@chakra-ui/react';
import { FaNotesMedical } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import {BsFileEarmarkPerson} from 'react-icons/bs';
import {MdFeedback} from 'react-icons/md';
import {BiTestTube} from 'react-icons/bi';
import Introduction from './introduction.jsx'
import Diagnosis from './diagnosis.jsx'
import { Editor } from '@tinymce/tinymce-react';


export default function PerformCase(props) {

    let { caseid } = useParams()
    caseid = caseid.split('caseid=')[1]
    const { isOpen : isNotesOpen, onOpen: onNotesOpen, onClose : onNotesClose } = useDisclosure();
    const { isOpen : isHomeOpen, onOpen: onHomeOpen, onClose : onHomeClose } = useDisclosure();
    const { isOpen : isDescOpen, onOpen: onDescOpen, onClose : onDescClose } = useDisclosure();
    const { isOpen : isFeedbackOpen, onOpen: onFeedbackOpen, onClose : onFeedbackClose } = useDisclosure();
    const { isOpen : isTreatmentResultsOpen, onOpen: onTreatmentResultsOpen, onClose : onTreatmentResultsClose } = useDisclosure();
    const [caseList, setCaseList] = useState([]);
    const  [currentStep, setCurrentStep] = useState({})
    const [currentIndex, setCurrentIndex] = useState()
    const [displayFeedback, setDisplayFeedback] = useState(false);
    const [description, setDescription] = useState('')
    const [notes, setNotes] = useState('')
    const [feedback, setFeedback] = useState('')
    const [treatmentResults, setTreatmentResults] = useState('')
    const editorRef = useRef(null);



    useEffect(() => {
        const getCaseList = async (event) => {
            
            const headers = {
                "Content-type" : "application/json",
                "case_id" : caseid
            }
            const caseListFromApi = await props.getCallToApi('http://localhost:5173/api/case/getCaseById', headers);

            setCaseList(caseListFromApi)
            setCurrentStep(caseListFromApi[0])
            setCurrentIndex(caseListFromApi[0].index)
        };

        getCaseList();
    }, []); 

    const nextStep = async (event) => {

        let nextIndex = currentIndex + 1

        let indexOfNextStep = caseList.findIndex(x => x.index === nextIndex);

        setCurrentStep(caseList[indexOfNextStep])
        setCurrentIndex(caseList[indexOfNextStep].index)
    }


    const saveNotes = () => {
    /*Saves text from the text editor to the notes variable */
        if (editorRef.current) {
        setNotes(editorRef.current.getContent())
        }
    };

    return (
        <>
            <nav>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <div className="Notes">
                        <IconButton
                        onClick={onNotesOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Notes'
                        fontSize='20px'
                        icon={<FaNotesMedical />}
                        />
                        <Modal isOpen={isNotesOpen} onClose={onNotesClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Anteckningar</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Editor
                                    apiKey='f20f7hhnsnotsjt5l3nxit8s7mxfmgoncdx2smt22tl5k8es'
                                    onInit={(evt, editor) => editorRef.current = editor}
                                    init={{
                                        plugins: 'ai tinycomments mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
                                        toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                        tinycomments_mode: 'embedded',
                                        tinycomments_author: 'Author name',
                                        mergetags_list: [
                                        { value: 'First.Name', title: 'First Name' },
                                        { value: 'Email', title: 'Email' },
                                        ],
                                        ai_request: (request, respondWith) => respondWith.string(() => Promise.reject("See docs to implement AI Assistant")),
                                    }}
                                    initialValue={notes}
                                    />
                                    <Button onClick={saveNotes}>Spara anteckningar</Button>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onNotesClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div className="Home">
                        <IconButton
                        onClick={onHomeOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Home'
                        fontSize='20px'
                        icon={<AiFillHome />}
                        />
                        <Modal isOpen={isHomeOpen} onClose={onHomeClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Är du säker på att du vill avsluta</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <Link to="/">
                                        <Button>Avsluta</Button>
                                    </Link>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onHomeClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div className="Desc">
                        <IconButton
                        onClick={onDescOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Description'
                        fontSize='20px'
                        icon={<BsFileEarmarkPerson />}
                        />
                        <Modal isOpen={isDescOpen} onClose={onDescClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Beskrivning</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    {description}
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onDescClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div className="Feedback">
                        <IconButton
                        onClick={onFeedbackOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Feedback'
                        fontSize='20px'
                        icon={<MdFeedback />}
                        />
                        <Modal isOpen={isFeedbackOpen} onClose={onFeedbackClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Feedback</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    {feedback}
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onFeedbackClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div className="TreatmentResults">
                        <IconButton
                        onClick={onTreatmentResultsOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Results'
                        fontSize='20px'
                        icon={<BiTestTube />}
                        />
                        <Modal isOpen={isTreatmentResultsOpen} onClose={onTreatmentResultsClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Labbtester</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    {treatmentResults}
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onTreatmentResultsClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </Box>
            </nav>
            <p>CASE</p>
            {currentStep.module_type_identifier == 0 &&
                <div>
                    <Introduction
                        getCallToApi = {props.getCallToApi}
                        stepId = {currentStep.step_id}
                        caseData = {caseList}
                        displayFeedback = {displayFeedback}
                        setDisplayFeedback = {setDisplayFeedback}
                        setDescription = {setDescription}
                        setFeedback = {setFeedback}
                    ></Introduction>
                </div>
            }
            {currentStep.module_type_identifier == 1 &&
                <div>
                    <p>Examination</p>
                </div>
            }
            {currentStep.module_type_identifier == 2 &&
                <div>
                    <Diagnosis
                        getCallToApi = {props.getCallToApi}
                        stepId = {currentStep.step_id}
                        displayFeedback = {displayFeedback}
                        setDisplayFeedback = {setDisplayFeedback}
                        setFeedback = {setFeedback}
                        feedback = {feedback}
                    ></Diagnosis>
                </div>
            }
            {currentStep.module_type_identifier == 3 &&
                <div>
                    <p>Behandling</p>
                </div>
            }
            {currentStep.module_type_identifier == 4 &&
                <div>
                    <p>Sammanfattning</p>
                </div>
            }
            {currentIndex + 1 <= caseList.length -1 && displayFeedback &&
                <Button onClick={nextStep} >Nästa</Button>
            }
            {currentIndex + 1 > caseList.length -1 &&
                <Link to="/"><Button>Avsluta</Button></Link>
            }
        </>
        
    );
}