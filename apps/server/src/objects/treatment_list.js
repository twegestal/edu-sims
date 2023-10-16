import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { treatment_type } from './treatment_type.js';
import { treatment_subtype } from './treatment_subtype.js';


export const treatment_list = db.define('treatment_list', {
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
  treatment_type_id: {
    type : DataTypes.UUID,
    allowNull: false
  },
  treatment_subtype_id: {
    type : DataTypes.UUID,
    allowNull: false
  }
}, {
  // Other model information goes here
  freezeTableName : true,
  timestamps : false
});



