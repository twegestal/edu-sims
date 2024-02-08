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

  router.get('/getMedicalFields', async (_req, res, _next) => {
    try {
      const result = await object.medical_field.findAll({});
      res.status(200).send(result);
    } catch (error) {
      console.error('error fetching medical fields', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/medicalField', async (req, res, _next) => {
    const { name } = req.body;

    try {
      const response = await object.medical_field.create({ name: name });
      if (response) {
        return res.status(201).send(response);
      } else {
        return res.status(400).json(`Could not create resource ${name}`);
      }
    } catch (error) {
      console.error('error adding new medical field ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/medicalField', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json('Missing body');
    }

    try {
      const medicalField = await object.medical_field.findOne({ where: { id: id } });
      if (!medicalField) {
        return res.status(404).json('Could not find resource');
      }
      const result = await medicalField.update({ name: name });
      if (!result) {
        return res.status(500).json('Something went wrong');
      }
      res.status(200).json('Resource updated');
    } catch (error) {
      console.error('Error patching medical field ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.delete('/medicalField', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Missing body');
    }

    try {
      const response = await object.medical_field.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json('Resource not found');
      }

      return res.status(200).json('Resource deleted');
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json('Resource cannot be deleted');
      } else {
        return res.status(500).json('Something went wrong');
      }
    }
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

  router.get('/getDiagnosisList', async (req, res, _next) => {
    const id = req.header('id');
    if (id) {
      try {
        const result = await object.diagnosis_list.findAll({
          where: {
            medical_field_id: id,
          },
        });

        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).json('Resource not found');
        }
      } catch (error) {
        console.error('Error getting diagnosis list from database', error);
        res.status(500).json('Internal server error');
      }
    } else {
      try {
        const result = await object.diagnosis_list.findAll();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).json('Resource not found');
        }
      } catch (error) {
        console.error('Error getting diagnosis list from database', error);
        res.status(500).json('Internal server error');
      }
    }
  });

  router.post('/diagnosis', async (req, res, _next) => {
    const { name, medical_field_id } = req.body;

    try {
      const resourceExists = await object.diagnosis_list.findOne({ where: { name: name } });
      if (resourceExists) {
        return res.status(400).json(`${name} is already a resource`);
      }

      const fieldExists = await object.medical_field.findOne({ where: { id: medical_field_id } });
      if (!fieldExists) {
        return res.status(400).json('Medical field does not exist');
      }

      const result = await object.diagnosis_list.create({
        name: name,
        medical_field_id: medical_field_id,
      });

      res.status(201).send(result);
    } catch (error) {
      console.error('error adding new diagnosis ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/diagnosis', async (req, res, _next) => {
    const { newName, id } = req.body;

    try {
      const response = await object.diagnosis_list.update({ name: newName }, { where: { id: id } });
      if (response > 0) {
        res.status(200).json('Resource updated');
      } else {
        res.status(400).json('Could not update resource');
      }
    } catch (error) {
      console.error('error updating diagnosis ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.delete('/diagnosis', async (req, res, _next) => {
    const { id } = req.body;

    try {
      const result = await object.diagnosis_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json('Resource deleted');
      } else {
        return res.status(400).json('Could not delete resouce');
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json('Resource cannot be deleted');
      } else {
        console.error('error deleting diagnosis ', error);
        res.status(500).json('Something went wrong');
      }
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

  router.get('/getExaminationTypes', async (req, res, _next) => {
    try {
      const id = req.header('id');
      const result = id
        ? await object.examination_type.findOne({ where: { id: id } })
        : await object.examination_type.findAll();

      if (result) {
        res.status(200).send(result);
      } else {
        res.status(400).json('Could not find resource');
      }
    } catch (error) {
      console.error('error feting examination types ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/examinationType', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json('Missing body');
    }

    try {
      const examinationType = await object.examination_type.findOne({ where: { id: id } });
      if (!examinationType) {
        return res.status(404).json('Resource not found');
      }

      const result = await examinationType.update({ name: name });
      if (!result) {
        return res.status(500).json('Something went wrong');
      }

      res.status(200).json('Resource updated');
    } catch (error) {
      console.error('error updating examination type ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.delete('/examinationType', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Missing body');
    }

    try {
      const response = await object.examination_type.destroy({ where: { id: id } });
      if (!response) {
        return res.status(400).json('Could not find resource');
      }
      res.status(200).json('Resource deleted');
    } catch (error) {
      console.error('error deleting examination type ', error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json('Resource cannot be deleted');
      } else {
        return res.status(500).json('Something went wrong');
      }
    }
  });

  router.patch('/examinationSubtype', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json('Missing body');
    }

    try {
      const examinationSubtype = await object.examination_subtype.findOne({ where: { id: id } });

      if (!examinationSubtype) {
        return res.status(404).json('Resource not found');
      }

      const result = await examinationSubtype.update({ name: name });
      if (!result) {
        return res.status(500).json('Something went wrong');
      }

      res.status(200).json('Resource updated');
    } catch (error) {
      console.error('error updating examination subtype ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.delete('/examinationSubtype', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Missing body');
    }
    try {
      const response = await object.examination_subtype.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json('Resource not found');
      }

      res.status(200).json('Resource deleted');
    } catch (error) {
      console.error('error deleting examination subtype ', error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json('Resource cannot be deleted');
      } else {
        return res.status(500).json('Something went wrong');
      }
    }
  });

  router.get('/getExaminationSubtypes', async (req, res, _next) => {
    try {
      const examinationTypeId = req.header('examination_type_id');
      const id = req.header('id');
      let whereClause = {};

      if (examinationTypeId) {
        const response = await object.examination_subtype.findAll({
          where: { examination_type_id: examinationTypeId },
        });
        return res.status(200).send(response);
      } else if (id) {
        const response = await object.examination_subtype.findOne({ where: { id: id } });
        res.status(200).send(response);
      } else {
        const response = await object.examination_subtype.findAll();
        return res.status(200).send(response);
      }
    } catch (error) {
      console.error('Error fetching examination subtypes: ', error);
      res.status(500).json('Internal Server Error');
    }
  });
  // kanske bara hämta beroende på examination_type_id och examination_subtyp_id för hämta delar av examinationer
  router.get('/getExaminationList', async (req, res, _next) => {
    try {
      const examinationSubtypeId = req.header('examination_subtype_id');
      const id = req.header('id');

      if (examinationSubtypeId) {
        const response = await object.examination_list.findAll({
          where: { examination_subtype_id: examinationSubtypeId },
          order: [['name', 'ASC']],
        });

        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(400).json('Could not find resource');
        }
      } else if (id) {
        const response = await object.examination_list.findAll({
          where: { examination_type_id: id },
          order: [['name', 'ASC']],
        });
        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(400).json('Could not find resource');
        }
      } else {
        const response = await object.examination_list.findAll({ order: [['name', 'ASC']] });
        if (response) {
          return res.status(200).send(response);
        } else {
          return res.status(400).json('Could not find resource');
        }
      }
    } catch (error) {
      console.error('error fetching examination list ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/examination', async (req, res, _next) => {
    const { name, subtypeId, examinationTypeId } = req.body;

    try {
      if (subtypeId && examinationTypeId && name) {
        const response = await object.examination_list.create({
          name: name,
          examination_type_id: examinationTypeId,
          examination_subtype_id: subtypeId,
        });

        if (!response) {
          return res.status(400).json('Could not create resource');
        }
        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new examination ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/examination', async (req, res, _next) => {
    const { id, newName } = req.body;

    try {
      if (id && newName) {
        const result = await object.examination_list.update(
          { name: newName },
          { where: { id: id } },
        );
        if (result > 0) {
          return res.status(200).json('Resource updated');
        }
        return res.status(400).json('Could not update resource');
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error updating examination list ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.delete('/examination', async (req, res, _next) => {
    const { id } = req.body;

    try {
      const result = await object.examination_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json('Resource deleted');
      } else {
        return res.status(400).json('Could not delete resouce');
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json('Resource cannot be deleted');
      } else {
        console.error('error deleting diagnosis ', error);
        res.status(500).json('Something went wrong');
      }
    }
  });

  router.post('/examinationType', async (req, res, _next) => {
    const { name } = req.body;

    try {
      if (name) {
        const response = object.examination_type.create({ name: name });
        if (!response) {
          return res.status(400).json('Could not create resource');
        }
        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new examination type ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/examinationSubtype', async (req, res, _next) => {
    const { name, id } = req.body;

    try {
      if (name && id) {
        const response = await object.examination_subtype.create({
          name: name,
          examination_type_id: id,
        });

        if (!response) {
          return res.status(400).json('Could not create resource');
        }

        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new examination subtype ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/examinationRange', async (req, res, _next) => {
    const { id, min, max, unit } = req.body;

    if (!id || !min || !max || !unit) {
      return res.status(400).json('Missing body');
    }

    try {
      const examination = await object.examination_list.findOne({ where: { id: id } });
      if (!examination) {
        return res.status(404).json('Resource not found');
      }

      const result = await examination.update({ min_value: min, max_value: max, unit: unit });
      if (!result) {
        return res.status(500).json('Something went wrong');
      }

      res.status(200).json('Resource updated');
    } catch (error) {
      console.error('error updating examination range ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.get('/getTreatmentTypes', async (_req, res, _next) => {
    try {
      const result = await object.treatment_type.findAll({ order: [['name', 'ASC']] });
      res.status(200).send(result);
    } catch (error) {
      console.error('error fetching treatment types ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.get('/getTreatmentSubtypes', async (req, res, _next) => {
    try {
      const id = req.header('id');
      const whereClause = id ? { where: { treatment_type_id: id } } : {};
      const response = await object.treatment_subtype.findAll(whereClause);

      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(404).json('No resources found');
      }
    } catch (error) {
      console.error('error fetching treatment subtypes ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.get('/getTreatmentList', async (req, res, _next) => {
    try {
      let whereClause = {};
      const treatmentSubtypeId = req.header('treatment_subtype_id');
      const treatmentTypeId = req.header('id');

      if (treatmentSubtypeId) {
        whereClause = { where: { treatment_subtype_id: treatmentSubtypeId } };
      } else if (treatmentTypeId) {
        whereClause = { where: { treatment_type_id: treatmentTypeId } };
      }

      const treatments = await object.treatment_list.findAll(whereClause);
      res.status(200).json(treatments);
    } catch (error) {
      console.error('Error fetching treatment list: ', error);
      res.status(500).json('Something went wrong');
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

  router.post('/treatment', async (req, res, _next) => {
    const { name, subtypeId, treatmentId } = req.body;

    try {
      if (subtypeId && treatmentId && name) {
        const response = await object.treatment_list.create({
          name: name,
          treatment_type_id: treatmentId,
          treatment_subtype_id: subtypeId,
        });

        if (!response) {
          return res.status(400).json('Could not create resource');
        }
        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new treatment ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/treatment', async (req, res, _next) => {
    const { id, newName } = req.body;

    try {
      if (id && newName) {
        const result = await object.treatment_list.update({ name: newName }, { where: { id: id } });
        if (result > 0) {
          return res.status(200).json('Resource updated');
        }
        return res.status(400).json('Could not update resource');
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error updating treatment list ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.delete('/treatment', async (req, res, _next) => {
    const { id } = req.body;

    try {
      const result = await object.treatment_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json('Resource deleted');
      } else {
        return res.status(400).json('Could not delete resouce');
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(400).json('Resource cannot be deleted');
      } else {
        console.error('error deleting diagnosis ', error);
        res.status(500).json('Something went wrong');
      }
    }
  });

  router.post('/treatmentSubtypes', async (req, res, _next) => {
    const { name, id } = req.body;

    try {
      if (name && id) {
        const response = await object.treatment_subtype.create({
          name: name,
          treatment_type_id: id,
        });

        if (!response) {
          return res.status(400).json('Could not create resource');
        }

        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new treatment subtype ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/treatmentSubtypes', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json('Missing body');
    }

    try {
      const treatmentSubtype = await object.treatment_subtype.findOne({ where: { id: id } });
      if (!treatmentSubtype) {
        return res.status(404).json('Could not find resource');
      }

      const result = await treatmentSubtype.update({ name: name });
      if (!result) {
        return res.status(500).json('Could not update resource');
      }

      return res.status(200).json('Resource updated');
    } catch (error) {
      console.error('error patching treatment subtype ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.delete('/treatmentSubtype', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Missing body');
    }

    try {
      const response = await object.treatment_subtype.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json('Could not find resource');
      }

      return res.status(200).json('Resource deleted');
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json('Cannot delete resource');
      }

      return res.status(500).json('Something went wrong');
    }
  });

  router.post('/treatmentTypes', async (req, res, _next) => {
    const { name } = req.body;

    try {
      if (name) {
        const response = object.treatment_type.create({ name: name });
        if (!response) {
          return res.status(400).json('Could not create resource');
        }
        res.status(201).send(response);
      } else {
        res.status(400).json('Could not parse input');
      }
    } catch (error) {
      console.error('error adding new treatment type ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.patch('/treatmentType', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json('Missing body');
    }

    try {
      const treatmentType = await object.treatment_type.findOne({ where: { id: id } });
      if (!treatmentType) {
        return res.status(404).json('Resource not found');
      }

      const response = await treatmentType.update({ name: name });

      if (!response) {
        return res.status(500).json('Something went wrong');
      }

      return res.status(200).json('Resource updated');
    } catch (error) {
      console.error('error updating treatment type ', error);
      return res.status(500).json('Something went wrong');
    }
  });

  router.delete('/treatmentType', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json('Missing body');
    }

    try {
      const response = await object.treatment_type.destroy({ where: { id: id } });

      if (!response) {
        return res.status(404).json('Could not find resource');
      }

      return res.status(200).json('Resource deleted');
    } catch (error) {
      console.error('error deleting treatment type ', error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json('Cannot delete resource');
      }
      return res.status(500).json('Something went wrong');
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
