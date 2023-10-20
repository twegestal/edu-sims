/*
Already exists in src/objects, seems like it's been handled like this one.

import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const end_user = db.define('end_user', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    email : {
        type : DataTypes.TEXT
    },
    password :{
        type : DataTypes.TEXT
    },
    is_admin :{
        type : DataTypes.Boolean
    },
    group_id : {
        type : DataTypes.TEXT
    }
});
*/