const express = require('express');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const emailTemplateController = require('../controllers/emailTemplate.controller');

router.get(
  '/validTags',
  [
    authenticationMiddleware,
    authorizationMiddleware([
      process.env.SUPER_ADMIN,
      process.env.COMPANY_ADMIN,
    ]),
    rateLimitMiddleware,
  ],
  emailTemplateController.getValidTags
);
router.post(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([
      process.env.SUPER_ADMIN,
      process.env.COMPANY_ADMIN,
    ]),
    rateLimitMiddleware,
  ],
  emailTemplateController.createTemplate
);
router.get(
  '/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.getMyTemplates
);
router.get(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.getAllTemplates
);
router.patch(
  '/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.updateMyTemplate
);
router.patch(
  '/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.updateTemplate
);
router.patch(
  '/disable/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.disableMyTemplate
);
router.patch(
  '/disable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.disableTemplate
);
router.patch(
  '/enable/me/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.enableMyTemplate
);
router.patch(
  '/enable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  emailTemplateController.enableTemplate
);

module.exports = router;
