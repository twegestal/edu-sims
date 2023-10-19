import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const examination_subtype = db.define('examination_subtype', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    examination_type_id: {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    name : {
        type: DataTypes.TEXT
    }
});
