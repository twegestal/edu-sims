import dotenv from 'dotenv';
import jwt from 'jsonwebtoken';

const KEY = process.env.JWT_KEY;

export const generateJWT = (user) => {
  const payload = {
    id: user.id,
    email: user.email,
  };
  return jwt.sign(payload, KEY, { expiresIn: '1h' });
};
