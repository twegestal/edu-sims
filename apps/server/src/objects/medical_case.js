import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const end_user = db.define('medical_field', {
    Id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    name : {
        type : DataTypes.TEXT,
        allowNull : false,
    },
    medical_field_id : { 
        type : DataTypes.UUID,
        allowNull : false
    },
    creator_user_id : { 
        type : DataTypes.UUID,
        allowNull : false
    },
    published : {
        type : DataTypes.Boolean,
        allowNull : false
    }

},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});



