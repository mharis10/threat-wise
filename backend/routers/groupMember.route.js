const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const groupMemberController = require('../controllers/groupMember.controller');

router.post(
  '/add',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupMemberController.addGroupMember
);
router.get(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupMemberController.getGroupMembers
);
router.post(
  '/remove',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  groupMemberController.removeGroupMember
);

module.exports = router;
