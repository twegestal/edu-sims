import { Button, Tooltip } from '@chakra-ui/react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth.jsx';
import { useCases } from '../hooks/useCases.js';
import ConfirmStartCase from '../components/ConfirmStartCase.jsx';

export default function StartCase({ caseId, caseToRandomise, published, attemps, caseName }) {
  const { user } = useAuth();
  const { createAttempt } = useCases();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  useEffect(() => {
    if (caseToRandomise === caseId) {
      startCase();
    }
  }, [caseToRandomise]);

  const startCase = () => {
    const attempt = attemps.find((e) => e.case_id === caseId);
    if (attempt) {
      setIsConfirmOpen(true);
    } else {
      postToAttempt();
    }
  };

  const postToAttempt = async () => {
    setIsConfirmOpen(false);
    setLoading(true);
    let createdAttempt = [];
    createdAttempt = await createAttempt(user.id, caseId);
    return navigate('/case/caseid=' + caseId + '/attemptid=' + createdAttempt.id);
  };

  const continueCase = () => {
    const attempt = attemps.find((e) => e.case_id === caseId);
    setIsConfirmOpen(false);
    return navigate('/case/caseid=' + caseId + '/attemptid=' + attempt.id );
  };

  const closeConfirm = () => {
    setIsConfirmOpen(false);
  };

  return (
    <>
      {user.isAdmin ? (
        published ? (
          <Button onClick={postToAttempt} colorScheme='teal' marginBottom='10%' isLoading={loading}>
            Starta fallet
          </Button>
        ) : (
          <Tooltip
            hasArrow
            label='Fallet är inte publicerat och visas därför inte för studenter, men du som admin kan testa fallet'
          >
            <Button
              onClick={postToAttempt}
              colorScheme='teal'
              marginBottom='10%'
              isLoading={loading}
            >
              Testa fallet
            </Button>
          </Tooltip>
        )
      ) : (
        <Button onClick={startCase} colorScheme='teal' marginBottom='10%' isLoading={loading}>
          Starta fallet
        </Button>
      )}
      <ConfirmStartCase
        isOpen={isConfirmOpen}
        onClose={closeConfirm}
        onRestart={postToAttempt}
        onContinue={continueCase}
        caseName={caseName}
      />
    </>
  );
}
