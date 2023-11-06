import { DataTypes, Sequelize } from 'sequelize';
import { db } from '../database/databaseConnection.js';
import { end_user } from './end_user.js';
import { attempt } from './attempt.js';
import { medical_field } from './medical_field.js';
import { step } from './step.js';

export const medical_case = db.define(
  'medical_case',
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
    medical_field_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    creator_user_id: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    published: {
      type: DataTypes.BOOLEAN,
    },
  },
  {
    // Other model information goes here
    freezeTableName: true,
    timestamps: false,
  },
);
