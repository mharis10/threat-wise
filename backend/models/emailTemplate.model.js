const { DataTypes, Model } = require('sequelize');
const Joi = require('joi');
const { sequelize } = require('../startup/db');

class EmailTemplate extends Model {}

EmailTemplate.init(
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
    title: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    body: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tags: {
      type: DataTypes.TEXT,
      allowNull: true,
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
    modelName: 'EmailTemplate',
    tableName: 'emailTemplates',
    timestamps: false,
  }
);

function validateEmailTemplate(emailTemplate) {
  const validTags = process.env.VALID_TAGS.split(',').map((tag) => tag.trim());

  const emailTemplateSchema = Joi.object({
    title: Joi.string().max(100).required(),
    subject: Joi.string().max(100).required(),
    body: Joi.string().required(),
    tags: Joi.array()
      .items(Joi.string().valid(...validTags))
      .optional(),
    // .allow(null, '', []),
  });

  return emailTemplateSchema.validate(emailTemplate);
}

module.exports = {
  EmailTemplate,
  validateEmailTemplate,
};
