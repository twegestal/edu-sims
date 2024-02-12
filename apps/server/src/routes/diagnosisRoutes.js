import express from 'express';

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
  

  router.post('/', async (req, res, _next) => {
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

  router.patch('/', async (req, res, _next) => {
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

  router.delete('/', async (req, res, _next) => {
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

  return router;
}