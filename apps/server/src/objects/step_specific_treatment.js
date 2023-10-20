import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const step_specific_treatment = db.define('step_specific_treatment', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    treatment_step_id:{
        type:DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    treatment_id:{
        type:DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    feedback_correct:{
        type:DataTypes.TEXT
    },
    value:{
        type:DataTypes.TEXT
    },
});

