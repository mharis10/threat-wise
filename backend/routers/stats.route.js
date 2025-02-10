const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const statsController = require('../controllers/stats.controller');

router.get('/reportPhishing', statsController.reportPhishing);
router.get('/reportEmailOpen', statsController.reportEmailOpen);
router.get(
  '/campaign/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  statsController.getCampaignStats
);
router.get(
  '/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  statsController.getUserStats
);
router.get(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  statsController.getStats
);
router.post(
  '/insights',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  statsController.getStatsInsights
);

module.exports = router;
