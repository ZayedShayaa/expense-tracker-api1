const sequelize_connect = require("../config/connect");
const { DataTypes } = require("sequelize");

  const ExpenseFile = sequelize_connect.define('ExpenseFile', {
    expense_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    filename: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    file_url: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    
  }, {
    tableName: 'expense_files',
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

module.exports = ExpenseFile;
