const { DataTypes, Model } = require('sequelize');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const { sequelize } = require('../startup/db');

class User extends Model {
  toSafeObject() {
    const {
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      mobileNumber,
      companyId,
      jobTitle,
      linkedin,
      location,
      department,
      language,
      lineManagerId,
      role,
      startDate,
      endDate,
      isActive,
      createdTimestamp,
      modifiedTimestamp,
    } = this;
    return {
      id,
      firstName,
      lastName,
      email,
      phoneNumber,
      mobileNumber,
      companyId,
      jobTitle,
      linkedin,
      location,
      department,
      language,
      lineManagerId,
      role,
      startDate,
      endDate,
      isActive,
      createdTimestamp,
      modifiedTimestamp,
    };
  }
}

User.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    firstName: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    lastName: {
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
    password: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },
    mobileNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    phoneNumber: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    companyId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'companies',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
    jobTitle: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    linkedin: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    location: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    department: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    language: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    lineManagerId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'users',
        key: 'id',
      },
      onDelete: 'CASCADE',
      onUpdate: 'RESTRICT',
    },
    role: {
      type: DataTypes.ENUM(
        process.env.SUPER_ADMIN,
        process.env.COMPANY_ADMIN,
        process.env.COMPANY_EMPLOYEE
      ),
      allowNull: false,
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
    endDate: {
      type: DataTypes.DATEONLY,
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
    modelName: 'User',
    tableName: 'users',
    timestamps: false,
  }
);

User.beforeCreate(async (user, options) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

function generateAccessToken(user) {
  const accessToken = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      mobileNumber: user.mobileNumber,
      companyId: user.companyId,
      jobTitle: user.jobTitle,
      location: user.location,
      department: user.department,
      language: user.language,
      lineManagerId: user.lineManagerId,
      role: user.role,
      startDate: user.startDate,
      endDate: user.endDate,
      isActive: user.isActive,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRY_SECONDS),
    }
  );
  return accessToken;
}

function generateRefreshToken(user) {
  const refreshToken = jwt.sign(
    {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      mobileNumber: user.mobileNumber,
      companyId: user.companyId,
      jobTitle: user.jobTitle,
      location: user.location,
      department: user.department,
      language: user.language,
      lineManagerId: user.lineManagerId,
      role: user.role,
      startDate: user.startDate,
      endDate: user.endDate,
      isActive: user.isActive,
    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRY_SECONDS),
    }
  );
  return refreshToken;
}

function validateUser(user) {
  const userSchema = Joi.object({
    firstName: Joi.string().max(100).required(),
    lastName: Joi.string().max(100).required(),
    email: Joi.string().email().max(100).required(),
    password: Joi.string().max(100).optional().allow(null, ''),
    phoneNumber: Joi.string().max(100).allow(null, ''),
    mobileNumber: Joi.string().max(100).allow(null, ''),
    companyId: Joi.number().optional().allow(null, ''),
    jobTitle: Joi.string().max(100).required(),
    linkedin: Joi.string().max(255).allow(null, ''),
    location: Joi.string().max(100).required(),
    department: Joi.string().max(100).required(),
    language: Joi.string().max(50).required(),
    lineManagerId: Joi.number().optional().allow(null, ''),
    startDate: Joi.date().optional().allow(null, ''),
    endDate: Joi.date().optional().allow(null, ''),
  });

  return userSchema.validate(user);
}

module.exports = {
  User,
  generateAccessToken,
  generateRefreshToken,
  validateUser,
};
