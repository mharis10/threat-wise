const { DataTypes, Model } = require('sequelize');
const { sequelize } = require('../startup/db');

class LoginAudit extends Model {}

LoginAudit.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
    loginIP: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    loginTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'LoginAudit',
    tableName: 'loginAudit',
    timestamps: false,
  }
);

module.exports = {
  LoginAudit,
};
