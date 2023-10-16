import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { examination_list } from './examination_list.js';
import { examination_type } from './examination_type.js';


export const examination_subtype = db.define('examination_subtype', {
  // Model attributes are defined here
  id : {
    type : DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    allowNull : false,
    primaryKey: true
  },
  examination_type_id: {
    type : DataTypes.UUID,
    allowNull: false
  },
  name: {
    type : DataTypes.TEXT
  }
}, {
  // Other model are go here
  freezeTableName : true,
  timestamps : false
});


