const logger = require('../startup/logging');

function loggerMiddleware(req, res, next) {
  const { traceId } = req;

  const logData = {
    method: req.method,
    endpoint: req.originalUrl,
    payload: req.body,
  };
  const logString = JSON.stringify(logData);

  logger.info(`Request Received: ${logString}`, { traceId });

  next();
}

module.exports = loggerMiddleware;
