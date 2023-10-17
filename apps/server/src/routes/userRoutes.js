import { Router } from "express";
import { end_user } from '../objects/end_user.js';

export const getUserRoutes = (db) => {
    const router = Router();

    router.get('', async (req, res, next) => {
        const user = await end_user.findOne({
            where : {
                id : req.body.user_id
            }
        })

        if (user === null) {
            res.status(404).json('User not found'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
        else {
            res.status(200).json(user);
        }
    })

    router.post('/login', async (req, res, next) => {
        /*
        Sequelize uses the provided email to query the database:
        */
        const user = await end_user.findOne({
            where : {
                email : req.body.email
            }
        });


        if (user === null) {
            res.status(404).json('Username or password incorrect'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
        else {
            if (req.body.password === user.password) {
                res.status(200).json(
                    {
                        id : result.id
                    }
                );
            }
            else {
                res.status(404).json('Username or password incorrect'); //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
            }
        }
    })

    router.post('/register', async (req, res, next) => {
        /*
        Queries the database to see if the email is already in use:
        */
        const result = await end_user.findOne({
            where : {
                email : req.body.email
            }
        });

        if (result != null) {
            res.status(400).json('Email is already registered') //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
        else {
            /*
            If the email is not found in the database, inserts a new row with new user in the end_user table:
            */
            const user = await end_user.create({
                group_id : req.body.group_id,
                email : req.body.email,
                password : req.body.password,
                is_admin : false
            })
            res.status(201).json({
                email : req.body.email,
                message : 'Registration successful'
            }); 
        }
        
    })

    router.patch('/update-password', async (req, res, next) =>{
        /*
        Query the database to see if the user exists:
        */
        const user = await end_user.findOne({
            where : {
                id : req.body.user_id
            }
        })

        if (user === null) {
            res.status(400).json('User not registered') //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
        else {
            await user.update({
                password : req.body.new_password
            })

            res.status(200).json('Password updated successfully');
        }
    })

    router.delete('', async (req, res, next) =>{
        /*
        Query the database to see if the user exists:
        */
        const user = await end_user.findOne({
            where : {
                id : req.body.user_id
            }
        })

        if (user === null) {
            res.status(400).json('User not found') //TODO: ändra felmeddelandet alternativt skriv det någon annanstans?
        }
        else {
            await end_user.destroy({
                where : {
                    id : user.id
                }
            });

            res.status(200).json('User removed');
        }
    })

    router.delete('/delete-all-users', async (req, res, next) => {
        //await end_user.truncate();
        //metoden ovan funkar inte när det finns foreign key constraints, jag blev lite skraj och har inte fortsatt :)
        res.status(200).json('All users removed');
    })

    return router;
}