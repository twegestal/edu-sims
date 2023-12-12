import IntroductionModal from './IntroductionModal';
import ExaminationModal from './ExaminationModal';
import DiagnosisModal from './DiagnosisModal';
import SummaryModal from './SummaryModal';
import TreatmentModal from './TreatmentModal';

export default function CreateCaseModal({ isOpen, onClose, module, moduleData, medicalFieldId }) {
  return (
    <>
      {module.module_type_identifier === 0 && (
        <IntroductionModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 1 && (
        <ExaminationModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 2 && (
        <DiagnosisModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} medicalFieldId={medicalFieldId} />
      )}

      {module.module_type_identifier === 3 && (
        <TreatmentModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}

      {module.module_type_identifier === 4 && (
        <SummaryModal isOpen={isOpen} onClose={onClose} moduleData={moduleData} />
      )}
    </>
  );
}
