import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const step = db.define('step', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    case_id : {
        type : DataTypes.UUID,
        allowNull: false,
        references: 'medical_case',
        referencesKey: 'id',
    },
    index : {
        type: DataTypes.INTEGER,
        allowNull : false,
    },
    module_type_identifier : { 
        type : DataTypes.INTEGER,
        allowNull: false,
        references: 'module_type',
        referencesKey: 'module_type_identfier'
    },
    step_id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    }
},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});

