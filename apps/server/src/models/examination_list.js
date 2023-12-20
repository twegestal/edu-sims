import { DataTypes, FLOAT } from 'sequelize';
import { db } from '../database/databaseConnection.js';

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
    min_value: {
      type: DataTypes.FLOAT
    },
    max_value: {
      type: DataTypes.FLOAT
    },
    is_randomizeable: {
      type: DataTypes.BOOLEAN
    }
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
