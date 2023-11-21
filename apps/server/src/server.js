import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';
import { getCaseRoutes } from './routes/caseRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { validateToken } from './utils/jwtHandler.js';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use('/auth', authRouter());
  app.use(validateToken);
  app.use('/user', getUserRoutes());
  app.use('/case', getCaseRoutes());
  app.get('/', (_req, res) => {
      res.json('Hello, world!');
    });
  

  return app;
};
