import { db } from '../database/databaseConnection.js';




export const populateDB = async () => {
    db.models.end_user.create({
        email: '1',
        password: '1',
        is_admin: true,
        group_id: 'admin'
    })
}


