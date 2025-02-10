const rateLimit = require('express-rate-limit');
const httpStatus = require('http-status-codes').StatusCodes;
const logger = require('../startup/logging');

const getUserId = (req) => {
  return req.user ? req.user.id : '';
};

const rateLimiter = rateLimit({
  store: new rateLimit.MemoryStore(),

  windowMs: parseInt(process.env.RATE_LIMIT_CACHE_EXPIRATION_SECONDS) * 1000, // 1 hour window
  max: process.env.RATE_LIMIT || 100,
  keyGenerator: getUserId,
  handler: (req, res) => {
    console.warn(`Too many requests - ${req.user.id}`);
    logger.warn(`Too many requests - ${req.user.id}`);

    res.status(httpStatus.TOO_MANY_REQUESTS).json({
      error: `Too many requests, please try again later.`,
      limit: req.rateLimit.limit,
      used: req.rateLimit.used,
      remaining: req.rateLimit.remaining,
      resetTime: req.rateLimit.resetTime,
    });

    if (!req.rateLimit.remaining) {
      console.warn(`Rate limit exceeded - ${req.user.id}`);
      logger.warn(`Rate limit exceeded - ${req.user.id}`);
    }
  },
});

module.exports = rateLimiter;
