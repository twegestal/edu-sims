import { Router } from "express";
import { end_user } from '../objects/end_user.js';

export const getUserRoutes = (db) => {
    const router = Router();

    router.post('/login', async (req, res, next) => {
        /*

        */
        const result = await end_user.findOne({
            where : {
                email : req.body.email
            }
        });

        if (result === null) {
            res.status(404).json('Username or password incorrect'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }

        if (req.body.password === result.password) {
            res.status(200).json(
                {
                    id : result.id
                }
            );
        }
        else {
            res.status(400).json('Username or password incorrect'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
    })

    router.post('/register', async (req, res, next) => {
    /*
    Registers a user in the DB using the end_user class
    */
        console.log(req.body.email)
        const user = await end_user.create({
            group_id : req.body.group_id,
            email : req.body.email,
            password : req.body.password,
            is_admin : false
        })
        res.status(201).json(''); 
    })
       
    
    router.post('/login', async (req, res, next) => {
        const result = await end_user.findAll({
            where: {
            email: 'hej@gmail.com'
            }
        });
        console.log(result[0].email)
    })

    return router;
}