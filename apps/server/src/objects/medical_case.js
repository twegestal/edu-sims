import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const medical_case = db.define('medical_case', {
    id : {
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
        references: 'medical_field',
        referencesKey: 'id',
        allowNull : false
    },
    creator_user_id : { 
        type : DataTypes.UUID,
        references: 'end_user',
        referencesKey: 'id',
        allowNull : false
    },
    published : {
        type : DataTypes.BOOLEAN,
        allowNull : false
    }

},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});



