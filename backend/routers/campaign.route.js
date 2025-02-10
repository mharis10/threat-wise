const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const campaignController = require('../controllers/campaign.controller');

router.post(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignController.createCampaign
);
router.get(
  '/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignController.getMyCampaigns
);
router.patch(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignController.updateMyCampaign
);
router.delete(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  campaignController.deleteMyCampaign
);

module.exports = router;
