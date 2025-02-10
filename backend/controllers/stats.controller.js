const httpStatus = require('http-status-codes').StatusCodes;
const { UserStat } = require('../models/userStat.model');
const { User } = require('../models/user.model');
const logger = require('../startup/logging');
const { getStatsInsights } = require('./gpt.controller');
const { CampaignRecipient } = require('../models/campaignRecipient.model');
const { CampaignStat } = require('../models/campaignStat.model');
const { Campaign } = require('../models/campaign.model');

const statsController = {
  getStats: async (req, res) => {
    const users = await User.findAll({
      where: {
        companyId: req.user.companyId,
        role: process.env.COMPANY_EMPLOYEE,
      },
      include: [
        {
          model: UserStat,
          attributes: ['emailOpenCount', 'reportPhishingCount'],
        },
      ],
    });

    const totalEmployees = users.length;
    const activeEmployees = users.filter((user) => user.isActive).length;
    const nonActiveEmployees = totalEmployees - activeEmployees;

    const employeeStats = users.map((user) => ({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      stats: user.UserStat || {
        emailOpenCount: 0,
        reportPhishingCount: 0,
      },
    }));

    const stats = {
      totalEmployees,
      activeEmployees,
      nonActiveEmployees,
      employeeStats,
    };

    res.status(httpStatus.OK).json(stats);
  },

  getStatsInsights: async (req, res) => {
    const stats = req.body;

    if (!stats || Object.keys(stats).length === 0) {
      console.warn('Stats data is required');
      logger.warn('Stats data is required');

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: 'Stats data is required' });
    }

    const insights = await getStatsInsights(stats);

    res.status(httpStatus.OK).json({
      insights,
    });
  },

  getUserStats: async (req, res) => {
    const { id } = req.params;

    const user = await User.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
        role: process.env.COMPANY_EMPLOYEE,
      },
      include: [
        {
          model: UserStat,
          attributes: ['emailOpenCount', 'reportPhishingCount'],
        },
      ],
    });

    if (!user) {
      console.warn('User not found');
      logger.warn('User not found');

      return res.status(httpStatus.NOT_FOUND).json({
        message: 'User not found',
      });
    }

    const userStats = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      isActive: user.isActive,
      stats: user.UserStat || {
        emailOpenCount: 0,
        reportPhishingCount: 0,
      },
    };

    res.status(httpStatus.OK).json(userStats);
  },

  getCampaignStats: async (req, res) => {
    const { id } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id: id,
        companyId: req.user.companyId,
      },
      include: [
        {
          model: CampaignStat,
          attributes: ['emailOpenCount', 'reportPhishingCount'],
        },
      ],
    });

    if (!campaign) {
      console.warn('Campaign not found');
      logger.warn('Campaign not found');

      return res.status(httpStatus.NOT_FOUND).json({
        message: 'Campaign not found',
      });
    }

    const overallStats = {
      emailOpenCount: campaign?.CampaignStat?.emailOpenCount ?? 0,
      reportPhishingCount: campaign?.CampaignStat?.reportPhishingCount ?? 0,
    };

    const campaignRecipients = await CampaignRecipient.findAll({
      where: {
        campaignId: id,
      },
      include: [
        {
          model: User,
          attributes: ['id', 'firstName', 'lastName', 'email', 'isActive'],
        },
      ],
    });

    const individualStats = campaignRecipients.map((recipient) => ({
      userId: recipient.userId,
      firstName: recipient.User.firstName,
      lastName: recipient.User.lastName,
      email: recipient.User.email,
      isActive: recipient.User.isActive,
      emailOpenCount: recipient.emailOpenCount,
      reportPhishingCount: recipient.reportPhishingCount,
    }));

    res.status(httpStatus.OK).json({
      overallStats,
      totalRecipients: individualStats.length,
      individualStats,
    });
  },

  reportPhishing: async (req, res) => {
    const { userId, campaignId } = req.query;

    console.log(`Phishing reported for user ID: ${userId}`);
    logger.info(`Phishing reported for user ID: ${userId}`);

    const userStat = await UserStat.findOne({ where: { userId } });

    if (userStat) {
      userStat.reportPhishingCount += 1;
      await userStat.save();
    } else {
      await UserStat.create({
        userId,
        emailOpenCount: 0,
        reportPhishingCount: 1,
      });
    }

    if (campaignId) {
      const campaignRecipient = await CampaignRecipient.findOne({
        where: {
          campaignId,
          userId,
        },
      });

      if (campaignRecipient) {
        campaignRecipient.reportPhishingCount += 1;
        await campaignRecipient.save();

        const campaignStat = await CampaignStat.findOne({
          where: {
            campaignId,
          },
        });

        if (campaignStat) {
          campaignStat.reportPhishingCount += 1;
          await campaignStat.save();
        } else {
          await CampaignStat.create({
            campaignId,
            emailOpenCount: 0,
            reportPhishingCount: 1,
          });
        }
      }
    }

    res.status(httpStatus.OK).json({
      message: 'Phishing reported successfully',
    });
  },

  reportEmailOpen: async (req, res) => {
    const { userId, campaignId } = req.query;

    console.log(`Email opened by user ID: ${userId}`);
    logger.info(`Email opened by user ID: ${userId}`);

    const userStat = await UserStat.findOne({ where: { userId } });

    if (userStat) {
      userStat.emailOpenCount += 1;
      await userStat.save();
    } else {
      await UserStat.create({
        userId,
        emailOpenCount: 1,
        reportPhishingCount: 0,
      });
    }

    if (campaignId) {
      const campaignRecipient = await CampaignRecipient.findOne({
        where: {
          campaignId,
          userId,
        },
      });

      if (campaignRecipient) {
        campaignRecipient.emailOpenCount += 1;
        await campaignRecipient.save();

        const campaignStat = await CampaignStat.findOne({
          where: {
            campaignId,
          },
        });

        if (campaignStat) {
          campaignStat.emailOpenCount += 1;
          await campaignStat.save();
        } else {
          await CampaignStat.create({
            campaignId,
            emailOpenCount: 1,
            reportPhishingCount: 0,
          });
        }
      }
    }

    const pixel = Buffer.from(
      'R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==',
      'base64'
    );

    res.writeHead(httpStatus.OK, {
      'Content-Type': 'image/gif',
      'Content-Length': pixel.length,
    });

    res.end(pixel);
  },
};

module.exports = statsController;
