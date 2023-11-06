import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { examination_type } from './examination_type.js';
import { examination_subtype } from './examination_subtype.js';

export const examination_list = db.define(
  'examination_list',
  {
    // Model attributes are defined here
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.TEXT,
    },
    examination_type_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    examination_subtype_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
