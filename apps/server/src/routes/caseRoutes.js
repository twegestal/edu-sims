import { Router } from "express";
import { medical_case } from '../objects/medical_case.js';
import { step } from "../objects/step.js";
import { summary } from "../objects/summary.js";
import { introduction } from "../objects/introduction.js";
import { examination } from "../objects/examination_list.js";

export const getCaseRoutes = (db) => {
    const router = Router();

    router.post('/createCase', async (req, res, next) => {
        
    })
    router.get('/GetCaseById', async(req,res,next)=>{
        const result = await medical_case.findOne({
            where: {
            id: req.query.id
            }
        });
        const test = await step.findAll({
            where: {
                case_id: req.query.id
            }
        });
        //detta fungerar bara som ett reminder hur det funkar
        /*const plan = await examination.findOne({
            where:{
                id: test[3].step_id
            }
        })
        res.status(201).json(plan.examination_to_display)
        */
        const plan = await examination.findOne({
            where:{
                id: test[3].step_id
            }
        })
        res.status(201).json(plan.examination_to_display.Labbanalyser[0])
    })

    return router;
}