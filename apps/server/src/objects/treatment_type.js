import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { treatment_list } from './treatment_list.js';


export const treatment_type = db.define('treatment_type', {
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

