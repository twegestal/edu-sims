import { Router } from 'express';
import { createRefreshCookie, createToken, validateRefreshToken } from '../utils/jwtHandler.js';
import { comparePasswords, hashPassword } from '../utils/crypting.js';
import * as object from '../models/object_index.js';

export const authRouter = () => {
  const router = Router();

  router.post('/login', async (req, res, _next) => {
    const { email, password } = req.body;
    const user = await object.end_user.findOne({
      where: {
        email: email,
      },
    });

    if (user === null) {
      res.status(404).send({ message: 'Username or password incorrect' });
    } else {
      if (await comparePasswords(password, user.password)) {
        const token = createToken(user.id);
        const refreshToken = createRefreshCookie(user.id);
        user.refresh_token = refreshToken;
        user.last_login = Date();
        try {
          await user.save();
        } catch (error) {
          console.error('error saving updated user to database', error);
        }

        res
          .cookie('refreshToken', refreshToken, { httpOnly: true, sameSite: 'strict' })
          .status(200)
          .send({
            id: user.id,
            email: user.email,
            token: token,
            isAdmin: user.is_admin,
          });
      } else {
        res.status(404).send({ message: 'Username or password incorrect' });
      }
    }
  });

  router.post('/register', async (req, res, _next) => {
    const { email, password, group_id } = req.body;

    const result = await object.end_user.findOne({
      where: {
        email: email,
      },
    });

    const hashedPassword = await hashPassword(password);

    if (result !== null) {
      res.status(400).json('Email is already registered');
    } else {
      const user = await object.end_user.create({
        group_id: group_id,
        email: email,
        password: hashedPassword,
        is_admin: false,
      });
      res.status(201).send({
        id: user.id,
        message: 'Registration successful',
      });
    }
  });

  router.patch('/reset-password', async (req, res, next) => {
    const { user_id, new_password } = req.body;
    const user = await object.end_user.findOne({
      where: {
        id: user_id,
      },
    });

    if (user === null) {
      res.status(400).send('User not registered');
    } else {
      const hash = await hashPassword(new_password);
      await user.update({
        password: hash,
      });

      res.status(200).send('Password updated successfully');
    }
  });

  return router;
};
