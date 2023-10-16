import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { treatment } from './treatment.js';
import { treatment_list } from './treatment_list.js';


export const step_specific_treatment = db.define('step_specific_treatment', {
  // Model attributes are defined here
  id : {
    type : DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull : false,
    primaryKey: true
  },
  treatment_step_id: {
    type : DataTypes.UUID,
    allowNull : false,
  },
  treatment_id: {
    type : DataTypes.UUID,
    allowNull : false,
  },
  value: {
    type : DataTypes.TEXT
  }
}, {
  // Other model information goes here
  freezeTableName : true,
  timestamps : false
});


