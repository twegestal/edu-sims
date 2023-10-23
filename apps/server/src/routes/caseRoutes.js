import { Router } from "express";
import * as object from "../objects/object_index.js";

export const getCaseRoutes = (db) => {
    const router = Router();

    router.post('/createCase', async (req, res, next) => {
        
    })
    router.get('/getAllCases',async(req,res,next)=>{
        const Cases = await object.medical_case.findAll();    
        res.status(200).json(Cases);
    }) 
    router.get('/getCaseById', async(req,res,next)=>{
        /*
        Hämta specific case
        const result = await medical_case.findOne({
            where: {
            id: req.query.id
            }
        });
        */
        const caseSteps = await object.step.findAll({
            where: {
                case_id: req.query.id
            }
            
        });
        //detta är bara en reminder på hur det funkar
        /*const plan = await examination.findOne({
            where:{
                id: test[3].step_id
            }
        })
        res.status(201).json(plan.examination_to_display)
        
        const plan = await examination.findOne({
            where:{
                id: test[3].step_id
            }
        })
        */

        res.status(201).json(caseSteps)
    })

    return router;
}