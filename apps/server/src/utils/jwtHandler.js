import jwt from 'jsonwebtoken';
import * as object from '../models/object_index.js';

export const createToken = (id) => {
  const res = jwt.sign({ id: id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '10s' });
  return res;
};

export const createRefreshCookie = (id) => {
  return jwt.sign({ id: id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

export const validateToken = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) {
    return res.status(401).send('No token provided');
  }

  try {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    next();
  } catch (error) {
    authWithRefreshToken(req, res, next);
  }
};

const authWithRefreshToken = async (req, res, next) => {
  const refreshToken = req.cookies['refreshToken'];
  const userId = await validateRefreshToken(refreshToken, res);

  if (userId) {
    const token = createToken(userId);
    res.setHeader('X-New-Token', token);
    next();
  }
}

export const validateRefreshToken = async (refreshToken, res) => {
  try {
    const user = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const dbUser = await object.end_user.findOne({
      attributes: ['refresh_token'],
      where: {
        id: user.id,
      },
    });

    return dbUser.refresh_token === refreshToken ? user.id : null;
  } catch (error) {
    console.error('Error parsing refresh token: ', error);
    res.status(401).send('Invalid refresh token');
  }
};
