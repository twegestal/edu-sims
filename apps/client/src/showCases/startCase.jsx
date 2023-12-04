import { Button } from '@chakra-ui/react';
import { Link, useNavigate, redirect } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';

export default function StartCase(props) {
  const { user } = useAuth();
  const { createAttempt } = useCases();
  const navigate = useNavigate();

  const postToAttemptNoReload = async () => {
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, props.caseId);
    return navigate('/case/caseid=' + props.caseId + '/attemptid=' + createdAttempt.id + '/reload=' + false);
  };
  const postToAttemptReload = async () => {
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, props.caseId);
    return navigate('/case/caseid=' + props.caseId + '/attemptid=' + createdAttempt.id + '/reload=' + true);
  };

  /*
return (
    <Link to={'/case/caseid=' + props.caseId + 'attemptid=' + createdAttempt.id}>
    <Button onClick={postToAttempt} colorScheme='teal' marginBottom='5%'>Starta fallet</Button>
    </Link>
);
*/

  return (
    <>
      <Button onClick={postToAttemptNoReload} colorScheme='teal' marginBottom='5%'>
        Starta fallet
      </Button>
      <Button onClick={postToAttemptReload} colorScheme='teal' marginBottom='5%'>
        Fortsätt fallet
      </Button>
    </>
  );
}
