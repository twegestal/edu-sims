import * as object from '../models/object_index.js';

export const sortAttempts = (attempts) => {
  const map = new Map();

  attempts.map((element) => {
    if (map.has(element.dataValues.case_id)) {
      const currentTimestamp = element.dataValues.timestamp_started;
      const timestampToCompare = map.get(element.dataValues.case_id).timestamp_started;
      if (currentTimestamp > timestampToCompare) {
        map.set(element.dataValues.case_id, element.dataValues);
      }
    } else {
      map.set(element.dataValues.case_id, element.dataValues);
    }
  });

  for (let [caseId, attemptData] of map) {
    if (attemptData.is_finished) {
      map.delete(caseId);
    }
  }

  const resultArray = Array.from(map, ([key, value]) => ({ case_id: key, ...value }));
  return resultArray;
};

export const fetchStepData = async (steps) => {
  for (let i = 0; i < steps.length; i++) {
    let step = steps[i];
    switch (step.module_type_identifier) {
      case 0: {
        const stepData = await fetchIntroductionStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
      case 1: {
        const stepData = await fetchExaminationStep(step.step_id);
        step.dataValues = { ...step.dataValues, stepData: stepData };
        break;
      }
    }
  }

  return steps;
};

const fetchIntroductionStep = async (stepId) => {
  const stepData = await object.introduction.findOne({
    where: {
      id: stepId,
    },
  });
  return stepData;
};

const fetchExaminationStep = async (stepId) => {
  const stepData = await object.examination.findOne({
    where: {
      id: stepId,
    },
  });

  stepData.examination_to_display = await fetchExaminationsToDisplay(
    stepData.examination_to_display,
  );

  return stepData;
};
/* 
const fetchExaminationsToDisplay = async (examinationsToDisplay) => {
  let examinationToDisplay = {};
  const examinationList = await object.examination_list.findAll();
  const examinationTypes = await object.examination_type.findAll();
  const examinationSubTypes = await object.examination_subtype.findAll();

  console.log('examination_to_display:', examinationsToDisplay);

  Object.entries(examinationsToDisplay).map(([examinationType, examinationSubTypeArray]) => {
    const filteredType = examinationTypes.filter(
      (examination) => examination.id === examinationType,
    );

    const examinationTypeName = filteredType[0].name;

    console.log('examtypename:', examinationTypeName);

    let subTypes = [];
    examinationSubTypeArray.map((element) => {
      const filteredSubType = examinationSubTypes.filter(
        (examinationSubtype) => examinationSubtype.id === element,
      );

      const subTypeName = filteredSubType[0].name;
      subTypes[subTypeName] = [];
    });

    examinationToDisplay[examinationTypeName] = subTypes;
  });
  console.log('exam2diw:', examinationToDisplay);
  return examinationToDisplay;
};
 */

const fetchExaminationsToDisplay = async (examinationsToDisplay) => {
  let examinationToDisplay = {};
  const examinationList = await object.examination_list.findAll();
  const examinationTypes = await object.examination_type.findAll();
  const examinationSubTypes = await object.examination_subtype.findAll();

  console.log('examination_to_display:', examinationsToDisplay);

  for (const [examinationType, examinationSubTypeArray] of Object.entries(examinationsToDisplay)) {
    const filteredType = examinationTypes.find((examination) => examination.id === examinationType);

    if (filteredType) {
      const examinationTypeName = filteredType.name;

      console.log('examtypename:', examinationTypeName);

      let subTypes = {};
      for (const element of examinationSubTypeArray) {
        const filteredSubType = examinationSubTypes.find((subType) => subType.id === element);

        if (filteredSubType) {
          const subTypeName = filteredSubType.name;
          subTypes[subTypeName] = [];
        }
      }

      examinationToDisplay[examinationTypeName] = subTypes;
    }
  }

  console.log('exam2diw:', examinationToDisplay);
  return examinationToDisplay;
};
