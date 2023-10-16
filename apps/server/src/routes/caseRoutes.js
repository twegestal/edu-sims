import { Router } from "express";


export const getCaseRoutes = (db) => {
    const router = Router();

    router.post('/createCase', async (req, res, next) => {
        
    })
    router.get('/GetCaseById', async(req,res,next)=>{
        res.status(201).json(req.body.ID)
    })
    

    return router;
}