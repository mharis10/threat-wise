const logger = require('../startup/logging');
const httpStatus = require('http-status-codes').StatusCodes;
const { Campaign, validateCampaign } = require('../models/campaign.model');
const { Log } = require('../models/log.model');

const campaignController = {
  createCampaign: async (req, res) => {
    const { name } = req.body;

    const { error } = validateCampaign(req.body);

    if (error) {
      console.warn(`Invalid data format: ${error}`);
      logger.warn(`Invalid data format: ${error}`);

      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ error: `Invalid data format: ${error}` });
    }

    const [newCampaign, created] = await Campaign.findOrCreate({
      where: {
        companyId: req.user.companyId,
        name,
      },
      defaults: {
        companyId: req.user.companyId,
        name,
      },
    });

    if (!created) {
      console.warn('Campaign already created');
      logger.warn('Campaign already created');

      return res
        .status(httpStatus.CONFLICT)
        .json({ error: 'Campaign already created' });
    }

    Log.create({
      userId: req.user.id,
      action: process.env.CREATE_CAMPAIGN_ACTION,
      message: `Campaign created with ID ${newCampaign.id}`,
    });

    res.status(httpStatus.CREATED).json({
      message: 'Campaign created successfully!',
      group: newCampaign,
    });
  },

  getMyCampaigns: async (req, res) => {
    let queryFilters = {
      companyId: req.user.companyId,
    };

    const validColumns = ['id', 'name'];
    validColumns.forEach((column) => {
      if (req.query[column]) {
        queryFilters[column] = req.query[column];
      }
    });

    const campaigns = await Campaign.findAll({
      where: queryFilters,
    });

    if (!campaigns && !campaigns.length) {
      console.warn('Campaigns not found');
      logger.warn('Campaigns not found');

      return res
        .status(httpStatus.NOT_FOUND)
        .json({ error: 'Campaigns not found' });
    }

    res.status(httpStatus.OK).json(campaigns);
  },

  updateMyCampaign: async (req, res) => {
    const { id } = req.params;
    const { name } = req.body;

    const campaign = await Campaign.findOne({
      where: {
        id: id,
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

    if (name) campaign.name = name;

    await campaign.save();

    Log.create({
      userId: req.user.id,
      action: process.env.UPDATE_CAMPAIGN_ACTION,
      message: `Campaign with ID ${campaign.id} updated its data`,
    });

    res.status(httpStatus.OK).json({
      message: 'Campaign updated successfully',
      campaign,
    });
  },

  deleteMyCampaign: async (req, res) => {
    const { id } = req.params;

    const campaign = await Campaign.findOne({
      where: {
        id: id,
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

    await campaign.destroy();

    await Log.create({
      userId: req.user.id,
      action: process.env.DELETE_CAMPAIGN_ACTION,
      message: `Campaign with ID ${campaign.id} deleted`,
    });

    res.status(httpStatus.OK).json({
      message: 'Campaign deleted successfully',
    });
  },
};

module.exports = campaignController;
