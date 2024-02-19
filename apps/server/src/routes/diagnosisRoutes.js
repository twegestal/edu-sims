import express from 'express';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses';

export const diagnosisRouter = () => {
  const router = express();
  
  router.get('/', async (req, res, _next) => {
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
          res.status(404).json(HTTPResponses.Error[404]);
        }
      } catch (error) {
        console.error(ConsoleResponses.GET_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    } else {
      try {
        const result = await object.diagnosis_list.findAll();
        if (result) {
          res.status(200).send(result);
        } else {
          res.status(404).json(HTTPResponses.Error[404]);
        }
      } catch (error) {
        console.error(ConsoleResponses.GET_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });
  

  router.post('/', async (req, res, _next) => {
    try {
      const { name, medical_field_id } = req.body;
      if(!name || !medical_field_id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const resourceExists = await object.diagnosis_list.findOne({ where: { name: name } });
      if (resourceExists) {
        return res.status(400).json(`${name} is already a resource`);
      }

      const fieldExists = await object.medical_field.findOne({ where: { id: medical_field_id } });
      if (!fieldExists) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }

      const result = await object.diagnosis_list.create({
        name: name,
        medical_field_id: medical_field_id,
      });
      res.status(201).send(result);
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/', async (req, res, _next) => {
    try {
      const { newName, id } = req.body;
      const response = await object.diagnosis_list.update({ name: newName }, { where: { id: id } });
      if (response > 0) {
        res.status(200).json(HTTPResponses.Success[200]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.SERVER_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.delete('/', async (req, res, _next) => {
    try {
      const { id } = req.body;
      const result = await object.diagnosis_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json(HTTPResponses.Success[200]);
      } else {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json(HTTPResponses.Error[409]);
      } else {
        console.error(ConsoleResponses.SERVER_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  return router;
}