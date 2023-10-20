import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const medical_case = db.define('medical_case', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    name:{
        type : DataTypes.TEXT
    },
    medical_field_id :{
        type:DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    creator_user_id :{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    published : {
        type : DataTypes.Boolean,
    }
});