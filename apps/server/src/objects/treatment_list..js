import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const treatment_list = db.define('treatment_list', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type:DataTypes.TEXT
    },
    treatment_type_id:{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    treatment_subtype_id:{
        type : DataTypes.UUID,
        defaultValue : UUIDV4
    }
});



