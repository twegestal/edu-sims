/*
was labled as examination in const examanition, upon checking file name
I discovered that it was supposed to be diagnosis
*/
import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const diagnosis = db.define('diagnosis', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    prompt:{
        type : DataTypes.TEXT
    },
    diagnosis_id :{
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false
    },
    feedback_correct :{
        type : DataTypes.TEXT
    },
    feedback_incorrect : {
        type : DataTypes.TEXT
    }
});


/*

this is the old code that was labled as examination
const examination = {
    id: String,
    prompt: String, 
    diagnosis_id: String,
    feedback_correct: String,
    feedback_incorrect: String
}
*/
