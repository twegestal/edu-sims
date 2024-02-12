import express from "express"

export const medicalFieldRouter = () => {
  const router = express();

  router.get('/', async (_req, res, _next) => {
    try {
      const result = await object.medical_field.findAll({});
      res.status(200).send(result);
    } catch (error) {
      console.error('error fetching medical fields', error);
      res.status(500).json('Something went wrong');
    }
  });

  router.post('/', async (req, res, _next) => {
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

  router.patch('/', async (req, res, _next) => {
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

  router.delete('/', async (req, res, _next) => {
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

  return router;
}