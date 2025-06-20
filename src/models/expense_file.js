const sequelize = require("../config/connect");
const { DataTypes } = require("sequelize");

  const ExpenseFile = sequelize.define('ExpenseFile', {
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
    // uploaded_at: {
    //   type: DataTypes.DATE,
    //   allowNull: false,
    //   defaultValue: DataTypes.NOW,
    // },
  }, {
    tableName: 'expense_files',
    timestamps: true,
    underscored: true,
    paranoid: true,
  });

module.exports = ExpenseFile;
