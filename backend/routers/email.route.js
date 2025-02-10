const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const emailController = require('../controllers/email.controller');

router.post('/requestDemo', emailController.requestDemoEmail);
router.post('/contactUs', emailController.contactUsEmail);
router.post(
  '/phishing',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  emailController.phishingEmail
);
router.post('/resetPassword', emailController.resetPasswordEmail);

module.exports = router;
