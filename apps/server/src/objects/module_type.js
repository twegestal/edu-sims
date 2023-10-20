import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const module_type = db.define('module_type', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    name:{
        type : DataTypes.TEXT
    },
    module_type_identifier:{
        type:DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    }
});
