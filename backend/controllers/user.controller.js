const httpStatus = require('http-status-codes').StatusCodes;
const {
  User,
  validateUser,
  generateAccessToken,
} = require('../models/user.model');
const { Company } = require('../models/company.model');
const responseToken = require('../helpers/responseToken');
const logger = require('../startup/logging');
const {
  sendCompanyAdminSignUpEmail,
  sendCompanyEmployeeSignUpEmail,
} = require('../helpers/email');
const { Log } = require('../models/log.model');
const { Op } = require('sequelize');

const userController = {
  registerSuperAdmin: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      password,
      phoneNumber,
      mobileNumber,
      jobTitle,
      linkedin,
      location,
      department,
      language,
    } = req.body;

    if (!password) {
      console.warn('Password must be provided');
      logger.warn('Password must be provided');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Password must be provided' });
    }

    const { error } = validateUser(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        firstName,
        lastName,
        email,
        password,
        phoneNumber,
        mobileNumber,
        jobTitle,
        linkedin,
        location,
        department,
        language,
        role: process.env.SUPER_ADMIN,
      },
    });

    if (!created) {
      console.warn('User already registered');
      logger.warn('User already registered');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'User already registered' });
    }

    responseToken.setAccessToken(newUser, res);
    await responseToken.setRefreshToken(newUser, res);

    Log.create({
      userId: newUser.id,
      action: process.env.REGISTER_SUPER_ADMIN_ACTION,
      message: `Super Admin registered with ID ${newUser.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'User registered successfully!',
      user: newUser.toSafeObject(),
    });
  },

  registerCompanyAdmin: async (req, res) => {
    const {
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
      startDate,
      endDate,
    } = req.body;

    if (!companyId) {
      console.warn('Company ID must be provided');
      logger.warn('Company ID must be provided');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Company ID must be provided' });
    }

    const company = await Company.findByPk(companyId);

    if (!company) {
      console.warn('Company not found');
      logger.warn('Company not found');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Company not found' });
    }

    const { error } = validateUser(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
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
        role: process.env.COMPANY_ADMIN,
        startDate,
        endDate,
      },
    });

    if (!created) {
      console.warn('User already registered');
      logger.warn('User already registered');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'User already registered' });
    }

    responseToken.setAccessToken(newUser, res);
    await responseToken.setRefreshToken(newUser, res);

    sendCompanyAdminSignUpEmail(newUser, generateAccessToken(newUser));

    Log.create({
      userId: req.user.id,
      action: process.env.REGISTER_COMPANY_ADMIN_ACTION,
      message: `Company Admin registered with ID ${newUser.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'User registered successfully!',
      user: newUser.toSafeObject(),
    });
  },

  registerCompanyEmployee: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      mobileNumber,
      jobTitle,
      linkedin,
      location,
      department,
      language,
      lineManagerId,
      startDate,
      endDate,
    } = req.body;

    const { error } = validateUser(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    let lineManager;

    if (lineManagerId) {
      lineManager = await User.findOne({
        where: { id: lineManagerId, companyId: req.user.companyId },
      });

      if (!lineManager) {
        console.warn('Line Manager not found');
        logger.warn('Line Manager not found');

        return res
          .status(httpStatus.BAD_REQUEST)
          .json({ error: 'Line Manager not found' });
      }
    }

    const [newUser, created] = await User.findOrCreate({
      where: { email },
      defaults: {
        firstName,
        lastName,
        email,
        phoneNumber,
        mobileNumber,
        companyId: req.user.companyId,
        jobTitle,
        linkedin,
        location,
        department,
        language,
        lineManagerId,
        role: process.env.COMPANY_EMPLOYEE,
        startDate,
        endDate,
      },
    });

    if (!created) {
      console.warn('User already registered');
      logger.warn('User already registered');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'User already registered' });
    }

    responseToken.setAccessToken(newUser, res);
    await responseToken.setRefreshToken(newUser, res);

    sendCompanyEmployeeSignUpEmail(newUser, generateAccessToken(newUser));

    Log.create({
      userId: req.user.id,
      action: process.env.REGISTER_COMPANY_EMPLOYEE_ACTION,
      message: `Company Employee registered with ID ${newUser.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'User registered successfully!',
      user: newUser.toSafeObject(),
    });
  },

  getMyUser: async (req, res) => {
    const user = await User.findByPk(req.user.id, {
      include: [
        {
          model: User,
          as: 'LineManager',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    res.status(httpStatus.OK).json(user.toSafeObject());
  },

  getAllUsers: async (req, res) => {
    let queryFilters = {};

    const validColumns = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'mobileNumber',
      'companyId',
      'jobTitle',
      'linkedin',
      'location',
      'department',
      'language',
      'lineManagerId',
      'role',
      'isActive',
    ];
    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    const users = await User.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'mobileNumber',
        'companyId',
        'jobTitle',
        'linkedin',
        'location',
        'department',
        'language',
        'lineManagerId',
        'role',
        'startDate',
        'endDate',
        'isActive',
        'createdTimestamp',
        'modifiedTimestamp',
      ],
      where: queryFilters,
      include: [
        {
          model: User,
          as: 'LineManager',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!users && !users.length) {
      console.warn('Users not found');
      logger.warn('Users not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Users not found' });
    }

    res.status(httpStatus.OK).json(users);
  },

  getMyEmployees: async (req, res) => {
    let queryFilters = {};

    const validColumns = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phoneNumber',
      'mobileNumber',
      'companyId',
      'jobTitle',
      'linkedin',
      'location',
      'department',
      'language',
      'lineManagerId',
      'role',
      'isActive',
    ];

    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    if (req.query.startDateFrom || req.query.startDateTo) {
      queryFilters.startDate = {};
      if (req.query.startDateFrom) {
        queryFilters.startDate[Op.gte] = new Date(req.query.startDateFrom);
      }
      if (req.query.startDateTo) {
        queryFilters.startDate[Op.lte] = new Date(req.query.startDateTo);
      }
    }

    const users = await User.findAll({
      attributes: [
        'id',
        'firstName',
        'lastName',
        'email',
        'phoneNumber',
        'mobileNumber',
        'companyId',
        'jobTitle',
        'linkedin',
        'location',
        'department',
        'language',
        'lineManagerId',
        'role',
        'startDate',
        'endDate',
        'isActive',
        'createdTimestamp',
        'modifiedTimestamp',
      ],
      where: {
        ...queryFilters,
        companyId: req.user.companyId,
        role: process.env.COMPANY_EMPLOYEE,
      },
      include: [
        {
          model: User,
          as: 'LineManager',
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    });

    if (!users && !users.length) {
      console.warn('Users not found');
      logger.warn('Users not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Users not found' });
    }

    res.status(httpStatus.OK).json(users);
  },

  updateMyUser: async (req, res) => {
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      mobileNumber,
      linkedin,
      location,
      language,
    } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (linkedin) user.linkedin = linkedin;
    if (location) user.location = location;
    if (language) user.language = language;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_UPDATE_ACTION,
      message: `User with ID ${user.id} updated his/her data`,
    });

    res.status(httpStatus.OK).json({
      message: 'User updated successfully',
      updatedUser: user.toSafeObject(),
    });
  },

  updateUser: async (req, res) => {
    const { id } = req.params;

    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      mobileNumber,
      jobTitle,
      linkedin,
      location,
      language,
      lineManagerId,
      startDate,
      endDate,
    } = req.body;

    const user = await User.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
        role: process.env.COMPANY_EMPLOYEE,
      },
    });

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;
    if (phoneNumber) user.phoneNumber = phoneNumber;
    if (mobileNumber) user.mobileNumber = mobileNumber;
    if (jobTitle) user.jobTitle = jobTitle;
    if (linkedin) user.linkedin = linkedin;
    if (location) user.location = location;
    if (language) user.language = language;
    if (lineManagerId) user.lineManagerId = lineManagerId;
    if (startDate) user.startDate = startDate;
    if (endDate) user.endDate = endDate;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_UPDATE_ACTION,
      message: `User with ID ${user.id} updated his/her data`,
    });

    res.status(httpStatus.OK).json({
      message: 'User updated successfully',
      updatedUser: user.toSafeObject(),
    });
  },

  disableMyUser: async (req, res) => {
    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    user.isActive = false;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_DISABLED_ACTION,
      message: `User with ID ${user.id} disabled himself/herself`,
    });

    res.status(httpStatus.OK).json({
      message: 'User disabled successfully',
    });
  },

  disableUser: async (req, res) => {
    let user;

    if (req.user.role === process.env.SUPER_ADMIN) {
      user = await User.findByPk(req.params.id);
    } else if (req.user.role === process.env.COMPANY_ADMIN) {
      user = await User.findOne({
        where: { id: req.params.id, companyId: req.user.companyId },
      });
    }

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    user.isActive = false;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_DISABLED_ACTION,
      message: `User disabled with ID ${user.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'User disabled successfully',
    });
  },

  enableUser: async (req, res) => {
    let user;

    if (req.user.role === process.env.SUPER_ADMIN) {
      user = await User.findByPk(req.params.id);
    } else if (req.user.role === process.env.COMPANY_ADMIN) {
      user = await User.findOne({
        where: { id: req.params.id, companyId: req.user.companyId },
      });
    }

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    if (user.isActive) {
      console.warn('User is already active');
      logger.warn('User is already active');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'User is already active' });
    }

    user.isActive = true;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_ENABLED_ACTION,
      message: `User enabled with ID ${user.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'User enabled successfully',
    });
  },

  deleteEmployee: async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
        role: process.env.COMPANY_EMPLOYEE,
      },
    });

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({ error: 'User not found' });
    }

    await user.destroy();

    Log.create({
      userId: req.user.id,
      action: process.env.USER_DELETE_ACTION,
      message: `User with ID ${user.id} deleted`,
    });

    res.status(httpStatus.OK).json({
      message: 'User deleted successfully',
    });
  },
};

module.exports = userController;
