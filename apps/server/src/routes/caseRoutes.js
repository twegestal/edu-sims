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
       const caseSteps = await object.step.findAll({
           where: {
               case_id: req.query.id
           }
       });
       
       res.status(201).json(caseSteps)
    })
    router.get('/getMedicalFields', async(req,res,next)=>{
        const Value = await object.medical_field.findAll({});
        res.status(200).json(Value);
    })
    //TODO fixa 5 endpoints för alla typer ov steps + hämsta listan av case type

    //Hämta specifict Introduction step
    router.get('/getIntroductionStep', async(req,res,next)=>{
        const IntroductionValue = await object.introduction.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(IntroductionValue);
    })
    //Hämta specifict Examination step
    router.get('/getExaminationStep', async(req,res,next)=>{
        const examinationValue = await object.examination.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(examinationValue);
    })
    //Hämta specifict Diagnosis step
    router.get('/getDiagnosisStep', async(req,res,next)=>{
        const diagnosisValue = await object.diagnosis.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(diagnosisValue);
    })
    //Hämta specifict Treatment step
    router.get('/getTreatmentStep', async(req,res,next)=>{
        const treatmentValue = await object.treatment.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(treatmentValue);
    })
    //Hämta specifict Summary step
    router.get('/getSummaryStep', async(req,res,next)=>{
        const summaryValue = await object.summary.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(summaryValue);
    })

    router.get('/getSpecificValues', async(req,res,next)=>{
        const summaryValue = await object.step_specific_values.findAll({
            where:{
                id : req.query.id
            }
        });
        res.status(200).json(summaryValue);
    })

    router.get('/getExaminationTypes', async (req,res,next)=>{
        const Value = await object.examination_type.findAll({});
        res.status(200).json(Value);
    })
    // Tar emot en examination types id och hämtar alla subtyper för det id
    router.get('/getExaminationSubtypes', async (req,res,next)=>{
        const Value = await object.examination_subtype.findAll({
            where : {
                examination_type_id : req.query.id
            }
        });
        res.status(200).json(Value);
    })
    router.get('/getExaminationList', async (req,res,next)=>{
        const Value = await object.examination_list.findAll({});
        res.status(200).json(Value);
    })


    return router;
}