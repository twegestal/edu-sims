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


export default function PerformCase(props) {

    let { caseid } = useParams()
    const { isOpen : isNotesOpen, onOpen: onNotesOpen, onClose : onNotesClose } = useDisclosure();
    const { isOpen : isHomeOpen, onOpen: onHomeOpen, onClose : onHomeClose } = useDisclosure();
    const { isOpen : isDescOpen, onOpen: onDescOpen, onClose : onDescClose } = useDisclosure();
    const { isOpen : isFeedbackOpen, onOpen: onFeedbackOpen, onClose : onFeedbackClose } = useDisclosure();
    const { isOpen : isTestOpen, onOpen: onTestOpen, onClose : onTestClose } = useDisclosure();



    return (
        <>
            <nav>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                    <div class="Notes">
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
                                    <p>Anteckning</p>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onNotesClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div class="Home">
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
                    <div class="Desc">
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
                                    <p>Beskrivning</p>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onDescClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div class="Feedback">
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
                                    <p>Feedback</p>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onFeedbackClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                    <div class="Tests">
                        <IconButton
                        onClick={onTestOpen}
                        variant='solid'
                        colorScheme='blue'
                        aria-label='Results'
                        fontSize='20px'
                        icon={<BiTestTube />}
                        />
                        <Modal isOpen={isTestOpen} onClose={onTestClose}>
                            <ModalOverlay />
                            <ModalContent>
                                <ModalHeader>Labbtester</ModalHeader>
                                <ModalCloseButton />
                                <ModalBody>
                                    <p>Resultat</p>
                                </ModalBody>

                                <ModalFooter>
                                    <Button colorScheme='blue' mr={3} onClick={onTestClose}>
                                    Close
                                    </Button>
                                </ModalFooter>
                            </ModalContent>
                        </Modal>
                    </div>
                </Box>
            </nav>
            <p>CASE {caseid}</p>
        </>
        
    );
}