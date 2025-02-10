const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const gptController = require('../controllers/gpt.controller');

router.post(
  '/emailTemplateHelp',
  [
    authenticationMiddleware,
    authorizationMiddleware([
      process.env.SUPER_ADMIN,
      process.env.COMPANY_ADMIN,
    ]),
    rateLimitMiddleware,
  ],
  gptController.emailTemplateHelp
);

module.exports = router;
