const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const userController = require('../controllers/user.controller');

router.post('/registerSuperAdmin', userController.registerSuperAdmin);
router.post(
  '/registerCompanyAdmin',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.registerCompanyAdmin
);
router.post(
  '/registerCompanyEmployee',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.registerCompanyEmployee
);
router.get(
  '/me',
  [authenticationMiddleware, rateLimitMiddleware],
  userController.getMyUser
);
router.get(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.getAllUsers
);
router.get(
  '/employees',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.getMyEmployees
);
router.patch(
  '/me',
  [authenticationMiddleware, rateLimitMiddleware],
  userController.updateMyUser
);
router.patch(
  '/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.updateUser
);
router.patch(
  '/disable/me',
  [authenticationMiddleware, rateLimitMiddleware],
  userController.disableMyUser
);
router.patch(
  '/disable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([
      process.env.SUPER_ADMIN,
      process.env.COMPANY_ADMIN,
    ]),
    rateLimitMiddleware,
  ],
  userController.disableUser
);
router.patch(
  '/enable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([
      process.env.SUPER_ADMIN,
      process.env.COMPANY_ADMIN,
    ]),
    rateLimitMiddleware,
  ],
  userController.enableUser
);
router.delete(
  '/employee/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  userController.deleteEmployee
);

module.exports = router;
