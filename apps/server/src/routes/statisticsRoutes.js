import { Router } from 'express';
import * as object from '../models/object_index.js';
import { Op, QueryTypes } from 'sequelize';
import { db } from '../database/databaseConnection.js';


export const getStatisticRoutes = () => {
  const router = Router();

  router.get('/getTotalAmountUsers', async (_req, res, _next) => {
    const amount = await object.end_user.count();
    res.status(200).json(amount);
  });

  router.get('/getActiveUsers', async (req, res, _next) => {
    const amount = await object.end_user.count(
    { 
        where: { last_login: {[Op.gt]: req.header('startdate')} }
    }
    );
    res.status(200).json(amount);
  });

  router.get('/allCasesStatistics', async (req, res, _next) => {
    const result = await db.query(
      "SELECT * FROM attempt left outer join medical_case on attempt.case_id = medical_case.id",
      { type: QueryTypes.SELECT }
    );
    res.status(200).json(result);
  });

  return router;
};
