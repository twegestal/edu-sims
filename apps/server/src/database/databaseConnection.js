//import { Client } from 'pg'
import pkg from 'pg';
const {Client} = pkg;

export const connectToDatabase = async () => {
    const client = new Client({
        host: 'pgserver.mau.se',
        port: 5432,
        database: 'edu_sims_test',
        user: 'am6110',
        password: 'eky5mc9s',
    });
      
    await client.connect();

    return client;
}

