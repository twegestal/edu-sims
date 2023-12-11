import { Router } from 'express';
import { getTransaction } from '../database/databaseConnection.js';
import * as object from '../models/object_index.js';
import { insertSteps } from '../utils/databaseUtils.js';
import { ForeignKeyConstraintError } from 'sequelize';

export const getCaseRoutes = () => {
  const router = Router();

  router.post('/createCase', async (req, res, _next) => {
    const caseObject = req.body;

    const transaction = await getTransaction();
    try {
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
    } catch (error) {
      console.error('transaction did not work', error);
      await transaction.rollback();
      res.status(400).send(error);
    }
  });

  //hämtar alla cases
  router.get('/getAllCases', async (_req, res, _next) => {
    const cases = await object.medical_case.findAll({
      include: [
        {
          model: object.end_user,
        },
      ],
    });
    res.status(200).send(cases);
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
      console.log('error fetching medical fields', error);
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
    if (req.header('id') == '') {
      res.status(404).json('not found');
    } else {
      const result = await object.examination.findOne({
        where: {
          id: req.header('id'),
        },
      });
      res.status(200).json(result);
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
  // Tar emot en examination types id och hämtar alla subtyper för det id
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
      let whereClause = {};

      if (examinationSubtypeId) {
        whereClause = { where: { examination_subtype_id: examinationSubtypeId } };
      }

      const response = await object.examination_list.findAll({
        whereClause,
        order: [['name', 'ASC']],
      });

      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(400).json('Could not find resource');
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
  // hämta treatments
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

  router.put('/publishCase', async (req, res, next) => {
    if (req.header('id') == '') {
      res.status(404).json('Not Found');
    } else {
      let publish = false;
      if (req.header('isPublished') == 'false' || req.header('isPublished') == 'null') {
        publish = true;
      }
      if (req.header('isPublished') == true) {
        publish = false;
      }
      const result = await object.medical_case.update(
        { published: publish },
        {
          where: {
            id: req.header('id'),
          },
        },
      );
      res.status(200).json(result);
    }
  });

  router.post('/createAttempt', async (req, res, _next) => {
    if (req.header('case_id') == '') {
      res.status(404).json('Not Found');
    } else {
      const result = await object.attempt.create({
        user_id: req.header('user_id'),
        case_id: req.header('case_id'),
        //Timestamp_started is automaticly created by Sequlize
      });
      res.status(200).json(result);
    }
  });

  router.put('/updateAttempt', async (req, res, next) => {
    if (req.header('attempt_id') == '') {
      res.status(404).json('Not Found');
    } else {
      let result = [];
      if (req.header('timestamp_finished') == '') {
        result = await object.attempt.update(
          {
            is_finished: req.header('is_finished'),
            faults: req.header('faults'),
            correct_diagnosis: req.header('correct_diagnosis'),
            nbr_of_tests_performed: req.header('nbr_of_tests_performed'),
          },
          {
            where: {
              id: req.header('attempt_id'),
            },
          },
        );
      } else {
        result = await object.attempt.update(
          {
            is_finished: req.header('is_finished'),
            faults: req.header('faults'),
            timestamp_finished: req.header('timestamp_finished'),
            correct_diagnosis: req.header('correct_diagnosis'),
            nbr_of_tests_performed: req.header('nbr_of_tests_performed'),
          },
          {
            where: {
              id: req.header('attempt_id'),
            },
          },
        );
      }
      res.status(200).json(result);
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

  return router;
};
