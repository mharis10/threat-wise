const { Model, DataTypes } = require('sequelize');
const { sequelize } = require('../startup/db');
const Joi = require('joi');

class GroupMember extends Model {}

GroupMember.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    groupId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'groups',
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
  },
  {
    sequelize,
    modelName: 'GroupMember',
    tableName: 'groupMembers',
    timestamps: false,
  }
);

function validateGroupMember(groupMember) {
  const groupMemberSchema = Joi.object({
    groupId: Joi.number().integer().positive().required(),
    userIds: Joi.array()
      .items(Joi.number().integer().positive().required())
      .min(1)
      .required(),
  });

  return groupMemberSchema.validate(groupMember);
}

module.exports = { GroupMember, validateGroupMember };
