import express from 'express';

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
      res.status(200).json(treatments);
    } catch (error) {
      console.error('Error fetching treatment list: ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/', async (req, res, _next) => {
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

  router.patch('/', async (req, res, _next) => {
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

  router.delete('/', async (req, res, _next) => {
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

  router.get('/type', async (_req, res, _next) => {
    try {
      const result = await object.treatment_type.findAll({ order: [['name', 'ASC']] });
      res.status(200).send(result);
    } catch (error) {
      console.error('error fetching treatment types ', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/type', async (req, res, _next) => {
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

  router.patch('/type', async (req, res, _next) => {
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

  router.delete('/type', async (req, res, _next) => {
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

  router.get('/subtype', async (req, res, _next) => {
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

  router.post('/subtype', async (req, res, _next) => {
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

  router.patch('/subtype', async (req, res, _next) => {
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

  router.delete('/subtype', async (req, res, _next) => {
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

  return router;
}