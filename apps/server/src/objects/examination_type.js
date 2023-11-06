import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { examination_list } from './examination_list.js';

export const examination_type = db.define(
  'examination_type',
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
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
