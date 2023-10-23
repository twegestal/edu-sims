import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { medical_case } from './medical_case.js';
import { attempt } from './attempt.js';


export const end_user = db.define('end_user', {
  // Model attributes are defined here
  id : {
    type : DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull : false,
    primaryKey: true
  },
  email: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  password: {
    type: DataTypes.TEXT,
    allowNull : false
  },
  is_admin : {
    type : DataTypes.BOOLEAN,
    allowNull : false
  },
  group_id : {
    type: DataTypes.TEXT
  }
}, {
  // Other model are go here
  freezeTableName : true,
  timestamps : false
});






