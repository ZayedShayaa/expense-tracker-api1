const sequelize_connect = require("../config/connect");
const { DataTypes } = require("sequelize");

const User = sequelize_connect.define(
  "User",
  {
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password_hash: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    tableName: "users",
    timestamps: true,
    underscored: true,
    paranoid: true,
  }
);

module.exports = User;
