import { Router } from 'express';
import * as object from '../objects/object_index.js';


export const getStatisticsRoutes = (db) => {
    const router = Router();
    router.get('/getAllAttempts', async (req, res, next) => {
        const result = object.attempt.findAll();
        res.status(200).json(result);
    })
    router.get('/getAttemptByCaseId', async (req, res, next) => {
        if (req.header.id) {
            const result = object.attempt.findAll({
                where: {
                    id: req.header.case_id
                }
            });
            //TODO: måste uppdatera attempt tabellen med en ny column som sparar antalet tests som körs
            res.status(200).json(result);
        }
        res.status(400).json("No id Was given");
    })
    //TODO: Måste modulera databasen user måste har en ny column med senaste inloggning
    router.get('/getUserLastDay', async (req, res, next) => {
        if (req.header.date) {
            const result = object.attempt.findAll({
                where: {
                    logging_date: req.header.date
                }
            });
            res.status(200).json(result.count);
        }
        res.status(400).json("No id Was given");
    })

    return router;
};


