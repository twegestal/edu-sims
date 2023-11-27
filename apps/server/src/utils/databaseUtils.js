import * as object from '../models/object_index.js';

export const insertSteps = async (steps, caseId, transaction) => {
  for (let i = 0; i < steps.length; i++) {
    const stepData = steps[i];
    const moduleTypeIdentifier = stepData.module_type_identifier;
    console.log('moduleTypeId: ', moduleTypeIdentifier);

    switch (moduleTypeIdentifier) {
      case 0: {
        await insertIntroductionStep(stepData, i, caseId, transaction);
        break;
      }
      case 1: {
        await insertExaminationStep(stepData, i, caseId, transaction);
        break;
      }
      case 2: {
        await insertDiagnosisStep(stepData, i, caseId, transaction);
        break;
      }
      case 3: {
        await insertTreatmentStep(stepData, i, caseId, transaction);
        break;
      }
      case 4: {
        await insertSummaryStep(stepData, i, caseId, transaction);
        break;
      }
    }
  }
};

const insertIntroductionStep = async (stepData, index, caseId, transaction) => {
  const introductionStep = await object.introduction.create(
    {
      description: stepData.description,
      prompt: stepData.prompt,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  console.log('introstep: ', introductionStep);
  const step = await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: introductionStep.id,
    },
    { transaction: transaction },
  );
  console.log('step i intro: ', step);
};

const insertExaminationStep = async (stepData, index, caseId, transaction) => {
  console.log('kommer vi hit?');
  const examinationStep = await object.examination.create(
    {
      prompt: stepData.prompt,
      examination_to_display: stepData.examination_to_display,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
      max_nbr_tests: stepData.max_nbr_tests,
    },
    { transaction: transaction },
  );

  console.log('examstep', examinationStep);

  for (let i = 0; i < stepData.step_specific_values.length; i++) {
    const stepSpecificValue = await object.step_specific_values.create(
      {
        examination_step_id: examinationStep.id,
        examination_id: stepData.step_specific_values[i].examination_id,
        value: stepData.step_specific_values[i].value,
        is_normal: stepData.step_specific_values[i].is_normal,
      },
      { transaction: transaction },
    );

    console.log('stepSpecificValue: ', stepSpecificValue);
  }

  const step = await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: examinationStep.id,
    },
    { transaction: transaction },
  );
  console.log('step i exam: ', step);
};

const insertDiagnosisStep = async (stepData, index, caseId, transaction) => {
  const diagnosisStep = await object.diagnosis.create(
    {
      prompt: stepData.prompt,
      diagnosis_id: stepData.diagnosis_id,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  console.log('diagnosstep: ', diagnosisStep);
  const step = await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: diagnosisStep.id,
    },
    { transaction: transaction },
  );

  console.log('step i diag: ', step);
};

const insertTreatmentStep = async (stepData, index, caseId, transaction) => {
  const treatmentStep = await object.treatment.create(
    {
      prompt: stepData.prompt,
      treatments_to_display: stepData.treatments_to_display,
      feedback_correct: stepData.feedback_correct,
      feedback_incorrect: stepData.feedback_incorrect,
    },
    { transaction: transaction },
  );

  console.log('treatmentstep: ', treatmentStep);

  for (let i = 0; i < stepData.step_specific_treatments.length; i++) {
    const stepSpecificTreatment = await object.step_specific_treatment.create(
      {
        treatment_step_id: treatmentStep.id,
        treatment_id: stepData.step_specific_treatments[i].treatment_id,
        value: stepData.step_specific_treatments[i].value,
      },
      { transaction: transaction },
    );

    console.log('stepSpecificTreatment: ', stepSpecificTreatment);
  }

  const step = await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: treatmentStep.id,
    },
    { transaction: transaction },
  );

  console.log('step i treat: ', step);
};

const insertSummaryStep = async (stepData, index, caseId, transaction) => {
  const summaryStep = await object.summary.create(
    {
      process: stepData.process,
      additional_info: stepData.additional_info,
      additional_links: stepData.additional_links,
    },
    { transaction: transaction },
  );

  console.log('summarystep: ', summaryStep);

  const step = await object.step.create(
    {
      case_id: caseId,
      index: index,
      module_type_identifier: stepData.module_type_identifier,
      step_id: summaryStep.id,
    },
    { transaction: transaction },
  );

  console.log('step i summary: ', step);
};
