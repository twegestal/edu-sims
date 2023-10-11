//const { Sequelize, DataTypes } = require('sequelize');
//import { Sequelize, DataTypes } from "sequelize";

export default (sequalize, DataTypes) => {
  const end_user = sequalize.define('end_user', {
    // Model attributes are defined here
    id : {
      type : DataTypes.UUID,
      allowNull : false
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
    }
  }, {
    // Other model options go here
    freezeTableName : true,
    timeStamps : false
  });

  return end_user;
}



