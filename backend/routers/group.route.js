const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const groupController = require('../controllers/group.controller');

router.post(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupController.createGroup
);
router.get(
  '/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupController.getMyGroups
);
router.patch(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupController.updateMyGroup
);
router.delete(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupController.deleteMyGroup
);

module.exports = router;
