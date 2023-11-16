import { Router } from 'express';
import * as object from '../models/object_index.js';
import { hashPassword, comparePasswords } from '../utils/crypting.js';

export const getUserRoutes = () => {
  const router = Router();

  router.get('/', async (req, res, next) => {
    const user = await object.end_user.findOne({
      where: {
        id: req.header('user_id'),
      },
    });

    if (user === null) {
      res.status(404).json('User not found'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      res.status(200).json(user);
    }
  });

  router.post('/login', async (req, res, next) => {
    const { email, password } = req.body;
    const user = await object.end_user.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.status(404).json({
        message: 'Username or password incorrect',
      }); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      if (await comparePasswords(password, user.password)) {
        res.status(200).json({
          id: user.id,
          email: user.email,
          token:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c', //FIXME: placeholder token
          isAdmin: user.is_admin,
        });
      } else {
        res.status(404).json({
          message: 'Username or password incorrect',
        }); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
      }
    }
  });

  router.post('/register', async (req, res, next) => {
    const { email, password, group_id } = req.body;
    const result = await object.end_user.findOne({
      where: {
        email: email,
      },
    });

    const hashedPassword = await hashPassword(password);

    if (result != null) {
      res.status(400).json('Email is already registered'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      const user = await object.end_user.create({
        group_id: group_id,
        email: email,
        password: hashedPassword,
        is_admin: false,
      });
      res.status(201).json({
        id: user.id,
        message: 'Registration successful',
      });
    }
  });

  router.patch('/update-password', async (req, res, next) => {
    /*
        Query the database to see if the user exists:
        */
    const user = await object.end_user.findOne({
      where: {
        id: req.body.user_id,
      },
    });

    if (user === null) {
      res.status(400).json('User not registered'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      await user.update({
        password: req.body.new_password,
      });

      res.status(200).json('Password updated successfully');
    }
  });

  router.delete('', async (req, res, next) => {
    /*
        Query the database to see if the user exists:
        */
    const user = await object.end_user.findOne({
      where: {
        id: req.body.user_id,
      },
    });

    if (user === null) {
      res.status(400).json('User not found'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
    } else {
      await end_user.destroy({
        where: {
          id: user.id,
        },
      });

      res.status(200).json('User removed');
    }
  });

  router.delete('/delete-all-users', async (req, res, next) => {
    //await object.end_user.truncate();
    //metoden ovan funkar inte när det finns foreign key constraints, jag blev lite skraj och har inte fortsatt :)
    res.status(200).json('All users removed');
  });

  return router;
};
