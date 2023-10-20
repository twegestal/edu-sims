import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const attempt = db.define('attempt', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    user_id:{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    case_id :{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    is_finished :{
        type : DataTypes.Boolean
    },
    faults : {
        type : DataTypes.Integer
    },
    timestamp_started : {
        type: DataTypes.Date
    },
    timestamp_finished : {
        type : DataTypes.Date
    },
    correct_diagnosis : {
        type : DataTypes.Boolean
    }
});
