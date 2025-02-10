const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');

class CampaignStat extends Model {}

CampaignStat.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    campaignId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'campaigns',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
    emailOpenCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    reportPhishingCount: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
  },
  {
    sequelize,
    modelName: 'CampaignStat',
    tableName: 'campaignStats',
    timestamps: false,
  }
);

module.exports = { CampaignStat };
