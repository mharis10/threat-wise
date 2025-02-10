const logger = require('../startup/logging');
const httpStatus = require('http-status-codes').StatusCodes;
const {
  CampaignRecipient,
  validateCampaignRecipient,
} = require('../models/campaignRecipient.model');
const { Log } = require('../models/log.model');
const { Campaign } = require('../models/campaign.model');
const { User } = require('../models/user.model');
const { Group } = require('../models/group.model');
const { GroupMember } = require('../models/groupMember.model');

const campaignRecipientController = {
  addCampaignRecipient: async (req, res) => {
    const { campaignId, userIds, groupIds } = req.body;

    const { error } = validateCampaignRecipient(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        companyId: req.user.companyId,
      },
    });

    if (!campaign) {
      console.warn('Campaign not found');
      logger.warn('Campaign not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Campaign not found' });
    }

    const users = await User.findAll({
      where: {
        id: userIds,
        companyId: req.user.companyId,
      },
    });

    if (users.length !== userIds.length) {
      console.warn(
        'One or more users not found or do not belong to the same company'
      );
      logger.warn(
        'One or more users not found or do not belong to the same company'
      );

      return res.status(httpStatus.NOT_FOUND).json({
        error:
          'One or more users not found or do not belong to the same company',
      });
    }

    const groups = await Group.findAll({
      where: {
        id: groupIds,
        companyId: req.user.companyId,
      },
    });

    if (groups.length !== groupIds.length) {
      console.warn(
        'One or more groups not found or do not belong to the same company'
      );
      logger.warn(
        'One or more groups not found or do not belong to the same company'
      );

      return res.status(httpStatus.NOT_FOUND).json({
        error:
          'One or more groups not found or do not belong to the same company',
      });
    }

    const groupMembers = await GroupMember.findAll({
      where: {
        groupId: groupIds,
      },
      attributes: ['userId'],
    });

    const groupUserIds = groupMembers.map((gm) => gm.userId);

    const allUserIds = Array.from(new Set([...userIds, ...groupUserIds]));

    const campaignRecipientsData = allUserIds.map((userId) => ({
      campaignId,
      userId,
    }));

    const campaignRecipients = await CampaignRecipient.bulkCreate(
      campaignRecipientsData
    );

    Log.create({
      userId: req.user.id,
      action: process.env.ADD_CAMPAIGN_RECIPIENT_ACTION,
      message: `Recipients added to campaign with ID ${campaign.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Users added to campaign successfully',
      campaignRecipients,
    });
  },

  getCampaignRecipients: async (req, res) => {
    const { id } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id,
        companyId: req.user.companyId,
      },
    });

    if (!campaign) {
      console.warn('Campaign not found');
      logger.warn('Campaign not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Campaign not found' });
    }

    const campaignRecipients = await CampaignRecipient.findAll({
      where: {
        campaignId: id,
      },
      include: [
        {
          model: User,
          attributes: ['firstName', 'lastName', 'email'],
        },
      ],
    });

    res.status(httpStatus.OK).json(campaignRecipients);
  },

  removeCampaignRecipient: async (req, res) => {
    const { campaignId, userId } = req.body;

    const campaign = await Campaign.findOne({
      where: {
        id: campaignId,
        companyId: req.user.companyId,
      },
    });

    if (!campaign) {
      console.warn('Campaign not found');
      logger.warn('Campaign not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Campaign not found' });
    }

    const campaignRecipient = await CampaignRecipient.findOne({
      where: {
        campaignId,
        userId,
      },
    });

    if (!campaignRecipient) {
      console.warn('Campaign Recipient not found');
      logger.warn('Campaign Recipient not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Campaign Recipient not found' });
    }

    await campaignRecipient.destroy();

    Log.create({
      userId: req.user.id,
      action: process.env.REMOVE_CAMPAIGN_RECIPIENT_ACTION,
      message: `Campaign Recipients removed from campaign with ID ${campaign.id}`,
    });

    res.status(httpStatus.OK).json({
      message: 'Users removed from campaign successfully',
    });
  },
};

module.exports = campaignRecipientController;
