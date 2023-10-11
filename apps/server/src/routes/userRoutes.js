import { Router } from "express";
import { connectToDatabase } from "../database/databaseConnection.js";
import pkg from 'pg';
const {Client} = pkg;

export const getUserRoutes = () => {
    const router = Router();

    router.post('/register', (req, res, next) => {
        res.status(201).json('hej registrering');
    })

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
    
    return router;
}