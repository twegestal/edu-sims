import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';


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
  salt : {
    type : DataTypes.TEXT
  },
  is_admin : {
    type : DataTypes.BOOLEAN,
    allowNull : false
  },
}, {
  // Other model options go here
  freezeTableName : true,
  timestamps : false
});





