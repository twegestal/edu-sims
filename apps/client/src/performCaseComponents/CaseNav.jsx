import { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
  Button,
  Flex,
  Text,
} from '@chakra-ui/react';
import { FaNotesMedical } from 'react-icons/fa';
import { AiFillHome } from 'react-icons/ai';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { MdFeedback } from 'react-icons/md';
import { BiTestTube } from 'react-icons/bi';
import { Editor } from '@tinymce/tinymce-react';
import './PerformCase.css';

export default function CaseNav(props) {
  const editorRef = useRef(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    window.addEventListener('scroll', listenToScroll);
    return () => window.removeEventListener('scroll', listenToScroll);
  }, []);

  const listenToScroll = () => {
    let heightToHideFrom = 10;
    const winScroll = document.body.scrollTop || document.documentElement.scrollTop;

    if (winScroll > heightToHideFrom) {
      isVisible && // to limit setting state only the first time
        setIsVisible(false);
    } else {
      setIsVisible(true);
    }
  };

  return (
    <nav id='caseNav'>
      <Box
        display='flex'
        alignItems='center'
        justifyContent='space-between'
        bg='brand.bg'
        padding={'7px'}
      >
        <div className='Notes'>
          {isVisible && <Text fontSize={'xs'}>Anteckningar</Text>}
          <IconButton
            onClick={props.onNotesOpen}
            variant='caseNav'
            colorScheme='blue'
            aria-label='Notes'
            fontSize='20px'
            icon={<FaNotesMedical />}
          />
          <Modal isOpen={props.isNotesOpen} onClose={props.onNotesClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Anteckningar</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Editor
                  apiKey='f20f7hhnsnotsjt5l3nxit8s7mxfmgoncdx2smt22tl5k8es'
                  onInit={(evt, editor) => (editorRef.current = props.editor)}
                  init={{
                    plugins:
                      'autolink  emoticons image link lists table  wordcount  tableofcontents ',
                    toolbar:
                      'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                  }}
                  initialValue={props.notes}
                />
                <Button onClick={props.saveNotes}>Spara anteckningar</Button>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={props.onNotesClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className='Desc'>
          {isVisible && <Text fontSize={'xs'}>Fallbeskrivning</Text>}
          <IconButton
            onClick={props.onDescOpen}
            variant='caseNav'
            colorScheme='blue'
            aria-label='Description'
            fontSize='20px'
            icon={<BsFileEarmarkPerson />}
          />
          <Modal isOpen={props.isDescOpen} onClose={props.onDescClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Beskrivning</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{props.description}</ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={props.onDescClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className='Feedback'>
          {isVisible && <Text fontSize={'xs'}>Feedback</Text>}
          <IconButton
            onClick={props.onFeedbackOpen}
            variant='caseNav'
            colorScheme='blue'
            aria-label='Feedback'
            fontSize='20px'
            icon={<MdFeedback />}
          />
          <Modal isOpen={props.isFeedbackOpen} onClose={props.onFeedbackClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Feedback</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Flex direction='column' rowGap='2'>
                  {props.feedback}
                </Flex>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={props.onFeedbackClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className='TreatmentResults'>
          {isVisible && <Text fontSize={'xs'}>Labbresultat</Text>}
          <IconButton
            onClick={props.onTreatmentResultsOpen}
            variant='caseNav'
            colorScheme='blue'
            aria-label='Results'
            fontSize='20px'
            icon={<BiTestTube />}
          />
          <Modal isOpen={props.isTreatmentResultsOpen} onClose={props.onTreatmentResultsClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Labbtester</ModalHeader>
              <ModalCloseButton />
              <ModalBody>{props.treatmentResults}</ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={props.onTreatmentResultsClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
        <div className='Home'>
          {isVisible && <Text fontSize={'xs'}>Hem</Text>}
          <IconButton
            onClick={props.onHomeOpen}
            variant='caseNav'
            colorScheme='blue'
            aria-label='Home'
            fontSize='20px'
            icon={<AiFillHome />}
          />
          <Modal isOpen={props.isHomeOpen} onClose={props.onHomeClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Är du säker på att du vill avsluta</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <Link to='/'>
                  <Button>Avsluta</Button>
                </Link>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={props.onHomeClose}>
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </div>
      </Box>
    </nav>
  );
}
