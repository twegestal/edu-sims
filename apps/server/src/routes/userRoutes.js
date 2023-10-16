import { Router } from "express";
import * as object from "../objects/object_index.js"

export const getUserRoutes = (db) => {
    const router = Router();

    router.post('/register', async (req, res, next) => {
    /*
    Registers a user in the DB using the end_user class
    */
        console.log(req.body.email)
        const user = await object.end_user.create({
            group_id : req.body.group_id,
            email : req.body.email,
            password : req.body.password,
            is_admin : false
        })
        res.status(201).json(''); 
    })
    
    router.post('/login', async (req, res, next) => {
        const result = await object.end_user.findAll({
            where: {
            email: 'hej@gmail.com'
            }
        });
        console.log(result[0].email)
    })


    return router;
}