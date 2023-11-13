import express from 'express';
import { getUserRoutes } from './routes/userRoutes.js';
import { getCaseRoutes } from './routes/caseRoutes.js';
import { getStatisticsRoutes } from './routes/statisticsRoutes.js';
import { db } from './database/databaseConnection.js';

export const createServer = () => {
  const app = express();

  app.use(express.json());
  app.use('/statistics',getStatisticsRoutes())
  app.use('/user', getUserRoutes(db));
  app.use('/case', getCaseRoutes(db));

  app.get('/', (_req, res) => {
    res.json('Hello, world!');
  });

  return app;
};
