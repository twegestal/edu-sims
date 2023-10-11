import { Router } from "express";
import { end_user } from '../objects/end_user.js';

export const getUserRoutes = (db) => {
    const router = Router();

    router.post('/register', async (req, res, next) => {
        try {
            await db.authenticate();
            console.log('Connection has been established successfully.');
          } catch (error) {
            console.error('Unable to connect to the database:', error);
        }

        const user = await end_user.create({
            email : 'hej@gmail.com',
            password : '12345',
            salt : 'kjhfaskjhf',
            is_admin : true
        })
        res.status(201).json(user.email); 
    })
    
    return router;
}