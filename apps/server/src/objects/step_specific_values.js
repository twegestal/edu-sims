import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const step_specific_values = db.define('step_specific_values', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    examination_step_id:{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    examination_id:{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    value: {
        type : DataTypes.TEXT,
    },
    is_normal: {
        type : DataTypes.Boolean
    }
});