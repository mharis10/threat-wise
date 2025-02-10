const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');

class CampaignRecipient extends Model {}

CampaignRecipient.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
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
    modelName: 'CampaignRecipient',
    tableName: 'campaignRecipients',
    timestamps: false,
  }
);

function validateCampaignRecipient(campaignRecipient) {
  const campaignRecipientSchema = Joi.object({
    campaignId: Joi.number().integer().positive().required(),
    userIds: Joi.array().items(Joi.number().integer().positive()).optional(),
    groupIds: Joi.array().items(Joi.number().integer().positive()).optional(),
  });

  return campaignRecipientSchema.validate(campaignRecipient);
}

module.exports = { CampaignRecipient, validateCampaignRecipient };
