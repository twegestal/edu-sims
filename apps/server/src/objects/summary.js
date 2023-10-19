import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const summary = db.define('summary', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    process : {
        type : DataTypes.TEXT,
        allowNull : false
    },
    additional_info: {
        type : DataTypes.TEXT,
        allowNull : false
    },
    additional_links : {
        type : DataTypes.TEXT,
        allowNull : false
    }
},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});



