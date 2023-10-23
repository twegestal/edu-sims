import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { medical_case } from './medical_case.js';
import { diagnosis_list } from './diagnosis_list.js';


export const medical_field = db.define('medical_field', {
  // Model attributes are defined here
  id : {
    type : DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull : false,
    primaryKey: true
  },
  name: {
    type : DataTypes.TEXT
  }
}, {
  // Other model information goes here
  freezeTableName : true,
  timestamps : false
});


