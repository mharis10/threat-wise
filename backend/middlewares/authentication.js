const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { RefreshToken } = require('../models/refreshToken.model');
const { setAccessToken } = require('../helpers/responseToken');
const logger = require('../startup/logging');
const { User } = require('../models/user.model');
const { Company } = require('../models/company.model');
const httpStatus = require('http-status-codes').StatusCodes;

async function verifyUser(id) {
  const user = await User.findByPk(id, {
    include: [{ model: Company }],
  });

  if (!user || !user.isActive || (user.Company && !user.Company.isActive)) {
    console.warn('Access denied. User or Company not active');
    logger.warn('Access denied. User or Company not active');

    return {
      success: false,
      error: 'Access denied. User or Company not active',
    };
  }

  const currentDate = new Date();
  if (
    (user.startDate && currentDate < new Date(user.startDate)) ||
    (user.endDate && currentDate > new Date(user.endDate))
  ) {
    console.warn('Access denied. User not active within allowed dates');
    logger.warn('Access denied. User not active within allowed dates');

    return {
      success: false,
      error: 'Access denied. User not active withing allowed dates',
    };
  }

  return {
    success: true,
    user,
  };
}

module.exports = async (req, res, next) => {
  const accessToken = req.header('access-token');
  const refreshToken = req.header('refresh-token');

  if (!accessToken && !refreshToken) {
    console.warn('Access denied. No token provided');
    logger.warn('Access denied. No token provided');

    return res
      .status(httpStatus.UNAUTHORIZED)
      .json({ error: 'Access denied. No token provided' });
  }

  let response;

  try {
    if (accessToken) {
      const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
      response = await verifyUser(decoded.id);

      if (!response.success) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: response.error });
      }

      req.user = response.user;
      return next();
    }
  } catch (accessTokenError) {
    console.warn(`Access token validation error: ${accessTokenError}`);
    logger.warn(`Access token validation error: ${accessTokenError}`);
  }

  try {
    if (refreshToken) {
      const decodedRefresh = jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET
      );

      const validRefreshToken = await RefreshToken.findOne({
        where: {
          userId: decodedRefresh.id,
          token: refreshToken,
          expiresAt: {
            [Op.gt]: new Date(),
          },
          isValid: true,
        },
      });

      if (!validRefreshToken) {
        console.warn('Access denied. Refresh token not found or has expired');
        logger.warn('Access denied. Refresh token not found or has expired');

        return res.status(httpStatus.UNAUTHORIZED).json({
          error: 'Access denied. Refresh token not found or has expired',
        });
      }

      setAccessToken(decodedRefresh, res);

      response = await verifyUser(decodedRefresh.id);

      if (!response.success) {
        return res
          .status(httpStatus.UNAUTHORIZED)
          .json({ error: response.error });
      }

      req.user = response.user;
      return next();
    }
  } catch (refreshTokenError) {
    console.warn(`Refresh token validation error: ${refreshTokenError}`);
    logger.warn(`Refresh token validation error: ${refreshTokenError}`);
  }

  res
    .status(httpStatus.UNAUTHORIZED)
    .json({ error: 'Access denied. Invalid token(s)' });
};
