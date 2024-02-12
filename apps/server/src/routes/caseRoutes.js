import { Router } from 'express';
import { getTransaction } from '../database/databaseConnection.js';
import * as object from '../models/object_index.js';
import { insertSteps, updateSteps, deleteModules } from '../utils/databaseUtils.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { validateCaseToPublish } from 'api';
import { fetchStepData, sortAttempts } from '../utils/caseUtils.js';

/**
 * This file contains routes for the REST API that serves data concerning medical cases.
 */

export const getCaseRoutes = () => {
  const router = Router();

  router.delete('/', async (req, res, _next) => {
    const { caseId } = req.body;

    if (!caseId) {
      return res.status(400).json('Missing body');
    }
    try {
      const medicalCase = await object.medical_case.findOne({
        where: {
          id: caseId,
        },
      });
      if (!medicalCase) {
        return res.status(404).json('Resource not found');
      }
      const response = await medicalCase.update({
        active: false,
      });
      if (!response) {
        return res.status(500).json('Something went wrong');
      }
      return res.status(200).json('Resource deleted');
    } catch (error) {
      return res.status(500).json('Something went wrong');
    }
  });

  router.patch('/', async (req, res, _next) => {
    const { caseObject, caseId, removedModules } = req.body;
    console.log('removedModules: ', removedModules);

    if (!caseObject || !caseId) {
      return res.status(400).json('Missing required properties in body');
    }
    let transaction = null;
    try {
      transaction = await getTransaction();

      const medicalCase = await object.medical_case.findOne({
        where: {
          id: caseId,
        },
      });

      if (!medicalCase) {
        return res.status(404).json('Medical case does not exist');
      }

      medicalCase.update(
        {
          name: caseObject.name,
          medical_field_id: caseObject.medical_field_id,
          creator_user_id: caseObject.creator_user_id,
        },
        { transaction: transaction },
      );

      await updateSteps(caseObject.steps, medicalCase.id, transaction);
      await deleteModules(removedModules);

      await transaction.commit();
      res.status(200).json('Case updated successfully');
    } catch (error) {
      console.error('transaction did not work', error);
      await transaction.rollback();
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/', async (req, res, _next) => {
    const caseObject = req.body;
    let transaction = null;
    try {
      transaction = await getTransaction();
      const existingMedicalCase = await object.medical_case.findOne({
        where: {
          name: caseObject.name,
        },
      });
      if (!existingMedicalCase) {
        const medicalCase = await object.medical_case.create(
          {
            name: caseObject.name,
            medical_field_id: caseObject.medical_field_id,
            creator_user_id: caseObject.creator_user_id,
            published: false,
          },
          { transaction: transaction },
        );

        await insertSteps(caseObject.steps, medicalCase.id, transaction);

        await transaction.commit();
        res.status(201).json('Case created');
      } else {
        res.status(400).json('Resource already exists');
      }
    } catch (error) {
      console.error('transaction did not work', error);
      await transaction.rollback();
      res.status(500).send(error);
    }
  });

  //hämtar alla cases
  router.get('/getAllCases', async (_req, res, _next) => {
    try {
      const cases = await object.medical_case.findAll({
        where: {
          active: true,
        },
        include: [
          {
            model: object.end_user,
            attributes: ['email'],
          },
        ],
      });

      if (cases.length > 0) {
        res.status(200).send(cases);
      } else {
        res.status(404).json('Could not find resource');
      }
    } catch (error) {
      console.error('error fetching all cases ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.get('/getCaseById', async (req, res, _next) => {
    const caseSteps = await object.step.findAll({
      where: {
        case_id: req.header('case_id'),
      },
      order: [['index', 'ASC']],
      include: [
        {
          model: object.medical_case,
        },
      ],
    });
    res.status(200).json(caseSteps);
  });

  //Hämta specifict Introduction step
  router.get('/getIntroductionStep', async (req, res, next) => {
    if (req.header('id') == null) {
      res.status(404).json('inget id i headern angavs');
    }
    const result = await object.introduction.findOne({
      where: {
        id: req.header('id'),
      },
    });
    res.status(200).json(result);
  });
  //Hämta specifict Examination step
  router.get('/getExaminationStep', async (req, res, next) => {
    const id = req.header('id');

    try {
      if (id) {
        let examinationStep = await object.examination.findOne({
          where: {
            id: req.header('id'),
          },
          raw: true,
        });
        if (!examinationStep) {
          return res.status(404).json('Could not find selected resource');
        }
        let stepSpecificValues = await object.step_specific_values.findAll({
          where: {
            examination_step_id: id,
          },
          raw: true,
        });

        if (!stepSpecificValues > 0) {
          return res.status(404).json('Could not find selected resource');
        }
        examinationStep.step_specific_values = stepSpecificValues;

        res.status(200).send(examinationStep);
      } else {
        res.status(400).json('Missing header');
      }
    } catch (error) {
      res.status(500).json('Something went wrong', error);
    }
  });
  //Hämta specifict Diagnosis step
  router.get('/getDiagnosisStep', async (req, res, next) => {
    if (req.header('id') == '') {
      res.status(404).json('not found');
    } else {
      const result = await object.diagnosis.findOne({
        where: {
          id: req.header('id'),
        },
      });
      res.status(200).json(result);
    }
  });

  //Hämta specifict Treatment step
  router.get('/getTreatmentStep', async (req, res, _next) => {
    const id = req.header('id');

    try {
      if (id) {
        let treatmentStep = await object.treatment.findOne({
          where: {
            id: id,
          },
          raw: true,
        });

        if (!treatmentStep) {
          return res.status(404).json('Resource not found');
        }

        const treatmentSpecificValues = await object.step_specific_treatment.findAll({
          where: {
            treatment_step_id: id,
          },
          raw: true,
        });

        if (!treatmentSpecificValues > 0) {
          return res.status(404).json('Resource not found');
        }

        treatmentStep.step_specific_treatments = treatmentSpecificValues;
        res.status(200).send(treatmentStep);
      } else {
        res.status(400).json('Missing header');
      }
    } catch (error) {
      console.error('Error fetching treatment step ', error);
      res.status(500).json('Something went wrong');
    }
  });
  //Hämta specifict Summary step
  router.get('/getSummaryStep', async (req, res, next) => {
    if (req.header('id') == '') {
      res.status(404).json('not found');
    } else {
      const result = await object.summary.findOne({
        where: {
          id: req.header('id'),
        },
      });
      res.status(200).json(result);
    }
  });

  router.get('/getExaminationSpecificValues', async (req, res, next) => {
    if (req.header('step_id')) {
      const result = await object.step_specific_values.findAll({
        where: {
          examination_step_id: req.header('step_id'),
        },
      });
      res.status(200).json(result);
    } else if (req.header('id')) {
      if (req.header('id') == '') {
        res.status(404).json('not found');
      } else {
        const result = await object.step_specific_values.findAll({
          // id som kommer in är det id som den specifika examinationen har
          where: {
            id: req.header('id'),
          },
        });
        res.status(200).json(result);
      }
    }
  });

  router.get('/getTreatmentSpecificValues', async (req, res, _next) => {
    try {
      const id = req.header('id');
      let whereClause = id ? { where: { treatment_step_id: id } } : {};

      const result = await object.step_specific_treatment.findAll(whereClause);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).json('Resource not found');
      }
    } catch (error) {
      console.error('error fetching treatment specific values', error);
      res.status(500).json('Something went wrong');
    }
  });

  //Hämta specifict Treatment step
  router.get('/getTreatmentStep', async (req, res, next) => {
    if (req.header('id') == '') {
      res.status(404).json('not found');
    } else {
      const result = await object.treatment.findOne({
        where: {
          id: req.header('id'),
        },
      });
      res.status(200).json(result);
    }
  });

  router.put('/publishCase', async (req, res, next) => {
    if (req.header('id') == '') {
      res.status(404).json('Not Found');
    } else {
      let publish = false;
      if (req.header('isPublished') === 'false' || req.header('isPublished') === 'null') {
        publish = true;
      }
      if (req.header('isPublished') == true) {
        publish = false;
      }

      try {
        const medicalCase = await object.medical_case.findOne({
          where: {
            id: req.header('id'),
          },
        });
        const steps = await object.step.findAll({
          where: {
            case_id: medicalCase.id,
          },
        });
        const caseToValidate = {
          name: medicalCase.name,
          creator_user_id: medicalCase.creator_user_id,
          steps: steps,
          medical_field_id: medicalCase.medical_field_id,
        };
        const validationResult = validateCaseToPublish(caseToValidate);

        if (validationResult.success) {
          await medicalCase.update({
            published: publish,
          });
          res.status(200).json('Succesful update of case published state');
        } else {
          res.status(400).send(validationResult.errors);
        }
      } catch (error) {
        console.error('Error updating medical case published status in database', error);
        res.status(500).json('Internal server error');
      }
    }
  });

  router.get('/attempt', async (req, res, _next) => {
    const id = req.header('id');

    if (!id) {
      return res.status(400).json('Missing identifier');
    }

    try {
      const result = await object.attempt.findAll({ where: { user_id: id } });
      const sortedResults = sortAttempts(result);
      return res.status(200).json(sortedResults);
    } catch (error) {
      console.error('error fetching attempts ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.get('/specificAttempt', async (req, res, _next) => {
    const attempt_id = req.header('attempt_id');

    if (!attempt_id) {
      return res.status(400).json('Missing identifier');
    }

    try {
      const result = await object.attempt.findAll({ where: { id: attempt_id } });
      return res.status(200).json(result);
    } catch (error) {
      console.error('error fetching attempt ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.post('/createAttempt', async (req, res, _next) => {
    if (req.header('case_id') == '') {
      res.status(404).json('Not Found');
    } else {
      const result = await object.attempt.create({
        user_id: req.header('user_id'),
        case_id: req.header('case_id'),
        is_finished: false,
        //Timestamp_started is automaticly created by Sequlize
      });
      res.status(200).json(result);
    }
  });

  router.put('/updateAttempt', async (req, res, _next) => {
    const {
      attempt_id,
      is_finished,
      faults,
      timestamp_finished,
      correct_diagnosis,
      nbr_of_tests_performed,
      examination_results,
      feedback,
      index,
    } = req.body;

    if (!attempt_id) {
      return res.status(400).json('Missing body');
    }

    if (Object.keys(timestamp_finished).length === 0) {
      try {
        const result = await object.attempt.update(
          {
            is_finished: is_finished,
            faults: faults,
            correct_diagnosis: correct_diagnosis,
            nbr_of_tests_performed: nbr_of_tests_performed,
            examination_results: examination_results,
            feedback: feedback,
            index: index,
          },
          {
            where: {
              id: attempt_id,
            },
          },
        );

        return res.status(200).json('Resource updated');
      } catch (error) {
        console.error('error updating attempt ', error);
        return res.status(500).json('Something went wrong');
      }
    } else {
      try {
        const result = await object.attempt.update(
          {
            is_finished: is_finished,
            faults: faults,
            timestamp_finished: timestamp_finished,
            correct_diagnosis: correct_diagnosis,
            nbr_of_tests_performed: nbr_of_tests_performed,
            examination_results: examination_results,
            feedback: feedback,
            index: index,
          },
          {
            where: {
              id: attempt_id,
            },
          },
        );

        return res.status(200).json('Resource updated');
      } catch (error) {
        console.error('error updating attempt ', error);
        return res.status(500).json('Something went wrong');
      }
    }
  });

  router.get('/getModuleTypes', async (_req, res, _next) => {
    try {
      const response = await object.module_type.findAll();

      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(error);
    }
  });

  router.get('/', async (req, res, _next) => {
    const caseId = req.query.caseId;
    if (caseId) {
      try {
        const medicalCase = await object.medical_case.findOne({
          where: {
            id: caseId,
          },
        });
        let steps = await object.step.findAll({
          where: {
            case_id: caseId,
          },
          order: [['index', 'ASC']],
        });
        steps = await fetchStepData(steps, medicalCase.medical_field_id);

        const caseObject = {
          name: medicalCase.name,
          caseId: caseId,
          steps: steps,
        };

        if (!medicalCase) {
          return res.status(404).json('Resource not found');
        }

        return res.status(200).send(caseObject);
      } catch (error) {
        console.error('Error fetching case', error);
        return res.status(500).json('Something went wrong.');
      }
    } else {
      try {
        const medicalCases = await object.medical_case.findAll();

        if (medicalCases.length < 1) {
          return res.status(404).json('Resource not found.');
        }
        return res.status(200).send(medicalCases);
      } catch (error) {
        console.error(error);
        return res.status(500).json('Something went wrong.');
      }
    }
  });

  return router;
};
