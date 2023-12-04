import IntroductionModal from './IntroductionModal';
import ExaminationModal from './ExaminationModal';
import DiagnosisModal from './DiagnosisModal';
import SummaryModal from './SummaryModal';

export default function CreateCaseModal({ isOpen, onClose, module, moduleData }) {
  return (
    <>
      {module.module_type_identifier === 0 && (
        <IntroductionModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 1 && (
        <ExaminationModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 2 && (
        <DiagnosisModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 3 && (
        <p>Treatment</p>
      )}

      {module.module_type_identifier === 4 && (
        <SummaryModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}
    </>
  );
}
