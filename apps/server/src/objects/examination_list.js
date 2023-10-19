import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';

export const examination = db.define('examination', {
    id : {
        type : DataTypes.UUID,
        defaultValue : DataTypes.UUIDV4,
        allowNull : false,
        primaryKey : true
    },
    prompt:{
        type:DataTypes.TEXT
    },
    examination_to_display:{
        type:DataTypes.JSON
    },
    feedback_correct:{
        type:DataTypes.TEXT
    },
    feedback_incorrect:{
        type:DataTypes.TEXT
    },
    max_nbr_tests:{
        type:DataTypes.INTEGER
    }
},{
    // Other model are go here
    freezeTableName : true,
    timestamps : false
});
const examination_list = {
    id: String,
    name: String,
    examination_type_id: String,
    examination_subtype_id: String
    }

