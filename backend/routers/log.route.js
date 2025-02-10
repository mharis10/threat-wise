const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const logController = require('../controllers/log.controller');

router.get(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  logController.getAllLogs
);
router.get(
  '/error',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  logController.getErrorLogs
);
router.get(
  '/error/download/:filename',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  logController.downloadErrorLog
);

module.exports = router;
