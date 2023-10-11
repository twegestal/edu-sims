import { Router } from "express";
import { setupModel } from '../objects/end_user.js';

export const getUserRoutes = (sequalize) => {
    const router = Router();

    router.post('/register', async (req, res, next) => {
        try {
            await sequalize.authenticate();
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
    })

    
    /*
    router.post('/create', async (req, res, next) => {
        const client = new Client({
            host: 'pgserver.mau.se',
            port: 5432,
            database: 'edu_sims_test',
            user: 'am6110',
            password: 'eky5mc9s',
        });
          
        await client.connect();

        const result = await client.query('SELECT * FROM end_user;');
        console.log(result.rows[0].email);
        console.log('result: ' + result);
        console.log('result end!')

        await client.end()
    })
    */
    
    return router;
}