const httpStatus = require('http-status-codes').StatusCodes;
const logger = require('../startup/logging');
const {
  sendDemoRequestEmail,
  sendContactUsEmail,
  sendPhishingEmail,
  sendResetPasswordEmail,
} = require('../helpers/email');
const { User, generateAccessToken } = require('../models/user.model');
const { EmailTemplate } = require('../models/emailTemplate.model');
const { Company } = require('../models/company.model');
const { CampaignRecipient } = require('../models/campaignRecipient.model');

const emailController = {
  requestDemoEmail: async (req, res) => {
    const { name, email, company, message } = req.body;

    if (!name || !email || !company) {
      console.warn('Name, Email and Company must be provided');
      logger.warn('Name, Email and Company must be provided');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Name, Email and Company must be provided' });
    }

    sendDemoRequestEmail(name, email, company, message);

    res.status(httpStatus.OK).json({
      message: 'Demo request sent successfully',
    });
  },

  contactUsEmail: async (req, res) => {
    const { firstName, lastName, email, message } = req.body;

    if (!firstName || !lastName || !email || !message) {
      console.warn('First Name, Last Name, Email and Message must be provided');
      logger.warn('First Name, Last Name, Email and Message must be provided');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'First Name, Last Name, Email and Message must be provided',
      });
    }

    sendContactUsEmail(firstName, lastName, email, message);

    res.status(httpStatus.OK).json({
      message: 'Contact Us request sent successfully',
    });
  },

  phishingEmail: async (req, res) => {
    const { employeeIds, campaignId, templateId } = req.body;

    if ((!employeeIds || employeeIds.length === 0) && !campaignId) {
      console.warn('At least one employee id or campaign id must be provided');
      logger.warn('At least one employee id or campaign id must be provided');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'At least one employee id or campaign id must be provided',
      });
    }

    if (!templateId) {
      console.warn('Template id must be provided');
      logger.warn('Template id must be provided');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Template id must be provided',
      });
    }

    let users = [];

    if (employeeIds && employeeIds.length > 0) {
      users = await User.findAll({
        where: {
          id: employeeIds,
          companyId: req.user.companyId,
        },
        include: [
          {
            model: Company,
            attributes: ['name', 'email'],
          },
          {
            model: User,
            as: 'LineManager',
            attributes: ['firstName', 'lastName', 'email'],
          },
        ],
      });

      if (users.length === 0) {
        console.warn('No users found for the provided employee ids');
        logger.warn('No users found for the provided employee ids');

        return res.status(httpStatus.NOT_FOUND).json({
          error: 'No users found for the provided employee ids',
        });
      }
    } else if (campaignId) {
      const campaignRecipients = await CampaignRecipient.findAll({
        where: {
          campaignId,
        },
        include: [
          {
            model: User,
            where: {
              companyId: req.user.companyId,
            },
            include: [
              {
                model: Company,
                attributes: ['name', 'email'],
              },
              {
                model: User,
                as: 'LineManager',
                attributes: ['firstName', 'lastName', 'email'],
              },
            ],
          },
        ],
      });

      if (campaignRecipients.length === 0) {
        console.warn('No users found for the provided campaign id');
        logger.warn('No users found for the provided campaign id');

        return res.status(httpStatus.NOT_FOUND).json({
          error: 'No users found for the provided campaign id',
        });
      }

      users = campaignRecipients.map((cr) => cr.User);
    }

    const template = await EmailTemplate.findByPk(templateId);

    if (!template) {
      console.warn('No email template found for the provided template id');
      logger.warn('No email template found for the provided template id');

      return res.status(httpStatus.NOT_FOUND).json({
        error: 'No email template found for the provided template id',
      });
    }

    for (const user of users) {
      sendPhishingEmail(user, campaignId, template);
    }

    res.status(httpStatus.OK).json({
      message: 'Phishing email(s) sent successfully',
    });
  },

  resetPasswordEmail: async (req, res) => {
    const { email } = req.body;

    if (!email) {
      console.warn('Email must be provided');
      logger.warn('Email must be provided');

      return res.status(httpStatus.BAD_REQUEST).json({
        error: 'Email must be provided',
      });
    }

    const user = await User.findOne({
      where: { email },
    });

    if (!user) {
      console.warn('No user found for the provided email');
      logger.warn('No user found for the provided email');

      return res.status(httpStatus.NOT_FOUND).json({
        error: 'No user found for the provided email',
      });
    }

    sendResetPasswordEmail(user, generateAccessToken(user));

    res.status(httpStatus.OK).json({
      message: 'Reset password email sent successfully',
    });
  },
};

module.exports = emailController;
