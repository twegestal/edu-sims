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

  router.get('/refreshToken', async (req, res, _next) => {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(400).json('Missing refreshToken');
    }

    try {
      const userId = await validateRefreshToken(refreshToken);
      if (userId === null) {
        return res.status(401).json('Invalid refresh token');
      }

      const user = await object.end_user.findOne({
        where: {
          id: userId,
        },
      });

      if (user === null) {
        return res.status(404).json('User does not exist');
      }
      const token = createToken(user.id);
      res.status(200).send({
        id: user.id,
        email: user.email,
        token: token,
        isAdmin: user.is_admin,
      });
    } catch (error) {
      if (error.message === 'Invalid refresh token') {
        res.status(401).json('Token expired');
      } else {
        res.status(500).json('Internal Server Error');
      }
    }
  });

  return router;
};
