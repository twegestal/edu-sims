import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { step } from './step.js';


export const module_type = db.define('module_type', {
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
  module_type_identifier: {
    type : DataTypes.INTEGER,
    allowNull : false
  }
}, {
  // Other model information goes here
  freezeTableName : true,
  timestamps : false
});

