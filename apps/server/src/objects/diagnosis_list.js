import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { medical_field } from './medical_field.js';


export const diagnosis_list = db.define('diagnosis_list', {
  // Model attributes are defined here
  id : {
    type : DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull : false,
    primaryKey: true
  },
  name: {
    type : DataTypes.TEXT
  },
  medical_field_id_id: {
    type : DataTypes.UUID,
    allowNull: false
  }
}, {
  // Other model information goes here
  freezeTableName : true,
  timestamps : false
});



