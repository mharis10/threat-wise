const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const campaignRecipientController = require('../controllers/campaignRecipient.controller');

router.post(
  '/add',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignRecipientController.addCampaignRecipient
);
router.get(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignRecipientController.getCampaignRecipients
);
router.post(
  '/remove',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignRecipientController.removeCampaignRecipient
);

module.exports = router;
