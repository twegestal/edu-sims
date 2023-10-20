import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const treatment = db.define('treatment', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    prompt:{
        type:DataTypes.TEXT
    },
    treatments_to_display:{
        type:DataTypes.JSON
    },
    feedback_correct:{
        type:DataTypes.TEXT
    },
    feedback_incorrect:{
        type:DataTypes.TEXT
    },
});



