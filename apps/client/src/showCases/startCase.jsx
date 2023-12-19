import {
  Button,
  Progress
} from '@chakra-ui/react';
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
    let startedCases = JSON.parse(localStorage.getItem('StartedCases'));
    console.log(startedCases);
    if (startedCases !== null) {
      let value = startedCases.length;
      for (let index = 0; index < startedCases.length; index++) {
        if (startedCases[index].caseId === props.caseId) {
          value = index;
          break;
        }
      }
      if (value === startedCases.length) {
        const attempLocal = {}
        attempLocal.attempt = createdAttempt.id;
        attempLocal.caseId = props.caseId;
        startedCases[value] = attempLocal;
      } else {
        startedCases[value].attempt = createdAttempt.id;
        startedCases[value].caseId = props.caseId;
      }
      localStorage.setItem('StartedCases', JSON.stringify(startedCases));
    } else {
      const arr = [];
      const attempLocal = {}
      attempLocal.attempt = createdAttempt.id;
      attempLocal.caseId = props.caseId;
      console.log(attempLocal);
      arr[0] = attempLocal;
      localStorage.setItem('StartedCases', JSON.stringify(arr));
    }
    return navigate(
      '/case/caseid=' + props.caseId + '/attemptid=' + createdAttempt.id + '/reload=' + false,
    );
  };

  const postToAttemptReload = async () => {
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, props.caseId);
    return navigate(
      '/case/caseid=' + props.caseId + '/attemptid=' + createdAttempt.id + '/reload=' + true,
    );
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
      <Button onClick={postToAttemptNoReload} colorScheme='teal' marginBottom='2%'>
        Starta fallet
      </Button>
      <Button onClick={postToAttemptReload} colorScheme='teal' marginBottom='2%'>
        Fortsätt fallet
      </Button>
    </>
  );
}
