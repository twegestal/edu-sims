import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const introduction = db.define('introduction', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    description:{
        type: DataTypes.TEXT,
    },
    prompt:{
        type: DataTypes.TEXT
    },
    feedback_correct:{
        type: DataTypes.TEXT
    },
    feedback_incorrect:{
        type: DataTypes.TEXT
    }
},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});





const examination = {
    id: String,
    description: String,
    prompt: String, 
    feedback_correct: String,
    feedback_incorrect: String
}

