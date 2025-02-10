const { v4: uuidv4 } = require('uuid');

function traceIdMiddleware(req, res, next) {
  const traceId = uuidv4();

  req.traceId = traceId;

  next();
}

module.exports = traceIdMiddleware;
