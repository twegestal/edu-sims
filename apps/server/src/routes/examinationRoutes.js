import express from 'express';

export const examinationRouter = () => {
  const router = express();

  router.get('/', async (req, res, _next) => {
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

  router.post('/', async (req, res, _next) => {
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

  router.patch('/', async (req, res, _next) => {
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

  router.delete('/', async (req, res, _next) => {
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

  router.get('/type', async (req, res, _next) => {
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

  router.post('/type', async (req, res, _next) => {
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

  router.patch('/type', async (req, res, _next) => {
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

  router.delete('/type', async (req, res, _next) => {
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

  router.get('/subtype', async (req, res, _next) => {
    try {
      const examinationTypeId = req.header('examination_type_id');
      const id = req.header('id');

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

  router.post('/subtype', async (req, res, _next) => {
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

  router.patch('/subtype', async (req, res, _next) => {
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

  router.delete('/subtype', async (req, res, _next) => {
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

  router.patch('/range', async (req, res, _next) => {
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

  return router;
}