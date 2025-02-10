const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const authenticationController = require('../controllers/authentication.controller');

router.post('/', authenticationController.login);
router.patch(
  '/setupPassword',
  [authenticationMiddleware, rateLimitMiddleware],
  authenticationController.setupPassword
);
router.patch(
  '/updatePassword',
  [authenticationMiddleware, rateLimitMiddleware],
  authenticationController.updatePassword
);
router.patch(
  '/resetPassword',
  [authenticationMiddleware, rateLimitMiddleware],
  authenticationController.resetPassword
);
router.post(
  '/logout',
  authenticationMiddleware,
  authenticationController.logout
);

module.exports = router;
