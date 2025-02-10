const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');

class Campaign extends Model {}

Campaign.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'companies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    createdTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Campaign',
    tableName: 'campaigns',
    timestamps: false,
  }
);

function validateCampaign(campaign) {
  const campaignSchema = Joi.object({
    name: Joi.string().max(100).required(),
  });

  return campaignSchema.validate(campaign);
}

module.exports = { Campaign, validateCampaign };
