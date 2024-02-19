import { Router } from 'express';
import { getTransaction } from '../database/databaseConnection.js';
import * as object from '../models/object_index.js';
import { insertSteps, updateSteps, deleteModules } from '../utils/databaseUtils.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { validateCaseToPublish } from 'api';
import { fetchStepData, sortAttempts } from '../utils/caseUtils.js';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';
/**
 * This file contains routes for the REST API that serves data concerning medical cases.
 */

export const getCaseRoutes = () => {
  const router = Router();

  router.delete('/', async (req, res, _next) => {
    try {
      const { caseId } = req.body;  
      if (!caseId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const medicalCase = await object.medical_case.findOne({
        where: {
          id: caseId,
        },
      });
      if (!medicalCase) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const response = await medicalCase.update({
        active: false,
      });
      if (!response) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }
      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/', async (req, res, _next) => {
    let transaction = null;
    try {
      const { caseObject, caseId, removedModules } = req.body;
      if (!caseObject || !caseId) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      transaction = await getTransaction();

      const medicalCase = await object.medical_case.findOne({
        where: {
          id: caseId,
        },
      });

      if (!medicalCase) {
        return res.status(404).json(HTTPResponses.Error[404]);
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
      res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.TRANSACTION_ERROR, error);
      await transaction.rollback();
      console.error(ConsoleResponses.TRANSACTION_ROLLBACK);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/', async (req, res, _next) => {
    let transaction = null;
    try {
      const caseObject = req.body;
      if(!caseObject) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
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
        res.status(201).json(HTTPResponses.Success[201]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.TRANSACTION_ERROR, error);
      await transaction.rollback();
      console.log(ConsoleResponses.TRANSACTION_ROLLBACK);
      res.status(500).send(HTTPResponses.Error[500]);
    }
  });

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
        res.status(404).json(HTTPResponses.Error[404]);
      }
    } catch (error) {
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getCaseById', async (req, res, _next) => {
    try {
      const id = req.header('case_id');
      if(!id) {
        return res.status(400).json(HTTPResponses.Error[400])
      }
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
    } catch(error) {
      console.log(ConsoleResponses.SERVER_ERROR);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getIntroductionStep', async (req, res, next) => {
    try {
      const id = req.header('id')
      if (!id) {
        res.status(400).json(HTTPResponses.Error[400]);
      }
      const result = await object.introduction.findOne({
        where: {
          id: req.header('id'),
        },
      });
      res.status(200).json(result);
    } catch(error) {
      console.log(error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  //Hämta specifict Examination step
  router.get('/getExaminationStep', async (req, res, next) => {
    try {
      const id = req.header('id');
      if (!id) {
          res.status(400).json(HTTPResponses.Error[400]);
        } else {
          let examinationStep = await object.examination.findOne({
            where: {
              id: req.header('id'),
            },
            raw: true,
          });
          if (!examinationStep) {
            return res.status(404).json(HTTPResponses.Error[404]);
          }
          let stepSpecificValues = await object.step_specific_values.findAll({
            where: {
              examination_step_id: id,
            },
            raw: true,
          });
  
          if (!stepSpecificValues > 0) {
            return res.status(404).json(HTTPResponses.Error[404]);
          }
          examinationStep.step_specific_values = stepSpecificValues;
  
          res.status(200).send(examinationStep);
        }
    } catch (error) {
      res.status(500).json(HTTPResponses.Error[500], error);
    }
  });

  router.get('/getDiagnosisStep', async (req, res, next) => {
    try {
      const id = req.header('id')
      if (!id) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        const result = await object.diagnosis.findOne({
          where: {
            id: id,
          },
        });
        if(!result) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        res.status(200).json(result);
      }
    } catch(error) {
      console.log(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500])
    }
  });

  router.get('/getTreatmentStep', async (req, res, _next) => {
    try {
      const id = req.header('id');
      if (!id) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        let treatmentStep = await object.treatment.findOne({
          where: {
            id: id,
          },
          raw: true,
        });
        if (!treatmentStep) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        const treatmentSpecificValues = await object.step_specific_treatment.findAll({
          where: {
            treatment_step_id: id,
          },
          raw: true,
        });
        if (!treatmentSpecificValues > 0) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        treatmentStep.step_specific_treatments = treatmentSpecificValues;
        res.status(200).send(treatmentStep);
      }  
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });
  //Hämta specifict Summary step
  router.get('/getSummaryStep', async (req, res, next) => {
    try {
      const id = req.header('id');
      if(!id) {
        return res.status(400).json(HTTPResponses.Error[400])
      } else {
        const result = await object.summary.findOne({
          where: {
            id: req.header('id'),
          },
        });
        if(!result) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        res.status(200).json(result);
      }
    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getExaminationSpecificValues', async (req, res, next) => {
    try {
      const stepId = req.header('step_id')
      const id = req.header('id');
      if (stepId) {
        const result = await object.step_specific_values.findAll({
          where: {
            examination_step_id: stepId,
          },
        });
        if(!result) {
          return res.status(404).json(HTTPResponses.Error[404])
        }
        res.status(200).json(result);
      } else if (id) {
        if (id == '') {
          res.status(400).json(HTTPResponses.Error[400]);
        } else {
          const result = await object.step_specific_values.findAll({
            where: {
              id: id,
            },
          });
          if(!result) {
            return res.status(404).json(HTTPResponses.Error[404])
          }
          res.status(200).json(result);
        }
      }
    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/getTreatmentSpecificValues', async (req, res, _next) => {
    try {
      const id = req.header('id');
      if(!id) {
        return res.status(400).json(HTTPResponses.Error[400])
      }
      let whereClause = id ? { where: { treatment_step_id: id } } : {};
      const result = await object.step_specific_treatment.findAll(whereClause);
      if (result) {
        res.status(200).send(result);
      } else {
        res.status(404).json(HTTPResponses.Error[404]);
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  //Hämta specifict Treatment step
  router.get('/getTreatmentStep', async (req, res, next) => {
    try {
      const id = req.header('id');
      if (!id) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        const result = await object.treatment.findOne({
          where: {
            id: id,
          },
        });
        if(!result) {
          return res.status(404).json(HTTPResponses.Error[404])
        }
        res.status(200).json(result);
      }
    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500])
    }
  });

  router.put('/publishCase', async (req, res, next) => {
    try {
      const id = req.header('id');
      if (!id) {
        res.status(400).json(HTTPResponses.Error[400]);
      } else {
        let publish = false;
        if (req.header('isPublished') === 'false' || req.header('isPublished') === 'null') {
          publish = true;
        }
        if (req.header('isPublished') == true) {
          publish = false;
        }
        const medicalCase = await object.medical_case.findOne({
          where: {
            id: id,
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
          res.status(200).json(HTTPResponses.Success[200]);
        } else {
          res.status(400).send(validationResult.errors);
        } 
      }
    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });


  router.get('/attempt', async (req, res, _next) => {
    try {
      const id = req.header('id');
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const result = await object.attempt.findAll({ where: { user_id: id } });
      const sortedResults = sortAttempts(result);
      return res.status(200).json(sortedResults);
    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/specificAttempt', async (req, res, _next) => {
    try {
      const attempt_id = req.header('attempt_id');
      if (!attempt_id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const result = await object.attempt.findAll({ where: { id: attempt_id } });
      return res.status(200).json(result);

    } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/createAttempt', async (req, res, _next) => {
    try {
      const caseId = req.header('case_id');
      if (!caseId) {
        res.status(404).json(HTTPResponses.Error[404]);
      } else {
        const result = await object.attempt.create({
          user_id: req.header('user_id'),
          case_id: req.header('case_id'),
          is_finished: false,
          //Timestamp_started is automaticly created by Sequlize
        });
        if(!result) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        res.status(200).json(result);
    }
  } catch(error) {
      console.error(ConsoleResponses.SERVER_ERROR);
      res.status(500).json(HTTPResponses.Error[500])
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
      return res.status(400).json(HTTPResponses.Error[400]);
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

        return res.status(200).json(HTTPResponses.Success[200]);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
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

        return res.status(200).json(HTTPResponses.Success[200]);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  router.get('/getModuleTypes', async (_req, res, _next) => {
    try {
      const response = await object.module_type.findAll();
      if(!response) {
        return res.status(404).json(HTTPResponses.Error[404])
      }
      res.status(200).send(response);
    } catch (error) {
      res.status(500).send(HTTPResponses.Error[500]);
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
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        return res.status(200).send(caseObject);
      } catch (error) {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    } else {
      try {
        const medicalCases = await object.medical_case.findAll();
        if (medicalCases.length < 1) {
          return res.status(404).json(HTTPResponses.Error[404]);
        }
        return res.status(200).send(medicalCases);
      } catch (error) {
        console.error(error);
        return res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  return router;
};
