import { Button } from '@chakra-ui/react';
import { useState } from 'react';

export default function Diagnosis({
  stepData,
  index,
  updateIsFinishedArray,
  incrementActiveStepIndex,
}) {
  const [isFinished, setIsFinished] = useState(false);
  const finishStep = () => {
    setIsFinished(true);
    updateIsFinishedArray(index);
    incrementActiveStepIndex();
  };
  return (
    <>
      <p>Diagnosgrejer</p>
      {isFinished === false && <Button onClick={finishStep}>Gör färdigt steget</Button>}
    </>
  );
}
