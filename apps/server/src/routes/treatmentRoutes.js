import express from 'express';
import * as object from '../models/object_index.js';
import { ForeignKeyConstraintError } from 'sequelize';
import { ConsoleResponses, HTTPResponses } from '../utils/serverResponses.js';

export const treatmentRouter = () => {
  const router = express();

  router.get('/', async (req, res, _next) => {
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
      if(!treatments) {
        return res.status(404).json(HTTPResponses.Error[404])
      }
      res.status(200).json(treatments);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/', async (req, res, _next) => {    
    try {
      const { name, subtypeId, treatmentId } = req.body;
      if (subtypeId && treatmentId && name) {
        const response = await object.treatment_list.create({
          name: name,
          treatment_type_id: treatmentId,
          treatment_subtype_id: subtypeId,
        });

        if (!response) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }
        res.status(201).send(response);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/', async (req, res, _next) => {    
    try {
      const { id, newName } = req.body;
      if (id && newName) {
        const result = await object.treatment_list.update({ name: newName }, { where: { id: id } });
        if (result > 0) {
          return res.status(200).json(HTTPResponses.Success(200));
        }
        return res.status(500).json(HTTPResponses.Error[500]);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.delete('/', async (req, res, _next) => {    
    try {
      const { id } = req.body;
      const result = await object.treatment_list.destroy({ where: { id: id } });
      if (result) {
        return res.status(200).json(HTTPResponses.Success[200]);
      } else {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        res.status(409).json(HTTPResponses.Error[409]);
      } else {
        console.error(ConsoleResponses.DELETE_ERROR, error);
        res.status(500).json(HTTPResponses.Error[500]);
      }
    }
  });

  router.get('/type', async (_req, res, _next) => {
    try {
      const result = await object.treatment_type.findAll({ order: [['name', 'ASC']] });
      res.status(200).send(result);
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/type', async (req, res, _next) => {
    const { name } = req.body;

    try {
      if (name) {
        const response = object.treatment_type.create({ name: name });
        if (!response) {
          return res.status(500).json(HTTPResponses.Error[500]);
        }
        res.status(201).send(response);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/type', async (req, res, _next) => {
    try {
      const { id, name } = req.body;  
      if (!id || !name) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const treatmentType = await object.treatment_type.findOne({ where: { id: id } });
      if (!treatmentType) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
      const response = await treatmentType.update({ name: name });
      if (!response) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.delete('/type', async (req, res, _next) => {
    
    try {
      const { id } = req.body;
      if (!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const response = await object.treatment_type.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      console.error(ConsoleResponses.DELETE_ERROR, error);
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      }
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.get('/subtype', async (req, res, _next) => {
    try {
      const id = req.header('id');
      console.log(id)
      if(!id) {
        return res.status(400).json(HTTPResponses.Error[400]);
      }
      const whereClause = id ? { where: { treatment_type_id: id } } : {};
      const response = await object.treatment_subtype.findAll(whereClause);
      if (response) {
        return res.status(200).send(response);
      } else {
        return res.status(404).json(HTTPResponses.Error[404]);
      }
    } catch (error) {
      console.error(ConsoleResponses.GET_ERROR, error);
      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.post('/subtype', async (req, res, _next) => {    
    try {
      const { name, id } = req.body;
      if (name && id) {
        const response = await object.treatment_subtype.create({
          name: name,
          treatment_type_id: id,
        });

        if (!response) {
          return res.status(400).json(HTTPResponses.Error[400]);
        }

        res.status(201).send(response);
      } else {
        res.status(400).json(HTTPResponses.Error[400]);
      }
    } catch (error) {
      console.error(ConsoleResponses.POST_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.patch('/subtype', async (req, res, _next) => {
    const { id, name } = req.body;

    if (!id || !name) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    try {
      const treatmentSubtype = await object.treatment_subtype.findOne({ where: { id: id } });
      if (!treatmentSubtype) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      const result = await treatmentSubtype.update({ name: name });
      if (!result) {
        return res.status(500).json(HTTPResponses.Error[500]);
      }

      return res.status(201).json(HTTPResponses.Success[201]);
    } catch (error) {
      console.error(ConsoleResponses.PATCH_ERROR, error);
      res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  router.delete('/subtype', async (req, res, _next) => {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json(HTTPResponses.Error[400]);
    }

    try {
      const response = await object.treatment_subtype.destroy({ where: { id: id } });
      if (!response) {
        return res.status(404).json(HTTPResponses.Error[404]);
      }

      return res.status(200).json(HTTPResponses.Success[200]);
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(409).json(HTTPResponses.Error[409]);
      }

      return res.status(500).json(HTTPResponses.Error[500]);
    }
  });

  return router;
}