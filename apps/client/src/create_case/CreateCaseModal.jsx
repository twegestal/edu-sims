import IntroductionModal from "./IntroductionModal";
import ExaminationModal from "./ExaminationModal";

export default function CreateCaseModal({ isOpen, onClose, module }) {

    return (
        <>
            {module.module_type_identifier === 0 && (
                <IntroductionModal
                isOpen={isOpen}
                onClose={onClose}
                />
            )}

            {module.module_type_identifier === 1 && (
                <ExaminationModal
                isOpen={isOpen}
                onClose={onClose}
                />
            )}
        </>
        
    )
}