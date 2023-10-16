import { Router } from "express";
import { medical_case } from '../objects/medical_case.js';

export const getCaseRoutes = (db) => {
    const router = Router();

    router.post('/createCase', async (req, res, next) => {
        
    })
    router.get('/GetCaseById', async(req,res,next)=>{
        const result = await medical_case.findAll({
            where: {
            Id: req.body.ID
            }
        });
        res.status(201).json(req.body.ID)
    })
    

    return router;
}