import express from 'express';
import cookieParser from 'cookie-parser';
import { getUserRoutes } from './routes/userRoutes.js';
import { getCaseRoutes } from './routes/caseRoutes.js';
import { authRouter } from './routes/authRoutes.js';
import { validateToken } from './utils/jwtHandler.js';
import { getStatisticRoutes } from './routes/statisticsRoutes.js';

export const createServer = () => {
  const app = express();

  app.get('/', (_req, res) => {
    res.json('Hello, world!');
  });
  app.use(express.json());
  app.use(cookieParser());
  app.use('/auth', authRouter());
  app.use(validateToken);
  app.use('/user', getUserRoutes());
  app.use('/case', getCaseRoutes());
  app.use('/statistic', getStatisticRoutes());

  return app;
};
