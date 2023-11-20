import {
  Button,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';



export default function StartCase(props) {
    const { user } = useAuth();
    const { createAttempt } = useCases();


  const postToAttempt = () => {
    createAttempt(user.id, props.caseId,)
  };


return (
    <Link to={'/case/caseid=' + props.caseId}>
    <Button onClick={postToAttempt} colorScheme='teal' marginBottom='5%'>Starta fallet</Button>
    </Link>
);
}
