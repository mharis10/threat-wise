const express = require('express');
const multer = require('multer');
const authenticationMiddleware = require('../middlewares/authentication');
const authorizationMiddleware = require('../middlewares/authorization');
const rateLimitMiddleware = require('../middlewares/rateLimit');

const router = express.Router();
const companyController = require('../controllers/company.controller');

const upload = multer({ storage: multer.memoryStorage() });

router.post(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.registerCompany
);
router.get(
  '/downloadTemplate',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.downloadTemplate
);
router.post(
  '/verifyData',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  upload.single('file'),
  companyController.verifyData
);
router.post(
  '/populateData',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  upload.single('file'),
  companyController.populateEmployeeData
);
router.get(
  '/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.getMyCompany
);
router.get(
  '/',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.getAllCompanies
);
router.patch(
  '/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.updateMyCompany
);
router.patch(
  '/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.updateCompany
);
router.patch(
  '/disable/me',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.COMPANY_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.disableMyCompany
);
router.patch(
  '/disable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.disableCompany
);
router.patch(
  '/enable/:id',
  [
    authenticationMiddleware,
    authorizationMiddleware([process.env.SUPER_ADMIN]),
    rateLimitMiddleware,
  ],
  companyController.enableCompany
);

module.exports = router;
