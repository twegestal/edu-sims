import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const treatment_subtype = db.define('treatment_subtype', {
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
        type:DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4
    }
});
