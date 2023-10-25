import { Router } from "express";
import * as object from "../objects/object_index.js";
import { examination_list } from "../objects/examination_list.js";

export const getCaseRoutes = (db) => {
    const router = Router();

    router.post('/createCase', async (req, res, next) => {
        
    })
    //hämtar alla cases
    router.get('/getAllCases',async(req,res,next)=>{
        const Cases = await object.medical_case.findAll();    
        res.status(200).json(Cases);
    }) 
    // Hämtar ett specifict case beroende på dess id
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
                case_id: req.header('case_id')
            },
            order: [
                ['index', 'ASC']
            ]
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
    //Hemta alla medical fields
    router.get('/getMedicalFields', async(req,res,next)=>{
        const result = await object.medical_field.findAll({});
        res.status(200).json(result);
    })
    //TODO fixa 5 endpoints för alla typer ov steps + hämsta listan av case type

    //Hämta specifict Introduction step
    router.get('/getIntroductionStep', async(req,res,next)=>{
        const reuslt = await object.introduction.findAll({
            where: {
                id: req.header('id')
            }
        });
        res.status(200).json(reuslt);
    })
    //Hämta specifict Examination step
    router.get('/getExaminationStep', async(req,res,next)=>{
        const reuslt = await object.examination.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(reuslt);
    })
    //Hämta specifict Diagnosis step
    router.get('/getDiagnosisStep', async(req,res,next)=>{
        const result = await object.diagnosis.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(result);
    })
    //Hämta specifict Treatment step
    router.get('/getTreatmentStep', async(req,res,next)=>{
        const result = await object.treatment.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(result);
    })
    //Hämta specifict Summary step
    router.get('/getSummaryStep', async(req,res,next)=>{
        const result = await object.summary.findAll({
            where: {
                id: req.query.id
            }
        });
        res.status(200).json(result);
    })

    router.get('/getSpecificValues', async(req,res,next)=>{
        const result = await object.step_specific_values.findAll({
            where:{
                id : req.query.id
            }
        });
        res.status(200).json(result);
    })

    router.get('/getExaminationTypes', async (req,res,next)=>{
        const Value = await object.examination_type.findAll({});
        res.status(200).json(Value);
    })
    // Tar emot en examination types id och hämtar alla subtyper för det id
    router.get('/getExaminationSubtypes', async (req,res,next)=>{
        if(req.query.id == null){
            res.status(200).json("NOT FOUND");
        }
        else{
            const result = await object.examination_subtype.findAll({
                where : {
                    examination_type_id : req.query.id
                }
            });
            res.status(200).json(result);
        }
    })
    // kanske bara hämta beroende på examination_type_id och examination_subtyp_id för hämta delar av examinationer
    router.get('/getExaminationList', async (req,res,next)=>{
        const Value = await examination_list.findAll({});
        res.status(200).json(Value);
    })

    router.get('/getTreatmentTypes', async (req,res,next)=>{
        const result = object.treatment_type.findAll({});
        res.status(200).json(result);
    })
    router.get('/getTreatmentSubtypes', async (req,res,next)=>{
        const result = object.treatment_type.findAll({
            where :{
                treatment_type_id : req.query.id
            }
        });
        res.status(200).json(result);
    })


    return router;
}