const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
const { sequelize } = require('../startup/db');

class Company extends Model {}

Company.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    industry: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },
    address: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    contractStartDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    contractLength: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    currentMailBoxes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    maxMailBoxes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    chatgptIntegration: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    trainingVideos: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    smsPhishingSimulation: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    widget: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    rewards: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0.0,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    modifiedTimestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: 'Company',
    tableName: 'companies',
    timestamps: false,
  }
);

function validateCompany(company) {
  const companySchema = Joi.object({
    name: Joi.string().max(100).required(),
    industry: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    address: Joi.string().max(500).required(),
    contractStartDate: Joi.date().required(),
    contractLength: Joi.string().max(100).required(),
    currentMailBoxes: Joi.number().integer().min(0).required(),
    maxMailBoxes: Joi.number().integer().min(0).required(),
    chatgptIntegration: Joi.boolean().required(),
    trainingVideos: Joi.boolean().required(),
    smsPhishingSimulation: Joi.boolean().required(),
    widget: Joi.boolean().required(),
    rewards: Joi.boolean().required(),
    price: Joi.number().precision(2).required(),
  });

  return companySchema.validate(company);
}

module.exports = {
  Company,
  validateCompany,
};
