const httpStatus = require('http-status-codes').StatusCodes;
const bcrypt = require('bcrypt');
const { User } = require('../models/user.model');
const { LoginAudit } = require('../models/loginAudit.model');
const Authentication = require('../models/authentication.model');
const { RefreshToken } = require('../models/refreshToken.model');
const responseToken = require('../helpers/responseToken');
const logger = require('../startup/logging');
const { Log } = require('../models/log.model');

const authController = {
  login: async (req, res) => {
    const { email, password } = req.body;

    const { error } = Authentication.validateAuth(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const user = await User.findOne({
      where: {
        email: email,
      },
    });

    if (!user) {
      console.warn('Invalid email or password');
      logger.warn('Invalid email or password');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Invalid email or password' });
    }

    if (!user.password) {
      console.warn('Password has not been setup');
      logger.warn('Password has not been setup');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Password has not been setup' });
    }

    if (!user.isActive) {
      console.warn('Access denied. User not active');
      logger.warn('Access denied. User not active');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Access denied. User not active' });
    }

    const currentDate = new Date();
    if (
      (user.startDate && currentDate < new Date(user.startDate)) ||
      (user.endDate && currentDate > new Date(user.endDate))
    ) {
      console.warn('Access denied. User not active');
      logger.warn('Access denied. User not active');

      return res.status(httpStatus.UNAUTHORIZED).json({
        error: 'Access denied. User not active',
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      console.warn('Invalid email or password');
      logger.warn('Invalid email or password');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'Invalid email or password' });
    }

    responseToken.setAccessToken(user, res);
    await responseToken.setRefreshToken(user, res);

    const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;

    LoginAudit.create({
      userId: user.id,
      loginIP: ip,
    });

    Log.create({
      userId: user.id,
      action: process.env.USER_LOGIN_ACTION,
      message: `User with ID ${user.id} logged in with IP ${ip}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Login Successful!',
      user: user.toSafeObject(),
    });
  },

  setupPassword: async (req, res) => {
    const { newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'User not found' });
    }

    if (user.password) {
      console.warn('Password has already been set');
      logger.warn('Password has already been set');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Password has already been set' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.UPDATE_PASSWORD_ACTION,
      message: `User with ID ${user.id} set up his password`,
    });

    res
      .status(httpStatus.OK)
      .json({ message: 'Password set up successfully!' });
  },

  updatePassword: async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'User not found' });
    }

    const validPassword = await bcrypt.compare(oldPassword, user.password);

    if (!validPassword) {
      console.warn('Password did not match');
      logger.warn('Password did not match');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Password did not match' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.UPDATE_PASSWORD_ACTION,
      message: `User with ID ${user.id} updated his password`,
    });

    res
      .status(httpStatus.OK)
      .json({ message: 'Password updated successfully!' });
  },

  resetPassword: async (req, res) => {
    const { newPassword } = req.body;

    const user = await User.findByPk(req.user.id);

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res
        .status(httpStatus.UNAUTHORIZED)
        .json({ error: 'User not found' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;

    await user.save();

    Log.create({
      userId: req.user.id,
      action: process.env.UPDATE_PASSWORD_ACTION,
      message: `User with ID ${user.id} reset his password`,
    });

    res.status(httpStatus.OK).json({ message: 'Password reset successfully!' });
  },

  logout: async (req, res) => {
    await RefreshToken.update(
      { isValid: false },
      { where: { userId: req.user.id } }
    );

    Log.create({
      userId: req.user.id,
      action: process.env.USER_LOGOUT_ACTION,
      message: `User with ID ${req.user.id} logged out`,
    });

    res.status(httpStatus.OK).json({
      message: 'Logged out successfully!',
    });
  },
};

module.exports = authController;
